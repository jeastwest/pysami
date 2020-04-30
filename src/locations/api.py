from django.core import serializers
from django.contrib.auth.models import User

from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from locations.models import Map, Source
from locations.serializers import UserSerializer, SourceSerializer, MapSerializer

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
def maps(request):
    """
    API endpoint that returns all map or creates new map
    """

    permission_classes = [IsAuthenticated]
    if request.method == 'GET':
        user = request.user
        maps = Map.objects.filter(Added_by=user)
        serializer = MapSerializer(maps, many=True)
        return Response(serializer.data)
    elif request.method =='POST':
        serializer = MapSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            map = serializer.save(Added_by=user)
            map.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PATCH'])
def sources(request, pk):
    """
    API endpoint that returns all sources  or creates new source
    """

    permission_classes = [IsAuthenticated]
    if request.method == 'GET':
        user = request.user
        sources = Source.objects.filter(Added_by=user, Map=pk)
        serializer = SourceSerializer(sources, many=True)
        return Response(serializer.data)
    elif request.method =='POST':
        serializer = SourceSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            source = serializer.save(Added_by=user)
            source.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
