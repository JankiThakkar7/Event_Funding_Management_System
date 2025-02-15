from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("volunteer", "Volunteer"),
        ("visitor", "Visitor")
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    admin = models.OneToOneField(User, on_delete=models.CASCADE, related_name="organization")

    def __str__(self):
        return self.name
    
class Volunteer(models.Model):
    vol_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="volunteers")

    