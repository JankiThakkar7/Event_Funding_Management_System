from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Organization, Admin
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password  # ✅ Import make_password and check_password
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

# 🟢 User Registration Serializer
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])  # Hash password
        return super().create(validated_data)

# 🟢 Organization Registration Serializer
class RegisterOrganizationSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(required=True)
    admin_contact_email = serializers.EmailField(required=True)

    class Meta:
        model = Organization
        fields = [
            "name", "description", "website", "contact_email",
            "contact_number", "street_address", "city", "state",
            "country", "zip_code", "industry_type", "facebook",
            "twitter", "linkedin", "admin_name", "admin_contact_email",
            "password"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        admin_name = validated_data.pop("admin_name")
        admin_contact_email = validated_data.pop("admin_contact_email")

        # ✅ Hash the password before saving
        validated_data["password"] = make_password(validated_data["password"])

        # ✅ Create Organization
        organization = Organization.objects.create(**validated_data)

        # ✅ Create Admin for Organization
        Admin.objects.create(
            organization=organization,
            admin_name=admin_name,
            contact_email=admin_contact_email
        )

        return organization


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        print(f"🔹 DEBUG: Email received -> {email}")
        print(f"🔹 DEBUG: Password received -> {password}")

        # ✅ Try Authenticating as User
        try:
            user = User.objects.get(email=email)
            print(f"✅ DEBUG: User found -> {user.username}")
            if check_password(password, user.password):
                print("✅ DEBUG: Password matched for user!")
                refresh = RefreshToken.for_user(user)
                return {
                    "id": user.id,
                    "type": "user",
                    "username": user.username,
                    "email": user.email,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
        except User.DoesNotExist:
            print(f"❌ DEBUG: No User found with email -> {email}")

        # ✅ Try Authenticating as Organization
        try:
            org = Organization.objects.get(contact_email=email)
            print(f"✅ DEBUG: Organization found -> {org.name}")
            if check_password(password, org.password):
                print("✅ DEBUG: Password matched for organization!")
                
                # ✅ Manually create JWT token for Organization
                refresh = RefreshToken()
                refresh.payload["user_id"] = org.org_id  # Manually assign org_id
                refresh.payload["type"] = "organization"

                return {
                    "id": org.org_id,
                    "type": "organization",
                    "name": org.name,
                    "email": org.contact_email,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
        except Organization.DoesNotExist:
            print(f"❌ DEBUG: No Organization found with email -> {email}")

        print("❌ DEBUG: Authentication failed!")
        raise serializers.ValidationError("Invalid email or password")
    
# class ForgotPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField()

#     def validate_email(self, value):
#         user = None
#         try:
#             user = User.objects.get(email=value)
#         except User.DoesNotExist:
#             try:
#                 user = Organization.objects.get(contact_email=value)
#             except Organization.DoesNotExist:
#                 raise serializers.ValidationError("No account found with this email.")

#         if user:
#             # Generate a reset token (for simplicity, using a random string)
#             reset_token = get_random_string(length=50)
#             user.reset_token = reset_token  # Assuming the model has a reset_token field
#             user.save()

#             # Send email
#             send_mail(
#                 "Password Reset Request",
#                 f"Click the link to reset your password: http://localhost:3000/reset-password/{reset_token}",
#                 "noreply@eventfunding.com",
#                 [user.email],
#                 fail_silently=False,
#             )

#         return value
    
# class ResetPasswordSerializer(serializers.Serializer):
#     token = serializers.CharField()
#     new_password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         token = data.get("token")
#         new_password = data.get("new_password")

#         try:
#             user = User.objects.get(reset_token=token)
#         except User.DoesNotExist:
#             try:
#                 user = Organization.objects.get(reset_token=token)
#             except Organization.DoesNotExist:
#                 raise serializers.ValidationError("Invalid token.")

#         user.set_password(new_password)
#         user.reset_token = None  # Clear the reset token after use
#         user.save()
#         return {"message": "Password reset successful!"}

