from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserSkills(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=100)
    skill_level = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    skill_type = models.CharField(max_length=50, choices=[
        ('technical', 'Technical'),
        ('soft', 'Soft'),
        ('language', 'Language'),
        ('other', 'Other')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class WorkExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='work_experience')
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_history')
    message = models.TextField()
    response = models.TextField()
    confidence = models.FloatField()
    intent = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class CareerInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_interests')
    industry = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    interest_level = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    created_at = models.DateTimeField(auto_now_add=True)

class UserAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    assessment_type = models.CharField(max_length=50, choices=[
        ('personality', 'Personality'),
        ('skills', 'Skills'),
        ('interests', 'Interests')
    ])
    results = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True) 