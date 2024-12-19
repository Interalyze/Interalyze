from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import StreamingHttpResponse
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaIoBaseUpload
from google.oauth2.service_account import Credentials
from rest_framework.permissions import AllowAny

import io

CREDENTIALS_PATH = "../../credentials.json"
READ_SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
UPLOAD_SCOPES = ['https://www.googleapis.com/auth/drive.file']

#class StreamGoogleDriveVideoByName(APIView):
#    #permission_classes = [IsAuthenticated]
#    permission_classes = [AllowAny]
#
#    def get(self, request, video_name):
#        try:
#            print("View Triggered: Video Name =", video_name)
#            credentials = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=READ_SCOPES)
#            drive_service = build('drive', 'v3', credentials=credentials)
#
#            # Search for the file by name
#            results = drive_service.files().list(
#                q=f"name='{video_name}' and mimeType contains 'video/'",
#                fields='files(id, name, mimeType)',
#                pageSize=1,
#                supportsAllDrives=True,
#                includeItemsFromAllDrives=True,
#            ).execute()
#                        
#            print("Searching for:", video_name)
#            print("API Response:", results)
#
#            files = results.get('files', [])
#            if not files:
#                return Response({"error": "Video not found."}, status=status.HTTP_404_NOT_FOUND)
#
#            file_info = files[0]
#            file_id = file_info.get('id')
#            mime_type = file_info.get('mimeType', 'application/octet-stream')
#            file_name = file_info.get('name', video_name)
#
#            # Download the file into a memory buffer
#            request_file = drive_service.files().get_media(fileId=file_id)
#            buffer = io.BytesIO()
#            downloader = MediaIoBaseDownload(buffer, request_file)
#
#            done = False
#            while not done:
#                status_, done = downloader.next_chunk()
#
#            buffer.seek(0)
#
#            # Stream the video as a response
#            response = StreamingHttpResponse(buffer, content_type=mime_type)
#            response['Content-Disposition'] = f'inline; filename="{file_name}"'
#
#            return response
#
#        except Exception as e:
#            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StreamGoogleDriveVideoByName(APIView):
    # Ensure this view is already implemented
    def get(self, request, video_name):
        try:
            credentials = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=READ_SCOPES)
            drive_service = build('drive', 'v3', credentials=credentials)

            # Search for the file by name
            results = drive_service.files().list(
                q=f"name='{video_name}' and mimeType contains 'video/' and trashed = false",
                fields='files(id, name, mimeType)',
                pageSize=1
            ).execute()

            files = results.get('files', [])
            if not files:
                return Response({"error": "Video not found."}, status=status.HTTP_404_NOT_FOUND)

            file_info = files[0]
            file_id = file_info.get('id')
            mime_type = file_info.get('mimeType', 'video/x-msvideo')  # Explicit MIME type for .avi files
            file_name = file_info.get('name', video_name)

            # Download the file into a memory buffer
            request_file = drive_service.files().get_media(fileId=file_id)
            buffer = io.BytesIO()
            downloader = MediaIoBaseDownload(buffer, request_file)

            done = False
            while not done:
                status_, done = downloader.next_chunk()

            buffer.seek(0)

            # Prepare StreamingHttpResponse with proper headers
            response = StreamingHttpResponse(buffer, content_type=mime_type)
            response['Content-Disposition'] = f'inline; filename="{file_name}"'
            response['Content-Length'] = buffer.getbuffer().nbytes  # Explicit content length

            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UploadGoogleDriveVideo(APIView):
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    
    def post(self, request):
        if 'video' not in request.FILES:
            return Response({"error": "No video file provided."}, status=status.HTTP_400_BAD_REQUEST)

        video_file = request.FILES['video']
        video_name = request.data.get('video_name', 'untitled_video')

        credentials = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=UPLOAD_SCOPES)
        drive_service = build('drive', 'v3', credentials=credentials)

        file_metadata = {
            'name': video_name,
            'mimeType': video_file.content_type or 'application/octet-stream'
        }

        media_body = MediaIoBaseUpload(video_file, mimetype=video_file.content_type, resumable=True)

        try:
            uploaded_file = drive_service.files().create(
                body=file_metadata,
                media_body=media_body,
                fields='id, name'
            ).execute()

            return Response({
                "message": "Video uploaded successfully.",
                "file_id": uploaded_file.get('id'),
                "file_name": uploaded_file.get('name')
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
