import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from authentication.models import CustomUser

users = [
    ('mbabah3450@gmail.com', 'Admin@1234'),
    ('mhamed.bbh01@gmail.com', 'Doctor@1234'),
]

for email, password in users:
    try:
        user = CustomUser.objects.get(email=email)
        user.set_password(password)
        user.is_active = True
        user.save()
        print(f"Updated — email: {email}  password: {password}  role: {user.role}")
    except CustomUser.DoesNotExist:
        print(f"NOT FOUND — {email}")
