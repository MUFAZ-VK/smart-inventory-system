import os
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound

def serve_react(request):
    """
    Serves the compiled React index.html file.
    In production (Docker), this file is located at /static/index.html.
    """
    # Primary path for production (Docker)
    # in Dockerfile: COPY --from=frontend /frontend/dist ./static
    # BASE_DIR is /app, so this resolves to /app/static/index.html
    path = os.path.join(settings.BASE_DIR, 'static', 'index.html')

    # Check if the production file exists
    if not os.path.exists(path):
        # Fallback for local development
        try:
            # Resolves to: backend/../frontend/dist/index.html
            base_dir = settings.BASE_DIR # backend/
            # Go up one level to project root, then into frontend/dist
            local_path = base_dir.parent / 'frontend' / 'dist' / 'index.html'
            path = str(local_path.resolve())
        except Exception:
            pass

    if os.path.exists(path):
        return FileResponse(open(path, 'rb'))
    
    return HttpResponseNotFound(f"React built index.html not found at: {path}. resolved from BASE_DIR: {settings.BASE_DIR}")
