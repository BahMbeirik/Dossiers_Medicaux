# backend/authentication/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.contrib.auth import authenticate

from .models import Patient
from .serializers import PatientSerializer
from rest_framework import viewsets, permissions
from rest_framework import filters
from .serializers import CreateDoctorSerializer
from django_filters.rest_framework import DjangoFilterBackend 
from rest_framework.permissions import IsAuthenticated
import secrets
from .serializers import (
    UserRegistrationSerializer, 
    LoginSerializer, 
    OTPVerificationSerializer
)
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(email=email, password=password)
            
            if user:
                # Generate OTP and send email
                otp = user.generate_otp()
                
                send_mail(
                    'Your OTP Code',
                    f'Your OTP is: {otp}',
                    'bahahembeirik@gmail.com',
                    [email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': 'OTP sent to your email',
                    'email': email
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AllPatientsViewSet(viewsets.ViewSet):
    """
    Example: returns all patients without pagination
    """
    def list(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
class OTPVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = CustomUser.objects.get(email=email)
                
                if user.verify_otp(otp):
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user_id': user.id,
                        'role': user.role,
                        'message': 'Login successful'
                    }, status=status.HTTP_200_OK)
                
                return Response({
                    'error': 'Invalid or expired OTP'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            except CustomUser.DoesNotExist:
                return Response({
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'Admin':
            return Response({'error': 'Only Admin can create doctors'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CreateDoctorSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            hospital = serializer.validated_data['hospital']
            
            # Generate a temporary password
            temp_password = secrets.token_urlsafe(8)
            
            # Create the doctor user
            doctor = CustomUser.objects.create_user(
                email=email,
                password=temp_password,
                role='Doctor',
                hospital=hospital
            )
            
            # Generate OTP for registration link
            otp = doctor.generate_otp()
            
            # Send email with registration link
            registration_link = f"http://localhost:8000/api/auth/register?email={email}&token={otp}"
            send_mail(
                'Complete Your Registration',
                f'Please complete your registration by clicking on the following link: {registration_link}',
                'bahahembeirik@gmail.com',
                [email],
                fail_silently=False,
            )
            
            return Response({'message': 'Doctor created successfully. Registration link sent to email.'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['sex'] 
    search_fields = ['numero_identite','nom', 'prenom'] 


