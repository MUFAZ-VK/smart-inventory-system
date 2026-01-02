FROM node:18 AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM python:3.10-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend .

COPY --from=frontend /frontend/dist ./static

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
