from flask import request
from flask_restx import Resource, Namespace
from backend.database.storage import mongo_storage

def create_film_routes(api, models):
    ns_films = Namespace('films', description='Film recommendations')
    api.add_namespace(ns_films)

    @ns_films.route('/recommendations')
    class FilmRecommendation(Resource):
        @ns_films.expect(models['film_recommendation_request'])
        @ns_films.marshal_with(models['film_recommendation_response'])
        def post(self):
            data = request.json or {}
            query = data.get('query', '').strip()
            if not query:
                films = mongo_storage.get_top_films(5)
                return {'films': films}
            # Advanced scoring
            all_films = mongo_storage.get_top_films(2000)  # get all films (or a large number)
            q = query.lower()
            scored = []
            for film in all_films:
                score = 0
                if q in film['title'].lower():
                    score += 3
                if q == film['genre'].lower():
                    score += 2
                if q.isdigit() and int(q) == film['year']:
                    score += 1
                if score > 0:
                    scored.append((score, film['popularity'], film))
            if not scored:
                films = mongo_storage.get_top_films(5)
                return {'films': films}
            # Sort by score desc, then popularity desc
            scored.sort(key=lambda x: (-x[0], -x[1]))
            top_films = [film for _, _, film in scored[:10]]
            return {'films': top_films} 