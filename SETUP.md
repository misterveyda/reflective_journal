# 🚀 Reflective Journal - Setup Guide

## Clean Architecture

We've completely rebuilt this project with a **clean separation**:

```
reflective_journal/
├── backend/          ← Django REST API (port 8000)
│   ├── config/       - Django settings & URLs
│   ├── journal/      - Journal app (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/         ← Vanilla HTML/CSS/JS (port 8001)
│   ├── index.html
│   ├── app.js        - All frontend logic
│   └── styles.css    - Complete styling
│
└── README.md
```

## No React, No Dependencies Mess 🎉

**Frontend**: Pure HTML5 + CSS3 + JavaScript (zero build tools)
**Backend**: Django REST API with Token Authentication

---

## 🔧 Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser --email test@example.com --username testuser

# When prompted for password, enter: testpass123

# Start server
python manage.py runserver
```

✅ Backend will run on: **http://localhost:8000**

### 2️⃣ Frontend Setup

```bash
cd frontend

# Option A: Using Python (simplest)
python -m http.server 8001

# Option B: Using Node.js
npx http-server -p 8001

# Option C: Using Ruby
ruby -run -ehttpd . -p8001

# Option D: Using PHP
php -S localhost:8001
```

✅ Frontend will run on: **http://localhost:8001**

---

## 📝 How to Use

### 1. Open the frontend
Visit: **http://localhost:8001**

### 2. Sign up or log in
- Email: `test@example.com`
- Password: `testpass123`

### 3. Create entries
- Title (optional)
- Content (what's on your mind)
- Mood emoji
- Click "Save Entry"

### 4. View all entries
Entries appear below the form, sorted by newest first.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with email & password → returns token
- `POST /api/auth/registration/` - Register new user → returns token

### Journal
- `GET /api/entries/` - List your entries (requires token)
- `POST /api/entries/` - Create new entry (requires token)
- `GET /api/entries/{id}/` - Get specific entry
- `PUT /api/entries/{id}/` - Update entry
- `DELETE /api/entries/{id}/` - Delete entry

**All requests need**: `Authorization: Token YOUR_TOKEN_HERE`

---

## 🛠️ Admin Panel

Access Django admin:
- URL: **http://localhost:8000/admin**
- Username: `testuser`
- Password: `testpass123`

Manage users, entries, and more!

---

## 📊 Project Features

✅ User authentication (email/password)
✅ Create journal entries with title, content, mood
✅ View all personal entries (newest first)
✅ Beautiful, responsive UI
✅ Mood emoji support (😊😢😐😰🤩)
✅ No database sending to cloud (local SQLite)
✅ Token-based API authentication

---

## 🚀 Deployment

### To Render.com
1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=your-app.onrender.com
   ```
4. Render will automatically build and deploy!

### Frontend on Vercel/Netlify
Simply upload the `frontend/` folder - it's static files!

---

## 📁 File Structure

```
backend/
├── config/
│   ├── __init__.py
│   ├── settings.py     ← All Django config
│   ├── urls.py         ← URL routing
│   └── wsgi.py         ← WSGI app
├── journal/
│   ├── models.py       ← JournalEntry model
│   ├── views.py        ← API views
│   ├── serializers.py  ← DRF serializers
│   ├── urls.py         ← Journal URLs
│   ├── admin.py        ← Admin config
│   ├── apps.py
│   ├── __init__.py
│   └── migrations/
├── manage.py
├── requirements.txt
├── db.sqlite3          ← Local database (auto-created)
└── .env.example

frontend/
├── index.html          ← Single HTML file
├── app.js              ← All JavaScript logic (~300 lines)
└── styles.css          ← Complete styling
```

---

## ❓ Troubleshooting

### "React app not built" on live site?
- Need to build React? We don't use React anymore!
- Deploy the `frontend/` folder directly

### Backend not running?
```bash
cd backend
source .venv/bin/activate  # Activate virtual environment
python manage.py runserver
```

### Can't connect frontend to backend?
- Make sure backend runs on `localhost:8000`
- Make sure frontend runs on `localhost:8001`
- Check browser console for errors (F12)
- Check `app.js` line 3 for API_URL

### Database issues?
```bash
cd backend
python manage.py migrate
```

---

## 💡 Next Steps

- ✨ Add email notifications
- 🔍 Add search/filter for entries
- 📊 Add statistics dashboard
- 🎨 Add more theme options
- 🔐 Add password reset
- 📱 Add PWA support

---

Happy journaling! ✨📝
