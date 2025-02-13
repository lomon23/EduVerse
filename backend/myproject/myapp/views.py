from django.shortcuts import render
from utils import get_db_handle
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.views import View
from pymongo import MongoClient
import jwt
import datetime
from django.conf import settings
from social_django.utils import psa

def create_collection(request):
    db_name = 'dyplom'
    db_handle, client = get_db_handle(db_name)
    if db_handle:
        collection = db_handle['dyplom']
        collection.insert_one({"key": "example_key", "value": "example_value"})
        return JsonResponse({"message": "Collection and document created successfully!"}, status=201)
    return JsonResponse({"message": "Connection failed!"}, status=500)
class MyDataView(APIView):
    @staticmethod
    def convert_objectid_to_str(data):
        if isinstance(data, list):
            return [MyDataView.convert_objectid_to_str(item) for item in data]
        elif isinstance(data, dict):
            return {key: MyDataView.convert_objectid_to_str(value) for key, value in data.items()}
        elif isinstance(data, ObjectId):
            return str(data)
        else:
            return data
    def get(self, request):
        try:
            db_handle, client = get_db_handle('dyplom')
             
            if db_handle is None:
                return JsonResponse({'error': 'Unable to connect to database'}, status=500)
            collection = db_handle['dyplom']
            data = list(collection.find())
            data = self.convert_objectid_to_str(data)
            if not data:
                return JsonResponse({'error': 'No data found'}, status=404)
            return JsonResponse({'data': data}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    def post(self, request):
        serializer = MyDataSerializer(data=request.data)
        if serializer.is_valid():
            db_handle, client = get_db_handle('dyplom')
            collection = db_handle['dyplom']
            collection.insert_one(serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework.permissions import IsAuthenticated



class RegisterView(APIView):#все працює
    permission_classes = [AllowAny]

    def post(self, request):
        db_handle, client = get_db_handle('dyplom')
        collection = db_handle['users']

        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password required'}, status=400)

        hashed_password = make_password(password)
        user_data = {"email": email, "password": hashed_password}

        if collection.find_one({"email": email}):
            return Response({'error': 'User already exists'}, status=400)

        collection.insert_one(user_data)
        return Response({'message': 'User registered successfully'}, status=201)
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Підключення до MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["mydatabase"]
        users_collection = db["users"]

        # Шукаємо користувача в базі
        user = users_collection.find_one({"email": email})

        if not user:
            return Response({"error": "Користувача не знайдено!"}, status=status.HTTP_401_UNAUTHORIZED)

        # Отримуємо хешований пароль з бази
        stored_hashed_password = user.get("password")

        # Перевіряємо пароль
        if check_password(password, stored_hashed_password):
            return Response({"message": "Успішний вхід!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Невірний пароль!"}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    @psa('social:complete')
    def post(self, request):
        token = request.data.get("access_token")
        if not token:
            return Response({'error': 'Token is required'}, status=400)

        user = request.backend.do_auth(token)

        if user:
            db_handle, client = get_db_handle('dyplom')
            collection = db_handle['users']
            user_data = {"email": user.email, "name": user.get_full_name()}

            if not collection.find_one({"email": user.email}):
                collection.insert_one(user_data)

            return Response({'message': 'Google login successful'}, status=200)
        return Response({'error': 'Invalid token'}, status=400)