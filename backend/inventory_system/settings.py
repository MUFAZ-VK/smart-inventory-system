"""
Django settings for inventory_system project.
Simple configuration for the Smart Inventory Management System.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# For development only - change this in production
SECRET_KEY = 'django-insecure-dev-key-change-in-production-12345'

# SECURITY WARNING: don't run with debug turned on in production!
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts - add your domain here in production
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.koyeb.app']

# Application definition
# These are the apps installed in this Django project
INSTALLED_APPS = [
    'django.contrib.admin',      # Django admin panel
    'django.contrib.auth',        # User authentication
    'django.contrib.contenttypes', # Content types framework
    'django.contrib.sessions',    # Session framework
    'django.contrib.messages',    # Messaging framework
    'django.contrib.staticfiles', # Static file handling
    'rest_framework',             # Django REST Framework for API
    'corsheaders',                # CORS handling for React frontend
    'inventory',                  # Our inventory app
]

# Middleware - processes requests and responses
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Handle CORS (must be first)
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Root URL configuration
ROOT_URLCONF = 'inventory_system.urls'

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.parent / 'frontend' / 'dist'],
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

# WSGI application
WSGI_APPLICATION = 'inventory_system.wsgi.application'

# Database configuration
# Using MySQL database (Railway hosting)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'railway',
        'USER': 'root',
        'PASSWORD': 'mmuecBFOXdwJSKEcrjjYfStaEfzwvVMj',
        'HOST': 'centerbeam.proxy.rlwy.net',
        'PORT': '28980',
        'OPTIONS': {
            'connect_timeout': 10,  # Connection timeout in seconds
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
        'CONN_MAX_AGE': 300,  # Keep database connections alive for 5 minutes (reduces connection overhead)
    }
}

# Password validation (using Django defaults)
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
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    # Fallback/Source path for dev - may not exist in prod but safe to keep
    BASE_DIR.parent / 'frontend' / 'dist',
]
# Enable Whitenoise storage (no manifest required as Vite handles hashing)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework configuration
REST_FRAMEWORK = {
    # Use JSON as default content type
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

# CORS settings - allow React frontend to access the API
# In production, specify exact frontend URL instead of '*'
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React default port
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Allow all origins in development (not recommended for production)
CORS_ALLOW_ALL_ORIGINS = True  # Set to False in production

# Allow credentials (cookies, session) to be sent with requests
# Allow credentials (cookies, session) to be sent with requests
CORS_ALLOW_CREDENTIALS = True

# CSRF Trusted Origins - Required for Django admin login in production
CSRF_TRUSTED_ORIGINS = [
    'https://nutty-meerkat-haca-44179d4f.koyeb.app',
]

