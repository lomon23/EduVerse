from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Адмін панель Django
    path('api/', include('myapp.urls')),  # Всі маршрути додатку myapp
]
