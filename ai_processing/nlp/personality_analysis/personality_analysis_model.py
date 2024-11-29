from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch


class PersonalityAnalyzer:
    """
    A class to load and use the KevSun/Personality_LM model to analyze Big Five personality traits.
    """

    def __init__(self):
        """
        Initialize the model and tokenizer for the personality analysis task.
        """
        self.model = AutoModelForSequenceClassification.from_pretrained(
            "KevSun/Personality_LM", ignore_mismatched_sizes=True
        )
        self.tokenizer = AutoTokenizer.from_pretrained("KevSun/Personality_LM")

    def analyze_text(self, text):
        """
        Analyze the input text to predict personality traits.
        Args:
            text (str): Input text for personality analysis.

        Returns:
            dict: Predicted scores for Big Five personality traits.
        """
        # Tokenize the input text
        encoded_input = self.tokenizer(
            text, return_tensors="pt", padding=True, truncation=True, max_length=64
        )

        # Perform prediction
        self.model.eval()
        with torch.no_grad():
            outputs = self.model(**encoded_input)

        # Apply softmax to convert logits to probabilities
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_scores = predictions[0].tolist()

        # Map predictions to trait names
        trait_names = ["agreeableness", "openness", "conscientiousness", "extraversion", "neuroticism"]
        results = {trait: round(score, 4) for trait, score in zip(trait_names, predicted_scores)}

        return results