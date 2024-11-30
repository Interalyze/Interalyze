from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2.service_account import Credentials
from django.http import StreamingHttpResponse
import io
# Build the path to the credentials.json file
CREDENTIALS_PATH = "../../credentials.json"

# Define Google Drive credentials and scope
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

@login_required
def stream_google_drive_video(request, file_id ): 
    # Authenticate with Google Drive API
    drive_service = build('drive', 'v3', credentials=credentials)
    credentials = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SCOPES)
    
    # Get file metadata
    request_metadata = drive_service.files().get(fileId=file_id, fields='name,mimeType').execute() #hardcoded for testing
    file_name = request_metadata.get('name')
    mime_type = request_metadata.get('mimeType')

    # Download the file
    request_file = drive_service.files().get_media(fileId=file_id)
    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request_file)

    done = False
    while not done:
        status, done = downloader.next_chunk()

    buffer.seek(0)

    # Stream the video as a response
    response = StreamingHttpResponse(buffer, content_type=mime_type)
    response['Content-Disposition'] = f'inline; filename="{file_name}"'
    return response

