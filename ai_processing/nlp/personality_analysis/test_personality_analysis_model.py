import unittest
from personality_analysis import PersonalityAnalyzer


class TestPersonalityAnalyzer(unittest.TestCase):
    """
    Test case for the PersonalityAnalyzer class.
    """

    def setUp(self):
        """
        Set up the analyzer instance.
        """
        self.analyzer = PersonalityAnalyzer()

    def test_analyze_text(self):
        """
        Test personality analysis for a given text.
        """
        # Read text from input_text.txt
        with open("test_text.txt", "r", encoding="utf-8") as file:
            text = file.read()

        # Perform analysis
        results = self.analyzer.analyze_text(text)

        # Assert results contain all Big Five traits
        expected_traits = ["agreeableness", "openness", "conscientiousness", "extraversion", "neuroticism"]
        self.assertTrue(all(trait in results for trait in expected_traits))

        # Print results for review
        print("\nPersonality Trait Scores:")
        for trait, score in results.items():
            print(f"{trait.capitalize()}: {score:.4f}")


if __name__ == "__main__":
    unittest.main()
