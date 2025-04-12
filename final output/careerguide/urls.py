"""careerguide URL Configuration"""

from django.contrib import admin
from django.urls import path
from .views import index, login_view, signup_view, chatbot_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='home'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('chat/', chatbot_view, name='chatbot'),
]