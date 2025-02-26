from .views import CategoryStatsView, CategoryViewSet, DocumentHistoryAPIView, HospitalStatsView,HospitalViewSet,FieldViewSet,DocumentAPIView,VerifyDocumentIntegrityAPIView,DocumentLastAPIView
from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_nested import routers

# Main router
router = DefaultRouter()

# Register the main routes
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'hospital', HospitalViewSet, basename='hospitals')

# Nested router for fields within categories
categories_router = routers.NestedDefaultRouter(router, r'category', lookup='category')
categories_router.register(r'fields', FieldViewSet, basename='category-fields')

# Combine all URLs
urlpatterns = router.urls + categories_router.urls

# Additional endpoints
urlpatterns += [
    path('documents/create/', DocumentAPIView.as_view(), name='create_document'),
    path('documents/<int:document_id>/', DocumentAPIView.as_view(), name='document-detail'),

    # path('documents/last/', DocumentLastAPIView.as_view(), name='document-last'),
    # path('documents/last/', get_last_document, name='get_last_document'),
    path('documents/history/', DocumentHistoryAPIView.as_view(), name='document-history'),


    path('documents/verify/<int:document_id>/', VerifyDocumentIntegrityAPIView.as_view(), name='verify_document'),

    path('hospitals/stats/', HospitalStatsView.as_view(), name='hospital_stats'),
    path('categories/stats/', CategoryStatsView.as_view(), name='category_stats'),
]
