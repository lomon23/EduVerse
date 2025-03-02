from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from ..utils import get_db_handle

@api_view(['POST'])
def create_course_item(request):
    try:
        db = get_db_handle()
        items_collection = db['course_items']
        courses_collection = db['courses']
        
        # Get data from request
        course_id = request.data.get('course_id')
        item_type = request.data.get('type')
        name = request.data.get('name')
        
        # Validate required fields
        if not course_id or not item_type or not name:
            return Response({
                'error': 'course_id, type, and name are required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Validate item type
        if item_type not in ['text', 'video']:
            return Response({
                'error': 'Invalid item type. Must be either "text" or "video"'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Create item document based on type
        item = {
            'course_id': course_id,
            'name': name,
            'type': item_type,
        }
        
        # Add type-specific field
        if item_type == 'video':
            url = request.data.get('url')
            if not url:
                return Response({
                    'error': 'URL is required for video items'
                }, status=status.HTTP_400_BAD_REQUEST)
            item['url'] = url
        else:  # text type
            text = request.data.get('text')
            if not text:
                return Response({
                    'error': 'Text content is required for text items'
                }, status=status.HTTP_400_BAD_REQUEST)
            item['text'] = text
        
        # Insert item
        result = items_collection.insert_one(item)
        
        # Update course's listItemId
        courses_collection.update_one(
            {'_id': ObjectId(course_id)},
            {'$push': {'listItemId': str(result.inserted_id)}}
        )
        
        # Return created item with ID
        response_item = {
            '_id': str(result.inserted_id),
            'course_id': course_id,
            'name': name,
            'type': item_type
        }
        
        if item_type == 'video':
            response_item['url'] = item['url']
        else:
            response_item['text'] = item['text']
            
        return Response(response_item, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create course item: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_course_items(request, _id):
    try:
        db = get_db_handle()
        items_collection = db['course_items']
        
        # Find items for the course
        items = list(items_collection.find({'course_id': _id}))
        
        # Transform the items for JSON serialization
        items_list = []
        for item in items:
            items_list.append({
                '_id': str(item['_id']),
                'course_id': item['course_id'],
                'name': item.get('name', ''),
                'type': item.get('type', ''),
                'text': item.get('text'),
                'url': item.get('url')
            })
        
        return Response(items_list, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Error fetching course items: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )