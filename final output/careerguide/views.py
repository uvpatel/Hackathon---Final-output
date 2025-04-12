from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        # Add authentication logic here (e.g., check against Django auth)
        return JsonResponse({'status': 'success', 'message': 'Login successful (placeholder)'})
    return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        # Add user creation logic here (e.g., Django User model)
        return JsonResponse({'status': 'success', 'message': 'Signup successful (placeholder)'})
    return render(request, 'signup.html')

@csrf_exempt
def chatbot_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '').lower()

            if message and ('career' in message or 'job' in message):
                response = "Based on your interests, I suggest exploring roles like Software Developer or Data Analyst. Want to assess your skills?"
            elif message and ('skill' in message or 'assessment' in message):
                response = "Great! Use the skills form above, or tell me your skills for tailored suggestions."
            else:
                response = "I'm here to help with career advice! Ask about jobs, skills, or the assessment."

            return JsonResponse({'response': response})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

