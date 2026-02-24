#!/bin/bash
# ============================================
# HPMS Django Backend - Quick Setup Script
# ============================================
# Run this script from the django_backend/ directory:
#   chmod +x setup.sh && ./setup.sh

echo "=== HPMS Django Backend Setup ==="

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations hospital
python manage.py migrate

# Seed sample data
echo "Seeding sample data..."
python manage.py seed_data

# Create superuser
echo ""
echo "Creating admin superuser..."
echo "  (Enter your desired username, email, and password)"
python manage.py createsuperuser

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To start the Django server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Then set NEXT_PUBLIC_USE_LIVE_API=true in your React frontend .env.local"
echo "The API will be available at: http://localhost:8000/api/"
echo "Django Admin panel at: http://localhost:8000/admin/"
