from groq import Groq
from typing import Optional
from ..config.settings import get_config

class AIService:
    """Service for AI operations using Groq API"""
    
    def __init__(self):
        self.config = get_config()
        self.client = Groq(
            api_key=self.config.GROQ_API_KEY,
            base_url=self.config.GROQ_BASE_URL
        )
    
    def ask_groq(self, question: str) -> str:
        """Ask a question to Groq AI"""
        try:
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": question}],
                model=self.config.GROQ_MODEL,
                temperature=self.config.GROQ_TEMPERATURE
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"
    
    def generate_task_guidance(self, title: str, description: str) -> str:
        """Generate AI guidance for a task"""
        prompt = f"Task: {title}. Details: {description}. Provide guidance on how to approach this task effectively."
        return self.ask_groq(prompt)
    
    def update_task_guidance(self, title: str, description: str) -> str:
        """Generate updated AI guidance for a modified task"""
        prompt = f"Updated task: {title}. New details: {description}. Provide updated guidance."
        return self.ask_groq(prompt)

    def habit_trainer(self, habit_goal: str, context: str = "") -> str:
        """Generate a personalized habit-building plan for the user"""
        prompt = (
            f"You are an AI Habit Trainer. A user wants to build the following habit: '{habit_goal}'. "
            f"Context: {context if context else 'No additional context provided.'} "
            "Provide a step-by-step, motivational, and practical plan to help the user build and sustain this habit. "
            "Include tips for overcoming common obstacles and how to track progress."
        )
        return self.ask_groq(prompt)

    def recognize_emotion(self, text: str) -> str:
        """Recognize emotion(s) from the given text using Groq AI"""
        prompt = (
            f"Analyze the following text and identify the primary emotion(s) expressed. "
            f"Text: '{text}'\n"
            "Respond with a single word or a short phrase describing the emotion(s), such as 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', or 'neutral'. "
            "If multiple emotions are present, list them separated by commas."
        )
        return self.ask_groq(prompt)

# Global AI service instance
ai_service = AIService() 