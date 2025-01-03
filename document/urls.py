from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path

router = DefaultRouter()

router.register(r'category', CategoryViewSet, basename='categories')
router.register(r'hospital', HospitalViewSet, basename='hospitals')

urlpatterns = router.urls

urlpatterns += [
    path('documents/create/', CreateDocumentAPIView.as_view(), name='create_document'),
    path('documents/verify/<int:document_id>/', VerifyDocumentIntegrityAPIView.as_view(), name='verify_document'),
]