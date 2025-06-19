from faker import Faker
import random
from pymongo import MongoClient

fake = Faker()

GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Fantasy", "Crime", "Thriller", "Romance", "Adventure", "Animation", "Horror"]

client = MongoClient('mongodb://localhost:27017/')
db = client['cursor_test_db']
films_col = db['films']

# Remove existing films
films_col.delete_many({})

films = []
for _ in range(150):
    film = {
        "title": fake.sentence(nb_words=3).replace('.', ''),
        "year": random.randint(1970, 2023),
        "genre": random.choice(GENRES),
        "popularity": round(random.uniform(5, 10), 2)
    }
    films.append(film)

films_col.insert_many(films)
print(f"Inserted {len(films)} films.") 