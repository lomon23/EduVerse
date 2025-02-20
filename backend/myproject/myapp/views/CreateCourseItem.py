from django.http import JsonResponse
from django.views import View
import json
from ..utils import get_db_handle

class CreateCourseItemView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            course_id = data.get("course_id")
            name = data.get("name")
            item_type = data.get("type")
            url = data.get("url")
            text = data.get("text")

            if not course_id or not name or not item_type:
                return JsonResponse({"error": "Course ID, name, and type are required"}, status=400)

            db = get_db_handle()
            items_collection = db["course_items"]

            item_data = {
                "course_id": course_id,
                "name": name,
                "type": item_type,
                "url": url if item_type == 'video' or item_type == 'audio' else None,
                "text": text if item_type == 'text' else None,
            }

            result = items_collection.insert_one(item_data)
            return JsonResponse({"message": "Course item created", "item_id": str(result.inserted_id)})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
