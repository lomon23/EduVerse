import logging
import random
import string
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime
from ..utils import get_db_handle

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.ERROR)

def check_room_permission(room, user_email, role='owner'):
    """
    Перевіряє, чи є user_email власником (owner) або учасником (member) кімнати.
    :param room: документ кімнати з БД
    :param user_email: email користувача
    :param role: 'owner' або 'member'
    :return: True/False
    """
    if not room or not user_email:
        return False

    if role == 'owner':
        return room.get('ownerEmail') == user_email
    elif role == 'member':
        return any(m['email'] == user_email for m in room.get('members', []))
    return False

@api_view(['POST'])
def create_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        # Get data from request
        name = request.data.get('name')
        is_private = request.data.get('isPrivate', False)
        owner_email = request.headers.get('Email')  # Use email from headers
        avatar = request.data.get('avatar', '')  # нове поле, можна передавати url або base64

        if not name or not owner_email:
            logger.error("Missing required fields: name or ownerEmail")
            return Response({
                'error': 'Name and owner email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generate invite code
        if is_private:
            random_suffix = ''.join(random.choices(string.digits, k=6))  # Increased to 6 digits
            invite_code = f"{name[:5]}-{datetime.now().strftime('%Y%m%d')}-{random_suffix}"
        else:
            random_suffix = ''.join(random.choices(string.digits, k=3))
            invite_code = f"{name[:5]}-{datetime.now().strftime('%Y%m%d')}-{random_suffix}"

        # Create room document
        room = {
            'name': name,
            'ownerEmail': owner_email,  # Associate room with the owner's email
            'isPrivate': is_private,
            'inviteCode': invite_code,
            'createdAt': datetime.now(),
            'avatar': avatar,  # нове поле
            'members': [{
                'email': owner_email,
                'role': 'owner',
                'joinedAt': datetime.now()
            }],
            'channels': []  # Initialize with an empty array
        }

        # Insert into MongoDB
        result = rooms_collection.insert_one(room)
        
        # Return the created room with its ID
        room['_id'] = str(result.inserted_id)
        return Response(room, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Exception occurred in create_room: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to create room: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def join_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        # Get data from request
        invite_code = request.data.get('inviteCode')
        user_email = request.headers.get('Email')  # Use email from headers

        if not invite_code or not user_email:
            return Response({
                'error': 'Invite code and user email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Find the room by invite code
        room = rooms_collection.find_one({'inviteCode': invite_code})

        if not room:
            return Response({
                'error': 'Invalid invite code or room not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if user is already a member
        if any(member['email'] == user_email for member in room['members']):
            return Response({
                'error': 'User is already a member of this room'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Add user to room members
        result = rooms_collection.update_one(
            {'_id': room['_id']},
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
            'message': 'Successfully joined room',
            'roomId': str(room['_id'])
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in join_room: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to join room: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def join_course(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        # Get data from request
        invite_code = request.data.get('inviteCode')
        user_email = request.headers.get('Email')

        if not invite_code or not user_email:
            return Response({
                'error': 'Invite code and user email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Find the room by invite code
        room = rooms_collection.find_one({'inviteCode': invite_code})

        if not room:
            return Response({
                'error': 'Invalid invite code or room not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if user is already a member
        if any(member['email'] == user_email for member in room['members']):
            return Response({
                'error': 'User is already a member of this course'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Add user to room members
        result = rooms_collection.update_one(
            {'_id': room['_id']},
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
                'error': 'Failed to join course'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'message': 'Successfully joined the course'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in join_course: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to join course: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def remove_user_from_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        room_id = request.data.get('roomId')
        user_id = request.data.get('userId')
        user_email = request.data.get('email')
        requester_email = request.headers.get('Email')

        if not room_id or (not user_id and not user_email):
            return Response({
                'error': 'Room ID and either user ID or email are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Find the room
        room = rooms_collection.find_one({'_id': ObjectId(room_id)})
        if not room:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if requester is the owner of the room
        if not check_room_permission(room, requester_email, role='owner'):
            return Response({'error': 'Only the room owner can remove users'}, status=status.HTTP_403_FORBIDDEN)

        # Заборонити видалення власника кімнати
        if user_email and user_email == room.get('ownerEmail'):
            return Response({'error': 'Owner cannot be removed from the room'}, status=status.HTTP_403_FORBIDDEN)

        # Build the query to remove the user
        query = {'_id': ObjectId(room_id)}
        update = {'$pull': {'members': {}}}
        if user_id:
            update['$pull']['members']['userId'] = user_id
        if user_email:
            update['$pull']['members']['email'] = user_email

        # Update the room document
        result = rooms_collection.update_one(query, update)

        if result.modified_count == 0:
            return Response({
                'error': 'Failed to remove user or user not found in the room'
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'message': 'User successfully removed from the room'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in remove_user_from_room: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to remove user: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_room(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        # Get data from request
        room_id = request.data.get('roomId')
        requester_email = request.headers.get('Email')

        if not room_id:
            return Response({
                'error': 'Room ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Find the room
        room = rooms_collection.find_one({'_id': ObjectId(room_id)})
        if not room:
            return Response({
                'error': 'Room not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if requester is the owner
        if not check_room_permission(room, requester_email, role='owner'):
            return Response({
                'error': 'Only the room owner can delete the room'
            }, status=status.HTTP_403_FORBIDDEN)

        # Delete the room
        result = rooms_collection.delete_one({'_id': ObjectId(room_id)})

        if result.deleted_count == 0:
            return Response({
                'error': 'Room not found or failed to delete'
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'message': 'Room successfully deleted'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in delete_room: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to delete room: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_rooms(request):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        user_email = request.headers.get('Email')  # Use email from headers

        if not user_email:
            return Response({
                'error': 'User email is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Fetch rooms created by the user
        created_rooms = list(rooms_collection.find({'ownerEmail': user_email}, {'_id': 1, 'name': 1}))
        for room in created_rooms:
            room['_id'] = str(room['_id'])

        # Fetch rooms the user has joined
        joined_rooms = list(rooms_collection.find({'members.email': user_email, 'ownerEmail': {'$ne': user_email}}, {'_id': 1, 'name': 1}))
        for room in joined_rooms:
            room['_id'] = str(room['_id'])

        return Response({
            'createdRooms': created_rooms,
            'joinedRooms': joined_rooms
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in get_user_rooms: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to fetch user rooms: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_room_details(request, room_id):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        
        room = rooms_collection.find_one(
            {'_id': ObjectId(room_id)},
            {'_id': 0, 'name': 1, 'createdAt': 1, 'ownerEmail': 1, 'inviteCode': 1, 'isPrivate': 1, 'avatar': 1}  # додано avatar
        )
        if not room:
            return Response({
                'error': 'Room not found'
            }, status=status.HTTP_404_NOT_FOUND)

        return Response(room, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Exception occurred in get_room_details: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to fetch room details: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_details(request, room_id, email):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        room = rooms_collection.find_one({'_id': ObjectId(room_id)})
        if not room:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        member = next((m for m in room.get('members', []) if m['email'] == email), None)
        if not member:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
        # Перетворюємо joinedAt у строку, якщо це datetime
        if hasattr(member['joinedAt'], 'isoformat'):
            member['joinedAt'] = member['joinedAt'].isoformat()
        return Response({
            'email': member['email'],
            'role': member['role'],
            'joinedAt': member['joinedAt']
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Exception occurred in get_room_member: {str(e)}", exc_info=True)
        return Response({'error': f'Failed to fetch member: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_room_members(request, room_id):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        room = rooms_collection.find_one({'_id': ObjectId(room_id)})
        if not room:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        members = room.get('members', [])
        for m in members:
            if hasattr(m['joinedAt'], 'isoformat'):
                m['joinedAt'] = m['joinedAt'].isoformat()
        return Response(members, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Exception in get_room_members: {str(e)}", exc_info=True)
        return Response({'error': f'Failed to fetch members: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def update_room_avatar(request, room_id):
    try:
        db = get_db_handle()
        rooms_collection = db['rooms']
        avatar = request.data.get('avatar')
        if not avatar:
            return Response({'error': 'Avatar is required'}, status=status.HTTP_400_BAD_REQUEST)
        result = rooms_collection.update_one(
            {'_id': ObjectId(room_id)},
            {'$set': {'avatar': avatar}}
        )
        if result.modified_count == 0:
            return Response({'error': 'Failed to update avatar'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Avatar updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

