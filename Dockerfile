# ===============================
# Build React frontend
# ===============================
FROM node:18 AS frontend
WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ===============================
# Django backend
# ===============================
FROM python:3.10-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

# Copy React build into Django static folder
COPY --from=frontend /frontend/dist ./static

EXPOSE 8000

CMD ["gunicorn", "inventory_system.wsgi:application", "--bind", "0.0.0.0:8000"]
