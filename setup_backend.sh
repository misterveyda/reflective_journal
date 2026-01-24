#!/bin/bash
cd /workspaces/reflective_journal/backend

echo "📦 Creating virtual environment..."
python3 -m venv .venv

echo "📥 Installing requirements..."
./.venv/bin/pip install -q -r requirements.txt

echo "🗂️ Running migrations..."
./.venv/bin/python manage.py migrate

echo "👤 Creating test user..."
./.venv/bin/python manage.py createsuperuser --email test@example.com --username testuser --noinput 2>/dev/null || echo "User already exists"

echo "🔑 Setting password..."
./.venv/bin/python manage.py shell <<EOF
from django.contrib.auth.models import User
u = User.objects.get(username='testuser')
u.set_password('testpass123')
u.save()
print('✓ Password set')
EOF

echo ""
echo "================================================"
echo "✅ BACKEND SETUP COMPLETE!"
echo "================================================"
echo ""
echo "To start the backend server:"
echo "  cd backend && ./.venv/bin/python manage.py runserver"
echo ""
