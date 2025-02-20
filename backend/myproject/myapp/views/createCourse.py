from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from ..utils import get_db_handle

@api_view(['POST'])
def create_course(request):
    try:
        data = request.data  # DRF автоматично обробляє JSON
        name = data.get("name")
        description = data.get("description")
        author = data.get("author")
        listItemId = data.get("listItemId", [])

        if not name or not author:
            return Response({"error": "Name and author are required"}, status=status.HTTP_400_BAD_REQUEST)

        db = get_db_handle()
        courses_collection = db["courses"]

        course_data = {
            "name": name,
            "description": description,
            "author": author,
            "listItemId": listItemId
        }

        result = courses_collection.insert_one(course_data)
        return Response({"message": "Course created", "course_id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
