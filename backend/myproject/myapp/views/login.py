from django.contrib.auth.hashers import  check_password
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..utils import get_db_handle

class LoginView(APIView):
    permission_classes = [AllowAny]
    @csrf_exempt 
    def post(self, request):
        db_handle = get_db_handle()
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

