from django.contrib.auth.models import User, Group, Permission
from .models import Map, Source
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'is_active', 'date_joined']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['name', 'content_type', 'codename']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = ['id', 'mapName', 'area','shapeFilePath', 'shapeFileData','featureFilePath','featureFileData','studyArea']

class NewMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = ['mapName', 'area','shapeFilePath', 'shapeFileData','featureFilePath','featureFileData','studyArea']

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['map_id', 'lat', 'lng', 'sourceType', 'intensity', 'dispersion', 'name']
