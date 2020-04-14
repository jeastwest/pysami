import datetime
from django.conf import settings
from django.db import models

# Create your models here.
class Source(models.Model):
	added_by 	=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	Latitude	=models.FloatField()
	Longitude	=models.FloatField()
	Description =models.TextField()
	Intensity 	=models.IntegerField()
	Dispersion  =models.FloatField()
	Name 		=models.TextField()
