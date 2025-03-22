from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Organization
from .serializers import RegisterUserSerializer, RegisterOrganizationSerializer, LoginSerializer
from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import ForgotPasswordSerializer, ResetPasswordSerializer

# 🟢 User Registration API
class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # ✅ No need to hash password manually
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# 🟢 Organization Registration API
class RegisterOrganizationView(APIView):
    def post(self, request):
        serializer = RegisterOrganizationSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                organization = serializer.save()  # ✅ No need to hash password manually
                return Response(
                    {
                        "message": "Organization registered successfully!",
                        "organization": {
                            "name": organization.name,
                            "contact_email": organization.contact_email,
                            "city": organization.city,
                            "country": organization.country
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )
            except IntegrityError:
                return Response(
                    {"error": "Organization with this email or name already exists!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🟢 Login API

class LoginView(APIView):
    def post(self, request):
        print("🔹 DEBUG: Login Request Data ->", request.data)
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            print("✅ DEBUG: Login Successful!")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        print("❌ DEBUG: Login Failed!", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class ForgotPasswordView(APIView):
#     def post(self, request):
#         serializer = ForgotPasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             return Response({"message": "Password reset email sent!"}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class ResetPasswordView(APIView):
#     def post(self, request):
#         serializer = ResetPasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             return Response(serializer.validated_data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
