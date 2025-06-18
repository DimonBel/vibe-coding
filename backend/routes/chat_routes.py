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
            data = request.json
            message = data.get('message', '')
            response = ai_service.ask_groq(message)
            return {'response': response} 