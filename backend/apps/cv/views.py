from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CVProfile
from .serializers import CVProfileSerializer, CVUploadSerializer
from .cv_parser import extract_text_from_pdf, parse_cv


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_cv(request):
    """US-03 – Upload a PDF CV and get parsed data back."""
    serializer = CVUploadSerializer(data=request.FILES)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    pdf_file = serializer.validated_data["file"]

    # Extract + parse text
    raw_text = extract_text_from_pdf(pdf_file)
    parsed = parse_cv(raw_text)

    # Create or update CVProfile
    profile, _ = CVProfile.objects.update_or_create(
        user=request.user,
        defaults={
            "raw_pdf": pdf_file,
            "raw_text": raw_text,
            **parsed,
        },
    )

    return Response(CVProfileSerializer(profile).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cv_profile(request):
    """Return the authenticated user's CV profile (or 404 if not uploaded yet)."""
    try:
        profile = request.user.cv_profile
    except CVProfile.DoesNotExist:
        return Response({"detail": "No CV uploaded yet."}, status=status.HTTP_404_NOT_FOUND)
    return Response(CVProfileSerializer(profile).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_cv_profile(request):
    """US-04 – Edit the extracted CV data."""
    try:
        profile = request.user.cv_profile
    except CVProfile.DoesNotExist:
        return Response({"detail": "No CV uploaded yet."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CVProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
