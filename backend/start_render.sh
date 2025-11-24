#!/bin/bash
# Render startup script for BlueMind Backend

echo "🌊 Starting BlueMind Ocean Restoration Platform API..."

# Run database migrations if needed (when we add Alembic)
# alembic upgrade head

# Start the application with Uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
