#!/bin/bash
# Quick setup script - run this to get everything ready!

set -e

echo "🚀 Setting up Reflective Journal..."
echo ""

# Backend setup
echo "📦 Backend Setup..."
cd backend
python3 -m venv .venv
echo "✓ Virtual environment created"

source .venv/bin/activate
pip install -q -r requirements.txt
echo "✓ Requirements installed"

python manage.py migrate
echo "✓ Database migrations done"

python manage.py createsuperuser --email test@example.com --username testuser --noinput 2>/dev/null || true
echo "✓ Test user ready"

python manage.py shell <<EOF
from django.contrib.auth.models import User
u, created = User.objects.get_or_create(username='testuser')
u.set_password('testpass123')
u.save()
if created:
    print("✓ New user created")
else:
    print("✓ User password updated")
EOF

cd ..
echo ""
echo "✅ Backend is ready!"
echo "   Run: cd backend && source .venv/bin/activate && python manage.py runserver"
echo ""

echo "✅ Frontend is ready!"
echo "   Run: cd frontend && python -m http.server 8001"
echo ""

echo "================================================"
echo "🎉 SETUP COMPLETE!"
echo "================================================"
echo ""
echo "1️⃣  Start backend:"
echo "   cd backend && source .venv/bin/activate && python manage.py runserver"
echo ""
echo "2️⃣  Start frontend (in another terminal):"
echo "   cd frontend && python -m http.server 8001"
echo ""
echo "3️⃣  Open browser:"
echo "   http://localhost:8001"
echo ""
echo "4️⃣  Login with:"
echo "   Email: test@example.com"
echo "   Password: testpass123"
echo ""
echo "📚 Read SETUP.md for detailed information"
echo ""
