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
        fields = ['pk', 'Name', 'City']

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['Map', 'Latitude', 'Longitude', 'Description', 'Intensity', 'Dispersion', 'Name']