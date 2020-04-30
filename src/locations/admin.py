from django.contrib import admin

# Register your models here.
from .models import Source
from .models import Map

admin.site.register(Source)
admin.site.register(Map)