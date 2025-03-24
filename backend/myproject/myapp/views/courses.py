from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..utils import get_db_handle

@api_view(['PUT'])
def update_course(request, course_id):
    try:
        email = request.headers.get('Email')
        if not email:
            return Response(
                {'error': 'Email header is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        db = get_db_handle()
        courses_collection = db['courses']

        # Check if course exists and user is the author
        course = courses_collection.find_one({
            '_id': ObjectId(course_id),
            'author_email': email
        })

        if not course:
            return Response(
                {'error': 'Course not found or you are not the author'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Update course data
        update_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description')
        }

        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}

        if not update_data:
            return Response(
                {'error': 'No valid update data provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the course
        result = courses_collection.update_one(
            {'_id': ObjectId(course_id)},
            {'$set': update_data}
        )

        if result.modified_count > 0:
            return Response({'message': 'Course updated successfully'})
        else:
            return Response(
                {'error': 'No changes made'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        print(f"Error updating course: {str(e)}")
        return Response(
            {'error': 'Failed to update course'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )