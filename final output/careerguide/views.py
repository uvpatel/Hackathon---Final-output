from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.db import transaction
import json
from .chatbot_model import chatbot_model
from .models import User, UserSkills, Education, WorkExperience, ChatHistory, CareerInterest, UserAssessment, Assessment
from .forms import UserSignUpForm, UserLoginForm

def index(request):
    return render(request, 'index.html')

def home_view(request):
    return render(request, 'careerguide/home.html')

def signup_view(request):
    if request.method == 'POST':
        form = UserSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('profile')
    else:
        form = UserSignUpForm()
    return render(request, 'careerguide/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = authenticate(email=email, password=password)
            if user:
                login(request, user)
                return redirect('profile')
    else:
        form = UserLoginForm()
    return render(request, 'careerguide/login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    return redirect('home')

@login_required
def profile_view(request):
    assessments = Assessment.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'careerguide/profile.html', {'assessments': assessments})

@login_required
@csrf_exempt
def chatbot_view(request):
    return render(request, 'careerguide/chatbot.html')

@login_required
def save_assessment(request):
    if request.method == 'POST':
        try:
            Assessment.objects.create(
                user=request.user,
                answers=request.POST.get('answers'),
                career_path=request.POST.get('career_path'),
                recommendations=request.POST.get('recommendations')
            )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

