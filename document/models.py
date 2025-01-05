from authentication.models import CustomUser, Patient
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import hashlib
import base64
import os
from djongo import models
from django.conf import settings


class Category(models.Model):
    id = models.BigAutoField(primary_key=True)      
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name


class Field(models.Model):
    id = models.BigAutoField(primary_key=True)  
    FIELD_TYPES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('date', 'Date'),
        ('textarea', 'Textarea'),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='fields',
    )
    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    required = models.BooleanField(default=False)

    class Meta:
        db_table = 'field'

    def __str__(self):
        return f"{self.name} ({self.field_type})"

class Hospital(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'hospital'

    def __str__(self):
        return self.name

class Document(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    result = models.TextField()        # Base64-encoded ciphertext
    hash = models.CharField(max_length=64)  # SHA-256 of raw ciphertext
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "document"

    @staticmethod
    def encrypt_data(plaintext: str, key: bytes) -> bytes:
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()

        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext.encode()) + padder.finalize()

        ciphertext = encryptor.update(padded_data) + encryptor.finalize()
        return iv + ciphertext

    @staticmethod
    def decrypt_data(encrypted_bytes: bytes, key: bytes) -> str:
        iv = encrypted_bytes[:16]
        ciphertext = encrypted_bytes[16:]
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()

        padded_data = decryptor.update(ciphertext) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        plaintext = unpadder.update(padded_data) + unpadder.finalize()
        return plaintext.decode()

    def save(self, *args, **kwargs):
        encryption_key = settings.RAW_AES_KEY
        if not encryption_key:
            raise ValueError("AES_KEY not found in settings (RAW_AES_KEY).")

        # Encrypt plaintext (self.result)
        encrypted_bytes = self.encrypt_data(self.result, encryption_key)
        # Base64-encode the ciphertext
        self.result = base64.b64encode(encrypted_bytes).decode('utf-8')
        # Compute SHA-256 of the raw encrypted bytes
        self.hash = hashlib.sha256(encrypted_bytes).hexdigest()

        super().save(*args, **kwargs)

    def get_plaintext_result(self) -> str:
        encryption_key = settings.RAW_AES_KEY
        if not encryption_key:
            raise ValueError("AES_KEY not found in settings (RAW_AES_KEY).")

        encrypted_bytes = base64.b64decode(self.result)
        return self.decrypt_data(encrypted_bytes, encryption_key)