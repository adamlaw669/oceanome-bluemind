@echo off
REM BlueMind Backend Startup Script for Windows

echo 🌊 Starting BlueMind Ocean Restoration Platform Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.9 or higher.
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt --quiet

REM Check if .env file exists
if not exist ".env" (
    echo ⚙️  Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration!
)

REM Start the server
echo.
echo ✅ Starting FastAPI server...
echo 📡 API will be available at: http://localhost:8000
echo 📚 API documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
