import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from authentication.models import CustomUser

email = 'mhamed.bbh01@gmail.com'
password = 'Doctor@1234'

user = CustomUser.objects.get(email=email)
user.set_password(password)
user.is_active = True
user.save()
print(f"Updated — email: {email}  password: {password}  role: {user.role}")
