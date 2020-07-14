
from django.contrib.auth.models import User
from django.core import serializers

import uuid

from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status

from locations.models import Map, Source
from locations.serializers import UserSerializer, SourceSerializer, MapSerializer, NewMapSerializer


@api_view(['GET'])
def users(request):
    """
    API endpoint that returns all users.
    """

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def maps(request):
    """
    API endpoint that returns all maps or creates new map
    """

    if request.method == 'GET':
        user = request.user
        maps = Map.objects.filter(added_by=user)
        serializer = MapSerializer(maps, many=True)
        return Response(serializer.data)
    elif request.method =='POST':
        print(str(len(request.data)))
        serializer = NewMapSerializer(data=request.data)
        if serializer.is_valid():
            id = uuid.uuid4()
            user = request.user
            map = serializer.save(id=id, added_by=user)
            map.save()
            serializer = MapSerializer(map)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'PATCH'])
def sources(request, pk):
    """
    API endpoint that returns all sources  or creates new source
    """

    if request.method == 'GET':
        user = request.user
        sources = Source.objects.filter(added_by=user, map_id=pk)
        serializer = SourceSerializer(sources, many=True)
        return Response(serializer.data)
    elif request.method =='POST':
        serializer = SourceSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            source = serializer.save(added_by=user)
            source.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'PATCH'])
def batch(request, pk):
    """
    API endpoint that returns all sources  or creates new source
    """

    if request.method =='POST':
        return Response([{"message": "oh i don't know"}], status=status.HTTP_201_CREATED)
    # if request.method =='POST':
    #     serializer = SourceSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user = request.user
    #         source = serializer.save(added_by=user)
    #         source.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    return Response([{"message": "oh i don't know either"}], status=status.HTTP_400_BAD_REQUEST)

