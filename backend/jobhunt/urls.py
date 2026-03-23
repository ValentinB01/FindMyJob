from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/auth/", include("apps.users.urls")),
    path("api/cv/", include("apps.cv.urls")),
    path("api/preferences/", include("apps.preferences.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
