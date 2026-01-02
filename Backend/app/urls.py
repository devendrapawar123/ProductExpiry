# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    RegisterView,
    LoginView,
    ProfileView,
    NotificationViewSet,
    UserSettingsView,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="products")
router.register("notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("", include(router.urls)),

    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),

    path("profile/<int:user_id>/", ProfileView.as_view(), name="user-profile"),

    path("settings/<int:user_id>/", UserSettingsView.as_view(), name="user-settings"),
]
