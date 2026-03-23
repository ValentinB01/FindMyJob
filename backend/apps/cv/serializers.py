from rest_framework import serializers
from .models import CVProfile


class CVProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CVProfile
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "summary",
            "skills",
            "work_experience",
            "education",
            "raw_pdf",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "raw_pdf", "created_at", "updated_at")


class CVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are accepted.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size must not exceed 5 MB.")
        return value
