from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.models import User
from django.db import IntegrityError

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes, authentication_classes

@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def signup_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'success': False, 'errors': {'detail': 'Username and password are required'}}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'success': False, 'errors': {'username': ['Username already exists.']}}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'success': True, 'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'success': False, 'errors': {'detail': str(e)}}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def password_reset_request_api(request):
    try:
        print(f"Password reset request data: {request.data}")
        form = PasswordResetForm(request.data)
        if form.is_valid():
            opts = {
                'use_https': request.is_secure(),
                'email_template_name': 'registration/password_reset_email.html',
                'request': request,
            }
            form.save(**opts)
            print("Password reset email sent (check console)")
            return Response({'success': True, 'message': 'Password reset email sent'})
        else:
            print(f"Form errors: {form.errors}")
            return Response({'success': False, 'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(tb)
        return Response({
            'success': False, 
            'errors': {'detail': str(e), 'traceback': tb}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def password_reset_confirm_api(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('new_password1')

    if not (uidb64 and token and password):
        return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.set_password(password)
        user.save()
        return Response({'success': True, 'message': 'Password has been reset successfully'})
    
    return Response({'error': 'Invalid link or expired token'}, status=status.HTTP_400_BAD_REQUEST)
