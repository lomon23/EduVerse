import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # Завантажує змінні з .env

def get_db_handle():
    mongo_url = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB_NAME")

    if not mongo_url or not db_name:
        raise ValueError("Missing required environment variables: MONGO_URI or MONGO_DB_NAME")

    client = MongoClient(mongo_url)
    return client[db_name]  # Повертає базу даних