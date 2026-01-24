# 🚀 Deploy Reflective Journal to Render.com

## Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account
- ✅ Render.com account (free tier works!)
- ✅ Code pushed to GitHub
- ✅ Backend and frontend ready

---

## Step 1: Push Code to GitHub

If you haven't already:

```bash
cd /workspaces/reflective_journal

# Initialize git (skip if already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Django backend + vanilla frontend"

# Add remote and push (replace USERNAME/REPO)
git remote add origin https://github.com/YOUR_USERNAME/reflective_journal.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Allow Render to access your repos

---

## Step 3: Create Production Files

### A. Create `backend/Procfile`

```
web: gunicorn config.wsgi
```

### B. Create `backend/runtime.txt`

```
python-3.12.1
```

### C. Update `backend/config/settings.py`

Find the `ALLOWED_HOSTS` section and update it:

```python
ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=lambda v: [s.strip() for s in v.split(',')]
)
```

This will read from environment variables on Render.

### D. Create `backend/staticfiles/.gitkeep`

```bash
mkdir -p backend/staticfiles
touch backend/staticfiles/.gitkeep
```

---

## Step 4: Deploy Backend on Render

### 1. Create Web Service

- Go to https://dashboard.render.com
- Click **"New +"** → **"Web Service"**
- Select your repository
- Select the **main** branch

### 2. Configure Deployment

**Name:** `reflective-journal-api`

**Root Directory:** `backend` (important!)

**Runtime:** `Python 3`

**Build Command:**
```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

**Start Command:**
```bash
gunicorn config.wsgi
```

### 3. Set Environment Variables

Click **"Environment"** and add:

| Key | Value |
|-----|-------|
| `DEBUG` | `False` |
| `SECRET_KEY` | Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `ALLOWED_HOSTS` | `reflective-journal-api.onrender.com` (use your actual URL) |
| `DATABASE_URL` | (Optional - Render provides one) |

### 4. Deploy

- Click **"Create Web Service"**
- Wait for build to complete (2-3 minutes)
- Get your backend URL: `https://reflective-journal-api.onrender.com`

---

## Step 5: Deploy Frontend

### Option A: Serve Frontend from Django (Easiest)

#### Build the frontend as static files:

```bash
cd frontend
# No build needed! Just copy files to Django static folder
```

#### Update Django to serve frontend:

Edit `backend/config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('journal.urls')),
]

# Serve frontend
if not settings.DEBUG:
    # In production, serve the index.html for frontend routes
    urlpatterns += [
        path('', TemplateView.as_view(template_name='index.html')),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

#### Copy frontend files to backend templates:

```bash
# Create template directory
mkdir -p backend/templates

# Copy frontend files
cp frontend/index.html backend/templates/
cp frontend/styles.css backend/static/
cp frontend/app.js backend/static/
```

#### Update `backend/config/settings.py`:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Add this
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Update `STATIC_URL` and add `STATIC_ROOT`:

```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# For frontend files
TEMPLATES_DIRS = [BASE_DIR / 'templates']
```

Also update CORS to allow your Render domain:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "https://reflective-journal-api.onrender.com",  # Add this
]
```

And update frontend to use the backend URL:

Edit `frontend/app.js` line 3:

```javascript
// Get backend URL from environment or use current host
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : window.location.origin;
```

#### Commit and push:

```bash
git add .
git commit -m "Add frontend static files and Django template serving"
git push
```

Render will auto-redeploy!

---

### Option B: Deploy Frontend Separately (Advanced)

#### Deploy to Vercel:

1. Go to https://vercel.com
2. Import your repository
3. Set root directory to `frontend`
4. No build command needed
5. Deploy!

#### Update frontend to use backend API:

Edit `frontend/app.js` line 3:

```javascript
const API_URL = 'https://reflective-journal-api.onrender.com';
```

---

## Step 6: Create Superuser on Render

