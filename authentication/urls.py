from django.urls import path,include
from .views import   UserRegistrationView, LoginView, OTPVerificationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PatientViewSet,AllPatientsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'patients-all', AllPatientsViewSet, basename='all_patients')
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify_otp'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('', include(router.urls)), 
]

