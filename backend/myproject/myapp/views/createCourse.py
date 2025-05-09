import random
import string
from enum import Enum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..utils import get_db_handle
from bson import ObjectId
from datetime import datetime  # Add this import
import math  # Add this import


class CourseVisibility(Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    PERSONAL = "personal"


def generate_course_code(length=8):
    """Генерація унікального коду курсу."""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@api_view(['POST'])
def create_course(request):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Get data from request
        name = request.data.get('name')
        description = request.data.get('description')
        xp_reward = request.data.get('xp_reward', 0)
        visibility = request.data.get('visibility', CourseVisibility.PERSONAL.value)
        author_email = request.headers.get('Email')

        if not name or not author_email:
            return Response({
                'error': 'Name and email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if visibility not in [v.value for v in CourseVisibility]:
            return Response({
                'error': f'Invalid visibility type. Must be one of: {[v.value for v in CourseVisibility]}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create course document
        course = {
            'name': name,
            'description': description or '',
            'author_email': author_email,
            'xp_reward': int(xp_reward),
            'visibility': visibility,
            'created_at': datetime.now(),
            'items': []
        }

        # Insert into MongoDB
        result = courses_collection.insert_one(course)
        
        # Return the created course with its ID
        course['_id'] = str(result.inserted_id)
        return Response(course, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error creating course: {str(e)}")  # Add debug logging
        return Response({
            'error': f'Failed to create course: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_courses(request):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Get email from request header
        author_email = request.headers.get('Email')
        if not author_email:
            return Response({'error': 'Email header is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Filter courses by author_email
        courses = list(courses_collection.find({'author_email': author_email}))
        
        # Convert ObjectId to string
        for course in courses:
            course['_id'] = str(course['_id'])
        
        return Response(courses, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch courses: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
def get_course_by_id(request, _id):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Get email from header
        author_email = request.headers.get('Email')
        if not author_email:
            return Response(
                {'error': 'Email header is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert string ID to ObjectId
        try:
            course_object_id = ObjectId(_id)
        except:
            return Response(
                {'error': 'Invalid course ID format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find course
        course = courses_collection.find_one({'_id': course_object_id})
        
        if not course:
            return Response(
                {'error': 'Course not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Convert ObjectId to string for JSON serialization
        course['_id'] = str(course['_id'])
        
        return Response(course, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching course: {str(e)}")  # Add debug logging
        return Response(
            {'error': f'Failed to fetch course: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def complete_course(request, course_id):
    try:
        email = request.headers.get('Email')
        if not email:
            return Response(
                {'message': 'Email header is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        completion_percentage = request.data.get('completionPercentage')
        if not completion_percentage:
            return Response(
                {'message': 'Completion percentage is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        db = get_db_handle()
        courses = db['courses']

        # Convert string ID to ObjectId
        try:
            course_id = ObjectId(course_id)
        except:
            return Response(
                {'message': 'Invalid course ID'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find and update the course
        result = courses.find_one_and_update(
            {'_id': course_id},
            {'$set': {'completionPercentage': completion_percentage}},
            return_document=True
        )

        if not result:
            return Response(
                {'message': 'Course not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate XP
        xp_reward = result.get('xpReward', 0)
        percentage = float(completion_percentage.strip('%')) / 100
        xp_earned = round(xp_reward * percentage)

        # Update user's progress
        users = db['users']
        users.update_one(
            {'email': email},
            {
                '$inc': {'xp': xp_earned},
                '$addToSet': {
                    'completed_courses': {
                        'course_id': str(course_id),
                        'completion_percentage': completion_percentage,
                        'completed_at': datetime.now()
                    }
                }
            }
        )

        return Response({
            'message': 'Course completed successfully',
            'xp_earned': xp_earned,
            'completion_percentage': completion_percentage
        })

    except Exception as e:
        print(f"Error completing course: {str(e)}")
        return Response(
            {'message': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def update_course_progress(request, course_id):
    pass