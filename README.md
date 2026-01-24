# Reflective Journal - Clean Restart

## Project Structure
```
backend/          - Django REST API
├── config/       - Django settings
├── journal/      - Journal app
└── manage.py

frontend/         - Vanilla HTML/CSS/JS
├── index.html
├── app.js
└── styles.css
```

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
# Serve with a local server (Python):
python -m http.server 8001
```

Then visit: http://localhost:8001

### API Endpoints
- `/api/auth/login/` - Login
- `/api/auth/registration/` - Register
- `/api/entries/` - List/create journal entries

### Admin Panel
- http://localhost:8000/admin/

## Test Credentials
- Email: test@example.com
- Password: testpass123
