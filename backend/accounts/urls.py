from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_api, name='signup_api'),
    path('password-reset/', views.password_reset_request_api, name='password_reset_api'),
    path('password-reset-confirm/', views.password_reset_confirm_api, name='password_reset_confirm_api'),
]
