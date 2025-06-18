import uuid
from datetime import datetime
from typing import Dict, Any

def generate_id() -> str:
    """Generate a unique ID"""
    return str(uuid.uuid4())

def get_current_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize input data"""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            # Remove leading/trailing whitespace
            sanitized[key] = value.strip()
        else:
            sanitized[key] = value
    return sanitized 