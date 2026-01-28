from django.contrib import admin
from django.urls import path, include, re_path
from .views import serve_react

# Main URL configuration for the Django project
urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin panel
    path('api/', include('inventory.urls')),  # Include all inventory API endpoints
    path('api/accounts/', include('accounts.urls')),  # Auth routes
    # Serve React Frontend for any other route
    re_path(r'^.*$', serve_react),
]

