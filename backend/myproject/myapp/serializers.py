from rest_framework import serializers

class MyDataSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=255)
    value = serializers.CharField(max_length=255)
