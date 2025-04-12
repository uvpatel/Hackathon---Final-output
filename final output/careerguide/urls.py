"""careerguide URL Configuration"""

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('chatbot/', views.chatbot_view, name='chatbot'),
    path('save-assessment/', views.save_assessment, name='save_assessment'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)