from django.db import models
from django.utils import timezone


# Create your models here.
# ---------------------------
# 1️⃣ Authentication Table
# ---------------------------
class UserMaster(models.Model):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("USER", "Normal User"),
    )

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Hashed
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="USER")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# ---------------------------
# 2️⃣ User Profile Table
# ---------------------------
class UserProfile(models.Model):
    user = models.OneToOneField(UserMaster, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=80)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.full_name


# ---------------------------
# 3️⃣ Product Table
# ---------------------------
class Product(models.Model):
    user = models.ForeignKey(
        UserMaster,
        on_delete=models.CASCADE,
        null=True,          # ✅ ab NULL allow
        blank=True          # ✅ form se bhejna zaroori nahi
    )

    product_name = models.CharField(max_length=200, default="null")
    category = models.CharField(max_length=100, blank=True)
    batch_no = models.CharField(max_length=50)
    barcode = models.CharField(max_length=50, blank=True, default="null")

    mfg_date = models.DateField()
    exp_date = models.DateField()
    quantity = models.IntegerField(default=1)
    
    image = models.ImageField(upload_to="products/", null=True, blank=True)   # ✅ NEW


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name



# ---------------------------
# 4️⃣ Expiry Alerts
# ---------------------------
class Notification(models.Model):
    NOTI_TYPES = (
        ("EXPIRED", "Expired"),
        ("NEAR_EXPIRY", "Near Expiry"),
    )

    user = models.ForeignKey(UserMaster, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    type = models.CharField(max_length=20, choices=NOTI_TYPES)
    message = models.CharField(max_length=200)
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.product_name} - {self.type}"


# ---------------------------
# 5️⃣ Theme + Language Settings
# ---------------------------
class UserSettings(models.Model):
    user = models.OneToOneField(UserMaster, on_delete=models.CASCADE)

    theme = models.CharField(max_length=10, default="light")
    language = models.CharField(max_length=10, default="en")
    notify_days_before = models.IntegerField(default=7)

    def __str__(self):
        return f"{self.user.email} Settings"
