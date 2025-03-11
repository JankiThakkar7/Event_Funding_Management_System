from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Organization
from .serializers import UserSerializer, OrganizationSerializer

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    def post(self, request):
        role = request.data.get("role")

        if role == "visitor" or role == "volunteer" or role == "admin":
            user_serializer = UserSerializer(data=request.data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                tokens = get_tokens_for_user(user)
                return Response({"message": "User registered successfully!", "tokens": tokens}, status=status.HTTP_201_CREATED)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif role == "organization":
            org_serializer = OrganizationSerializer(data=request.data)
            if org_serializer.is_valid():
                org_serializer.save()
                return Response({"message": "Organization registered successfully!"}, status=status.HTTP_201_CREATED)
            return Response(org_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
