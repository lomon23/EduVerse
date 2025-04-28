from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime
from ..utils import get_db_handle

@api_view(['POST'])
def save_message(request):
    try:
        db = get_db_handle()
        chat_collection = db['chat']

        # Extract data from the request
        chat_id = request.data.get('chatId')
        sender_email = request.data.get('senderEmail')
        sender_name = request.data.get('senderName')
        content = request.data.get('content')
        message_type = request.data.get('type', 'text')

        if not chat_id or not sender_email or not sender_name or not content:
            return Response({
                'error': 'chatId, senderEmail, senderName, and content are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create the message document
        message = {
            '_id': str(ObjectId()),
            'chatId': chat_id,
            'senderEmail': sender_email,
            'senderName': sender_name,
            'content': content,
            'type': message_type,
            'timestamp': datetime.now(),
            'edited': False
        }

        # Insert into MongoDB
        chat_collection.insert_one(message)

        return Response({
            'message': 'Message saved successfully',
            'data': message
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'error': f'Failed to save message: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_messages(request, chat_id):
    try:
        db = get_db_handle()
        chat_collection = db['chat']
        
        messages = list(chat_collection.find({'chatId': chat_id}).sort('timestamp', 1))
        
        # Convert ObjectId to string for JSON serialization
        for message in messages:
            message['_id'] = str(message['_id'])
            message['timestamp'] = message['timestamp'].isoformat()
            
        return Response(messages, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': f'Failed to fetch messages: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)