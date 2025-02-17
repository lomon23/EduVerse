import json
import requests

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import  csrf_protect

from ..utils import get_db_handle




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

        db_handle = get_db_handle()
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

        db_handle = get_db_handle()
        collection = db_handle['users']

        # Перевіряємо, чи є користувач
        existing_user = collection.find_one({'email': email})

        if existing_user:
            # Якщо користувач існує — логінемо його
            return JsonResponse({'message': 'User logged in successfully', 'email': email, 'name': name})

        # Якщо користувача немає — повертаємо помилку
        return JsonResponse({'error': 'User not found. Please register first.'}, status=400)

