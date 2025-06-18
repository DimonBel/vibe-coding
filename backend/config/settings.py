import os
from typing import Optional

class Config:
    """Base configuration class"""
    DEBUG = False
    TESTING = False
    DB_FILE = 'local_db.json'
    GROQ_API_KEY = "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"
    GROQ_BASE_URL = "https://api.groq.com"
    GROQ_MODEL = "llama3-8b-8192"
    GROQ_TEMPERATURE = 0.7

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # In production, use environment variables
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', Config.GROQ_API_KEY)

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DB_FILE = 'test_db.json'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name: Optional[str] = None) -> Config:
    """Get configuration based on environment"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    return config[config_name]() 