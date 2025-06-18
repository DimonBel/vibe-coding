import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from ..database.storage import mongo_storage
from ..services.ai_service import ai_service

class TaskService:
    """Service for task-related operations"""
    
    def get_all_tasks(self) -> List[Dict[str, Any]]:
        """Get all tasks"""
        return mongo_storage.get_all_tasks()
    
    def get_task_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get a task by ID"""
        return mongo_storage.find_task(task_id)
    
    def create_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new task"""
        task_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        # Generate AI guidance
        ai_response = ai_service.generate_task_guidance(
            task_data['title'], 
            task_data['description']
        )
        
        new_task = {
            'id': task_id,
            'title': task_data['title'],
            'description': task_data['description'],
            'status': task_data.get('status', 'pending'),
            'ai_response': ai_response,
            'users': [],
            'details': task_data.get('details', {}),
            'created_at': now,
            'updated_at': now
        }
        
        mongo_storage.add_task(new_task)
        return new_task
    
    def update_task(self, task_id: str, task_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a task"""
        task = mongo_storage.find_task(task_id)
        if not task:
            return None
        
        # Update timestamp
        task_data['updated_at'] = datetime.now().isoformat()
        
        # Generate new AI guidance if description changed
        if 'description' in task_data:
            ai_response = ai_service.update_task_guidance(
                task_data.get('title', task['title']), 
                task_data['description']
            )
            task_data['ai_response'] = ai_response
        
        updated_task = mongo_storage.update_task(task_id, task_data)
        return updated_task
    
    def delete_task(self, task_id: str) -> bool:
        """Delete a task"""
        return mongo_storage.delete_task(task_id)
    
    def assign_user_to_task(self, task_id: str, user_id: str) -> bool:
        """Assign a user to a task"""
        return mongo_storage.assign_user_to_task(task_id, user_id)
    
    def remove_user_from_task(self, task_id: str, user_id: str) -> bool:
        """Remove a user from a task"""
        return mongo_storage.remove_user_from_task(task_id, user_id)

# Global task service instance
task_service = TaskService() 