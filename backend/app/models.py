"""Database models for BlueMind platform"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    """User account model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    simulations = relationship("Simulation", back_populates="user")
    sensor_zones = relationship("SensorZone", back_populates="user")


class Simulation(Base):
    """Ocean microbiome simulation model"""
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    scenario_type = Column(String, nullable=True)  # preset scenario
    
    # Environmental parameters
    temperature = Column(Float, default=20.0)
    nutrients = Column(Float, default=50.0)
    light = Column(Float, default=75.0)
    salinity = Column(Float, default=35.0)
    ph = Column(Float, default=8.1)
    dissolved_oxygen = Column(Float, default=8.0)
    
    # Simulation state
    week = Column(Integer, default=0)
    phytoplankton = Column(Float, default=1000.0)
    zooplankton = Column(Float, default=500.0)
    bacteria = Column(Float, default=2000.0)
    
    # AI predictions
    carbon_sequestration_rate = Column(Float, default=0.0)  # kg CO2/day
    biodiversity_index = Column(Float, default=0.5)
    ecosystem_health_score = Column(Float, default=75.0)
    
    # Metadata
    is_running = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="simulations")
    history = relationship("SimulationHistory", back_populates="simulation", cascade="all, delete-orphan")
    microbe_populations = relationship("MicrobePopulation", back_populates="simulation", cascade="all, delete-orphan")


class SimulationHistory(Base):
    """Historical snapshots of simulation state"""
    __tablename__ = "simulation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"))
    week = Column(Integer, nullable=False)
    
    # Environmental data
    temperature = Column(Float)
    nutrients = Column(Float)
    light = Column(Float)
    ph = Column(Float)
    
    # Population data
    phytoplankton = Column(Float)
    zooplankton = Column(Float)
    bacteria = Column(Float)
    
    # AI metrics
    carbon_sequestration = Column(Float)
    biodiversity_index = Column(Float)
    ecosystem_health = Column(Float)
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    simulation = relationship("Simulation", back_populates="history")


class MicrobePopulation(Base):
    """Specific microbe species populations in a simulation"""
    __tablename__ = "microbe_populations"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"))
    microbe_id = Column(String, nullable=False)  # e.g., "prochlorococcus"
    microbe_name = Column(String, nullable=False)
    population = Column(Float, default=0.0)
    growth_rate = Column(Float, default=0.0)
    
    # Relationships
    simulation = relationship("Simulation", back_populates="microbe_populations")


class SensorZone(Base):
    """IoT sensor zones for real ocean monitoring"""
    __tablename__ = "sensor_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)  # e.g., "Pacific Ocean, 35.5°N, 139.7°E"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    depth = Column(Float, default=0.0)  # meters
    
    # Current readings
    temperature = Column(Float, default=20.0)
    salinity = Column(Float, default=35.0)
    ph = Column(Float, default=8.1)
    dissolved_oxygen = Column(Float, default=8.0)
    turbidity = Column(Float, default=1.0)
    
    # Status
    is_active = Column(Boolean, default=True)
    last_reading = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="sensor_zones")
    sensor_readings = relationship("SensorReading", back_populates="zone", cascade="all, delete-orphan")


class SensorReading(Base):
    """Time-series sensor data"""
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("sensor_zones.id"))
    
    # Environmental readings
    temperature = Column(Float)
    salinity = Column(Float)
    ph = Column(Float)
    dissolved_oxygen = Column(Float)
    turbidity = Column(Float)
    
    # Nutrient levels (mg/L)
    nitrate = Column(Float, default=0.0)
    phosphate = Column(Float, default=0.0)
    silicate = Column(Float, default=0.0)
    
    # Microbiome data (cells/mL)
    phytoplankton_count = Column(Float, default=0.0)
    bacteria_count = Column(Float, default=0.0)
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    zone = relationship("SensorZone", back_populates="sensor_readings")


class BioAgent(Base):
    """Engineered microbes for deployment"""
    __tablename__ = "bio_agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    scientific_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # Capabilities
    carbon_sequestration_rate = Column(Float, default=0.0)  # kg CO2/day per million cells
    pollutant_degradation = Column(JSON, default=dict)  # {pollutant: rate}
    optimal_temperature = Column(Float, default=20.0)
    optimal_salinity = Column(Float, default=35.0)
    
    # Safety & regulation
    safety_level = Column(String, default="experimental")  # experimental, tested, approved
    risk_assessment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Deployment(Base):
    """Bio-agent deployment tracking"""
    __tablename__ = "deployments"
    
    id = Column(Integer, primary_key=True, index=True)
    bio_agent_id = Column(Integer, ForeignKey("bio_agents.id"))
    zone_id = Column(Integer, ForeignKey("sensor_zones.id"))
    
    quantity = Column(Float, nullable=False)  # million cells
    deployment_date = Column(DateTime, default=datetime.utcnow)
    
    # Monitoring
    status = Column(String, default="active")  # active, monitoring, completed
    effectiveness_score = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
