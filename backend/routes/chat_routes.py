from flask import request
from flask_restx import Resource, Namespace
from backend.services.ai_service import ai_service

def create_chat_routes(api, models):
    """Create chat-related routes"""
    ns_chat = Namespace('chat', description='Chat with Groq AI')
    api.add_namespace(ns_chat)

    @ns_chat.route('/')
    class Chat(Resource):
        @ns_chat.expect(models['chat_request'])
        @ns_chat.marshal_with(models['chat_response'])
        def post(self):
            """Send a message to the chatbot and get a response"""
            data = request.json or {}
            message = data.get('message', '')
            response = ai_service.ask_groq(message)
            return {'response': response}

    @ns_chat.route('/habit-trainer')
    class HabitTrainer(Resource):
        @ns_chat.expect(models['habit_trainer_request'])
        @ns_chat.marshal_with(models['habit_trainer_response'])
        def post(self):
            """Get a personalized habit-building plan from the AI Habit Trainer"""
            data = request.json or {}
            habit_goal = data.get('habit_goal', '')
            context = data.get('context', '')
            plan = ai_service.habit_trainer(habit_goal, context)
            return {'plan': plan}

    @ns_chat.route('/emotion-recognition')
    class EmotionRecognition(Resource):
        @ns_chat.expect(models['emotion_recognition_request'])
        @ns_chat.marshal_with(models['emotion_recognition_response'])
        def post(self):
            """Recognize emotion(s) from the provided text"""
            try:
                data = request.json or {}
                text = data.get('text', '')
                print(f"[EmotionRecognition] Input text: {text}")
                if not text:
                    api.abort(400, 'Text is required for emotion recognition')
                emotions = ai_service.recognize_emotion(text)
                print(f"[EmotionRecognition] AI response: {emotions}")
                if emotions.startswith('Error:'):
                    api.abort(500, emotions)
                return {'emotions': emotions}
            except Exception as e:
                print(f"[EmotionRecognition] Exception: {e}")
                api.abort(500, f'Emotion recognition failed: {str(e)}') 