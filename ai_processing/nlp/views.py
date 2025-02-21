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
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            input_text = body.get("text", "")
            if not input_text:
                return JsonResponse({"error": "No text provided"}, status=400)

            skill_analyzer = AllSkillsAnalyzer()
            annotations = skill_analyzer.analyze_text(input_text)

            extracted_skills = []
            try:
                for skill in annotations["results"]["ngram_scored"]:
                    extracted_skills.append({
                        "skill_name": skill["doc_node_value"],
                        "confidence": round(float(skill["score"]), 2),
                    })
            except KeyError as e:
                print(f"KeyError: {e}")
                return JsonResponse({"error": "Invalid annotations structure"}, status=500)

            return JsonResponse({"extracted_skills": extracted_skills}, status=200)

        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            print(f"Unexpected error: {e}")
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

