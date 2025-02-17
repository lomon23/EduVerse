import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # Завантажує змінні з .env

def get_db_handle():
    mongo_url = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "dyplom")

    client = MongoClient(mongo_url)
    return client[db_name]  # Повертає базу даних
