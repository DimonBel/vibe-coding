# Backend API Server

A well-structured Flask REST API server with JSON storage and AI integration using Groq.

## Architecture

The backend follows a clean architecture pattern with the following structure:

```
backend/
├── config/          # Configuration management
│   ├── __init__.py
│   └── settings.py
├── database/        # Data persistence layer
│   ├── __init__.py
│   └── storage.py
├── models/          # Data models and schemas
│   ├── __init__.py
│   └── schemas.py
├── routes/          # API endpoints
│   ├── __init__.py
│   ├── task_routes.py
│   └── user_routes.py
├── services/        # Business logic
│   ├── __init__.py
│   ├── ai_service.py
│   ├── task_service.py
│   └── user_service.py
├── utils/           # Helper functions
│   ├── __init__.py
│   └── helpers.py
├── __init__.py      # Application factory
├── app.py           # Main application
├── run.py           # Run script
├── requirements.txt # Dependencies
└── README.md        # This file
```

## Features

- **Clean Architecture**: Separation of concerns with distinct layers
- **Configuration Management**: Environment-based configuration
- **JSON Storage**: Simple file-based data persistence
- **AI Integration**: Groq API integration for task guidance
- **RESTful API**: Full CRUD operations for tasks and users
- **API Documentation**: Auto-generated Swagger documentation
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### Tasks
- `GET /tasks` - List all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get task details
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `PUT /tasks/{id}/users/{user_id}` - Assign user to task
- `DELETE /tasks/{id}/users/{user_id}` - Remove user from task

### Users
- `GET /users` - List all users
- `POST /users` - Create a new user

## Setup and Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:
   ```bash
   python run.py
   ```

3. **Access the API**:
   - API Base URL: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/docs`

## Configuration

The application supports different environments:
- `development` (default)
- `production`
- `testing`

Set the `FLASK_ENV` environment variable to change the configuration.

## Data Storage

Data is stored in JSON files:
- `local_db.json` - Main database file
- `test_db.json` - Test database file

## AI Integration

The application integrates with Groq AI to provide task guidance:
- Automatic AI response generation for new tasks
- Updated guidance when tasks are modified
- Configurable AI model and parameters 