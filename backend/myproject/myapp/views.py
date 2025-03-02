
from .views.registration import RegisterView
from .views.login import LoginView
from .views.google_auth import GoogleRegisterView, GoogleLoginView, GetCSRFToken

from .views.createCourse import create_course, get_courses,get_course_by_id
from .views.CreateCourseItem import create_course_item, get_course_items 
