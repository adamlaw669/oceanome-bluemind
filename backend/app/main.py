"""Main FastAPI application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.api import auth, simulations, sensors, dashboard, websockets


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🌊 Starting BlueMind Ocean Restoration Platform...")
    await init_db()
    print("✅ Database initialized")
    print(f"🚀 Server running at http://localhost:8000")
    print(f"📚 API documentation at http://localhost:8000/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down BlueMind platform...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    # BlueMind Ocean Restoration Platform API
    
    AI-powered platform for ocean microbiome monitoring and restoration.
    
    ## Features
    - 🌊 Real-time ocean microbiome simulations
    - 📡 IoT sensor data streaming
    - 🤖 AI-powered predictions for carbon sequestration
    - 🧬 Bio-agent deployment tracking
    - 📊 Digital twin simulations
    - 🔬 Microbe population analytics
    
    ## Getting Started
    1. Create an account via `/api/v1/auth/signup`
    2. Login to get your access token
    3. Use the token for all authenticated endpoints
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
api_prefix = f"/api/{settings.API_VERSION}"

app.include_router(auth.router, prefix=api_prefix)
app.include_router(simulations.router, prefix=api_prefix)
app.include_router(sensors.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)
app.include_router(websockets.router, prefix=api_prefix)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to BlueMind Ocean Restoration Platform API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "healthy",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "BlueMind API",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
