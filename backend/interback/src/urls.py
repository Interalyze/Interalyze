"""
URL configuration for interback project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from ai_processing.nlp.views import analyze_bert_personality, analyze_personality, analyze_skills, analyze_soft_skills

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path("api/analyze-bert-personality/", analyze_bert_personality, name="analyze_bert_personality"),
    path("api/analyze-personality/", analyze_personality, name="analyze_personality"),
    path("api/soft-skills-analysis/", analyze_soft_skills, name="analyze_soft-skills"),
    path("api/skills-analysis/", analyze_skills, name="analyze_skills"),
]

