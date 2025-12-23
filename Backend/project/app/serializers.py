from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Product, UserMaster, UserProfile, Notification, UserSettings


# ---------------- PRODUCT ----------------
class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product_name")
    batch = serializers.CharField(source="batch_no")
    mfgDate = serializers.DateField(source="mfg_date")
    expDate = serializers.DateField(source="exp_date")
    image = serializers.ImageField(required=False)

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "batch",
            "barcode",
            "mfgDate",
            "expDate",
            "quantity",
            "user",
            "image",
        ]
        read_only_fields = ["id", "user"]


# ---------------- NOTIFICATION ----------------
class NotificationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.product_name", read_only=True
    )
    expDate = serializers.DateField(
        source="product.exp_date", read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "type",
            "message",
            "is_read",
            "created_at",
            "product",
            "product_name",
            "expDate",
        ]
        read_only_fields = ["id", "created_at"]


# ---------------- PROFILE ----------------
class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "full_name", "phone", "address", "email", "role"]


# ---------------- REGISTER ----------------
class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=10)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        name = validated_data.pop("name")
        phone = validated_data.pop("phone")
        password = validated_data.pop("password")
        validated_data.pop("confirm_password")

        user = UserMaster.objects.create(
            email=validated_data["email"],
            password=make_password(password),
        )

        UserProfile.objects.create(user=user, full_name=name, phone=phone)
        UserSettings.objects.get_or_create(user=user)

        return user


# ---------------- LOGIN ----------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            user = UserMaster.objects.get(email__iexact=attrs["email"])
        except UserMaster.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not check_password(attrs["password"], user.password):
            raise serializers.ValidationError("Invalid credentials")

        attrs["user"] = user
        return attrs


# ---------------- SETTINGS ----------------
class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["theme", "language", "notify_days_before"]
