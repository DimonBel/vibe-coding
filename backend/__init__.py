from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from .config.settings import get_config
from .models.schemas import create_api_models
from .routes.task_routes import create_task_routes
from .routes.user_routes import create_user_routes

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Enable CORS
    CORS(app)
    
    # Initialize API
    api = Api(
        app, 
        version='1.0', 
        title='Groq API Server',
        description='A simple API server with JSON storage',
        doc='/docs'
    )
    
    # Create API models
    models = create_api_models(api)
    
    # Register routes
    create_task_routes(api, models)
    create_user_routes(api, models)
    
    return app 