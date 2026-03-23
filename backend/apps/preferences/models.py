from django.db import models
from django.conf import settings


class JobPreferences(models.Model):
    """US-05 – Per-user job search preferences."""

    WORK_TYPE_CHOICES = [
        ("remote", "Remote"),
        ("hybrid", "Hybrid"),
        ("onsite", "On-site"),
    ]
    SENIORITY_CHOICES = [
        ("junior", "Junior"),
        ("mid", "Mid-level"),
        ("senior", "Senior"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_preferences",
    )
    preferred_title = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES, default="remote")
    seniority = models.CharField(max_length=20, choices=SENIORITY_CHOICES, default="junior")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_preferences"

    def __str__(self):
        return f"Prefs – {self.user.email}"


class JobSource(models.Model):
    """US-06 – Which job-board sources Agent 1 can query."""

    SOURCE_CHOICES = [
        ("adzuna", "Adzuna"),
        ("remoteok", "RemoteOK"),
        ("arbeitnow", "Arbeitnow"),
        ("hn_hiring", "HN Who's Hiring"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_sources",
    )
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = "job_sources"
        unique_together = ["user", "source"]

    def __str__(self):
        return f"{self.user.email} – {self.source} ({'on' if self.is_enabled else 'off'})"
