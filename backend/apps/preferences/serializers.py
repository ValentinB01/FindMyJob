from rest_framework import serializers
from .models import JobPreferences, JobSource


class JobPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPreferences
        fields = (
            "id",
            "preferred_title",
            "location",
            "work_type",
            "seniority",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class JobSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSource
        fields = ("id", "source", "is_enabled")
        read_only_fields = ("id",)
