# BlueMind Ocean Restoration Platform

> AI-powered platform for ocean microbiome monitoring and restoration

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![Node](https://img.shields.io/badge/node-18+-green)

## Overview

BlueMind is a comprehensive platform that combines IoT sensors, AI/ML predictions, and digital twin simulations to monitor and restore ocean microbiomes. The platform helps researchers and organizations track carbon sequestration, analyze microbe populations, and make data-driven decisions for ocean health.

### Key Features

-  **Real-time Ocean Simulations** - Digital twin modeling of ocean microbiomes
-  **IoT Sensor Integration** - Live data streaming from ocean monitoring stations
-  **AI-Powered Predictions** - Machine learning models for carbon sequestration forecasting
-  **Bio-agent Tracking** - Monitor and deploy beneficial microorganisms
-  **Interactive Dashboards** - Comprehensive analytics and visualizations
-  **Scientific Tools** - Action lab for experiments and scenario testing
-  **Educational Content** - Learn about ocean microbiomes and restoration

##  Architecture

The platform consists of two main components:

### Frontend
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Context API

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy with SQLite/PostgreSQL
- **Authentication**: JWT tokens
- **Real-time**: WebSockets
- **AI/ML**: NumPy, Pandas, Scikit-learn

## 📁 Project Structure

```
bluemind/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── README.md           # Frontend documentation
│
├── backend/                 # FastAPI backend application
│   ├── app/                # Application code
│   │   ├── api/           # API route handlers
│   │   ├── core/          # Business logic
│   │   ├── main.py        # FastAPI app entry point
│   │   ├── config.py      # Configuration
│   │   └── models.py      # Database models
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
│
├── render.yaml             # Render deployment configuration
├── DEPLOYMENT.md           # Deployment guide
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # This file
```

##  Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.9
- **Git**
- **pnpm** or **npm** (for frontend)
- **pip** (for backend)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bluemind.git
cd bluemind
```

#### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set a secure SECRET_KEY

# Run the backend
python -m app.main
```

Backend will be available at: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

#### 3. Setup Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Create .env.local file
cp .env.example .env.local

# The default API URL should work for local development:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Run the frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

#### 4. Create Your First Account

1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account with email and password
4. Login and explore the platform!

##  Docker Development

Run both services with Docker Compose:

```bash
# Build and start services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

##  Deployment

### Deploy to Render

The easiest way to deploy BlueMind is using Render. We provide comprehensive deployment documentation:

📖 **[Read the complete Deployment Guide](DEPLOYMENT.md)**

### Quick Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will use the included `render.yaml` file

3. **Configure Environment Variables**
   - Set `ALLOWED_ORIGINS` in backend to your frontend URL
   - Set `NEXT_PUBLIC_API_URL` in frontend to your backend URL

4. **Done!** Your app will be live in 5-10 minutes 🎉

For detailed instructions, troubleshooting, and best practices, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📚 Documentation

- **[Frontend Documentation](frontend/README.md)** - Frontend setup, development, and API usage
- **[Backend Documentation](backend/README.md)** - Backend setup, API endpoints, and configuration
- **[Deployment Guide](DEPLOYMENT.md)** - Complete deployment instructions for Render
- **[Getting Started](GETTING_STARTED.md)** - Beginner-friendly guide
- **[Project Summary](PROJECT_SUMMARY.md)** - High-level project overview

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

For production, use your deployed backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

### Backend Environment Variables

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./bluemind.db
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.onrender.com
```

Generate a secure secret key:
```bash
openssl rand -hex 32
```

See `backend/.env.example` for all available options.

##  Testing

### Backend Tests

```bash
cd backend
pytest

# Or use the provided test script
python test_api.py
```

### Frontend Tests

```bash
cd frontend
npm run lint
```

##  API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login-json` - Login
- `GET /api/v1/auth/me` - Get current user

### Simulations
- `GET /api/v1/simulations` - List simulations
- `POST /api/v1/simulations` - Create simulation
- `POST /api/v1/simulations/{id}/step` - Advance simulation
- `POST /api/v1/simulations/{id}/predict` - AI prediction

### Sensors
- `GET /api/v1/sensors/zones` - List sensor zones
- `POST /api/v1/sensors/zones` - Create zone
- `GET /api/v1/sensors/zones/{id}/current` - Current reading

### Dashboard
- `GET /api/v1/dashboard/stats` - Platform statistics

### WebSocket
- `WS /api/v1/ws/sensors/{zone_id}` - Real-time sensor data

See the [API Documentation](http://localhost:8000/docs) for complete details.

##  Tech Stack

### Frontend
- **Framework**: Next.js 16.0.0
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: SQLAlchemy 2.0.23
- **Authentication**: python-jose (JWT)
- **Password Hashing**: Bcrypt
- **WebSockets**: Built-in FastAPI
- **Data Science**: NumPy, Pandas, Scikit-learn
- **Server**: Uvicorn

##  Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Python best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep code DRY (Don't Repeat Yourself)

##  Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 8000 is available
- Verify Python dependencies are installed
- Check `.env` file configuration

**Frontend won't start:**
- Check if port 3000 is available
- Run `npm install` to ensure dependencies are installed
- Verify `.env.local` has correct API URL

**CORS errors:**
- Add your frontend URL to `ALLOWED_ORIGINS` in backend
- Restart the backend after updating

**Database errors:**
- Delete `bluemind.db` and restart (local development only)
- For PostgreSQL, verify connection string

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting tips.

##  Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI models for prediction accuracy
- [ ] Integration with more IoT sensor types
- [ ] Multi-language support
- [ ] Collaborative features for research teams
- [ ] Enhanced data export capabilities
- [ ] 3D visualization of ocean zones

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Ocean conservation researchers and scientists
- Open-source community
- FastAPI and Next.js teams
- All contributors to this project

##  Support

- **Documentation**: Check the docs folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/bluemind/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bluemind/discussions)
- **Email**: support@bluemind.example.com

##  Star Us!

If you find this project useful, please consider giving it a star on GitHub! It helps others discover the project.

---

**Made for the ocean**

*BlueMind - Restoring our oceans, one microbe at a time* 
