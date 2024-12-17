import whisperx
from pydub import AudioSegment
import os
import re

class Transcription_Model:
    """
    A class to transcribe audio and assign speaker diarization using WhisperX.
    """

    def __init__(self, model_size="medium", device="cuda", compute_type="float16", batch_size=16):
        """
        Initialize the WhisperX model and settings for transcription and diarization.

        Args:
            model_size (str): Size of the Whisper model (e.g., tiny, base, medium, large).
            device (str): Device to run the model on (e.g., 'cuda', 'cpu').
            compute_type (str): Type of computation (e.g., 'float16', 'int8').
            batch_size (int): Batch size for transcription.
        """
        self.device = device
        self.batch_size = batch_size

        # Load WhisperX transcription model
        self.model = whisperx.load_model(model_size, device, compute_type=compute_type, language = "en")
    def preprocess_audio(self, audio_path, output_path, duration_ms=5000):         #this does not work
        """                     CONVERT AVI MP4 --> WAV
        Adds silence or clear speech samples to the start of the audio file.
        in order to prevent cold start problem/ warm up
        Args:
            audio_path (str): Path to the original audio file.
            output_path (str): Path to save the processed audio file.
            silence_duration (int): Duration of silence to add in milliseconds.
        """
        # Load the audio file
        audio = AudioSegment.from_file(audio_path)
        #first_segment = audio[:duration_ms]
        audio = audio.set_channels(1)  # Convert to mono
        audio = audio.set_frame_rate(16000)  # Resample to 16 kHz
        # Generate silence
        #silence = AudioSegment.silent(duration=duration_ms)

        # Concatenate silence and audio
        #processed_audio = silence + audio       #add silence or first segment


        # Save the processed audio
        audio.export(output_path, format="wav")

    def transcribe_and_diarize(self, audio_path, num_speakers=2, min_speakers=2, max_speakers=2, use_auth_token=None):
        """
        Transcribe audio and perform speaker diarization.

        Args:
            audio_path (str): Path to the audio file.
            num_speakers (int): Expected number of speakers in the audio.
            min_speakers (int): Minimum number of speakers for diarization.
            max_speakers (int): Maximum number of speakers for diarization.
            use_auth_token (str): Hugging Face auth token for diarization models.

        Returns:
            dict: Dictionary containing speaker-wise transcriptions.
        """
        processed_audio_path = "processed_audio.wav"
        self.preprocess_audio(audio_path, processed_audio_path)
        # Load audio
        audio = whisperx.load_audio(audio_path)

        # Perform transcription
        result = self.model.transcribe(audio, batch_size=self.batch_size)

        # Load alignment model for word-level alignment
        model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=self.device)
        result = whisperx.align(result["segments"], model_a, metadata, audio, self.device, return_char_alignments=False)
    
        # Perform speaker diarization
        diarize_model = whisperx.DiarizationPipeline("pyannote/speaker-diarization-3.1", use_auth_token=use_auth_token, device=self.device)
        diarize_segments = diarize_model(
            audio, num_speakers=num_speakers, min_speakers=min_speakers, max_speakers=max_speakers, 
        )

        # Assign speaker information to the transcription
        result = whisperx.assign_word_speakers(diarize_segments, result)
        speaker_labeled_text = ""
        for segment in result["segments"]:
            speaker = segment["speaker"]
            start = segment["start"]
            end = segment["end"]
            text = segment["text"]
            speaker_labeled_text += f"({speaker} {start} - {end}) {text}\n"
        roles = self.assign_roles_based_on_dialogue(result)
        qa_pairs = self.get_question_answer_pairs(speaker_labeled_text, roles)

        
        speaker_transcripts = {}
        for segment in result["segments"]:
            speaker = segment["speaker"]
            text = segment["text"]
            start = segment["start"]
            end = segment["end"]

            if speaker not in speaker_transcripts:
                speaker_transcripts[speaker] = []

            speaker_transcripts[speaker].append(f"[{start} - {end}] {text}")
        
        if os.path.exists(processed_audio_path):
            os.remove(processed_audio_path)
            print(f"Temporary file {processed_audio_path} deleted.")
        return speaker_transcripts, qa_pairs
    

    def is_question(self, text):
        """
        Determine if a given text is a question based on heuristics.
        """
        question_phrases = [
            "can you", "how did", "why do", "what do", "could you", 
            "tell me about", "so what", "how do", "do you think", "why should",
            "describe", "explain", "give me", "tell me", "what's", "walk me through",
            "share with me", "how would", "why is", "talk about", "is there"
        ]
    
        text_lower = text.lower().strip()
        
        if any(text_lower.startswith(q) for q in question_phrases):
            return True
        
        if any(q in text_lower for q in question_phrases):
            return True
        
        return text.strip().endswith("?")

    def assign_roles_based_on_dialogue(self, result):
        speaker_roles = {}
        speaker_text_lengths = {}

        for segment in result["segments"]:
            speaker = segment["speaker"]
            text = segment["text"]

            word_count = len(text.split())
            if speaker not in speaker_text_lengths:
                speaker_text_lengths[speaker] = 0
            speaker_text_lengths[speaker] += word_count

        # Assign roles based on word count (the speaker with more words is likely the interviewee)
        interviewee = max(speaker_text_lengths, key=speaker_text_lengths.get)
        
        for speaker in speaker_text_lengths:
            if speaker == interviewee:
                speaker_roles[speaker] = "Interviewee"
            else:
                speaker_roles[speaker] = "Interviewer"
        
        #for speaker, role in speaker_roles.items():
            #print(f"{speaker} = {role}")
        
        return speaker_roles
    def get_question_answer_pairs(self, text, roles):
        """
        Extract question-answer pairs from speaker-labeled transcriptions with timestamps.
        
        Args:
            text (str): Speaker-labeled transcription string with timestamps.

        Returns:
            list: List of question-answer pairs, each containing a question, answer, and respective timestamps.
        """
        # Regex pattern to capture timestamps, speaker labels, and content
        pattern = re.compile(r"\(SPEAKER_(\d{2})\s([\d\.\s\-]+)\)\s(.*)")

        question = None
        answer = []
        question_timestamp = None
        answer_timestamps = []
        qa_pairs = []

        for line in text.split("\n"):
            match = pattern.match(line)
            if match:
                speaker = match.group(1)
                timestamp = match.group(2)  # Timestamp
                content = match.group(3)

                if self.is_question(content):
                    if question and answer:
                        answer_start, answer_end = self.extract_start_end_timestamps(answer_timestamps)
                        qa_pairs.append((question, " ".join(answer), question_timestamp, answer_start, answer_end))
                        answer = []
                        answer_timestamps = []

                    question = content
                    question_timestamp = timestamp
                    continue 

                if question and roles.get(f"SPEAKER_{speaker}") == "Interviewee":
                    answer.append(content)
                    answer_timestamps.append(timestamp)

        if question and answer:
            answer_start, answer_end = self.extract_start_end_timestamps(answer_timestamps)
            qa_pairs.append((question, " ".join(answer), question_timestamp, answer_start, answer_end))

        return qa_pairs
    
    def extract_start_end_timestamps(self, answer_timestamps):
        """
        Extract the first and last timestamp from a list of timestamp ranges.

        Args:
            answer_timestamps (list): List of timestamp ranges as strings.

        Returns:
            tuple: First and last timestamp as floats, or None if the list is empty.
        """
        if not answer_timestamps:
            return None, None

        # Extract the first start timestamp
        first_range = answer_timestamps[0]
        start_timestamp = float(first_range.split('-')[0].strip())

        # Extract the last end timestamp
        last_range = answer_timestamps[-1]
        end_timestamp = float(last_range.split('-')[-1].strip())
        #print(start_timestamp, end_timestamp)
        return start_timestamp, end_timestamp