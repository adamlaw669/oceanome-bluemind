"""Pydantic schemas for request/response validation"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime


# ============ Auth Schemas ============

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(min_length=6)
    name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data"""
    email: Optional[str] = None


class UserResponse(BaseModel):
    """User data response"""
    id: int
    email: str
    name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Simulation Schemas ============

class SimulationCreate(BaseModel):
    """Create new simulation"""
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    scenario_type: Optional[str] = None
    temperature: float = Field(default=20.0, ge=0, le=35)
    nutrients: float = Field(default=50.0, ge=0, le=100)
    light: float = Field(default=75.0, ge=0, le=100)
    salinity: float = Field(default=35.0, ge=30, le=40)


class SimulationUpdate(BaseModel):
    """Update simulation parameters"""
    name: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0, le=35)
    nutrients: Optional[float] = Field(None, ge=0, le=100)
    light: Optional[float] = Field(None, ge=0, le=100)
    salinity: Optional[float] = Field(None, ge=30, le=40)


class SimulationHistoryResponse(BaseModel):
    """Simulation history data point"""
    week: int
    temperature: float
    nutrients: float
    phytoplankton: float
    zooplankton: float
    bacteria: float
    carbon_sequestration: float
    biodiversity_index: float
    ecosystem_health: float
    
    class Config:
        from_attributes = True


class SimulationResponse(BaseModel):
    """Simulation data response"""
    id: int
    name: str
    description: Optional[str]
    scenario_type: Optional[str]
    temperature: float
    nutrients: float
    light: float
    salinity: float
    week: int
    phytoplankton: float
    zooplankton: float
    bacteria: float
    carbon_sequestration_rate: float
    biodiversity_index: float
    ecosystem_health_score: float
    is_running: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SimulationWithHistory(SimulationResponse):
    """Simulation with historical data"""
    history: List[SimulationHistoryResponse] = []


# ============ Sensor Schemas ============

class SensorZoneCreate(BaseModel):
    """Create new sensor zone"""
    name: str = Field(min_length=1, max_length=200)
    location: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    depth: float = Field(default=0.0, ge=0)


class SensorReadingResponse(BaseModel):
    """Sensor reading data"""
    temperature: float
    salinity: float
    ph: float
    dissolved_oxygen: float
    turbidity: float
    nitrate: float
    phosphate: float
    silicate: float
    phytoplankton_count: float
    bacteria_count: float
    timestamp: datetime
    
    class Config:
        from_attributes = True


class SensorZoneResponse(BaseModel):
    """Sensor zone data"""
    id: int
    name: str
    location: str
    latitude: float
    longitude: float
    depth: float
    temperature: float
    salinity: float
    ph: float
    dissolved_oxygen: float
    turbidity: float
    is_active: bool
    last_reading: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class SensorZoneWithReadings(SensorZoneResponse):
    """Sensor zone with recent readings"""
    recent_readings: List[SensorReadingResponse] = []


# ============ AI Prediction Schemas ============

class PredictionRequest(BaseModel):
    """Request for AI predictions"""
    temperature: float
    nutrients: float
    light: float
    salinity: float
    current_phytoplankton: float
    current_bacteria: float
    weeks_ahead: int = Field(default=4, ge=1, le=52)


class PredictionResponse(BaseModel):
    """AI prediction results"""
    predicted_phytoplankton: List[float]
    predicted_bacteria: List[float]
    carbon_sequestration_rate: float
    biodiversity_index: float
    ecosystem_health_score: float
    recommendations: List[str]


# ============ Microbe Schemas ============

class MicrobePopulationResponse(BaseModel):
    """Microbe population data"""
    microbe_id: str
    microbe_name: str
    population: float
    growth_rate: float
    
    class Config:
        from_attributes = True


# ============ Bio-Agent Schemas ============

class BioAgentCreate(BaseModel):
    """Create bio-agent"""
    name: str
    scientific_name: Optional[str] = None
    description: Optional[str] = None
    carbon_sequestration_rate: float = 0.0
    optimal_temperature: float = 20.0
    optimal_salinity: float = 35.0


class BioAgentResponse(BaseModel):
    """Bio-agent data"""
    id: int
    name: str
    scientific_name: Optional[str]
    description: Optional[str]
    carbon_sequestration_rate: float
    optimal_temperature: float
    optimal_salinity: float
    safety_level: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Dashboard Schemas ============

class DashboardStats(BaseModel):
    """Dashboard statistics"""
    total_simulations: int
    active_sensors: int
    total_carbon_sequestered: float  # kg CO2
    average_ecosystem_health: float
    total_microbe_populations: int
