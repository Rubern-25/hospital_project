@echo off
REM ============================================
REM HPMS - Start Django Backend Server
REM ============================================
REM Run this after setup.bat has been run once.
REM Open Command Prompt in django_backend\ folder and run: run.bat
REM ============================================

echo.
echo Starting HPMS Django Backend...
echo.

call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Virtual environment not found.
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Server starting at http://localhost:8000
echo API available at http://localhost:8000/api/
echo Admin panel at http://localhost:8000/admin/
echo.
echo Press Ctrl+C to stop the server.
echo.

python manage.py runserver
