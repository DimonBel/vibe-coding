from flask_restx import fields
from typing import Dict, Any

def create_api_models(api):
    """Create API models for request/response validation"""
    
    # User model
    user_model = api.model('User', {
        'id': fields.String(description='User ID'),
        'username': fields.String(required=True, description='Username'),
        'email': fields.String(required=True, description='Email address')
    })
    
    # Task details model
    task_details_model = api.model('TaskDetails', {
        'priority': fields.String(default='medium', enum=['low', 'medium', 'high'], description='Task priority'),
        'due_date': fields.DateTime(description='Task due date'),
        'notes': fields.String(description='Additional notes')
    })
    
    # Task model
    task_model = api.model('Task', {
        'id': fields.String(description='Task ID'),
        'title': fields.String(required=True, description='Task title'),
        'description': fields.String(required=True, description='Task description'),
        'status': fields.String(enum=['pending', 'in_progress', 'completed'], description='Task status'),
        'ai_response': fields.String(description='AI-generated response'),
        'users': fields.List(fields.Nested(user_model), description='Assigned users'),
        'details': fields.Nested(task_details_model, description='Task details'),
        'created_at': fields.DateTime(description='Creation timestamp'),
        'updated_at': fields.DateTime(description='Last update timestamp')
    })
    
    # Task creation model (without auto-generated fields)
    task_create_model = api.model('TaskCreate', {
        'title': fields.String(required=True, description='Task title'),
        'description': fields.String(required=True, description='Task description'),
        'status': fields.String(enum=['pending', 'in_progress', 'completed'], default='pending'),
        'details': fields.Nested(task_details_model, description='Task details')
    })
    
    # Task update model
    task_update_model = api.model('TaskUpdate', {
        'title': fields.String(description='Task title'),
        'description': fields.String(description='Task description'),
        'status': fields.String(enum=['pending', 'in_progress', 'completed']),
        'details': fields.Nested(task_details_model, description='Task details')
    })
    
    # User creation model
    user_create_model = api.model('UserCreate', {
        'username': fields.String(required=True, description='Username'),
        'email': fields.String(required=True, description='Email address')
    })
    
    # Error model
    error_model = api.model('Error', {
        'message': fields.String(description='Error message'),
        'code': fields.Integer(description='Error code')
    })
    
    # Chat request model
    chat_request_model = api.model('ChatRequest', {
        'message': fields.String(required=True, description='User message for the chatbot')
    })

    # Chat response model
    chat_response_model = api.model('ChatResponse', {
        'response': fields.String(description='Chatbot response')
    })

    # Habit Trainer request model
    habit_trainer_request_model = api.model('HabitTrainerRequest', {
        'habit_goal': fields.String(required=True, description='The habit the user wants to build'),
        'context': fields.String(required=False, description='Additional context about the user or situation')
    })

    # Habit Trainer response model
    habit_trainer_response_model = api.model('HabitTrainerResponse', {
        'plan': fields.String(description='Personalized habit-building plan')
    })

    # Emotion Recognition request model
    emotion_recognition_request_model = api.model('EmotionRecognitionRequest', {
        'text': fields.String(required=True, description='Text to analyze for emotion recognition')
    })

    # Emotion Recognition response model
    emotion_recognition_response_model = api.model('EmotionRecognitionResponse', {
        'emotions': fields.String(description='Recognized emotion(s) from the text')
    })

    # Film model
    film_model = api.model('Film', {
        'title': fields.String(required=True, description='Film title'),
        'year': fields.Integer(required=True, description='Release year'),
        'genre': fields.String(required=True, description='Genre'),
    })

    # Film recommendation request model
    film_recommendation_request_model = api.model('FilmRecommendationRequest', {
        'query': fields.String(description='Search query for film recommendations'),
    })

    # Film recommendation response model
    film_recommendation_response_model = api.model('FilmRecommendationResponse', {
        'films': fields.List(fields.Nested(film_model), description='List of recommended films'),
    })
    
    return {
        'user': user_model,
        'task': task_model,
        'task_create': task_create_model,
        'task_update': task_update_model,
        'user_create': user_create_model,
        'error': error_model,
        'chat_request': chat_request_model,
        'chat_response': chat_response_model,
        'habit_trainer_request': habit_trainer_request_model,
        'habit_trainer_response': habit_trainer_response_model,
        'emotion_recognition_request': emotion_recognition_request_model,
        'emotion_recognition_response': emotion_recognition_response_model,
        'film': film_model,
        'film_recommendation_request': film_recommendation_request_model,
        'film_recommendation_response': film_recommendation_response_model
    } 