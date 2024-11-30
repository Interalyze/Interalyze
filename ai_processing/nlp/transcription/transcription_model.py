import whisperx

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
        self.model = whisperx.load_model(model_size, device, compute_type=compute_type)

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
        # Load audio
        audio = whisperx.load_audio(audio_path)

        # Perform transcription
        result = self.model.transcribe(audio, batch_size=self.batch_size)

        # Load alignment model for word-level alignment
        model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=self.device)
        result = whisperx.align(result["segments"], model_a, metadata, audio, self.device, return_char_alignments=False)

        # Perform speaker diarization
        diarize_model = whisperx.DiarizationPipeline(use_auth_token=use_auth_token, device=self.device)
        diarize_segments = diarize_model(
            audio, num_speakers=num_speakers, min_speakers=min_speakers, max_speakers=max_speakers
        )

        # Assign speaker information to the transcription
        result = whisperx.assign_word_speakers(diarize_segments, result)

        # Organize results into speaker-wise transcriptions
        speaker_transcripts = {}
        for segment in result["segments"]:
            speaker = segment["speaker"]
            text = segment["text"]
            start = segment["start"]
            end = segment["end"]

            if speaker not in speaker_transcripts:
                speaker_transcripts[speaker] = []

            speaker_transcripts[speaker].append(f"[{start} - {end}] {text}")

        return speaker_transcripts
