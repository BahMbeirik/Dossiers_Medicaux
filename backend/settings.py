"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
from datetime import timedelta
import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7=2hj#e3yho)#=32e-4dk+831e+f@pp20k)=8mxfl!!)460$p!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'Access-Control-Allow-Origin',
]
load_dotenv(dotenv_path=BASE_DIR / '.env')
# Application definition

####### for AES-KEY #######
load_dotenv(BASE_DIR / ".env")

# Get AES_KEY from the .env file
AES_KEY_HEX = os.getenv("AES_KEY")
if not AES_KEY_HEX:
    raise ValueError("Missing AES_KEY in .env file.")

# Convert hex to raw bytes
RAW_AES_KEY = bytes.fromhex(AES_KEY_HEX)
if len(RAW_AES_KEY) != 32:
    raise ValueError("AES_KEY must decode to 32 bytes for AES-256 encryption.")
# END AES-KEY

######## Load Blockchain Configurations #######
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:7545")  # Default to Ganache if missing


# Validate variables
if not CONTRACT_ADDRESS:
    raise ValueError("Missing CONTRACT_ADDRESS in .env file.")

if not PRIVATE_KEY:
    raise ValueError("Missing PRIVATE_KEY in .env file.")

print(f"🔵 Loaded CONTRACT_ADDRESS: {CONTRACT_ADDRESS}")
print(f"🔵 Loaded PRIVATE_KEY: {PRIVATE_KEY}")
print(f"🔵 Loaded RPC_URL: {RPC_URL}")
######## End Loading Blockchain Configurations #######


INSTALLED_APPS = [
    'authentication',
    'document',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',   
    'django_filters',  

]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '30/min',
        'anon' : '10/min',
        'get_scope': '20/min',
        'post_scope': '10/min',
    }
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 1, 
    # 'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend', 'rest_framework.filters.SearchFilter'],

}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',

]


# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'bahahembeirik@gmail.com'
EMAIL_HOST_PASSWORD = 'sjgm gyuq gnrl onlp'

# Authentication Settings
AUTH_USER_MODEL = 'authentication.CustomUser'

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'https://lwww.winserver-2019.fst.rsc',
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5176', 
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# MongoDB Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'DBDossiersMedicaux', 
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        },
        # 'CLIENT': {
        #     'host': 'mongodb+srv://mbabah3450:cwceYKBwsgCJyVgj@cluster0.qus3k.mongodb.net/DBDossiersMedicaux?retryWrites=true&w=majority',
        # },
        'USER': '',
        'PASSWORD': '',
        'AUTH_SOURCE': 'admin',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



