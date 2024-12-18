from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ai_processing.nlp.stress_analysis.stress_analysis_model import StressAnalyzer
from .skills_analysis.skills_analysis_model import AllSkillsAnalyzer, SkillAnalyzer
from ai_processing.nlp.personality_analysis.personality_analysis_model import PersonalityAnalyzer
from .personality_analysis.bert_personality_model import BERTPersonalityAnalyzer
from .transcription.transcription_model import Transcription_Model
import torch
import os
from django.core.files.storage import default_storage
import json

@csrf_exempt
def analyze_bert_personality(request):
    """
    API endpoint to analyze personality traits based on the provided text.
    """
    if request.method == "POST":
        try:
            # Parse the input text from the request body
            body = json.loads(request.body)
            input_text = body.get("text", "")

            if not input_text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Initialize the analyzer and get results
            analyzer = BERTPersonalityAnalyzer()
            results = analyzer.analyze_text(input_text)

            # Return the personality predictions
            return JsonResponse({"personality_scores": results}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

#  one answer at a time
@csrf_exempt
def analyze_personality(request):
    """
    API endpoint to analyze personality traits for a single question or a batch of questions.
    """
    if request.method == "POST":
        try:
            # Parse the input text or batch of texts from the request body
            body = json.loads(request.body)
            input_texts = body.get("texts", [])

            if not input_texts:
                return JsonResponse({"error": "No text provided"}, status=400)

            analyzer = PersonalityAnalyzer()
            results = []

            # Analyze each text individually
            for text in input_texts:
                result = analyzer.analyze_text(text)
                results.append(result)

            # Return the personality predictions
            return JsonResponse({"personality_scores": results}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# GIVES ALL SKILLS
@csrf_exempt
def analyze_skills(request):
    """
    API endpoint to analyze skills from the provided text.
    """
    if request.method == "POST":
        try:
            # Parse the input text from the request body
            body = json.loads(request.body)
            input_text = body.get("text", "")

            if not input_text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Initialize the SkillAnalyzer and get results
            skill_analyzer = AllSkillsAnalyzer()
            annotations = skill_analyzer.analyze_text(input_text)

            # Format the skills into a user-friendly structure
            extracted_skills = []
            for skill in annotations["results"]["ngram_scored"]:
                extracted_skills.append({
                    "skill_name": skill["doc_node_value"],
                    "confidence": round(float(skill["score"]), 2),  # Convert score to Python float
                })


            # Return the extracted skills
            return JsonResponse({"extracted_skills": extracted_skills}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


#  GIVES ONLY SOFT SKILLS
@csrf_exempt
def analyze_soft_skills(request):
    """
    API endpoint to analyze only soft skills from all answers at once.
    """
    if request.method == "POST":
        try:
            # Parse the input text from the request body
            body = json.loads(request.body)
            input_text = body.get("text", "")

            if not input_text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Initialize the SkillAnalyzer and get soft skills
            skill_analyzer = SkillAnalyzer()
            soft_skills = skill_analyzer.analyze_soft_skills(input_text)

            # Return the extracted soft skills
            return JsonResponse({"soft_skills": soft_skills}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


#  one answer at a time
@csrf_exempt
def analyze_stress(request):
    """
    API endpoint to analyze stress levels for a single question or a batch of questions.
    """
    if request.method == "POST":
        try:
            # Parse the input text or batch of texts from the request body
            body = json.loads(request.body)
            input_texts = body.get("texts", [])

            if not input_texts:
                return JsonResponse({"error": "No text provided"}, status=400)

            classifier = StressAnalyzer()
            results = []

            # Analyze each text individually
            for text in input_texts:
                result = classifier.classify_stress(text)
                results.append(result)

            # Return the stress analysis predictions
            return JsonResponse({"stress_analysis": results}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def transcribe_audio(request):
    """
    API endpoint to transcribe audio files to text.
    """
    if request.method == "POST":
        try:
            if "audio_file" not in request.FILES:
                return JsonResponse({"status": "error", "message": "No audio file provided"}, status=400)

            audio_file = request.FILES["audio_file"]
            
            file_path = default_storage.save(f"temp/{audio_file.name}", audio_file)
            if torch.cuda.is_available():
                print("CUDA is available")
                device = "cuda"  # Use GPU if available
                compute_type = "float16"
            else:
                print("CUDA is not available")
                device = "cpu"  # Use CPU if CUDA is not available
                compute_type = "int8"
            
            transcribe = Transcription_Model(model_size="medium", device=device, compute_type=compute_type, batch_size=16)
            transcriptions, qa_pairs = transcribe.transcribe_and_diarize(
                file_path, num_speakers=2, min_speakers=2, max_speakers=2, use_auth_token="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"
            )
            qa_results = []
            for i, (question, answer, question_timestamp, answer_start, answer_end) in enumerate(qa_pairs, 1):
                qa_results.append({
                    "question": question,
                    "answer": answer,
                    "question_timestamp": question_timestamp,
                    "answer_start": answer_start,
                    "answer_end": answer_end
                })
            if os.path.exists(file_path):
                os.remove(file_path)
            return JsonResponse({"status": "success", "qa_pairs": qa_results}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
