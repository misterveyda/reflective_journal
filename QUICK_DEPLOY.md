# ⚡ Quick Deploy to Render

## Prerequisites
- Code pushed to GitHub
- Render.com account

## In 5 Minutes:

### 1. Go to Render Dashboard
https://dashboard.render.com

### 2. Click "New +" → "Web Service"

### 3. Configure:
- **Repository:** Select your reflective_journal repo
- **Name:** `reflective-journal-api`
- **Root Directory:** `backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- **Start Command:** `gunicorn config.wsgi`

### 4. Add Environment Variables:
| Key | Value |
|-----|-------|
| DEBUG | False |
| SECRET_KEY | `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| ALLOWED_HOSTS | `reflective-journal-api.onrender.com` (replace with your URL) |

### 5. Deploy!
- Click "Create Web Service"
- Wait 2-3 minutes
- ✅ App is live!

## After Deployment:

### Create Admin User
1. Go to Render Dashboard → Your Service → Shell
2. Run:
```bash
python manage.py createsuperuser --email admin@example.com --username admin
```

### Access Your App:
- Frontend: `https://reflective-journal-api.onrender.com`
- Admin: `https://reflective-journal-api.onrender.com/admin`

## Done! 🎉

Your Reflective Journal is now live!

---

**See DEPLOY_RENDER.md for full detailed instructions**
