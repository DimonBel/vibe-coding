from flask import Flask, request, jsonify, send_file
from flask_restx import Api, Resource, fields
from flask_cors import CORS
from groq import Groq
import requests
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
api = Api(app, version='1.0', title='Groq API Server',
    description='A simple API server with JSON storage')

# JSON database setup
DB_FILE = 'local_db.json'

def load_db():
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {'users': [], 'tasks': []}

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2, default=str)

# Helper functions
def find_task(task_id):
    db = load_db()
    return next((t for t in db['tasks'] if t['id'] == task_id), None)

def find_user(user_id):
    db = load_db()
    return next((u for u in db['users'] if u['id'] == user_id), None)

# Namespaces
ns_ask = api.namespace('ask', description='AI问答操作')
ns_image = api.namespace('image', description='Image operations')
ns_tasks = api.namespace('tasks', description='Task operations') 
ns_users = api.namespace('users', description='User operations')

# Models
user_model = api.model('User', {
    'id': fields.String(description='User ID'),
    'username': fields.String(required=True),
    'email': fields.String(required=True)
})

task_details_model = api.model('TaskDetails', {
    'priority': fields.String(default='medium'),
    'due_date': fields.DateTime,
    'notes': fields.String
})

task_model = api.model('Task', {
    'id': fields.String,
    'title': fields.String(required=True),
    'description': fields.String(required=True),
    'status': fields.String(enum=['pending', 'in_progress', 'completed']),
    'ai_response': fields.String,
    'users': fields.List(fields.Nested(user_model)),
    'details': fields.Nested(task_details_model),
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

# Groq client setup
client = Groq(
    api_key="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",
    base_url="https://api.groq.com"
)

def ask_groq(question):
    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": question}],
            model="llama3-8b-8192",
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# Task Endpoints
@ns_tasks.route('')
class TaskList(Resource):
    @ns_tasks.marshal_list_with(task_model)
    def get(self):
        """List all tasks"""
        return load_db()['tasks']

    @ns_tasks.expect(task_model)
    @ns_tasks.marshal_with(task_model, code=201)
    def post(self):
        """Create new task"""
        db = load_db()
        data = request.json
        
        task_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        ai_response = ask_groq(f"Task: {data['title']}. Details: {data['description']}. Provide guidance.")
        
        new_task = {
            'id': task_id,
            'title': data['title'],
            'description': data['description'],
            'status': 'pending',
            'ai_response': ai_response,
            'users': [],
            'details': {},
            'created_at': now,
            'updated_at': now
        }
        
        db['tasks'].append(new_task)
        save_db(db)
        return new_task, 201

@ns_tasks.route('/<string:task_id>')
class TaskResource(Resource):
    @ns_tasks.marshal_with(task_model)
    def get(self, task_id):
        """Get task details"""
        task = find_task(task_id)
        if not task:
            api.abort(404, "Task not found")
        return task

    @ns_tasks.expect(task_model)
    @ns_tasks.marshal_with(task_model)
    def put(self, task_id):
        """Update task"""
        db = load_db()
        task = find_task(task_id)
        if not task:
            api.abort(404, "Task not found")
            
        data = request.json
        task.update(data)
        task['updated_at'] = datetime.now().isoformat()
        
        if 'description' in data:
            task['ai_response'] = ask_groq(f"Updated task: {data['title']}. New details: {data['description']}")
        
        save_db(db)
        return task

    def delete(self, task_id):
        """Delete task"""
        db = load_db()
        db['tasks'] = [t for t in db['tasks'] if t['id'] != task_id]
        save_db(db)
        return '', 204

# User Endpoints 
@ns_users.route('')
class UserList(Resource):
    @ns_users.marshal_list_with(user_model)
    def get(self):
        """List all users"""
        return load_db()['users']

    @ns_users.expect(user_model)
    @ns_users.marshal_with(user_model, code=201)
    def post(self):
        """Create new user"""
        db = load_db()
        data = request.json
        
        if any(u['email'] == data['email'] for u in db['users']):
            api.abort(400, "Email already exists")
            
        new_user = {
            'id': str(uuid.uuid4()),
            'username': data['username'],
            'email': data['email']
        }
        
        db['users'].append(new_user)
        save_db(db)
        return new_user, 201

# Task Relationships
@ns_tasks.route('/<string:task_id>/users/<string:user_id>')
class TaskUserRelationship(Resource):
    def put(self, task_id, user_id):
        """Assign user to task"""
        db = load_db()
        task = find_task(task_id)
        user = find_user(user_id)
        
        if not task or not user:
            api.abort(404, "Task or User not found")
            
        if user['id'] not in task['users']:
            task['users'].append(user['id'])
            save_db(db)
        return '', 204

    def delete(self, task_id, user_id):
        """Remove user from task"""
        db = load_db()
        task = find_task(task_id)
        if task and user_id in task['users']:
            task['users'].remove(user_id)
            save_db(db)
        return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)
