# Smart Inventory System

A modern, full-stack inventory management solution built with Django and React.

## ✨ Key Features
- **� Comprehensive Inventory Management**: Track products, stock levels, and sales across multiple locations.
- **🏢 Multi-Branch Support**: Manage inventory for unlimited store branches independently.
- **💰 Sales Tracking**: Record sales transactions that automatically update stock levels.
- **🔐 Secure Authentication**: Built-in user login and session management.
- **📊 Real-time Updates**: Instant stock adjustments upon sale or manual update.
- **⚡ RESTful API**: Fully documented API endpoints for all operations.

## �🚀 Tech Stack
- **Backend:** Django 4.2, Django REST Framework, MySQL
- **Frontend:** React 18, Vite, React Router, Axios
- **Deployment:** Production-ready with Gunicorn + Whitenoise

## 🛠️ Quick Start

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Create a superuser (for login):
   ```bash
   python manage.py createsuperuser
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

