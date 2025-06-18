import json
import os
from typing import Dict, List, Any, Optional
from ..config.settings import get_config
from pymongo import MongoClient

class MongoDBStorage:
    """MongoDB-based storage system"""
    def __init__(self, uri=None, db_name=None):
        self.uri = uri or 'mongodb://localhost:27017/'
        self.db_name = db_name or 'cursor_test_db'
        self.client = MongoClient(self.uri)
        self.db = self.client[self.db_name]
        self.users = self.db['users']
        self.tasks = self.db['tasks']

    def find_task(self, task_id):
        return self.tasks.find_one({'id': task_id})

    def find_user(self, user_id):
        return self.users.find_one({'id': user_id})

    def get_all_tasks(self):
        return list(self.tasks.find({}, {'_id': 0}))

    def get_all_users(self):
        return list(self.users.find({}, {'_id': 0}))

    def add_task(self, task):
        self.tasks.insert_one(task)

    def add_user(self, user):
        self.users.insert_one(user)

    def update_task(self, task_id, task_data):
        result = self.tasks.find_one_and_update(
            {'id': task_id},
            {'$set': task_data},
            return_document=True
        )
        return result

    def delete_task(self, task_id):
        result = self.tasks.delete_one({'id': task_id})
        return result.deleted_count > 0

    def assign_user_to_task(self, task_id, user_id):
        result = self.tasks.update_one(
            {'id': task_id},
            {'$addToSet': {'users': user_id}}
        )
        return result.modified_count > 0

    def remove_user_from_task(self, task_id, user_id):
        result = self.tasks.update_one(
            {'id': task_id},
            {'$pull': {'users': user_id}}
        )
        return result.modified_count > 0

    def user_exists_by_email(self, email):
        return self.users.count_documents({'email': email}) > 0

# Global MongoDB storage instance
mongo_storage = MongoDBStorage() 