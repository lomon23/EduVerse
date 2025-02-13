from pymongo import MongoClient

def get_db_handle(db_name, host="localhost", port=27017):

    client = MongoClient(host, port)
    db_handle = client[db_name]
    return db_handle, client
