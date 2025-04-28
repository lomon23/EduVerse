from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime
from ..utils import get_db_handle

# ======================= BOARD ENDPOINTS =======================
@api_view(['POST'])
def create_board(request):
    try:
        db = get_db_handle()
        boards_collection = db['boards']
        name = request.data.get('name')
        room_id = request.data.get('room_id')
        avatar = request.data.get('avatar', '')
        if not name or not room_id:
            return Response({'error': 'Name and room_id are required'}, status=status.HTTP_400_BAD_REQUEST)
        board = {
            'name': name,
            'room_id': room_id,
            'avatar': avatar,
            'widgets': [],
            'createdAt': datetime.now()
        }
        result = boards_collection.insert_one(board)
        board['_id'] = str(result.inserted_id)
        return Response(board, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Failed to create board: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_board(request):
    try:
        db = get_db_handle()
        boards_collection = db['boards']
        board_id = request.data.get('board_id')
        if not board_id:
            return Response({'error': 'board_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        result = boards_collection.delete_one({'_id': ObjectId(board_id)})
        if result.deleted_count == 0:
            return Response({'error': 'Board not found or already deleted'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Board deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Failed to delete board: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def update_board(request):
    try:
        db = get_db_handle()
        boards_collection = db['boards']
        board_id = request.data.get('board_id')
        new_name = request.data.get('name')
        new_avatar = request.data.get('avatar')
        if not board_id:
            return Response({'error': 'board_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        update_fields = {}
        if new_name:
            update_fields['name'] = new_name
        if new_avatar is not None:
            update_fields['avatar'] = new_avatar
        if not update_fields:
            return Response({'error': 'No fields to update'}, status=status.HTTP_400_BAD_REQUEST)
        result = boards_collection.update_one({'_id': ObjectId(board_id)}, {'$set': update_fields})
        if result.matched_count == 0:
            return Response({'error': 'Board not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Board updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Failed to update board: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_board(request, board_id):
    try:
        db = get_db_handle()
        boards_collection = db['boards']
        board = boards_collection.find_one({'_id': ObjectId(board_id)})
        if not board:
            return Response({'error': 'Board not found'}, status=status.HTTP_404_NOT_FOUND)
        board['_id'] = str(board['_id'])
        widgets_count = len(board.get('widgets', []))
        board['widgetsCount'] = widgets_count
        return Response(board, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Failed to get board: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ======================= WIDGET ENDPOINTS =======================
@api_view(['POST'])
def create_widget(request):
    try:
        db = get_db_handle()
        widgets_collection = db['widgets']
        board_id = request.data.get('board_id')
        widget_type = request.data.get('type')
        x = request.data.get('x')
        y = request.data.get('y')
        data = request.data.get('data', {})
        if not board_id or not widget_type or x is None or y is None:
            return Response({'error': 'board_id, type, x, y are required'}, status=status.HTTP_400_BAD_REQUEST)
        widget = {
            'board_id': board_id,
            'type': widget_type,
            'x': x,
            'y': y,
            'data': data,
            'createdAt': datetime.now()
        }
        result = widgets_collection.insert_one(widget)
        widget['_id'] = str(result.inserted_id)
        return Response(widget, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Failed to create widget: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_widget(request):
    try:
        db = get_db_handle()
        widgets_collection = db['widgets']
        widget_id = request.data.get('widget_id')
        if not widget_id:
            return Response({'error': 'widget_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        result = widgets_collection.delete_one({'_id': ObjectId(widget_id)})
        if result.deleted_count == 0:
            return Response({'error': 'Widget not found or already deleted'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Widget deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Failed to delete widget: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def update_widget(request):
    try:
        db = get_db_handle()
        widgets_collection = db['widgets']
        widget_id = request.data.get('widget_id')
        if not widget_id:
            return Response({'error': 'widget_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        update_fields = {}
        for field in ['type', 'x', 'y', 'data', 'board_id']:
            if field in request.data:
                update_fields[field] = request.data[field]
        if not update_fields:
            return Response({'error': 'No fields to update'}, status=status.HTTP_400_BAD_REQUEST)
        result = widgets_collection.update_one({'_id': ObjectId(widget_id)}, {'$set': update_fields})
        if result.matched_count == 0:
            return Response({'error': 'Widget not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Widget updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Failed to update widget: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
