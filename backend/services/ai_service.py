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

# Global AI service instance
ai_service = AIService() 