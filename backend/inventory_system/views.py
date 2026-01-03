import os
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound

def serve_react(request):
    """
    Serves the compiled React index.html file.
    In production (Docker), this file is located at /static/index.html.
    """
    # Primary path for production
    path = '/static/index.html'

    # Check if the production file exists
    if not os.path.exists(path):
        # Fallback for local development
        # Attempts to locate index.html in the frontend/dist directory
        try:
            path = os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'index.html')
        except Exception:
            pass

    if os.path.exists(path):
        return FileResponse(open(path, 'rb'))
    
    return HttpResponseNotFound(f"React built index.html not found at {path}")
