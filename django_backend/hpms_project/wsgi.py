"""WSGI config for HPMS project."""
import os
from django.core.wsgi import get_wsgi_application
settings_module = 'hpms_project.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'hpms_project.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
application = get_wsgi_application()
