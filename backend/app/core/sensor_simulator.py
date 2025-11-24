"""IoT sensor data simulation for ocean monitoring"""

import asyncio
import random
import math
from datetime import datetime
from typing import Dict, Optional
import numpy as np


class SensorDataGenerator:
    """
    Simulates realistic IoT sensor data from ocean monitoring stations
    
    Features:
    - Realistic diurnal patterns
    - Seasonal variations
    - Noise and measurement uncertainty
    - Correlation between parameters
    """
    
    def __init__(
        self,
        base_temperature: float = 20.0,
        base_salinity: float = 35.0,
        latitude: float = 35.0,
        depth: float = 0.0,
    ):
        self.base_temperature = base_temperature
        self.base_salinity = base_salinity
        self.latitude = latitude
        self.depth = depth
        self.time_offset = 0  # Simulated time in hours
        
    def generate_reading(self) -> Dict:
        """Generate a single sensor reading with realistic variations"""
        
        # Time-based variations
        hour_of_day = (self.time_offset % 24)
        day_of_year = (self.time_offset // 24) % 365
        
        # Temperature with diurnal and seasonal patterns
        diurnal_temp = 2.0 * math.sin(2 * math.pi * hour_of_day / 24)
        seasonal_temp = 5.0 * math.sin(2 * math.pi * day_of_year / 365)
        depth_correction = -0.05 * self.depth  # Temperature decreases with depth
        temperature = (
            self.base_temperature +
            diurnal_temp +
            seasonal_temp +
            depth_correction +
            np.random.normal(0, 0.3)
        )
        
        # Salinity (relatively stable with small variations)
        salinity = self.base_salinity + np.random.normal(0, 0.2)
        
        # pH (affected by temperature and biological activity)
        biological_cycle = 0.1 * math.sin(2 * math.pi * hour_of_day / 24)
        ph = 8.1 + biological_cycle + np.random.normal(0, 0.05)
        
        # Dissolved oxygen (inverse relationship with temperature)
        # Higher at night due to less respiration
        day_night_cycle = 1.0 * math.sin(2 * math.pi * (hour_of_day + 12) / 24)
        do_base = 10.0 - (temperature - 20) * 0.2  # Decreases with temperature
        dissolved_oxygen = max(4.0, do_base + day_night_cycle + np.random.normal(0, 0.3))
        
        # Turbidity (water clarity)
        turbidity = max(0.1, 1.5 + np.random.normal(0, 0.3))
        
        # Nutrients (correlation with upwelling and biological activity)
        nitrate = max(0, 5.0 + np.random.normal(0, 1.0))
        phosphate = max(0, 1.5 + np.random.normal(0, 0.3))
        silicate = max(0, 8.0 + np.random.normal(0, 1.5))
        
        # Biological counts (higher during day for phytoplankton)
        phyto_multiplier = 1.5 if 6 <= hour_of_day <= 18 else 0.8
        phytoplankton_count = max(0, 1000 * phyto_multiplier + np.random.normal(0, 200))
        bacteria_count = max(0, 5000 + np.random.normal(0, 800))
        
        self.time_offset += 1  # Advance time by 1 hour
        
        return {
            "temperature": round(temperature, 2),
            "salinity": round(salinity, 2),
            "ph": round(ph, 2),
            "dissolved_oxygen": round(dissolved_oxygen, 2),
            "turbidity": round(turbidity, 2),
            "nitrate": round(nitrate, 2),
            "phosphate": round(phosphate, 2),
            "silicate": round(silicate, 2),
            "phytoplankton_count": round(phytoplankton_count, 2),
            "bacteria_count": round(bacteria_count, 2),
            "timestamp": datetime.utcnow(),
        }
    
    def simulate_event(self, event_type: str) -> Dict:
        """Simulate special environmental events"""
        reading = self.generate_reading()
        
        if event_type == "algal_bloom":
            reading["phytoplankton_count"] *= 5
            reading["turbidity"] *= 3
            reading["dissolved_oxygen"] *= 1.5
            reading["ph"] += 0.2
        
        elif event_type == "upwelling":
            reading["temperature"] -= 5
            reading["nitrate"] *= 3
            reading["phosphate"] *= 2.5
            reading["phytoplankton_count"] *= 2
        
        elif event_type == "storm":
            reading["turbidity"] *= 4
            reading["dissolved_oxygen"] *= 1.3
            reading["temperature"] -= 2
        
        elif event_type == "pollution":
            reading["ph"] -= 0.3
            reading["dissolved_oxygen"] *= 0.6
            reading["turbidity"] *= 2
            reading["bacteria_count"] *= 3
        
        return reading


class SmartBuoySimulator:
    """
    Simulates a SmartBuoy IoT device for ocean monitoring
    
    Provides real-time streaming data and can simulate various oceanographic events
    """
    
    def __init__(
        self,
        zone_id: int,
        name: str,
        latitude: float,
        longitude: float,
        depth: float = 0.0,
    ):
        self.zone_id = zone_id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.depth = depth
        
        # Initialize sensor generator
        base_temp = self._calculate_base_temperature()
        self.sensor = SensorDataGenerator(
            base_temperature=base_temp,
            latitude=latitude,
            depth=depth,
        )
        
        self.is_active = True
        self.readings_count = 0
    
    def _calculate_base_temperature(self) -> float:
        """Calculate base temperature based on latitude"""
        # Simple model: warmer near equator, colder near poles
        lat_abs = abs(self.latitude)
        if lat_abs < 23.5:  # Tropics
            return 27.0
        elif lat_abs < 40:  # Subtropics
            return 22.0
        elif lat_abs < 60:  # Temperate
            return 15.0
        else:  # Polar
            return 5.0
    
    async def stream_data(self, interval_seconds: int = 5):
        """Stream sensor data at regular intervals"""
        while self.is_active:
            reading = self.sensor.generate_reading()
            reading["zone_id"] = self.zone_id
            reading["zone_name"] = self.name
            self.readings_count += 1
            
            yield reading
            
            await asyncio.sleep(interval_seconds)
    
    def get_current_reading(self) -> Dict:
        """Get a single current reading"""
        reading = self.sensor.generate_reading()
        reading["zone_id"] = self.zone_id
        reading["zone_name"] = self.name
        return reading
    
    def simulate_event(self, event_type: str) -> Dict:
        """Simulate a special event"""
        reading = self.sensor.simulate_event(event_type)
        reading["zone_id"] = self.zone_id
        reading["zone_name"] = self.name
        reading["event"] = event_type
        return reading
    
    def stop(self):
        """Stop the buoy simulation"""
        self.is_active = False


class SensorNetworkManager:
    """Manages multiple SmartBuoy sensors across different zones"""
    
    def __init__(self):
        self.buoys: Dict[int, SmartBuoySimulator] = {}
    
    def add_buoy(
        self,
        zone_id: int,
        name: str,
        latitude: float,
        longitude: float,
        depth: float = 0.0,
    ) -> SmartBuoySimulator:
        """Add a new buoy to the network"""
        buoy = SmartBuoySimulator(zone_id, name, latitude, longitude, depth)
        self.buoys[zone_id] = buoy
        return buoy
    
    def remove_buoy(self, zone_id: int):
        """Remove a buoy from the network"""
        if zone_id in self.buoys:
            self.buoys[zone_id].stop()
            del self.buoys[zone_id]
    
    def get_buoy(self, zone_id: int) -> Optional[SmartBuoySimulator]:
        """Get a specific buoy"""
        return self.buoys.get(zone_id)
    
    def get_all_current_readings(self) -> Dict[int, Dict]:
        """Get current readings from all buoys"""
        return {
            zone_id: buoy.get_current_reading()
            for zone_id, buoy in self.buoys.items()
        }
    
    async def stream_all_buoys(self, interval_seconds: int = 5):
        """Stream data from all buoys"""
        tasks = [
            buoy.stream_data(interval_seconds)
            for buoy in self.buoys.values()
        ]
        
        async for readings in asyncio.gather(*tasks):
            yield readings
    
    def stop_all(self):
        """Stop all buoys"""
        for buoy in self.buoys.values():
            buoy.stop()


# Global sensor network manager
sensor_network = SensorNetworkManager()


def get_sensor_network() -> SensorNetworkManager:
    """Get the global sensor network manager"""
    return sensor_network
