from django.urls import path
from .views import RegisterView, LoginView, GoogleRegisterView, GoogleLoginView, GetCSRFToken
from .views import create_course, get_courses, get_course_by_id
from .views import create_course_item, get_course_items
from .views import get_account_details
from .views import update_course
from .views import courses
from .views import complete_course

urlpatterns = [
    # Аутентифікація
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-register/', GoogleRegisterView.as_view(), name='google_register'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('get-csrf-token/', GetCSRFToken.as_view(), name='get_csrf_token'),
    
    # Курси
    path('create-course/', create_course, name='create_course'),
    path('courses/', get_courses, name='get_courses'),
    path('courses/<str:_id>/', get_course_by_id, name='get-course-by-id'),  # Changed from course_id to _id
    path('api/courses/', get_courses, name='get_courses'),
    path('courses/<str:course_id>/', courses.update_course, name='update_course'),

    path('courses/<str:course_id>/complete/', complete_course, name='complete_course'),

    # Елементи курсу
    path('create-course-item/', create_course_item, name='create_course_item'),
    path('course/<str:_id>/items/', get_course_items, name='get-course-items'),  # Changed from course_id to _id

    # акаунт 
    path('account/details/', get_account_details, name='account_details'),
]
