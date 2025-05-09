from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..utils import get_db_handle
from bson import ObjectId
from datetime import datetime
from enum import Enum

class TaskType(Enum):
    HOMEWORK = "homework"
    LESSON = "lesson"
    REVIEW = "review"

@api_view(['POST'])
def create_weekly_task(request):
    try:
        db = get_db_handle()
        tasks_collection = db['weekly_tasks']
        
        # Get data from request
        title = request.data.get('title')
        description = request.data.get('description')
        task_type = request.data.get('task_type')
        target_count = request.data.get('target_count', 1)
        reward_xp = request.data.get('reward_xp', 0)
        reward_badge_id = request.data.get('reward_badge_id')
        
        if not title or not task_type:
            return Response({
                'error': 'Title and task type are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if task_type not in [t.value for t in TaskType]:
            return Response({
                'error': f'Invalid task type. Must be one of: {[t.value for t in TaskType]}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create task document
        task = {
            'title': title,
            'description': description or '',
            'task_type': task_type,
            'target_count': int(target_count),
            'current_progress': 0,
            'reward_xp': int(reward_xp),
            'reward_badge_id': reward_badge_id,
            'created_at': datetime.now(),
            'is_completed': False,
            'last_updated': datetime.now()
        }

        # Insert into MongoDB
        result = tasks_collection.insert_one(task)
        
        # Return the created task with its ID
        task['_id'] = str(result.inserted_id)
        return Response(task, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error creating weekly task: {str(e)}")
        return Response({
            'error': f'Failed to create weekly task: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_weekly_tasks(request):
    try:
        db = get_db_handle()
        tasks_collection = db['weekly_tasks']
            
        # Fetch all tasks without filtering by course_id
        tasks = list(tasks_collection.find())
        
        # Convert ObjectIds to strings
        for task in tasks:
            task['_id'] = str(task['_id'])
            
        return Response(tasks, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching weekly tasks: {str(e)}")
        return Response({
            'error': f'Failed to fetch weekly tasks: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def update_task_progress(request, task_id):
    try:
        db = get_db_handle()
        tasks_collection = db['weekly_tasks']
        
        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        if not task:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        
        new_progress = int(request.data.get('progress', 0))
        if new_progress > task['target_count']:
            return Response({'error': 'Progress cannot exceed target count'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        update_data = {
            'current_progress': new_progress,
            'is_completed': new_progress >= task['target_count'],
            'last_updated': datetime.now()
        }
        
        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': update_data}
        )
        
        return Response({
            'message': 'Progress updated successfully',
            'is_completed': update_data['is_completed']
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to update progress: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
