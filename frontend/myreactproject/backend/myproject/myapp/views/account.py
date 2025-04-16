from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..utils import get_db_handle
from bson import ObjectId
import base64

@api_view(['GET', 'POST'])
def get_account_details(request):
    try:
        db = get_db_handle()
        users_collection = db['users']
        email = request.headers.get('Email')

        if not email:
            return Response(
                {'error': 'Email header is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.method == 'POST':
            data = request.data
            
            # Handle avatar upload separately
            if 'avatar' in data:
                users_collection.update_one(
                    {'email': email},
                    {'$set': {'avatar': data['avatar']}}
                )
                return Response({'message': 'Avatar updated successfully'})
            
            # Handle other profile updates
            update_data = {
                'first_name': data.get('firstName', ''),
                'last_name': data.get('lastName', ''),
                'date_of_birth': data.get('dateOfBirth', ''),
                'description': data.get('description', '')  # Add description field
            }

            # Update user profile
            result = users_collection.update_one(
                {'email': email},
                {'$set': update_data}
            )

            if result.modified_count > 0:
                return Response({'message': 'Profile updated successfully'})
            else:
                return Response(
                    {'error': 'No changes made'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        # GET request handling
        user = users_collection.find_one({'email': email})
        if not user:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        user['_id'] = str(user['_id'])
        
        return Response({
            'email': user['email'],
            'firstName': user.get('first_name', ''),
            'lastName': user.get('last_name', ''),
            'xp': user.get('xp', 0),
            'dateOfBirth': user.get('date_of_birth', ''),
            'completed_courses': user.get('completed_courses', []),
            'avatar': user.get('avatar', ''),
            'description': user.get('description', '')  # Add description to response
        })
        
    except Exception as e:
        print(f"Error in account_details: {str(e)}")
        return Response(
            {'error': f'Operation failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )