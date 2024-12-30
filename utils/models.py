# models.py
from django.db import models
from django.conf import settings  

class City(models.Model):
    country = models.CharField(max_length=100, default="Iran", db_index=True)  
    name = models.CharField(max_length=100,default=None, db_index=True)   
    
    def __str__(self):
        return f"{self.name}, {self.country}"


class UserSelection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username}: {self.city}, {self.country}"
