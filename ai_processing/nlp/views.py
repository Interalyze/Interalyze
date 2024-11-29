from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ai_processing.nlp.stress_analysis.stress_analysis_model import StressAnalyzer
from .skills_analysis.skills_analysis_model import AllSkillsAnalyzer, SkillAnalyzer
from ai_processing.nlp.personality_analysis.personality_analysis_model import PersonalityAnalyzer
from .personality_analysis.bert_personality_model import BERTPersonalityAnalyzer
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


# CSRF exemption allows testing without CSRF token (for development only)
@csrf_exempt
def analyze_personality(request):
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

            # Initialize the personality analyzer and get results
            analyzer = PersonalityAnalyzer()
            results = analyzer.analyze_text(input_text)

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
    API endpoint to analyze only soft skills from the provided text.
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


@csrf_exempt
def analyze_stress(request):
    """
    API endpoint to analyze stress levels based on the provided text.
    """
    if request.method == "POST":
        try:
            # Parse the input text from the request body
            body = json.loads(request.body)
            input_text = body.get("text", "")

            if not input_text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Initialize the classifier and get results
            classifier = StressAnalyzer()
            results = classifier.classify_stress(input_text)

            # Return the stress analysis predictions
            return JsonResponse({"stress_analysis": results}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)