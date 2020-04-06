import datetime
from django.db import models

# Create your models here.
class Source(models.Model):
	Latitude	=models.FloatField()
	Longitude	=models.FloatField()
	Description =models.TextField()
	Intensity 	=models.IntegerField()
	Dispersion  =models.FloatField()
	Name 		=models.TextField()