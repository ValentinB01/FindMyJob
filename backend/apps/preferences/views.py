from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import JobPreferences, JobSource
from .serializers import JobPreferencesSerializer, JobSourceSerializer

ALL_SOURCES = ["adzuna", "remoteok", "arbeitnow", "hn_hiring"]


def _init_sources(user):
    """Create default (all-enabled) source rows for a user if missing."""
    for source in ALL_SOURCES:
        JobSource.objects.get_or_create(user=user, source=source, defaults={"is_enabled": True})


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def preferences(request):
    """US-05 – Get or update job search preferences."""
    obj, _ = JobPreferences.objects.get_or_create(user=request.user)

    if request.method == "GET":
        return Response(JobPreferencesSerializer(obj).data)

    serializer = JobPreferencesSerializer(obj, data=request.data, partial=False)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_sources(request):
    """US-06 – Return all job sources for the user (initialised if first visit)."""
    _init_sources(request.user)
    sources = JobSource.objects.filter(user=request.user).order_by("source")
    return Response(JobSourceSerializer(sources, many=True).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_source(request, source):
    """US-06 – Toggle a specific source on/off."""
    if source not in ALL_SOURCES:
        return Response({"detail": "Unknown source."}, status=status.HTTP_400_BAD_REQUEST)

    _init_sources(request.user)
    try:
        src_obj = JobSource.objects.get(user=request.user, source=source)
    except JobSource.DoesNotExist:
        return Response({"detail": "Source not found."}, status=status.HTTP_404_NOT_FOUND)

    # Ensure at least one source stays enabled
    if src_obj.is_enabled:
        enabled_count = JobSource.objects.filter(user=request.user, is_enabled=True).count()
        if enabled_count <= 1:
            return Response(
                {"detail": "At least one source must remain active."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    src_obj.is_enabled = not src_obj.is_enabled
    src_obj.save()
    return Response(JobSourceSerializer(src_obj).data)
