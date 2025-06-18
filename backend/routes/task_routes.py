from flask import request
from flask_restx import Resource, Namespace
from http import HTTPStatus
from ..services.task_service import task_service
from ..services.user_service import user_service

def create_task_routes(api, models):
    """Create task-related routes"""
    
    ns_tasks = Namespace('tasks', description='Task operations')
    api.add_namespace(ns_tasks)
    
    @ns_tasks.route('')
    class TaskList(Resource):
        @ns_tasks.marshal_list_with(models['task'])
        def get(self):
            """List all tasks"""
            return task_service.get_all_tasks()
        @ns_tasks.expect(models['task_create'])
        @ns_tasks.marshal_with(models['task'])
        def post(self):
            """Create new task"""
            print(f"Request headers: {dict(request.headers)}")
            print(f"Request data: {request.get_data()}")
            print(f"Request json: {request.json}")
            data = request.json
            if data is None:
                api.abort(400, "Invalid JSON data")
            new_task = task_service.create_task(data)  # type: ignore
            return new_task, HTTPStatus.CREATED

    @ns_tasks.route('/<string:task_id>')
    class TaskResource(Resource):
        @ns_tasks.marshal_with(models['task'])
        def get(self, task_id):
            """Get task details"""
            task = task_service.get_task_by_id(task_id)
            if not task:
                api.abort(404, "Task not found")
            return task

        @ns_tasks.expect(models['task_update'])
        @ns_tasks.marshal_with(models['task'])
        def put(self, task_id):
            """Update task"""
            data = request.json
            if data is None:
                api.abort(400, "Invalid JSON data")
            updated_task = task_service.update_task(task_id, data)  # type: ignore
            if not updated_task:
                api.abort(404, "Task not found")
            return updated_task

        def delete(self, task_id):
            """Delete task"""
            success = task_service.delete_task(task_id)
            if not success:
                api.abort(404, "Task not found")
            return '', 204

    @ns_tasks.route('/<string:task_id>/users/<string:user_id>')
    class TaskUserRelationship(Resource):
        def put(self, task_id, user_id):
            """Assign user to task"""
            success = task_service.assign_user_to_task(task_id, user_id)
            if not success:
                api.abort(404, "Task or User not found")
            return '', 204

        def delete(self, task_id, user_id):
            """Remove user from task"""
            success = task_service.remove_user_from_task(task_id, user_id)
            if not success:
                api.abort(404, "Task or User not found")
            return '', 204 