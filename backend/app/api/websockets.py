"""WebSocket endpoints for real-time data streaming"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Set
import asyncio
import json

from app.database import get_db
from app.core.sensor_simulator import get_sensor_network
from app.config import settings

router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        self.active_connections.discard(websocket)
    
    async def broadcast(self, message: Dict):
        """Broadcast message to all connected clients"""
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                disconnected.add(connection)
        
        # Remove disconnected clients
        for conn in disconnected:
            self.disconnect(conn)


manager = ConnectionManager()


@router.websocket("/ws/sensors/{zone_id}")
async def sensor_stream(websocket: WebSocket, zone_id: int):
    """Stream real-time sensor data for a specific zone"""
    await manager.connect(websocket)
    
    try:
        sensor_network = get_sensor_network()
        buoy = sensor_network.get_buoy(zone_id)
        
        if not buoy:
            await websocket.send_json({
                "error": "Sensor not found or not initialized"
            })
            await websocket.close()
            return
        
        # Stream data at regular intervals
        while True:
            reading = buoy.get_current_reading()
            await websocket.send_json({
                "type": "sensor_reading",
                "data": {
                    "zone_id": reading["zone_id"],
                    "zone_name": reading["zone_name"],
                    "temperature": reading["temperature"],
                    "salinity": reading["salinity"],
                    "ph": reading["ph"],
                    "dissolved_oxygen": reading["dissolved_oxygen"],
                    "turbidity": reading["turbidity"],
                    "nitrate": reading["nitrate"],
                    "phosphate": reading["phosphate"],
                    "silicate": reading["silicate"],
                    "phytoplankton_count": reading["phytoplankton_count"],
                    "bacteria_count": reading["bacteria_count"],
                    "timestamp": reading["timestamp"].isoformat(),
                }
            })
            
            await asyncio.sleep(settings.SENSOR_UPDATE_INTERVAL)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)
        print(f"WebSocket error: {e}")


@router.websocket("/ws/simulation/{simulation_id}")
async def simulation_stream(websocket: WebSocket, simulation_id: int):
    """Stream real-time simulation updates"""
    await manager.connect(websocket)
    
    try:
        while True:
            # Wait for client messages (commands)
            data = await websocket.receive_json()
            
            if data.get("action") == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "simulation_id": simulation_id,
                })
            
            elif data.get("action") == "step":
                # Client requested a simulation step
                await websocket.send_json({
                    "type": "step_complete",
                    "simulation_id": simulation_id,
                })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)
        print(f"WebSocket error: {e}")


@router.websocket("/ws/dashboard")
async def dashboard_stream(websocket: WebSocket):
    """Stream real-time dashboard updates"""
    await manager.connect(websocket)
    
    try:
        while True:
            # Get all sensor readings
            sensor_network = get_sensor_network()
            all_readings = sensor_network.get_all_current_readings()
            
            await websocket.send_json({
                "type": "dashboard_update",
                "data": {
                    "sensor_count": len(all_readings),
                    "timestamp": asyncio.get_event_loop().time(),
                }
            })
            
            await asyncio.sleep(10)  # Update every 10 seconds
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)
        print(f"WebSocket error: {e}")
