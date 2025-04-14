from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Organization, Admin, Volunteer, Event, Notification
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

# 🟢 User Registration Serializer
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
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

        validated_data["password"] = make_password(validated_data["password"])
        organization = Organization.objects.create(**validated_data)

        Admin.objects.create(
            organization=organization,
            admin_name=admin_name,
            contact_email=admin_contact_email
        )
        return organization

# 🟢 Volunteer Registration Serializer
class RegisterVolunteerSerializer(serializers.ModelSerializer):
    # Changing the organization field to accept the organization name
    organization_name = serializers.CharField(write_only=True)

    class Meta:
        model = Volunteer
        fields = ["vol_id", "organization_name", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_organization_name(self, value):
        try:
            # Lookup organization by its name
            organization = Organization.objects.get(name=value)
        except Organization.DoesNotExist:
            raise serializers.ValidationError("Organization with this name does not exist.")
        return organization

    def create(self, validated_data):
        # Extract organization_name and retrieve the organization
        organization_name = validated_data.pop("organization_name")
        organization = Organization.objects.get(name=organization_name)

        # Hash the password before saving the volunteer
        validated_data["password"] = make_password(validated_data["password"])

        # Create and save the volunteer, associating them with the organization
        volunteer = Volunteer.objects.create(organization=organization, **validated_data)
        return volunteer

# 🟢 Event Serializer
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date', 'location', 'organization']

    def create(self, validated_data):
        # Creating an event and associating it with the organization
        event = Event.objects.create(**validated_data)
        return event

# 🟢 Volunteer-Event Serializer to link volunteers to events
class VolunteerEventSerializer(serializers.ModelSerializer):
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    volunteer_ids = serializers.PrimaryKeyRelatedField(queryset=Volunteer.objects.all(), many=True)

    class Meta:
        model = Event
        fields = ['event_id', 'volunteer_ids']

    def create(self, validated_data):
        event = validated_data.get('event_id')
        volunteers = validated_data.get('volunteer_ids')

        # Link the volunteers to the event
        event.volunteers.add(*volunteers)

        # Sending notifications to volunteers about the event
        for volunteer in volunteers:
            message = f"You have been added to the event '{event.name}'."
            Notification.objects.create(volunteer=volunteer, message=message)

        return event

# 🟢 Notification Serializer (To manage notifications for volunteers)
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'volunteer', 'message', 'read', 'created_at']

    def create(self, validated_data):
        # Notification creation logic here, could be emailing, etc.
        return super().create(validated_data)

# 🟢 Login Serializer (Common for User / Organization / Volunteer)
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # ✅ Try Authenticating as User
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
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
            pass

        # ✅ Try Authenticating as Organization
        try:
            org = Organization.objects.get(contact_email=email)
            if check_password(password, org.password):
                refresh = RefreshToken()
                refresh.payload["user_id"] = org.org_id
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
            pass

        # ✅ Try Authenticating as Volunteer
        try:
            volunteer = Volunteer.objects.get(email=email)
            if check_password(password, volunteer.password):
                refresh = RefreshToken()
                refresh.payload["user_id"] = volunteer.vol_id
                refresh.payload["type"] = "volunteer"

                return {
                    "id": volunteer.vol_id,
                    "type": "volunteer",
                    "username": volunteer.username,
                    "email": volunteer.email,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                }
        except Volunteer.DoesNotExist:
            pass

        raise serializers.ValidationError("Invalid email or password")

class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = ["vol_id", "username", "email", "organization"]

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance
