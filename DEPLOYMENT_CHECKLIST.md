# ✅ Deployment Checklist - Reflective Journal

## Before Deploying

### Code Ready
- [x] Backend in `/backend` folder
- [x] Frontend files in `backend/templates` and `backend/static`
- [x] `Procfile` created
- [x] `runtime.txt` created
- [x] `requirements.txt` with all dependencies
- [x] `settings.py` configured for production

### GitHub Ready
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Repository is public or Render has access

## Deployment Steps

### Step 1: Create Web Service (3 mins)
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Select repository
- [ ] Choose main branch

### Step 2: Configure Service (2 mins)
- [ ] Set Name: `reflective-journal-api`
- [ ] Set Root Directory: `backend`
- [ ] Set Runtime: `Python 3`
- [ ] Set Build Command:
  ```
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- [ ] Set Start Command:
  ```
  gunicorn config.wsgi
  ```

### Step 3: Environment Variables (2 mins)
- [ ] Add `DEBUG` = `False`
- [ ] Add `SECRET_KEY` = (generate from script below)
- [ ] Add `ALLOWED_HOSTS` = `your-service.onrender.com`

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 4: Deploy (2-3 mins)
- [ ] Click "Create Web Service"
- [ ] Monitor build in Logs tab
- [ ] Wait for "Build started" → "Build successful"
- [ ] Service is now live!

### Step 5: Post-Deployment (2 mins)
- [ ] Go to Shell tab
- [ ] Create superuser:
  ```bash
  python manage.py createsuperuser --email admin@example.com --username admin
  ```
- [ ] Test frontend: Visit your service URL
- [ ] Test admin: Visit `/admin/`

## Testing Checklist

### Frontend
- [ ] Login page loads
- [ ] Can signup with new account
- [ ] Can login with existing account
- [ ] Can create journal entry
- [ ] Moods display correctly
- [ ] Entries list shows all entries
- [ ] Responsive on mobile

### Backend
- [ ] API responds to requests
- [ ] Admin panel works
- [ ] Database persists entries
- [ ] No CORS errors in console
- [ ] No 500 errors

### Integration
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] Entries sync correctly
- [ ] Logout works properly

## Troubleshooting

### If build fails:
- [ ] Check Build logs for errors
- [ ] Verify `requirements.txt` exists
- [ ] Check syntax in `settings.py`
- [ ] Verify all imports are available

### If app shows blank page:
- [ ] Check browser console (F12)
- [ ] Verify API_URL in `app.js` is correct
- [ ] Check Network tab for 404/500 errors
- [ ] Check Render logs for backend errors

### If can't login:
- [ ] Verify database migrated (check Logs)
- [ ] Verify superuser created
- [ ] Check API endpoint is responding
- [ ] Verify CORS settings in `settings.py`

### If static files don't load:
- [ ] Verify `collectstatic` ran in build
- [ ] Check `STATIC_ROOT` in settings
- [ ] Verify files in `backend/static/`
- [ ] Check Render build logs

## Post-Launch

### Optional: Custom Domain
1. Go to Service Settings
2. Click "Custom Domain"
3. Add your domain
4. Follow DNS instructions

### Optional: Auto-deploy
- [ ] Already enabled by default
- [ ] Push to main → auto-deploys
- [ ] Takes 2-3 minutes

### Monitoring
- [ ] Check Logs regularly
- [ ] Monitor for errors
- [ ] Track uptime

## Success Criteria

✅ App is live on Render domain
✅ Frontend loads without errors
✅ Can signup and login
✅ Can create and view entries
✅ Admin panel is accessible
✅ Mobile responsive
✅ No console errors
✅ Database persists data

## Live URLs

Once deployed:
- **App:** `https://reflective-journal-api.onrender.com`
- **Admin:** `https://reflective-journal-api.onrender.com/admin`
- **API:** `https://reflective-journal-api.onrender.com/api/entries/`

---

## Quick Commands Reference

```bash
# Generate secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Check local build
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver

# Via Render Shell
python manage.py createsuperuser
python manage.py shell
python manage.py migrate
```

---

**Estimated Total Time: 10-15 minutes** ⏱️

Happy deploying! 🚀
