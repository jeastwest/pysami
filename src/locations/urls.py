from django.urls import path

from locations import api

urlpatterns = [
    path('users/', api.users, name='users'),
    path('maps/', api.maps, name='maps'),
    path('sources/<pk>/', api.sources, name='sources')
]