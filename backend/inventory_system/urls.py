from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

# Main URL configuration for the Django project
urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin panel
    path('api/', include('inventory.urls')),  # Include all inventory API endpoints
    # Serve React Frontend for any other route
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

