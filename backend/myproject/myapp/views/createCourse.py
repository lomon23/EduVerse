from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..utils import get_db_handle

@api_view(['POST'])
def create_course(request):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Get data from request
        name = request.data.get('name')
        description = request.data.get('description')
        author = request.data.get('author')
        
        # Validate required fields
        if not name or not author:
            return Response({
                'error': 'Name and author are required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Create course document
        course = {
            'name': name,
            'description': description or '',
            'author': author,
            'listItemId': []  # Empty array for future items
        }
        
        # Insert into MongoDB
        result = courses_collection.insert_one(course)
        
        # Return created course with ID
        return Response({
            '_id': str(result.inserted_id),
            'name': name,
            'description': description,
            'author': author,
            'listItemId': []
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create course: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_courses(request):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Get all courses from collection
        courses = list(courses_collection.find())
        
        # Format response
        response_courses = []
        for course in courses:
            response_courses.append({
                '_id': str(course['_id']),
                'name': course['name'],
                'description': course.get('description', ''),
                'author': course['author'],
                'listItemId': course.get('listItemId', [])
            })
            
        return Response(response_courses, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch courses: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def get_course_by_id(request, _id):
    try:
        db = get_db_handle()
        courses_collection = db['courses']
        
        # Convert string ID to ObjectId
        try:
            course_object_id = ObjectId(_id)
        except:
            return Response(
                {'error': 'Invalid course ID format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Find the course
        course = courses_collection.find_one({'_id': course_object_id})
        
        if not course:
            return Response(
                {'error': 'Course not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Format response
        response_course = {
            '_id': str(course['_id']),
            'name': course['name'],
            'description': course.get('description', ''),
            'author': course.get('author', ''),
            'listItemId': course.get('listItemId', [])
        }
        
        return Response(response_course, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch course: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )