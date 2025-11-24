# BlueMind Ocean Restoration Platform - Frontend

## Overview

This is the frontend application for BlueMind, an AI-powered ocean microbiome monitoring and restoration platform built with Next.js 16, React 19, and TypeScript.

## Features

- 🌊 Real-time ocean microbiome simulations
- 📡 IoT sensor data visualization
- 🤖 AI-powered predictions dashboard
- 🧬 Bio-agent deployment tracking
- 📊 Interactive data visualizations with Recharts
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 🌓 Dark/Light theme support

## Tech Stack

- **Framework**: Next.js 16.0.0
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

3. Update the `NEXT_PUBLIC_API_URL` in `.env.local` with your backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Deployment on Render

### Option 1: Using Render Dashboard

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `bluemind-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://bluemind-backend.onrender.com/api/v1`)
     - `PORT`: 10000 (default, Render will set this)

### Option 2: Using render.yaml

A `render.yaml` file is included in the root of the project for automatic deployment configuration.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── learn/             # Educational content
│   ├── onboarding/        # User onboarding
│   └── action-lab/        # Simulation/Action lab
├── components/            # Reusable React components
│   └── ui/               # Base UI components
├── lib/                   # Utility functions and configs
│   ├── api-client.ts     # API client for backend
│   ├── auth-context.tsx  # Authentication context
│   └── utils.ts          # Helper utilities
├── public/               # Static assets
└── styles/               # Global styles

```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |

## API Integration

The frontend connects to the backend API using the `api-client.ts` module. All API calls are centralized in this file.

Example usage:
```typescript
import { apiClient } from '@/lib/api-client'

// Login
const response = await apiClient.login(email, password)

// Get dashboard stats
const stats = await apiClient.getDashboardStats()
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
