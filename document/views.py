from django.shortcuts import render
from rest_framework import viewsets,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Category, Hospital, Document,Field
from .serializers import CategorySerializer, HospitalSerializer,FieldSerializer
from authentication.models import Patient, CustomUser

import hashlib
import base64
import json
from rest_framework.exceptions import NotFound


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer

    def get_queryset(self):
        try:
            category_id = self.kwargs['categories_pk']
            return Field.objects.filter(category_id=category_id)
        except Category.DoesNotExist:
            raise NotFound("The requested category does not exist.")

    def perform_create(self, serializer):
        try:
            category_id = self.kwargs['categories_pk']
            category = Category.objects.get(id=category_id)
            serializer.save(category=category)
        except Category.DoesNotExist:
            raise NotFound("Cannot add field: The specified category does not exist.")



class HospitalViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class CreateDocumentAPIView(APIView):
    """
    API to create a document with encrypted result.
    POST fields required: patient_id, category_id, doctor_id, result (JSON or string)
    """
    def post(self, request):
        patient_id = request.data.get("patient_id")
        category_id = request.data.get("category_id")
        doctor_id = request.data.get("doctor_id")
        result_data = request.data.get("result")  # Could be a dict if coming in as JSON

        if not (patient_id and category_id and doctor_id and result_data):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert JSON result to a string if it's a dict
            if isinstance(result_data, dict):
                result_data = json.dumps(result_data)

            # Fetch related models
            patient = Patient.objects.get(id=patient_id)
            category = Category.objects.get(id=category_id)
            doctor = CustomUser.objects.get(id=doctor_id)

            # Create and save the document (the save() method will do encryption)
            document = Document(
                patient=patient,
                category=category,
                doctor=doctor,
                result=result_data  # a plain string now (JSON-serialized if needed)
            )
            document.save()

            return Response(
                {
                    "message": "Document created successfully",
                    "document_id": document.id,
                    "hash": document.hash
                },
                status=status.HTTP_201_CREATED
            )
        except (Patient.DoesNotExist, Category.DoesNotExist, CustomUser.DoesNotExist) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyDocumentIntegrityAPIView(APIView):
    """
    Checks if the stored `hash` matches a fresh hash of the encrypted (base64) data.
    """
    def get(self, request, document_id):
        try:
            document = Document.objects.get(id=document_id)
            encrypted_bytes = base64.b64decode(document.result)
            computed_hash = hashlib.sha256(encrypted_bytes).hexdigest()

            if computed_hash == document.hash:
                return Response({"message": "Integrity verified: Hashes match."},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": "Hashes do not match: Data may be corrupted."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)