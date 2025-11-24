"""Simulation management endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from app.database import get_db
from app.models import User, Simulation, SimulationHistory, MicrobePopulation
from app.schemas import (
    SimulationCreate,
    SimulationUpdate,
    SimulationResponse,
    SimulationWithHistory,
    PredictionRequest,
    PredictionResponse,
)
from app.core.security import get_current_active_user
from app.core.simulation_engine import create_simulation_engine, EnvironmentalState, PopulationState, OceanSimulationEngine

router = APIRouter(prefix="/simulations", tags=["Simulations"])


@router.post("", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
async def create_simulation(
    sim_data: SimulationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new simulation"""
    
    # Create simulation engine
    engine = create_simulation_engine(
        temperature=sim_data.temperature,
        nutrients=sim_data.nutrients,
        light=sim_data.light,
        salinity=sim_data.salinity,
    )
    
    # Get initial metrics
    state = engine.get_current_state()
    
    # Create database record
    simulation = Simulation(
        user_id=current_user.id,
        name=sim_data.name,
        description=sim_data.description,
        scenario_type=sim_data.scenario_type,
        temperature=sim_data.temperature,
        nutrients=sim_data.nutrients,
        light=sim_data.light,
        salinity=sim_data.salinity,
        phytoplankton=state["populations"]["phytoplankton"],
        zooplankton=state["populations"]["zooplankton"],
        bacteria=state["populations"]["bacteria"],
        carbon_sequestration_rate=state["metrics"]["carbon_sequestration_rate"],
        biodiversity_index=state["metrics"]["biodiversity_index"],
        ecosystem_health_score=state["metrics"]["ecosystem_health_score"],
    )
    
    db.add(simulation)
    await db.commit()
    await db.refresh(simulation)
    
    return simulation


@router.get("", response_model=List[SimulationResponse])
async def get_simulations(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all simulations for current user"""
    
    result = await db.execute(
        select(Simulation)
        .where(Simulation.user_id == current_user.id)
        .order_by(Simulation.created_at.desc())
    )
    simulations = result.scalars().all()
    
    return simulations


@router.get("/{simulation_id}", response_model=SimulationWithHistory)
async def get_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific simulation with history"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Get history
    history_result = await db.execute(
        select(SimulationHistory)
        .where(SimulationHistory.simulation_id == simulation_id)
        .order_by(SimulationHistory.week)
    )
    history = history_result.scalars().all()
    
    return {**simulation.__dict__, "history": history}


@router.put("/{simulation_id}", response_model=SimulationResponse)
async def update_simulation(
    simulation_id: int,
    update_data: SimulationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Update simulation parameters"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Update fields
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(simulation, field, value)
    
    await db.commit()
    await db.refresh(simulation)
    
    return simulation


@router.post("/{simulation_id}/step", response_model=SimulationResponse)
async def step_simulation(
    simulation_id: int,
    weeks: int = 1,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Advance simulation by specified weeks"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Create engine from current state
    env = EnvironmentalState(
        temperature=simulation.temperature,
        nutrients=simulation.nutrients,
        light=simulation.light,
        salinity=simulation.salinity,
        ph=simulation.ph,
        dissolved_oxygen=simulation.dissolved_oxygen,
    )
    pop = PopulationState(
        phytoplankton=simulation.phytoplankton,
        zooplankton=simulation.zooplankton,
        bacteria=simulation.bacteria,
    )
    engine = OceanSimulationEngine(env, pop)
    engine.week = simulation.week
    
    # Run simulation
    engine.step(weeks)
    state = engine.get_current_state()
    
    # Update simulation
    simulation.week = state["week"]
    simulation.temperature = state["environment"]["temperature"]
    simulation.nutrients = state["environment"]["nutrients"]
    simulation.ph = state["environment"]["ph"]
    simulation.dissolved_oxygen = state["environment"]["dissolved_oxygen"]
    simulation.phytoplankton = state["populations"]["phytoplankton"]
    simulation.zooplankton = state["populations"]["zooplankton"]
    simulation.bacteria = state["populations"]["bacteria"]
    simulation.carbon_sequestration_rate = state["metrics"]["carbon_sequestration_rate"]
    simulation.biodiversity_index = state["metrics"]["biodiversity_index"]
    simulation.ecosystem_health_score = state["metrics"]["ecosystem_health_score"]
    
    # Save history
    for hist in engine.history:
        history_entry = SimulationHistory(
            simulation_id=simulation_id,
            week=hist["week"],
            temperature=hist["temperature"],
            nutrients=hist["nutrients"],
            ph=hist["ph"],
            phytoplankton=hist["phytoplankton"],
            zooplankton=hist["zooplankton"],
            bacteria=hist["bacteria"],
            carbon_sequestration=hist["carbon_sequestration"],
            biodiversity_index=hist["biodiversity"],
            ecosystem_health=hist["ecosystem_health"],
        )
        db.add(history_entry)
    
    await db.commit()
    await db.refresh(simulation)
    
    return simulation


@router.post("/{simulation_id}/reset", response_model=SimulationResponse)
async def reset_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Reset simulation to initial state"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Reset to initial values
    simulation.week = 0
    simulation.phytoplankton = 1000
    simulation.zooplankton = 500
    simulation.bacteria = 2000
    
    # Clear history
    await db.execute(
        select(SimulationHistory).where(SimulationHistory.simulation_id == simulation_id)
    )
    
    await db.commit()
    await db.refresh(simulation)
    
    return simulation


@router.delete("/{simulation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a simulation"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    await db.delete(simulation)
    await db.commit()
    
    return None


@router.post("/{simulation_id}/predict", response_model=PredictionResponse)
async def predict_future(
    simulation_id: int,
    weeks_ahead: int = 4,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get AI predictions for future state"""
    
    result = await db.execute(
        select(Simulation).where(
            and_(
                Simulation.id == simulation_id,
                Simulation.user_id == current_user.id
            )
        )
    )
    simulation = result.scalar_one_or_none()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Create engine from current state
    env = EnvironmentalState(
        temperature=simulation.temperature,
        nutrients=simulation.nutrients,
        light=simulation.light,
        salinity=simulation.salinity,
    )
    pop = PopulationState(
        phytoplankton=simulation.phytoplankton,
        zooplankton=simulation.zooplankton,
        bacteria=simulation.bacteria,
    )
    engine = OceanSimulationEngine(env, pop)
    
    # Generate predictions
    predictions = engine.predict_future(weeks_ahead)
    recommendations = engine.generate_recommendations()
    
    return {
        "predicted_phytoplankton": [p["phytoplankton"] for p in predictions],
        "predicted_bacteria": [p["bacteria"] for p in predictions],
        "carbon_sequestration_rate": predictions[-1]["carbon_sequestration"] if predictions else 0,
        "biodiversity_index": predictions[-1]["biodiversity"] if predictions else 0,
        "ecosystem_health_score": predictions[-1]["ecosystem_health"] if predictions else 0,
        "recommendations": recommendations,
    }
