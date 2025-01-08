from .models import Category, Hospital, Document,Field
from rest_framework import serializers

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'field_type', 'required', 'category']
        extra_kwargs = {
            'category': {'read_only': True},
        }


class CategorySerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True) 

    class Meta:
        model = Category
        fields = '__all__' 


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    decrypted_result = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'patient_id', 'category_id', 'doctor_id', 'decrypted_result', 'hash', 'created_at']

    def get_decrypted_result(self, obj):
        try:
            return obj.get_plaintext_result()
        except Exception as e:
            return f"Error decrypting result: {str(e)}"