from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Hospital, Document
from .serializers import CategorySerializer, HospitalSerializer
from authentication.models import Patient, CustomUser

import hashlib
import base64


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer


class CreateDocumentAPIView(APIView):
    """
    API to create a document with encrypted result.
    POST fields required: patient_id, category_id, doctor_id, result (plaintext)
    """
    def post(self, request):
        patient_id = request.data.get("patient_id")
        category_id = request.data.get("category_id")
        doctor_id = request.data.get("doctor_id")
        result = request.data.get("result")  # Plaintext from request

        if not (patient_id and category_id and doctor_id and result):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch related models
            patient = Patient.objects.get(id=patient_id)
            category = Category.objects.get(id=category_id)
            doctor = CustomUser.objects.get(id=doctor_id)

            # Create and save the document (the save() method will do encryption)
            document = Document(
                patient=patient,
                category=category,
                doctor=doctor,
                result=result  # plaintext
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
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyDocumentIntegrityAPIView(APIView):
    """
    API to verify the integrity of a Document by comparing the stored `hash`
    with a fresh hash of the raw (encrypted) data (stored in `result` as base64).
    """
    def get(self, request, document_id):
        try:
            document = Document.objects.get(id=document_id)

            # Convert from base64 back to raw encrypted bytes
            encrypted_bytes = base64.b64decode(document.result)

            # Recompute hash of encrypted bytes
            computed_hash = hashlib.sha256(encrypted_bytes).hexdigest()
            
            if computed_hash == document.hash:
                return Response({"message": "Integrity verified: Hashes match."},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": "Hashes do not match: Data may be corrupted."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
