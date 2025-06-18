import json
import os
from typing import Dict, List, Any, Optional
from ..config.settings import get_config

class JSONStorage:
    """JSON file-based storage system"""
    
    def __init__(self, db_file: Optional[str] = None):
        self.config = get_config()
        self.db_file = db_file or self.config.DB_FILE
        
    def load_db(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load data from JSON file"""
        try:
            if os.path.exists(self.db_file):
                with open(self.db_file, 'r') as f:
                    return json.load(f)
            else:
                # Initialize with empty structure
                return {'users': [], 'tasks': []}
        except (FileNotFoundError, json.JSONDecodeError):
            return {'users': [], 'tasks': []}
    
    def save_db(self, data: Dict[str, List[Dict[str, Any]]]) -> None:
        """Save data to JSON file"""
        with open(self.db_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def find_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Find a task by ID"""
        db = self.load_db()
        return next((t for t in db['tasks'] if t['id'] == task_id), None)
    
    def find_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Find a user by ID"""
        db = self.load_db()
        return next((u for u in db['users'] if u['id'] == user_id), None)
    
    def get_all_tasks(self) -> List[Dict[str, Any]]:
        """Get all tasks"""
        db = self.load_db()
        return db['tasks']
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users"""
        db = self.load_db()
        return db['users']
    
    def add_task(self, task: Dict[str, Any]) -> None:
        """Add a new task"""
        db = self.load_db()
        db['tasks'].append(task)
        self.save_db(db)
    
    def add_user(self, user: Dict[str, Any]) -> None:
        """Add a new user"""
        db = self.load_db()
        db['users'].append(user)
        self.save_db(db)
    
    def update_task(self, task_id: str, task_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a task"""
        db = self.load_db()
        task = self.find_task(task_id)
        if task:
            task.update(task_data)
            self.save_db(db)
            return task
        return None
    
    def delete_task(self, task_id: str) -> bool:
        """Delete a task"""
        db = self.load_db()
        original_length = len(db['tasks'])
        db['tasks'] = [t for t in db['tasks'] if t['id'] != task_id]
        self.save_db(db)
        return len(db['tasks']) < original_length
    
    def assign_user_to_task(self, task_id: str, user_id: str) -> bool:
        """Assign a user to a task"""
        db = self.load_db()
        task = self.find_task(task_id)
        user = self.find_user(user_id)
        
        if task and user and user_id not in task.get('users', []):
            if 'users' not in task:
                task['users'] = []
            task['users'].append(user_id)
            self.save_db(db)
            return True
        return False
    
    def remove_user_from_task(self, task_id: str, user_id: str) -> bool:
        """Remove a user from a task"""
        db = self.load_db()
        task = self.find_task(task_id)
        
        if task and user_id in task.get('users', []):
            task['users'].remove(user_id)
            self.save_db(db)
            return True
        return False
    
    def user_exists_by_email(self, email: str) -> bool:
        """Check if a user exists by email"""
        db = self.load_db()
        return any(u['email'] == email for u in db['users'])

# Global storage instance
storage = JSONStorage() 