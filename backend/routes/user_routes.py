from flask import request
from flask_restx import Resource, Namespace
from ..services.user_service import user_service

def create_user_routes(api, models):
    """Create user-related routes"""
    
    ns_users = Namespace('users', description='User operations')
    api.add_namespace(ns_users)
    
    @ns_users.route('')
    class UserList(Resource):
        @ns_users.marshal_list_with(models['user'])
        def get(self):
            """List all users"""
            return user_service.get_all_users()

        @ns_users.expect(models['user_create'])
        @ns_users.marshal_with(models['user'], code=201)
        def post(self):
            """Create new user"""
            data = request.json
            new_user = user_service.create_user(data)
            if not new_user:
                api.abort(400, "Email already exists")
            return new_user, 201 