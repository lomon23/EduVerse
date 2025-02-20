from django.urls import path
from .views import RegisterView, LoginView, GoogleRegisterView, GoogleLoginView, GetCSRFToken, create_course

urlpatterns = [


    # Аутентифікація
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-register/', GoogleRegisterView.as_view(), name='google_register'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('get-csrf-token/', GetCSRFToken.as_view(), name='get_csrf_token'),
    path('create-course/', create_course, name='create_course'),
    
]
