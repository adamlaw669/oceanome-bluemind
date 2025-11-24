# BlueMind Ocean Restoration Platform - Backend

## Overview

This is the backend API for BlueMind, an AI-powered ocean microbiome monitoring and restoration platform built with FastAPI, Python, and SQLAlchemy.

## Features

- 🔐 JWT-based authentication and authorization
- 🌊 Real-time ocean microbiome simulations
- 📡 IoT sensor data streaming via WebSockets
- 🤖 AI-powered predictions for carbon sequestration
- 🧬 Bio-agent deployment tracking
- 📊 Digital twin simulations
- 🔬 Microbe population analytics
- 📈 RESTful API with automatic OpenAPI documentation

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: SQLAlchemy 2.0.23 with SQLite/PostgreSQL support
- **Authentication**: JWT with python-jose
- **Password Hashing**: Bcrypt
- **WebSockets**: Built-in FastAPI WebSocket support
- **Data Science**: NumPy, Pandas, Scikit-learn
- **Server**: Uvicorn with async support

## Getting Started

### Prerequisites

- Python >= 3.9
- pip or poetry

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./bluemind.db
```

### Development

Run the development server:

```bash
# Using Python directly
python -m app.main

# Or using Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### Testing

Run tests:

```bash
pytest
```

Run test with the provided test script:

```bash
python test_api.py
```

## Deployment on Render

### Prerequisites

1. A Render account
2. A GitHub repository with your code
3. A PostgreSQL database (recommended for production)

### Option 1: Using Render Dashboard

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `bluemind-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `./start_render.sh` or `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Add Environment Variables:
   - `SECRET_KEY`: A secure random string (generate with: `openssl rand -hex 32`)
   - `DEBUG`: `False`
   - `ENVIRONMENT`: `production`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://bluemind-frontend.onrender.com`)
   - `PORT`: 10000 (Render will set this automatically)

### Option 2: Using render.yaml

A `render.yaml` file is included in the root of the project for automatic deployment configuration.

### Setting up PostgreSQL on Render

1. Create a new **PostgreSQL** database on Render
2. Copy the **Internal Database URL**
3. Add it as `DATABASE_URL` environment variable to your web service
4. Make sure to use the async PostgreSQL driver format:
   ```
   postgresql+asyncpg://user:password@host:5432/dbname
   ```

### Database Migrations

For production with PostgreSQL, you may want to set up Alembic migrations:

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database setup and session management
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── api/                 # API route handlers
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── simulations.py   # Simulation endpoints
│   │   ├── sensors.py       # Sensor data endpoints
│   │   ├── dashboard.py     # Dashboard stats endpoints
│   │   └── websockets.py    # WebSocket endpoints
│   └── core/                # Core business logic
│       ├── security.py      # Security utilities
│       ├── simulation_engine.py  # Simulation logic
│       └── sensor_simulator.py   # Sensor data generation
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── Dockerfile              # Docker configuration
├── start.sh                # Local startup script
├── start_render.sh         # Render startup script
└── test_api.py             # API tests
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create a new user account
- `POST /api/v1/auth/login` - Login (form data)
- `POST /api/v1/auth/login-json` - Login (JSON)
- `GET /api/v1/auth/me` - Get current user info

### Simulations
- `GET /api/v1/simulations` - List all simulations
- `POST /api/v1/simulations` - Create a new simulation
- `GET /api/v1/simulations/{id}` - Get simulation details
- `PUT /api/v1/simulations/{id}` - Update simulation parameters
- `DELETE /api/v1/simulations/{id}` - Delete simulation
- `POST /api/v1/simulations/{id}/step` - Advance simulation by time steps
- `POST /api/v1/simulations/{id}/reset` - Reset simulation
- `POST /api/v1/simulations/{id}/predict` - AI prediction for future state

### Sensors
- `GET /api/v1/sensors/zones` - List all sensor zones
- `POST /api/v1/sensors/zones` - Create a new sensor zone
- `GET /api/v1/sensors/zones/{id}` - Get zone details
- `DELETE /api/v1/sensors/zones/{id}` - Delete zone
- `GET /api/v1/sensors/zones/{id}/current` - Get current sensor reading
- `POST /api/v1/sensors/zones/{id}/simulate-event` - Simulate an environmental event

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### WebSocket
- `WS /api/v1/ws/sensors/{zone_id}` - Real-time sensor data stream

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_NAME` | Application name | BlueMind Ocean Restoration API | No |
| `ENVIRONMENT` | Environment (development/production) | development | No |
| `DEBUG` | Enable debug mode | False | No |
| `SECRET_KEY` | JWT secret key | - | Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 30 | No |
| `DATABASE_URL` | Database connection string | sqlite+aiosqlite:///./bluemind.db | No |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | localhost:3000 | Yes |
| `ENABLE_AI_PREDICTIONS` | Enable AI predictions | True | No |
| `MODEL_UPDATE_INTERVAL` | Model update interval (seconds) | 300 | No |
| `SENSOR_UPDATE_INTERVAL` | Sensor update interval (seconds) | 5 | No |
| `ENABLE_SENSOR_SIMULATION` | Enable sensor simulation | True | No |
| `PORT` | Server port | 8000 | No |
| `HOST` | Server host | 0.0.0.0 | No |

## Security

### Generating a Secret Key

Generate a secure secret key for production:

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### CORS Configuration

Update `ALLOWED_ORIGINS` in your `.env` file to include your frontend URL:

```env
ALLOWED_ORIGINS=https://your-frontend.onrender.com,http://localhost:3000
```

## Database

### SQLite (Development)

By default, the application uses SQLite for local development:

```env
DATABASE_URL=sqlite+aiosqlite:///./bluemind.db
```

### PostgreSQL (Production - Recommended)

For production, use PostgreSQL with the async driver:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
```

## Monitoring and Logging

The application includes:
- Health check endpoint: `GET /health`
- Root endpoint: `GET /`
- Automatic request logging
- Error handling with detailed error messages

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:
1. Verify your `DATABASE_URL` is correct
2. For PostgreSQL, ensure the database exists
3. Check network connectivity to the database

### CORS Errors

If you encounter CORS errors:
1. Add your frontend URL to `ALLOWED_ORIGINS`
2. Ensure the URL includes the protocol (http:// or https://)
3. Restart the server after updating environment variables

### Port Already in Use

If port 8000 is already in use:
```bash
# Find the process using the port
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=8001 uvicorn app.main:app
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
