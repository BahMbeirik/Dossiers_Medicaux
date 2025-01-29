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
from .serializers import CreateDoctorSerializer
import time
from django.conf import settings
from django.shortcuts import get_object_or_404

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        print(f"🔍 Received registration request for email: {email}")  # Debugging

        # Restrict registration to pre-created users
        user = get_object_or_404(CustomUser, email=email)

        if user.is_active:
            return Response({'error': 'This user is already registered.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegistrationSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            print(f"❌ Validation errors: {serializer.errors}")  # Debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({'message': 'User registered successfully. Please login.'}, status=status.HTTP_201_CREATED)



FAILED_LOGIN_ATTEMPTS = {}
LOGIN_LOCKOUT_TIMES = [60, 180, 300]  # 1 min, 3 min, 5 min
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            if email in FAILED_LOGIN_ATTEMPTS and FAILED_LOGIN_ATTEMPTS[email]['locked_until'] > time.time():
                time_left = FAILED_LOGIN_ATTEMPTS[email]['locked_until'] - time.time()
                return Response({"error": "Too many failed attempts. Try again later.", "lockout_time": int(time_left)}, status=status.HTTP_403_FORBIDDEN)            
            user = authenticate(email=email, password=password)
            
            if user:
                FAILED_LOGIN_ATTEMPTS.pop(email, None)
                otp = user.generate_otp()
                send_mail(
                    'Your OTP Code',
                    f'Your OTP is: {otp}',
                    'bahahembeirik@gmail.com',
                    [email],
                    fail_silently=False,
                )
                return Response({'message': 'OTP sent to your email', 'email': email}, status=status.HTTP_200_OK)
            
            attempts = FAILED_LOGIN_ATTEMPTS.get(email, {'count': 0, 'locked_until': 0})
            attempts['count'] += 1
            if attempts['count'] >= 3:
                lock_time = LOGIN_LOCKOUT_TIMES[min(attempts['count'] - 3, len(LOGIN_LOCKOUT_TIMES) - 1)]
                attempts['locked_until'] = time.time() + lock_time
            FAILED_LOGIN_ATTEMPTS[email] = attempts
            
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
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
            
            # Check if email already exists
            if CustomUser.objects.filter(email=email).exists():
                return Response({'error': 'A doctor with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate OTP for registration
            doctor = CustomUser.objects.create(
                email=email,
                role='Doctor',
                hospital=hospital,
                is_active=False  # Make doctor inactive until registration is complete
            )

            otp = doctor.generate_otp()

            # Get the first allowed frontend URL from CORS settings
            FRONTEND_URL = settings.CORS_ALLOWED_ORIGINS[0]
            registration_link = f"{FRONTEND_URL}/register?email={email}"            
            # Send email with registration link
            send_mail(
                'Complete Your Registration',
                f'Please complete your registration by visiting: {registration_link}. Use this OTP to verify: {otp}',
                'bahahembeirik@gmail.com',
                [email],
                fail_silently=False,
            )
            
            return Response({
                'message': 'Doctor created successfully. Registration link sent to email.',
                'registration_link': registration_link  # Include this in response for frontend redirection
            }, status=status.HTTP_201_CREATED)  
              
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['sex'] 
    search_fields = ['numero_identite','nom', 'prenom'] 


