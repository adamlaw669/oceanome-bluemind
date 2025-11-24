"""Dashboard and statistics endpoints"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import User, Simulation, SensorZone
from app.schemas import DashboardStats
from app.core.security import get_current_active_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get dashboard statistics for current user"""
    
    # Count simulations
    sim_result = await db.execute(
        select(func.count(Simulation.id)).where(Simulation.user_id == current_user.id)
    )
    total_simulations = sim_result.scalar_one()
    
    # Count active sensors
    sensor_result = await db.execute(
        select(func.count(SensorZone.id)).where(
            SensorZone.user_id == current_user.id,
            SensorZone.is_active == True
        )
    )
    active_sensors = sensor_result.scalar_one()
    
    # Calculate total carbon sequestered
    carbon_result = await db.execute(
        select(func.sum(Simulation.carbon_sequestration_rate)).where(
            Simulation.user_id == current_user.id
        )
    )
    total_carbon = carbon_result.scalar_one() or 0.0
    
    # Calculate average ecosystem health
    health_result = await db.execute(
        select(func.avg(Simulation.ecosystem_health_score)).where(
            Simulation.user_id == current_user.id
        )
    )
    avg_health = health_result.scalar_one() or 0.0
    
    # Count total microbe populations
    microbe_result = await db.execute(
        select(Simulation).where(Simulation.user_id == current_user.id)
    )
    simulations = microbe_result.scalars().all()
    total_microbes = sum(
        sim.phytoplankton + sim.zooplankton + sim.bacteria
        for sim in simulations
    )
    
    return {
        "total_simulations": total_simulations,
        "active_sensors": active_sensors,
        "total_carbon_sequestered": round(total_carbon, 2),
        "average_ecosystem_health": round(avg_health, 1),
        "total_microbe_populations": int(total_microbes),
    }
