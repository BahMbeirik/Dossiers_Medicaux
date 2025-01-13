import logging
from django.shortcuts import render
from rest_framework import viewsets,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Category, Hospital, Document,Field
from .serializers import CategorySerializer, DocumentSerializer, HospitalSerializer,FieldSerializer
from authentication.models import Patient, CustomUser

import hashlib
import base64
import json
from rest_framework.exceptions import NotFound
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category_pk = self.kwargs.get('category_pk')  # Corrected lookup
        if not Category.objects.filter(pk=category_pk).exists():
            raise NotFound(detail="The requested category does not exist.")
        return Field.objects.filter(category_id=category_pk)

    def perform_create(self, serializer):
        category_pk = self.kwargs.get('category_pk')
        try:
            category = Category.objects.get(pk=category_pk)
            data = serializer.validated_data
            if not data.get('options'):
                data['options'] = []
            if not data.get('file_types'):
                data['file_types'] = []
            serializer.save(category=category)
        except Category.DoesNotExist:
            raise NotFound(detail="Cannot add field: The specified category does not exist.")

class HospitalViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

logger = logging.getLogger(__name__)

class DocumentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]


    def post(self, request):
        patient_id = request.data.get("patient_id")
        category_id = request.data.get("category_id")
        doctor_id = request.data.get("doctor_id")
        result_data = request.data.get("result")  # Could be a dict if coming in as JSON

        if not (patient_id and category_id and doctor_id and result_data):
            logger.warning("Missing required fields")
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
            logger.error(f"Related object does not exist: {str(e)}")
            return Response({"error": f"Related object does not exist: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON format in result data: {str(e)}")
            return Response({"error": "Invalid JSON format in result data."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("An error occurred while creating the document")
            return Response(
                {"error": f"An error occurred: {str(e)}", "type": type(e).__name__},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    # get the decrypted document
    def get(self, request, document_id):
        """
        Retrieve a specific document with decrypted result.
        """
        try:
            document = Document.objects.get(id=document_id)

            # Optional: Add permission checks here
            # For example, ensure the requesting user is the doctor who created the document
            if document.doctor != request.user:
                return Response({"error": "You do not have permission to view this document."}, status=status.HTTP_403_FORBIDDEN)

            # Decrypt the result
            plaintext_result = document.get_plaintext_result()

            # Prepare the response data
            response_data = {
                "id": document.id,
                "patient_id": document.patient.id,
                "category_id": document.category.id,
                "doctor_id": document.doctor.id,
                "result": plaintext_result,  # Decrypted result
                "hash": document.hash,
                "created_at": document.created_at
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        


logger = logging.getLogger(__name__)

class DocumentLastAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Extract query parameters
        patient_id = request.query_params.get("patient_id")
        category_id = request.query_params.get("category_id")

        # Validate the parameters
        if not patient_id or not category_id:
            logger.warning("Missing 'patient_id' or 'category_id'")
            return Response(
                {"error": "Both 'patient_id' and 'category_id' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Ensure patient_id and category_id are integers
            patient_id = int(patient_id)
            category_id = int(category_id)
            logger.debug(f"Converted IDs: patient_id={patient_id}, category_id={category_id}")
        except ValueError:
            logger.error("Invalid 'patient_id' or 'category_id' format")
            return Response(
                {"error": "'patient_id' and 'category_id' must be integers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch all matching documents
            documents = Document.objects.filter(
                patient=patient_id,
                category=category_id
            )

            if not documents.exists():
                logger.info(f"No document found for patient_id={patient_id} and category_id={category_id}")
                return Response(
                    {"error": "No document found for the given patient and category."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Find the latest document in Python
            latest_document = max(documents, key=lambda doc: doc.created_at)

            # Permission check: Ensure the requesting user is the doctor who created the document
            if latest_document.doctor != request.user:
                logger.warning(f"User {request.user.id} does not have permission to view document {latest_document.id}")
                return Response(
                    {"error": "You do not have permission to view this document."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Decrypt the result
            try:
                decrypted_result = latest_document.get_plaintext_result()
            except Exception as decrypt_error:
                logger.error(f"Decryption failed for document {latest_document.id}: {decrypt_error}")
                return Response(
                    {"error": "Failed to decrypt document result."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Serialize the document using DocumentSerializer
            serializer = DocumentSerializer(latest_document)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("An unexpected error occurred in DocumentLastAPIView")
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
        
