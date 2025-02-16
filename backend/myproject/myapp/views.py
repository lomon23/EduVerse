from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.views import View
from pymongo import MongoClient
import jwt
import datetime
import json
from django.conf import settings
from social_django.utils import psa
from rest_framework import status
from django.contrib.auth import authenticate
import requests
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils import get_db_handle


def create_collection():
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
    def get(self,):
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
            db_handle, = get_db_handle('dyplom')
            collection = db_handle['dyplom']
            collection.insert_one(serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class RegisterView(APIView):  
    permission_classes = [AllowAny]
    @csrf_exempt  # Не забувайте використовувати декоратор
    def post(self, request):
        db_handle = get_db_handle('dyplom')  # Повертає базу даних
        collection = db_handle['users']  # Отримуємо колекцію users

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
    permission_classes = [AllowAny]
    @csrf_exempt 
    def post(self, request):
        db_handle = get_db_handle('dyplom')
        collection = db_handle['users']

        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        # Знайти користувача в базі даних
        user = collection.find_one({"email": email})
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)

        if check_password(password, user["password"]):
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

from django.views import View
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
import json
import requests
from .utils import get_db_handle  # Підключення до MongoDB

@method_decorator(csrf_protect, name='dispatch')  # Додаємо CSRF-захист
class GoogleRegisterView(View):
    def post(self, request):
        data = json.loads(request.body)
        token = data.get('token')

        if not token:
            return JsonResponse({'error': 'Token is required'}, status=400)

        # Перевірка Google-токена
        google_url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}"
        google_response = requests.get(google_url)

        if google_response.status_code != 200:
            return JsonResponse({'error': 'Invalid Google token'}, status=400)

        user_info = google_response.json()
        email = user_info.get('email')
        name = user_info.get('name')

        db_handle = get_db_handle('dyplom')
        collection = db_handle['users']

        # Перевіряємо, чи є користувач
        existing_user = collection.find_one({'email': email})

        if existing_user:
            return JsonResponse({'message': 'User already exists', 'email': email, 'name': name})

        # Зберігаємо нового користувача разом із токеном
        collection.insert_one({'email': email, 'name': name, 'token': token})

        return JsonResponse({'message': 'User registered successfully', 'email': email, 'name': name})



class GetCSRFToken(View):
    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})


@method_decorator(csrf_protect, name='dispatch')  # Додаємо CSRF-захист
class GoogleLoginView(View):
    def post(self, request):
        data = json.loads(request.body)
        token = data.get('token')

        if not token:
            return JsonResponse({'error': 'Token is required'}, status=400)

        # Перевірка Google-токена
        google_url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}"
        google_response = requests.get(google_url)

        if google_response.status_code != 200:
            return JsonResponse({'error': 'Invalid Google token'}, status=400)

        user_info = google_response.json()
        email = user_info.get('email')
        name = user_info.get('name')

        db_handle = get_db_handle('dyplom')
        collection = db_handle['users']

        # Перевіряємо, чи є користувач
        existing_user = collection.find_one({'email': email})

        if existing_user:
            # Якщо користувач існує — логінемо його
            return JsonResponse({'message': 'User logged in successfully', 'email': email, 'name': name})

        # Якщо користувача немає — повертаємо помилку
        return JsonResponse({'error': 'User not found. Please register first.'}, status=400)

