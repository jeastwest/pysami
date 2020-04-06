from django.urls import path

from locations import api

urlpatterns = [
    path('users/', api.users, name='users'),
    path('sources/', api.sources, name='sources'),
]