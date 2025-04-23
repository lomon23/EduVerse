from .registration import RegisterView
from .login import LoginView
from .google_auth import GoogleRegisterView, GoogleLoginView, GetCSRFToken
from .createCourse import create_course, get_courses, get_course_by_id
from .CreateCourseItem import create_course_item, get_course_items
from .account import get_account_details
from .courses import update_course
from .createCourse import update_course_progress, complete_course
from .rooms import create_room, join_room  # Add this line