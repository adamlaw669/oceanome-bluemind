"""IoT sensor management endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from app.database import get_db
from app.models import User, SensorZone, SensorReading
from app.schemas import (
    SensorZoneCreate,
    SensorZoneResponse,
    SensorZoneWithReadings,
    SensorReadingResponse,
)
from app.core.security import get_current_active_user
from app.core.sensor_simulator import get_sensor_network

router = APIRouter(prefix="/sensors", tags=["Sensors"])


@router.post("/zones", response_model=SensorZoneResponse, status_code=status.HTTP_201_CREATED)
async def create_sensor_zone(
    zone_data: SensorZoneCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new sensor zone"""
    
    # Create database record
    zone = SensorZone(
        user_id=current_user.id,
        name=zone_data.name,
        location=zone_data.location,
        latitude=zone_data.latitude,
        longitude=zone_data.longitude,
        depth=zone_data.depth,
    )
    
    db.add(zone)
    await db.commit()
    await db.refresh(zone)
    
    # Add to sensor network
    sensor_network = get_sensor_network()
    sensor_network.add_buoy(
        zone_id=zone.id,
        name=zone.name,
        latitude=zone.latitude,
        longitude=zone.longitude,
        depth=zone.depth,
    )
    
    return zone


@router.get("/zones", response_model=List[SensorZoneResponse])
async def get_sensor_zones(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all sensor zones for current user"""
    
    result = await db.execute(
        select(SensorZone)
        .where(SensorZone.user_id == current_user.id)
        .order_by(SensorZone.created_at.desc())
    )
    zones = result.scalars().all()
    
    return zones


@router.get("/zones/{zone_id}", response_model=SensorZoneWithReadings)
async def get_sensor_zone(
    zone_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific sensor zone with recent readings"""
    
    result = await db.execute(
        select(SensorZone).where(
            and_(
                SensorZone.id == zone_id,
                SensorZone.user_id == current_user.id
            )
        )
    )
    zone = result.scalar_one_or_none()
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor zone not found"
        )
    
    # Get recent readings (last 24 hours)
    readings_result = await db.execute(
        select(SensorReading)
        .where(SensorReading.zone_id == zone_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(100)
    )
    readings = readings_result.scalars().all()
    
    return {**zone.__dict__, "recent_readings": readings}


@router.get("/zones/{zone_id}/current")
async def get_current_reading(
    zone_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current sensor reading from the zone"""
    
    result = await db.execute(
        select(SensorZone).where(
            and_(
                SensorZone.id == zone_id,
                SensorZone.user_id == current_user.id
            )
        )
    )
    zone = result.scalar_one_or_none()
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor zone not found"
        )
    
    # Get from sensor network
    sensor_network = get_sensor_network()
    buoy = sensor_network.get_buoy(zone_id)
    
    if not buoy:
        # Create buoy if it doesn't exist
        buoy = sensor_network.add_buoy(
            zone_id=zone.id,
            name=zone.name,
            latitude=zone.latitude,
            longitude=zone.longitude,
            depth=zone.depth,
        )
    
    reading = buoy.get_current_reading()
    
    # Save to database
    db_reading = SensorReading(
        zone_id=zone_id,
        temperature=reading["temperature"],
        salinity=reading["salinity"],
        ph=reading["ph"],
        dissolved_oxygen=reading["dissolved_oxygen"],
        turbidity=reading["turbidity"],
        nitrate=reading["nitrate"],
        phosphate=reading["phosphate"],
        silicate=reading["silicate"],
        phytoplankton_count=reading["phytoplankton_count"],
        bacteria_count=reading["bacteria_count"],
    )
    db.add(db_reading)
    
    # Update zone
    zone.temperature = reading["temperature"]
    zone.salinity = reading["salinity"]
    zone.ph = reading["ph"]
    zone.dissolved_oxygen = reading["dissolved_oxygen"]
    zone.turbidity = reading["turbidity"]
    zone.last_reading = reading["timestamp"]
    
    await db.commit()
    
    return reading


@router.delete("/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sensor_zone(
    zone_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a sensor zone"""
    
    result = await db.execute(
        select(SensorZone).where(
            and_(
                SensorZone.id == zone_id,
                SensorZone.user_id == current_user.id
            )
        )
    )
    zone = result.scalar_one_or_none()
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor zone not found"
        )
    
    # Remove from sensor network
    sensor_network = get_sensor_network()
    sensor_network.remove_buoy(zone_id)
    
    await db.delete(zone)
    await db.commit()
    
    return None


@router.post("/zones/{zone_id}/simulate-event")
async def simulate_event(
    zone_id: int,
    event_type: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Simulate an environmental event at the sensor zone"""
    
    result = await db.execute(
        select(SensorZone).where(
            and_(
                SensorZone.id == zone_id,
                SensorZone.user_id == current_user.id
            )
        )
    )
    zone = result.scalar_one_or_none()
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor zone not found"
        )
    
    # Get buoy
    sensor_network = get_sensor_network()
    buoy = sensor_network.get_buoy(zone_id)
    
    if not buoy:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor not initialized"
        )
    
    # Simulate event
    valid_events = ["algal_bloom", "upwelling", "storm", "pollution"]
    if event_type not in valid_events:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid event type. Must be one of: {', '.join(valid_events)}"
        )
    
    reading = buoy.simulate_event(event_type)
    
    return reading
