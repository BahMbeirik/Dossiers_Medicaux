from django.db import models
from authentication.models import CustomUser, Patient
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import hashlib
import base64
import os


class Category(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name


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
    # Use TextField to store base64-encoded ciphertext
    result = models.TextField()
    # Store the SHA-256 hash of the (raw) encrypted bytes
    hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'document'

    @staticmethod
    def encrypt_data(plaintext: str, key: bytes) -> bytes:
        """
        Encrypts data using AES-256 (CBC mode) and returns IV + ciphertext as bytes.
        """
        backend = default_backend()
        iv = os.urandom(16)  # random IV
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=backend)
        encryptor = cipher.encryptor()

        # Pad plaintext to match AES block size
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext.encode()) + padder.finalize()

        # Encrypt
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()

        # Prepend the IV so we can decrypt later
        return iv + ciphertext

    @staticmethod
    def decrypt_data(encrypted_bytes: bytes, key: bytes) -> str:
        """
        Decrypts IV + ciphertext using AES-256 (CBC mode).
        """
        backend = default_backend()
        iv = encrypted_bytes[:16]
        ciphertext = encrypted_bytes[16:]
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=backend)
        decryptor = cipher.decryptor()

        padded_data = decryptor.update(ciphertext) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        plaintext = unpadder.update(padded_data) + unpadder.finalize()
        return plaintext.decode()

    def save(self, *args, **kwargs):
        """
        Override save() to:
          - Encrypt the user-supplied plaintext (self.result)
          - Base64-encode the raw encrypted bytes
          - Compute hash of the raw encrypted bytes
        """
        encryption_key = os.environ.get("AES_KEY", None)
        if not encryption_key:
            raise ValueError("Missing AES_KEY in environment variables.")
        
        encryption_key = encryption_key.encode()  # e.g. must be 32 bytes for AES-256

        # Encrypt the plaintext that's currently in self.result
        encrypted_bytes = self.encrypt_data(self.result, encryption_key)

        # Base64-encode for storage in the `result` TextField
        self.result = base64.b64encode(encrypted_bytes).decode('utf-8')

        # Compute a hash of the encrypted bytes (not the base64 text)
        self.hash = hashlib.sha256(encrypted_bytes).hexdigest()

        super().save(*args, **kwargs)

    def get_plaintext_result(self) -> str:
        """
        Helper to decode & decrypt the stored `result`.
        """
        encryption_key = os.environ.get("AES_KEY", None)
        if not encryption_key:
            raise ValueError("Missing AES_KEY in environment variables.")
        
        encryption_key = encryption_key.encode()
        
        # Convert from base64 string back to the raw encrypted bytes
        encrypted_bytes = base64.b64decode(self.result)
        # Decrypt
        return self.decrypt_data(encrypted_bytes, encryption_key)
