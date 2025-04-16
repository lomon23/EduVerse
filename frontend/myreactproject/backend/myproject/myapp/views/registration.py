from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from ..utils import get_db_handle

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        db_handle = get_db_handle() 
        collection = db_handle['users']

        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        date_of_birth = request.data.get('date_of_birth')

        if not email or not password or not first_name or not last_name or not date_of_birth:
            return Response({'error': 'All fields are required'}, status=400)

        hashed_password = make_password(password)
        user_data = {
            "email": email,
            "password": hashed_password,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth
        }

        # Перевірка чи такий користувач вже існує в базі
        if collection.find_one({"email": email}):
            return Response({'error': 'User already exists'}, status=400)

        collection.insert_one(user_data)
        return Response({'message': 'User registered successfully'}, status=201)
