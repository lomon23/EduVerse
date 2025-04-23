from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime
from ..utils import get_db_handle

@api_view(['POST'])
def create_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        # Get data from request
        name = request.data.get('name')
        is_private = request.data.get('isPrivate', False)
        invite_code = request.data.get('inviteCode') if is_private else None
        owner_email = request.headers.get('Email')

        if not name or not owner_email:
            return Response({
                'error': 'Name and owner email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create room document
        room = {
            'name': name,
            'isPrivate': is_private,
            'inviteCode': invite_code,
            'createdAt': datetime.now(),
            'members': [{
                'email': owner_email,
                'role': 'owner',
                'joinedAt': datetime.now()
            }]
        }

        # Insert into MongoDB
        result = rooms_collection.insert_one(room)
        
        # Return the created room with its ID
        room['_id'] = str(result.inserted_id)
        return Response(room, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'error': f'Failed to create room: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def join_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        room_id = request.data.get('roomId')
        invite_code = request.data.get('inviteCode')
        user_email = request.headers.get('Email')

        if not room_id or not user_email:
            return Response({
                'error': 'Room ID and user email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Find the room
        try:
            room = rooms_collection.find_one({'_id': ObjectId(room_id)})
        except:
            return Response({
                'error': 'Invalid room ID'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not room:
            return Response({
                'error': 'Room not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if user is already a member
        if any(member['email'] == user_email for member in room['members']):
            return Response({
                'error': 'User is already a member of this room'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check invite code for private rooms
        if room['isPrivate'] and invite_code != room['inviteCode']:
            return Response({
                'error': 'Invalid invite code'
            }, status=status.HTTP_403_FORBIDDEN)

        # Add user to room members
        result = rooms_collection.update_one(
            {'_id': ObjectId(room_id)},
            {'$push': {
                'members': {
                    'email': user_email,
                    'role': 'member',
                    'joinedAt': datetime.now()
                }
            }}
        )

        if result.modified_count == 0:
            return Response({
                'error': 'Failed to join room'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'message': 'Successfully joined room'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': f'Failed to join room: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)