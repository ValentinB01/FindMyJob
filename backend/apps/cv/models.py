from django.db import models
from django.conf import settings


class CVProfile(models.Model):
    """Stores the parsed and user-edited CV data. One per user."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cv_profile",
    )
    raw_pdf = models.FileField(upload_to="cvs/raw/", null=True, blank=True)

    # Parsed / editable fields
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    summary = models.TextField(blank=True)
    skills = models.JSONField(default=list)
    work_experience = models.JSONField(default=list)
    education = models.JSONField(default=list)
    raw_text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "cv_profiles"

    def __str__(self):
        return f"CV – {self.user.email}"
