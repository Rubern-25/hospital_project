@echo off
REM ============================================
REM HPMS Django Backend - Windows Setup Script
REM ============================================
REM
REM PREREQUISITES: You need Python 3.10+ installed.
REM Download from: https://www.python.org/downloads/
REM IMPORTANT: During install, CHECK "Add Python to PATH"
REM
REM HOW TO RUN:
REM   1. Open Command Prompt (cmd) or PowerShell
REM   2. cd into this django_backend folder
REM   3. Run: setup.bat
REM ============================================

echo.
echo ============================================
echo   HPMS - Hospital Management System Setup
echo ============================================
echo.

REM --- Step 1: Check if Python is installed ---
echo [Step 1/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo IMPORTANT: During installation, check the box that says
    echo "Add Python to PATH" at the bottom of the installer.
    echo.
    echo After installing Python, close this window and run setup.bat again.
    echo.
    pause
    exit /b 1
)
python --version
echo Python found!
echo.

REM --- Step 2: Create virtual environment ---
echo [Step 2/6] Creating virtual environment...
if exist "venv" (
    echo Virtual environment already exists, skipping creation.
) else (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment.
        echo Try running: pip install virtualenv
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)
echo.

REM --- Step 3: Activate virtual environment ---
echo [Step 3/6] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment.
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

REM --- Step 4: Install dependencies ---
echo [Step 4/6] Installing Django and dependencies...
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM --- Step 5: Setup database ---
echo [Step 5/6] Setting up database...
python manage.py makemigrations hospital
python manage.py migrate
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed.
    pause
    exit /b 1
)
echo Database created successfully!
echo.

REM --- Step 6: Seed sample data ---
echo [Step 6/6] Adding sample data...
python manage.py seed_data
echo Sample data added!
echo.

REM --- Create admin user ---
echo ============================================
echo   Create Admin Account (for Django Admin Panel)
echo ============================================
echo You will be asked for a username, email, and password.
echo (You can skip this by pressing Ctrl+C, then Y)
echo.
python manage.py createsuperuser

echo.
echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo To START the Django backend server:
echo.
echo   1. Open Command Prompt in this folder
echo   2. Run these commands:
echo.
echo      venv\Scripts\activate
echo      python manage.py runserver
echo.
echo   The API will run at: http://localhost:8000/api/
echo   Admin panel at:      http://localhost:8000/admin/
echo.
echo To START the React frontend:
echo.
echo   1. Open ANOTHER Command Prompt in the project root folder
echo   2. Run these commands:
echo.
echo      npm install
echo      npm run dev
echo.
echo   The frontend will run at: http://localhost:3000
echo.
echo ============================================
echo.
pause
