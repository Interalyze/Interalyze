from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .serializers import LoginSerializer
from django.contrib.auth import authenticate, login

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            request.session['user_id'] = user[0]
            request.session['user_name'] = user[1]
            user = authenticate(request, username=username, password=password)
            return Response({"message": "Login successful.", "email": user.email}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignUpView(APIView):
    def post(self, request):
        # Pass the incoming data to the serializer
        print('OO KENNY')
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Save the user to the database
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
