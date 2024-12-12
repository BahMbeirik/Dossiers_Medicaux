from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from djongo import models
from django.utils import timezone
import secrets

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    otp_secret = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def generate_otp(self):
        self.otp_secret = str(secrets.randbelow(999999)).zfill(6)
        self.otp_created_at = timezone.now()
        self.save()
        return self.otp_secret

    def verify_otp(self, otp):
        if not self.otp_secret:
            return False
        
        time_diff = timezone.now() - self.otp_created_at
        if time_diff.total_seconds() > 300:  # 5 minutes expiration
            return False
        
        return self.otp_secret == otp