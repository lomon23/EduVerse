import pymongo
from pymongo import MongoClient

# Налаштування підключення до MongoDB
def get_db_handle(db_name):
    client = MongoClient('mongodb://localhost:27017/')  # Підключення до локального MongoDB
    db_handle = client[db_name]  # Використовуємо базу даних з вказаним ім'ям
    return db_handle