from django.core import serializers
from django.contrib.auth.models import User

from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login

from locations.models import Source
from locations.serializers import UserSerializer, SourceSerializer

@api_view(['GET'])
def users(request):
    """
    API endpoint that returns all users.
    """
    permission_classes = [IsAuthenticated]
    
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST', 'PATCH'])
def sources(request):
    """
    API endpoint that returns all workflows or creates new workflow
    """
    permission_classes = [IsAuthenticated]
    if request.method == 'GET':
        sources = Source.objects.all()
        serializer = SourceSerializer(sources, many=True)
        return Response(serializer.data)
    else:
        serializer = SourceSerializer(data=request.data)
        if serializer.is_valid():
            source = serializer.save()
            paths = utils.generate_directories(source.name)
            source.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
