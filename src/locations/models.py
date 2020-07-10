import datetime
import uuid
from django.conf import settings
from django.db import models
from django.urls import reverse

# Create your models here.
class Map(models.Model):
	id  			=models.UUIDField(primary_key=True)
	added_by		=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	# add-map request json properties:
	mapName		 	=models.TextField(default="") # map name
	area 		 	=models.TextField(default="") # study area name
	shapeFilePath	=models.TextField(default="") # study area shape file path
	shapeFileData	=models.TextField(default="") # placeholder for future data
	featureFilePath =models.TextField(default="") # features.csv file path
	featureFileData =models.TextField(default="") # placeholder for future data
	studyArea		=models.TextField(default="") # placeholder for future data

	def __str__(self):
		return f'{self.Name}'

   
class Source(models.Model):
	added_by	=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	# source feature request json properties
	map_id		=models.ForeignKey(Map, on_delete=models.CASCADE)
	lat			=models.FloatField()
	lng			=models.FloatField()
	sourceType	=models.TextField()
	intensity	=models.FloatField()
	dispersion	=models.FloatField()
	name		=models.TextField()

	def __str__(self):
		return f'{self.Name}'