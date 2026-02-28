import os
from .settings import *
from .settings import BASE_DIR
ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']]

DEBUG = False
CSRF_TRUSTED_ORIGINS = [
    f"https://{os.environ.get('WEBSITE_HOSTNAME')}",
    'https://brave-water-032ac4a03.6.azurestaticapps.net',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
},}
CORS_ALLOWED_ORIGINS = [
    'https://brave-water-032ac4a03.6.azurestaticapps.net',
]
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
import os

CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']

# parse connection string safely
CONNECTION_STR = {pair.split('=', 1)[0]: pair.split('=', 1)[1] for pair in CONNECTION.split()}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": CONNECTION_STR['dbname'],
        "USER": CONNECTION_STR['user'],
        "PASSWORD": CONNECTION_STR['password'],
        "HOST": CONNECTION_STR['host'],
        "PORT": CONNECTION_STR['port'],
        "OPTIONS": {
            "sslmode": CONNECTION_STR.get("sslmode", "require"),
        },
    }
}


STATIC_ROOT = BASE_DIR / 'staticfiles'
