from django.contrib.auth.models import User, Group, Permission
from .models import Source
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


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['Latitude', 'Longitude', 'Description', 'Intensity', 'Dispersion', 'Name']