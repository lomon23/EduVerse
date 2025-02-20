# views/__init__.py

from .registration import RegisterView
from .login import LoginView
from .google_auth import GoogleRegisterView, GoogleLoginView , GetCSRFToken
from .createCourse import create_course
