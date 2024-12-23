from django.urls import path
from .views import StreamGoogleDriveVideoByName, UploadGoogleDriveVideo

urlpatterns = [
    path('upload_video/', UploadGoogleDriveVideo.as_view(), name='upload_google_drive_video'),
    path('<str:video_name>/', StreamGoogleDriveVideoByName.as_view(), name='stream_google_drive_video_by_name'),
]
