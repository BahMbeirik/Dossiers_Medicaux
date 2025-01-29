from rest_framework import serializers

from document.models import Hospital
from .models import CustomUser
from django.core.validators import validate_email
from .models import Patient
import re

import re
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import CustomUser
from django.core.validators import validate_email

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'confirm_password')
        extra_kwargs = {
            'email': {'validators': [validate_email]},
        }

    def validate(self, data):
        errors = {}

        # Ensure passwords match
        if data['password'] != data['confirm_password']:
            errors["confirm_password"] = "Passwords must match."
        
        password = data['password']
        if len(password) < 12:
            errors["password"] = "Password must be at least 12 characters long."
        if not re.search(r'[A-Z]', password):
            errors["password"] = "Password must contain at least one uppercase letter."
        if not re.search(r'[a-z]', password):
            errors["password"] = "Password must contain at least one lowercase letter."
        if not re.search(r'\d', password):
            errors["password"] = "Password must contain at least one number."
        if not re.search(r'[\W_]', password):
            errors["password"] = "Password must contain at least one special character."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def update(self, instance, validated_data):

        validated_data.pop('confirm_password')  # Remove confirm_password field
        
        instance.username = validated_data.get('username', instance.username)
        instance.set_password(validated_data.get('password'))
        instance.is_active = True  # Activate the user
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class CreateDoctorSerializer(serializers.Serializer):
    email = serializers.EmailField()
    hospital = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all())



class PatientSerializer(serializers.ModelSerializer):
    sex = serializers.ChoiceField(choices=Patient.SEX_CHOICES)
    class Meta:
        model = Patient
        fields = '__all__'
        