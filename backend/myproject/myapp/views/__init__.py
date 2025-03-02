# views/__init__.py

from .registration import RegisterView
from .login import LoginView
from .google_auth import GoogleRegisterView, GoogleLoginView , GetCSRFToken
from .createCourse import create_course, get_courses,get_course_by_id

from .CreateCourseItem import create_course_item, get_course_items

