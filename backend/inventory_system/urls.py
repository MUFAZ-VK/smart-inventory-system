from django.contrib import admin
from django.urls import path, include

# Main URL configuration for the Django project
urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin panel
    path('api/', include('inventory.urls')),  # Include all inventory API endpoints
]

