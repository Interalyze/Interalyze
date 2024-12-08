# # imports
# import spacy
# from spacy.matcher import PhraseMatcher

# # load default skills data base
# from skillNer.general_params import SKILL_DB
# # import skill extractor
# from skillNer.skill_extractor_class import SkillExtractor

# # init params of skill extractor
# nlp = spacy.load("en_core_web_lg")
# # init skill extractor
# skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher)

# # extract skills from job_description
# job_description = """
# You are a Python developer with a solid experience in web development
# and can manage projects. You quickly adapt to new environments
# and speak fluently English and French
# """

# annotations = skill_extractor.annotate(job_description)
# print("Extracted Skills Annotations:", annotations)
import spacy
from spacy.matcher import PhraseMatcher
from skillNer.general_params import SKILL_DB
from skillNer.skill_extractor_class import SkillExtractor


class AllSkillsAnalyzer:
    def __init__(self):
        """
        Initialize the Skill Extractor using spaCy and the default skill database.
        """
        self.nlp = spacy.load("en_core_web_lg")
        self.skill_extractor = SkillExtractor(self.nlp, SKILL_DB, PhraseMatcher)

    def analyze_text(self, text):
        """
        Extract skills from the provided text.
        Args:
            text (str): The job description or input text.

        Returns:
            dict: A dictionary of extracted skills with categories.
        """
        annotations = self.skill_extractor.annotate(text)
        return annotations


class SkillAnalyzer:
    def __init__(self):
        """
        Initialize the Skill Extractor using spaCy and the default skill database.
        """
        self.nlp = spacy.load("en_core_web_lg")
        self.skill_extractor = SkillExtractor(self.nlp, SKILL_DB, PhraseMatcher)

    def analyze_soft_skills(self, text):
        """
        Extract only soft skills from the provided text.
        Args:
            text (str): The job description or input text.

        Returns:
            list: A list of extracted soft skills with their confidence scores.
        """
        annotations = self.skill_extractor.annotate(text)
        soft_skills = []

        for skill in annotations["results"]["ngram_scored"]:
            # Check if the skill type is "Soft Skill" in the database
            skill_id = skill["skill_id"]
            skill_data = SKILL_DB.get(skill_id, {})
            if skill_data.get("skill_type") == "Soft Skill":
                soft_skills.append({
                    "skill_name": skill["doc_node_value"],
                    "confidence": round(float(skill["score"]), 2),  # Convert score to Python float
                })

        return soft_skills
