from django.urls import path
from .views import RegisterUserView, RegisterOrganizationView, LoginView

urlpatterns = [
    path('register/user/', RegisterUserView.as_view(), name="register_user"),
    path('register/organization/', RegisterOrganizationView.as_view(), name="register_organization"),
    path("login/", LoginView.as_view(), name="login"),
    # path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    # path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
]

