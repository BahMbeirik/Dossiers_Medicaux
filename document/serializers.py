from .models import Category, Hospital, Document,Field
from rest_framework import serializers
import json
from collections import OrderedDict
from authentication.models import CustomUser

# serializers.py

import json
from collections import OrderedDict
from rest_framework import serializers
from .models import Field

class FieldSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Field
        fields = ['id', 'name', 'field_type', 'required', 'category', 'options', 'file_types']
        read_only_fields = ['id']

    def validate(self, data):
        data['options'] = data.get('options', [])
        data['file_types'] = data.get('file_types', [])
        return super().validate(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Handle options field safely
        if isinstance(instance.options, str):
            try:
                # Parse string to a Python object
                options = json.loads(instance.options)
                if isinstance(options, list):
                    # Convert OrderedDict to regular dict
                    data['options'] = [dict(option) if isinstance(option, OrderedDict) else option for option in options]
            except json.JSONDecodeError:
                data['options'] = []  # Fallback to an empty list
        elif isinstance(instance.options, list):
            # Convert OrderedDict to regular dict if necessary
            data['options'] = [dict(option) if isinstance(option, OrderedDict) else option for option in instance.options]

        return data



# class FieldSerializer(serializers.ModelSerializer):
#     category = serializers.PrimaryKeyRelatedField(read_only=True)

#     class Meta:
#         model = Field
#         fields = ['id', 'name', 'field_type', 'required', 'category', 'options', 'file_types']
#         read_only_fields = ['id']

#     def validate(self, data):
#         data['options'] = data.get('options', [])
#         data['file_types'] = data.get('file_types', [])
#         return super().validate(data)

#     def to_representation(self, instance):
#         data = super().to_representation(instance)

#         # Handle options field
#         if isinstance(instance.options, str):
#             try:
#                 # Parse string to a Python object
#                 options = eval(instance.options)
#                 if isinstance(options, list):
#                     # Convert OrderedDict to regular dict
#                     data['options'] = [dict(option) if isinstance(option, OrderedDict) else option for option in options]
#             except Exception:
#                 data['options'] = []  # Fallback to an empty list
#         elif isinstance(instance.options, list):
#             # Convert OrderedDict to regular dict if necessary
#             data['options'] = [dict(option) if isinstance(option, OrderedDict) else option for option in instance.options]

#         return data
        

class CategorySerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True) 

    class Meta:
        model = Category
        fields = '__all__' 


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'
        
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email','username', 'role', 'hospital']


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
        