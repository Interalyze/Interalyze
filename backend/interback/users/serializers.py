from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import check_password

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password']

    def validate(self, data):

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        print("Saving user to the database...")
        validated_data.pop('confirm_password')  
        user = User.objects.create(**validated_data)
        print(f"User created: {user}")
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')


        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")


        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password.")

        data['user'] = user  
        return data