Once deployed, create a superuser:

### Option A: Via Render Shell

1. Go to your service on Render dashboard
2. Click **"Shell"** tab
3. Run:

```bash
python manage.py createsuperuser --email admin@example.com --username admin
# Set a strong password
```

### Option B: Via Django API

Register a new user through the frontend signup form!

---

## Step 7: Verify Deployment

### Test Backend
```bash
curl https://reflective-journal-api.onrender.com/admin/
```

You should see the Django admin login page.

### Test Frontend
```bash
# If served from Django:
curl https://reflective-journal-api.onrender.com/
```

You should see the HTML with your journal app.

### Test API
```bash
curl https://reflective-journal-api.onrender.com/api/entries/
```

Should return `{"detail":"Authentication credentials were not provided."}` (which is correct!)

---

## Step 8: Access Your App

### Login
Visit: `https://reflective-journal-api.onrender.com`

Create a new account or use the superuser credentials you set up.

### Admin Panel
Visit: `https://reflective-journal-api.onrender.com/admin/`

---

## 🔧 Troubleshooting

### Build Fails: "ModuleNotFoundError"
- Check `requirements.txt` in backend folder
- Make sure all imports are listed
- Rebuild and check logs

### "ALLOWED_HOSTS" Error
- Go to Render dashboard
- Get your actual service URL
- Update ALLOWED_HOSTS environment variable

### Database Issues
- Migrations run automatically in build command
- Check logs: Render Dashboard → Logs tab
- Run migrations manually via shell if needed

### Static Files Not Loading
- Make sure `collectstatic` runs in build command
- Check `STATIC_ROOT` and `STATIC_URL` in settings
- Render will serve files from `staticfiles/` directory

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` in settings.py
- Add your Render domain
- Redeploy

### Frontend Shows API Errors
- Check `API_URL` in `frontend/app.js`
- Should be `https://your-service.onrender.com`
- Check browser console (F12) for error messages

---

## 📊 Environment Variables Checklist

| Variable | Example | Required |
|----------|---------|----------|
| `DEBUG` | `False` | ✅ |
| `SECRET_KEY` | Long random string | ✅ |
| `ALLOWED_HOSTS` | `your-app.onrender.com` | ✅ |
| `DATABASE_URL` | Auto-provided | ❌ (uses SQLite if not set) |

---

## 💡 Pro Tips

### 1. Use Render Environment Groups
Create different settings for staging vs production.

### 2. Enable Auto-Deploy
Render auto-deploys when you push to main branch.

### 3. Monitor Logs
Always check the Logs tab if something breaks.

### 4. Free Plan Limits
- Services spin down after 15 minutes of inactivity
- Restart when accessed again
- Perfect for testing

### 5. Upgrade to Paid
- Get always-on service
- Better performance
- Starts at $7/month

---

## 🚀 Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend accessible
- [ ] Can signup/login
- [ ] Can create entries
- [ ] Can view entries
- [ ] Admin panel working
- [ ] Database persisting entries
- [ ] No CORS errors
- [ ] Domain configured
- [ ] Custom domain setup (optional)

---

## 📝 Quick Deploy Command

```bash
# From project root
cd reflective_journal
git add .
git commit -m "Ready for deployment"
git push origin main

# Then watch Render dashboard for auto-deploy
```

---

## 🎯 Your Live App

Once deployed, you'll have:

```
Frontend: https://reflective-journal-api.onrender.com
Admin:    https://reflective-journal-api.onrender.com/admin
API:      https://reflective-journal-api.onrender.com/api/
```

(Replace `reflective-journal-api` with your actual service name)

---

## 🆘 Need Help?

1. Check Render logs: Dashboard → Logs tab
2. Check browser console: F12 → Console tab
3. Check Django logs: Render Shell → run commands
4. Check network requests: F12 → Network tab

---

**Happy deploying! Your app will be live in minutes! 🎉**
