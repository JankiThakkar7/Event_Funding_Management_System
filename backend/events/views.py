from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import User, Organization, Volunteer, Event, Notification
from .serializers import RegisterUserSerializer, RegisterOrganizationSerializer, LoginSerializer, RegisterVolunteerSerializer, EventSerializer, NotificationSerializer, VolunteerSerializer
from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken

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

# 🟢 Volunteer Registration API
class RegisterVolunteerView(APIView):
    def post(self, request):
        serializer = RegisterVolunteerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Volunteer registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
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

# 🟢 Get Volunteers for a Specific Organization (Authenticated Admin only)
class GetVolunteersView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # The logged-in admin
        try:
            organization = user.organization  # Assume the user has a relationship with an organization
            volunteers = Volunteer.objects.filter(organization=organization)  # Get volunteers for the organization

            # Serialize the volunteer data
            serializer = VolunteerSerializer(volunteers, many=True)
            return Response({"volunteers": serializer.data}, status=status.HTTP_200_OK)
        except Organization.DoesNotExist:
            return Response({"error": "Organization not found!"}, status=status.HTTP_404_NOT_FOUND)

# 🟢 Add Volunteers to Event (Authenticated Admin only)
class AddVolunteersToEventView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            volunteers_ids = request.data.get("volunteers", [])

            # Check if volunteers are selected
            volunteers = Volunteer.objects.filter(id__in=volunteers_ids)

            # Add volunteers to event (Many-to-Many relationship)
            event.volunteers.add(*volunteers)

            # Optionally, you can notify the volunteers or perform any other business logic
            for volunteer in volunteers:
                message = f"You have been added to the event: {event.name}."
                Notification.objects.create(volunteer=volunteer, message=message)

            return Response({"message": "Volunteers added to event successfully!"}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# 🟢 Get Notifications for Volunteers (Authenticated Volunteer only)
class GetNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        volunteer = request.user  # The logged-in volunteer
        try:
            notifications = Notification.objects.filter(volunteer=volunteer)  # Get notifications for the volunteer

            # Serialize the notifications data
            serializer = NotificationSerializer(notifications, many=True)
            return Response({"notifications": serializer.data}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "No notifications found!"}, status=status.HTTP_404_NOT_FOUND)
