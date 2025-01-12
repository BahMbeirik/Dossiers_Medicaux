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

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Doctor', 'Doctor'),
    )
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    otp_secret = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Doctor')
    hospital = models.ForeignKey(
        'document.Hospital', 
        to_field='id',  # تحديد الحقل المرجعي بوضوح
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='doctors',
        db_column='hospital_id'  # تحديد اسم العمود في قاعدة البيانات
    )

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
    

class Patient(models.Model):
    SEX_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    numero_identite = models.CharField(max_length=10, unique=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    date_naissance = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    numero_telephone = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"