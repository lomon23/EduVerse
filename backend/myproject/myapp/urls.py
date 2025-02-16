from django.urls import path
from .views import create_collection, MyDataView, RegisterView, LoginView,  GoogleRegisterView, GetCSRFToken,GoogleLoginView

urlpatterns = [
    # Робота з MongoDB
    path('create_collection/', create_collection, name='create_collection'),
    path('data/', MyDataView.as_view(), name='my_data'),

    # Аутентифікація
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-register/', GoogleRegisterView.as_view(), name='google_register'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('get-csrf-token/', GetCSRFToken.as_view(), name='get_csrf_token'),
]
