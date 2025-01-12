from rest_framework import serializers

from document.models import Hospital
from .models import CustomUser
from django.core.validators import validate_email
from .models import Patient

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email','username', 'password', 'confirm_password')
        extra_kwargs = {
            'email': {'validators': [validate_email]}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        return user

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
        