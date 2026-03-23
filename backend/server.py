"""
Django ASGI entry point for uvicorn.
Replaces FastAPI – all logic lives in the jobhunt Django project.
"""
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobhunt.settings")

from django.core.asgi import get_asgi_application  # noqa: E402

app = get_asgi_application()
