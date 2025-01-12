from django.shortcuts import render
from rest_framework import viewsets,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from .models import Category, Hospital, Document,Field
from .serializers import CategorySerializer, DocumentSerializer, HospitalSerializer,FieldSerializer,DoctorSerializer
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

    @action(detail=True, methods=['get'])
    def doctors(self, request, pk=None):
        hospital = self.get_object()
        doctors = CustomUser.objects.filter(hospital=hospital, role='Doctor')
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

class DocumentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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
        

class DocumentLastAPIView(APIView):
    """
    API to retrieve the last document for a specific patient and category.
    GET parameters: patient_id, category_id
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        patient_id = request.query_params.get("patient_id")
        category_id = request.query_params.get("category_id")

        if not (patient_id and category_id):
            return Response({"error": "Missing required query parameters: patient_id and category_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.filter(
                patient_id=patient_id,
                category_id=category_id
            ).order_by('-created_at').first()

            if not document:
                return Response({"error": "No document found for the specified patient and category."}, status=status.HTTP_404_NOT_FOUND)

            # Optional: Ensure the requesting user has permission to view the document
            if document.doctor != request.user:
                return Response({"error": "You do not have permission to view this document."}, status=status.HTTP_403_FORBIDDEN)

            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


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