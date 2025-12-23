"""from datetime import date
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Product, UserMaster, UserProfile, Notification, UserSettings
from .serializers import (
    ProductSerializer,
    RegisterSerializer,
    LoginSerializer,
    NotificationSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
)

# ---------------- NOTIFICATION HELPER ----------------
def update_notifications_for_product(product: Product):
    Notification.objects.filter(product=product).delete()

    days_before = 7
    try:
        settings = UserSettings.objects.get(user=product.user)
        days_before = settings.notify_days_before or 7
    except UserSettings.DoesNotExist:
        pass

    today = date.today()
    diff = (product.exp_date - today).days

    if diff < 0:
        Notification.objects.create(
            user=product.user,
            product=product,
            type="EXPIRED",
            message=f"{product.product_name} expired on {product.exp_date}.",
        )
    elif diff <= days_before:
        Notification.objects.create(
            user=product.user,
            product=product,
            type="NEAR_EXPIRY",
            message=f"{product.product_name} will expire in {diff} days.",
        )

# ---------------- PRODUCTS (USER-WISE) ----------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()   # REQUIRED FOR ROUTER
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if not user_id:
            return Product.objects.none()
        return Product.objects.filter(user_id=user_id).order_by("-id")

    def perform_create(self, serializer):
        user_id = self.request.data.get("user")
        user = UserMaster.objects.get(id=user_id)
        product = serializer.save(user=user)
        update_notifications_for_product(product)

    def perform_update(self, serializer):
        product = serializer.save()
        update_notifications_for_product(product)


# ---------------- NOTIFICATIONS (USER-WISE) ----------------
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if not user_id:
            return Notification.objects.none()
        return Notification.objects.filter(user_id=user_id).order_by("-created_at")


# ---------------- AUTH ----------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile = UserProfile.objects.get(user=user)

        return Response({
            "id": user.id,
            "name": profile.full_name,
            "email": user.email,
            "phone": profile.phone,
            "role": user.role,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        profile = UserProfile.objects.get(user=user)

        return Response({
            "id": user.id,
            "name": profile.full_name,
            "email": user.email,
            "phone": profile.phone,
            "role": user.role,
        }, status=status.HTTP_200_OK)


# ---------------- PROFILE ----------------
class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        profile, _ = UserProfile.objects.get_or_create(user_id=user_id)
        return Response(UserProfileSerializer(profile).data)

    def put(self, request, user_id):
        profile, _ = UserProfile.objects.get_or_create(user_id=user_id)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ---------------- SETTINGS ----------------
class UserSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        settings, _ = UserSettings.objects.get_or_create(user_id=user_id)
        return Response(UserSettingsSerializer(settings).data)

    def put(self, request, user_id):
        settings, _ = UserSettings.objects.get_or_create(user_id=user_id)
        serializer = UserSettingsSerializer(
        settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)"""
# app/views.py
from datetime import date
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Product, UserMaster, UserProfile, Notification, UserSettings
from .serializers import (
    ProductSerializer,
    RegisterSerializer,
    LoginSerializer,
    NotificationSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
)

# ---------------- NOTIFICATION HELPER ----------------
def update_notifications_for_product(product: Product):
    Notification.objects.filter(product=product).delete()

    today = date.today()
    diff = (product.exp_date - today).days

    if diff < 0:
        Notification.objects.create(
            user=product.user,
            product=product,
            type="EXPIRED",
            message=f"{product.product_name} expired.",
        )
    elif diff <= 7:
        Notification.objects.create(
            user=product.user,
            product=product,
            type="NEAR_EXPIRY",
            message=f"{product.product_name} expiring soon.",
        )

# ---------------- PRODUCTS (FIXED) ----------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    # 🔥 FIX: allow retrieve / update / delete
    def get_queryset(self):
        return Product.objects.all().order_by("-id")

    # 🔥 User-wise LIST only
    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response([])

        queryset = Product.objects.filter(user_id=user_id).order_by("-id")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user_id = self.request.data.get("user")
        if not user_id:
            raise ValueError("User ID is required")

        user = UserMaster.objects.get(id=int(user_id))
        product = serializer.save(user=user)
        update_notifications_for_product(product)

    def perform_update(self, serializer):
        product = serializer.save()
        update_notifications_for_product(product)

# ---------------- NOTIFICATIONS ----------------
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if not user_id:
            return Notification.objects.none()
        return Notification.objects.filter(user_id=user_id).order_by("-created_at")

# ---------------- AUTH ----------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile = UserProfile.objects.get(user=user)

        return Response({
            "id": user.id,
            "name": profile.full_name,
            "email": user.email,
            "phone": profile.phone,
            "role": user.role,
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        profile = UserProfile.objects.get(user=user)

        return Response({
            "id": user.id,
            "name": profile.full_name,
            "email": user.email,
            "phone": profile.phone,
            "role": user.role,
        }, status=status.HTTP_200_OK)

# ---------------- PROFILE ----------------
class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        profile, _ = UserProfile.objects.get_or_create(user_id=user_id)
        return Response(UserProfileSerializer(profile).data)

    def put(self, request, user_id):
        profile, _ = UserProfile.objects.get_or_create(user_id=user_id)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

# ---------------- SETTINGS ----------------
class UserSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        settings, _ = UserSettings.objects.get_or_create(user_id=user_id)
        return Response(UserSettingsSerializer(settings).data)

    def put(self, request, user_id):
        settings, _ = UserSettings.objects.get_or_create(user_id=user_id)
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
