from transcription_model import Transcription_Model

transcribe = Transcription_Model(model_size="medium", device="cuda", compute_type="float16", batch_size=16)

audio_path = "C:\\Users\\USER\\Desktop\\Interalyze\\ai_processing\\nlp\\transcription\\P11.wav"
transcriptions, qa_pairs = transcribe.transcribe_and_diarize(
    audio_path, num_speakers=2, min_speakers=2, max_speakers=2, use_auth_token="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"
)


#for speaker, transcriptions_list in transcriptions.items():
    #print(f"Speaker {speaker}:")
    #for transcription in transcriptions_list:
        #print(transcription)
    #print("\n" + "="*40 + "\n")

print(len(qa_pairs))
 #Print the results
for i, (question, answer) in enumerate(qa_pairs, 1):
    print(f"Q{i}: {question}")
    print(f"A{i}: {answer}\n")
