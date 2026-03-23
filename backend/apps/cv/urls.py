from django.urls import path
from . import views

urlpatterns = [
    path("upload/", views.upload_cv, name="cv-upload"),
    path("profile/", views.get_cv_profile, name="cv-profile"),
    path("profile/update/", views.update_cv_profile, name="cv-profile-update"),
]
