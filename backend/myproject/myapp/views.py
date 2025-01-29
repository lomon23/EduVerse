from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

def home(request):
    return render(request, 'index.html', {
        'title': 'Головна сторінка'
    })

@api_view(['GET'])
def api_test(request):
    return Response({
        "message": "API працює успішно!"
    })
