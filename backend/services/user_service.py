import uuid
from typing import Dict, List, Any, Optional
from ..database.storage import storage

class UserService:
    """Service for user-related operations"""
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users"""
        return storage.get_all_users()
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user by ID"""
        return storage.find_user(user_id)
    
    def create_user(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user"""
        # Check if email already exists
        if storage.user_exists_by_email(user_data['email']):
            return None
        
        new_user = {
            'id': str(uuid.uuid4()),
            'username': user_data['username'],
            'email': user_data['email']
        }
        
        storage.add_user(new_user)
        return new_user
    
    def user_exists_by_email(self, email: str) -> bool:
        """Check if a user exists by email"""
        return storage.user_exists_by_email(email)

# Global user service instance
user_service = UserService() 