import logging
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
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from .services.eth_service import BlockchainService

class CategoryViewSet(viewsets.ModelViewSet):
    throttle_scope = 'custom_user'
    permission_classes = [permissions.IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FieldViewSet(viewsets.ModelViewSet):
    throttle_scope = 'custom_user'
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
    throttle_scope = 'custom_user'
    permission_classes = [permissions.IsAuthenticated]
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

    @action(detail=True, methods=['get'])
    def doctors(self, request, pk=None):
        hospital = self.get_object()
        doctors = CustomUser.objects.filter(hospital=hospital, role='Doctor')
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

logger = logging.getLogger(__name__)

class DocumentAPIView(APIView):
    throttle_scope = 'custom_user'
    permission_classes = [permissions.IsAuthenticated]
    blockchain_service = BlockchainService()  # Initialize blockchain connection

    # def post(self, request):
    #     print("🔵 Incoming request data:", request.data)  # 🔥 Debugging step
        
    #     patient_id = request.data.get("patient_id")
    #     category_id = request.data.get("category_id")
    #     doctor_id = request.data.get("doctor_id")
    #     result_data = request.data.get("result")

    #     if not (patient_id and category_id and doctor_id and result_data):
    #         logger.warning("⚠️ Missing required fields")
    #         return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         # 🔵 Debugging: Print individual values
    #         print(f"✅ Patient ID: {patient_id}")
    #         print(f"✅ Category ID: {category_id}")
    #         print(f"✅ Doctor ID: {doctor_id}")
    #         print(f"✅ Result Data: {result_data}")

    #         # Ensure result_data is a valid JSON string
    #         if isinstance(result_data, dict):
    #             result_data = json.dumps(result_data)

    #         # Fetch related models
    #         patient = Patient.objects.get(id=patient_id)
    #         category = Category.objects.get(id=category_id)
    #         doctor = CustomUser.objects.get(id=doctor_id)

    #         # Create and save the document
    #         document = Document(
    #             patient=patient,
    #             category=category,
    #             doctor=doctor,
    #             result=result_data
    #         )
    #         document.save()

    #         print(f"✅ Document saved successfully: {document.id}")

    #         # Hash encrypted result
    #         encrypted_bytes = base64.b64decode(document.result)
    #         document_hash = hashlib.sha256(encrypted_bytes).hexdigest()
    #         print(f"🔹 Computed Document Hash: {document_hash}")

    #         try:
    #             tx_hash = self.blockchain_service.store_document(document.id, document_hash)
    #             logger.info(f"✅ Document hash stored on blockchain. Tx Hash: {tx_hash}")

    #             return Response(
    #                 {
    #                     "message": "Document created successfully and hash stored on blockchain",
    #                     "document_id": document.id,
    #                     "hash": document_hash,
    #                     "tx_hash": tx_hash
    #                 },
    #                 status=status.HTTP_201_CREATED
    #             )

    #         except Exception as e:
    #             logger.error(f"❌ Blockchain Error: {str(e)}")
    #             return Response(
    #                 {"error": f"Document saved locally but failed to store on blockchain: {str(e)}"},
    #                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #             )

    #     except (Patient.DoesNotExist, Category.DoesNotExist, CustomUser.DoesNotExist) as e:
    #         logger.error(f"❌ Related object does not exist: {str(e)}")
    #         return Response({"error": f"Related object does not exist: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)
    #     except json.JSONDecodeError as e:
    #         logger.error(f"❌ Invalid JSON format in result data: {str(e)}")
    #         return Response({"error": "Invalid JSON format in result data."}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         logger.exception("❌ Unexpected error while creating the document")
    #         return Response(
    #             {"error": f"An unexpected error occurred: {str(e)}", "type": type(e).__name__},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )

    def post(self, request):
        logger.debug(f"🔵 Incoming request data: {request.data}")  # Debugging step

        patient_id = request.data.get("patient_id")
        category_id = request.data.get("category_id")
        doctor_id = request.data.get("doctor_id")
        result_data = request.data.get("result")

        if not (patient_id and category_id and doctor_id and result_data):
            logger.warning("⚠️ Missing required fields")
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Debugging: Log individual values
            logger.debug(f"✅ Patient ID: {patient_id}")
            logger.debug(f"✅ Category ID: {category_id}")
            logger.debug(f"✅ Doctor ID: {doctor_id}")
            logger.debug(f"✅ Result Data: {result_data}")

            # Ensure result_data is a valid JSON string
            if isinstance(result_data, dict):
                result_data = json.dumps(result_data)

            # Fetch related models
            patient = Patient.objects.get(id=patient_id)
            category = Category.objects.get(id=category_id)
            doctor = CustomUser.objects.get(id=doctor_id)

            # Create and save the document
            document = Document(
                patient=patient,
                category=category,
                doctor=doctor,
                result=result_data
            )
            document.save()

            logger.info(f"✅ Document saved successfully: {document.id}")

            # Hash encrypted result
            encrypted_bytes = base64.b64decode(document.result)
            document_hash = hashlib.sha256(encrypted_bytes).hexdigest()
            logger.debug(f"🔹 Computed Document Hash: {document_hash}")

            try:
                tx_hash = self.blockchain_service.store_document(document.id, document_hash)
                logger.info(f"✅ Document hash stored on blockchain. Tx Hash: {tx_hash}")

                return Response(
                    {
                        "message": "Document created successfully and hash stored on blockchain",
                        "document_id": document.id,
                        "hash": document_hash,
                        "tx_hash": tx_hash
                    },
                    status=status.HTTP_201_CREATED
                )

            except ValueError as ve:
                # Handle specific blockchain errors like insufficient funds
                logger.error(f"❌ Blockchain Error: {str(ve)}")
                return Response(
                    {"error": f"Document saved locally but failed to store on blockchain: {str(ve)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as e:
                # Handle other blockchain-related errors
                logger.error(f"❌ Blockchain Error: {str(e)}")
                return Response(
                    {"error": f"Document saved locally but failed to store on blockchain: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except (Patient.DoesNotExist, Category.DoesNotExist, CustomUser.DoesNotExist) as e:
            logger.error(f"❌ Related object does not exist: {str(e)}")
            return Response({"error": f"Related object does not exist: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)
        except json.JSONDecodeError as e:
            logger.error(f"❌ Invalid JSON format in result data: {str(e)}")
            return Response({"error": "Invalid JSON format in result data."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("❌ Unexpected error while creating the document")
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}", "type": type(e).__name__},
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
            # if document.doctor != request.user:
            #     return Response({"error": "You do not have permission to view this document."}, status=status.HTTP_403_FORBIDDEN)

            # Decrypt the result
            plaintext_result = document.get_plaintext_result()

            # Verify integrity against blockchain
            try:
                is_valid = self.blockchain_service.verify_document(document.id, document.hash)
            except Exception as e:
                logger.error(f"Blockchain verification failed: {str(e)}")
                is_valid = False


            # Prepare the response data
            response_data = {
                "id": document.id,
                "patient_id": document.patient.id,
                "category_id": document.category.id,
                "doctor_id": document.doctor.id,
                "result": plaintext_result,  # Decrypted result
                "hash": document.hash,
                "is_valid": is_valid,  # Blockchain verification result
                "created_at": document.created_at
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        


logger = logging.getLogger(__name__)
import traceback

class DocumentHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        patient_id = request.query_params.get("patient_id")
        category_id = request.query_params.get("category_id")

        if not patient_id or not category_id:
            return Response(
                {"error": "Both 'patient_id' and 'category_id' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            patient_id = int(patient_id)
            category_id = int(category_id)
        except ValueError:
            return Response(
                {"error": "'patient_id' and 'category_id' must be integers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch all documents for the patient and category
            documents = Document.objects.filter(
                patient=patient_id,
                category=category_id
            ).order_by('-created_at')

            if not documents.exists():
                return Response(
                    {"error": "No document found for the given patient and category."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Remove doctor restriction: Allow all doctors to see the data
            if request.user.role != "Doctor" and request.user.role != "Admin":
                return Response(
                    {"error": "Only doctors and admins can access patient documents."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Initialize Blockchain Service
            blockchain_service = BlockchainService()

            # Decrypt and verify all documents
            document_list = []
            for doc in documents:
                try:
                    decrypted_result = doc.get_plaintext_result()
                except Exception as decrypt_error:
                    decrypted_result = f"Failed to decrypt: {str(decrypt_error)}"

                # Verify document hash on blockchain
                is_valid = False
                try:
                    is_valid = blockchain_service.verify_document(doc.id, doc.hash)

                except Exception as e:
                    is_valid = False  # Assume invalid if verification fails

                document_list.append({
                    "id": doc.id,
                    "patient_id": doc.patient.id,
                    "category_id": doc.category.id,
                    "doctor_id": doc.doctor.id if doc.doctor else None,
                    "decrypted_result": decrypted_result,
                    "hash": doc.hash,
                    "is_valid": is_valid,  # Add verification result
                    "created_at": doc.created_at
                })

            return Response(document_list, status=status.HTTP_200_OK)

        # except Exception as e:
        #     return Response(
        #         {"error": f"An unexpected error occurred: {str(e)}"},
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR
        #     )
        except Exception as e:
            error_details = traceback.format_exc()

            print("❌ ERROR IN DOCUMENT HISTORY VIEW ❌")
            print(error_details)  # Print full error traceback in Django logs

            return Response(
                {
                    "error": "An unexpected error occurred",
                    "details": str(e),
                    "traceback": error_details.split("\n")[-3:]  # Show last 3 lines of error for debugging
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# OLD VERSION
# class DocumentHistoryAPIView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         patient_id = request.query_params.get("patient_id")
#         category_id = request.query_params.get("category_id")

#         if not patient_id or not category_id:
#             return Response(
#                 {"error": "Both 'patient_id' and 'category_id' are required."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             patient_id = int(patient_id)
#             category_id = int(category_id)
#         except ValueError:
#             return Response(
#                 {"error": "'patient_id' and 'category_id' must be integers."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Fetch all documents for the patient and category
#             documents = Document.objects.filter(
#                 patient=patient_id,
#                 category=category_id
#             ).order_by('-created_at')

#             if not documents.exists():
#                 return Response(
#                     {"error": "No document found for the given patient and category."},
#                     status=status.HTTP_404_NOT_FOUND
#                 )

#             # Remove doctor restriction: Allow all doctors to see the data
#             if request.user.role != "Doctor" and request.user.role != "Admin":
#                 return Response(
#                     {"error": "Only doctors and admins can access patient documents."},
#                     status=status.HTTP_403_FORBIDDEN
#                 )

#             # Decrypt all documents
#             document_list = []
#             for doc in documents:
#                 try:
#                     decrypted_result = doc.get_plaintext_result()
#                 except Exception as decrypt_error:
#                     decrypted_result = f"Failed to decrypt: {str(decrypt_error)}"

#                 document_list.append({
#                     "id": doc.id,
#                     "patient_id": doc.patient.id,
#                     "category_id": doc.category.id,
#                     "doctor_id": doc.doctor.id if doc.doctor else None,
#                     "decrypted_result": decrypted_result,
#                     "hash": doc.hash,
#                     "created_at": doc.created_at
#                 })

#             return Response(document_list, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response(
#                 {"error": f"An unexpected error occurred: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


# WE DON'T USE THIS RIGHT NOW
class DocumentLastAPIView(APIView):
    throttle_scope = 'custom_user'
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
        
