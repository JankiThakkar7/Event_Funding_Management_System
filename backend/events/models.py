from django.db import models
from django.contrib.auth.models import make_password
from django.contrib.auth.hashers import check_password   # ✅ Import check_password

# Create your models here.

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed password
    # reset_token = models.CharField(max_length=50, null=True, blank=True) 

    def save(self, *args, **kwargs):
        """Ensure password is hashed only if it’s not already hashed."""
        if not self.password.startswith("pbkdf2_sha256$"):  # Prevent double hashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        """Verify the password for authentication."""
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return self.username


class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    contact_email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    industry_type = models.CharField(max_length=255, blank=True, null=True)
    facebook = models.URLField(max_length=500, blank=True, null=True)
    twitter = models.URLField(max_length=500, blank=True, null=True)
    linkedin = models.URLField(max_length=500, blank=True, null=True)
    password = models.CharField(max_length=255)  # 🔹 Added Password Field
    # reset_token = models.CharField(max_length=50, null=True, blank=True) 

    def save(self, *args, **kwargs):
        if not self.password.startswith("pbkdf2_sha256$"):  
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name="admin")
    contact_email = models.EmailField()  # Admin-specific email
    admin_name = models.CharField(max_length=255) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin_name} - {self.organization.name}" 
    
class Volunteer(models.Model):
    vol_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="volunteers")
    joined_at = models.DateTimeField(auto_now_add=True)

class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    available_seats = models.IntegerField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="events")
    approved = models.BooleanField(default=False)
    images = models.ImageField(upload_to="event_images/", blank=True, null=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=10)


class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    

class Donation(models.Model):
    donation_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

# Review Model
class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()