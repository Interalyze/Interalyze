from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch


class StressAnalyzer:
    """
    A class to load and use the dstefa/roberta-base_stress_classification model.
    """

    def __init__(self):
        """
        Initialize the model and tokenizer for stress classification.
        """
        self.model = AutoModelForSequenceClassification.from_pretrained("dstefa/roberta-base_stress_classification")
        self.tokenizer = AutoTokenizer.from_pretrained("dstefa/roberta-base_stress_classification")
        self.labels = ["Not Stressed", "Stressed"]

    def classify_stress(self, text):
        """
        Classify the stress level in the given text.

        Args:
            text (str): Input text for stress classification.

        Returns:
            dict: Stress level and confidence score.
        """
        # Tokenize the input text
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

        # Perform prediction
        self.model.eval()
        with torch.no_grad():
            outputs = self.model(**inputs)

        # Get probabilities using softmax
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)

        # Get the predicted label
        predicted_label = torch.argmax(probabilities, dim=-1).item()
        confidence = probabilities[0][predicted_label].item()

        return {
            "stress_level": self.labels[predicted_label],
            "confidence": round(confidence, 4)
        }
