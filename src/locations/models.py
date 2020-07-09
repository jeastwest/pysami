import datetime
import uuid
from django.conf import settings
from django.db import models
from django.urls import reverse

# Create your models here.
class Map(models.Model):
	id  			=models.UUIDField(primary_key=True)
	Added_by		=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	mapName		 	=models.TextField(default="")
	area 		 	=models.TextField(default="")
	shapeFile		=models.TextField(default="")
	shapeFileData	=models.TextField(default="") 
	featuresFile 	=models.TextField(default="")
	featuresFileData=models.TextField(default="")
	studyArea		=models.TextField(default="")

	def __str__(self):
		return f'{self.Name}'

   
class Source(models.Model):
	Map			=models.ForeignKey(Map, on_delete=models.CASCADE)
	Added_by	=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	Latitude	=models.FloatField()
	Longitude	=models.FloatField()
	Description	=models.TextField()
	Intensity	=models.IntegerField()
	Dispersion	=models.FloatField()
	Name		=models.TextField()

	def __str__(self):
		return f'{self.Name}'