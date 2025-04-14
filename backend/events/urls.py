from django.urls import path
from .views import RegisterUserView, RegisterOrganizationView, LoginView, RegisterVolunteerView, GetVolunteersView, AddVolunteersToEventView, GetNotificationsView

urlpatterns = [
    # 🟢 User Registration
    path('register/user/', RegisterUserView.as_view(), name="register_user"),

    # 🟢 Organization Registration
    path('register/organization/', RegisterOrganizationView.as_view(), name="register_organization"),

    # 🟢 Volunteer Registration
    path('register/volunteer/', RegisterVolunteerView.as_view(), name="register_volunteer"),

    # 🟢 Login
    path('login/', LoginView.as_view(), name="login"),

    # 🟢 Get Volunteers for Admin (Authenticated)
    path('admin/volunteers/', GetVolunteersView.as_view(), name="get_volunteers"),

    # 🟢 Add Volunteers to Event (Admin)
    path('admin/event/<int:event_id>/add_volunteers/', AddVolunteersToEventView.as_view(), name="add_volunteers_to_event"),

    # 🟢 Get Notifications for Volunteers
    path('volunteer/notifications/', GetNotificationsView.as_view(), name="get_notifications"),

]
