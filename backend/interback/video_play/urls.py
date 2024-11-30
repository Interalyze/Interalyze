from django.urls import path
from . import views

urlpatterns = [
    path('video_play/<str:file_id>',views.stream_google_drive_video, name='stream_google_drive_video' )
]