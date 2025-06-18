import unittest
from app import app
import json

class TestAnalysisEndpoints(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_valid_analysis_request(self):
        """Test analysis with valid text input"""
        payload = {
            "text": "The quick brown fox jumps over the lazy dog. This sentence contains all letters of the English alphabet. Repeated practice helps in mastering typing skills.",
            "max_length": 50
        }
        response = self.app.post('/analysis/analyze', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.json)
        self.assertTrue(len(response.json["response"].split()) <= 50)

    def test_missing_text_field(self):
        """Test analysis request with missing text field"""
        payload = {"max_length": 100}
        response = self.app.post('/analysis/analyze', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json)

    def test_long_text_analysis(self):
        """Test analysis with large text input"""
        long_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " * 50
        payload = {
            "text": long_text,
            "max_length": 200
        }
        response = self.app.post('/analysis/analyze', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertLessEqual(len(response.json["response"].split()), 200)

    def test_default_length_parameter(self):
        """Test analysis uses default max_length when not provided"""
        payload = {
            "text": "A short text sample for testing purposes."
        }
        response = self.app.post('/analysis/analyze', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertLessEqual(len(response.json["response"].split()), 150)

if __name__ == '__main__':
    unittest.main()
