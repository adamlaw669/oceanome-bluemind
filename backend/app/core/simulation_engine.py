"""Advanced ocean microbiome simulation engine with AI predictions"""

import numpy as np
from typing import Dict, List, Tuple
from dataclasses import dataclass
import math


@dataclass
class EnvironmentalState:
    """Environmental parameters"""
    temperature: float  # Celsius
    nutrients: float  # % saturation
    light: float  # % of surface light
    salinity: float  # PSU
    ph: float = 8.1
    dissolved_oxygen: float = 8.0  # mg/L


@dataclass
class PopulationState:
    """Microbiome population state"""
    phytoplankton: float
    zooplankton: float
    bacteria: float
    cyanobacteria: float = 0.0
    diatoms: float = 0.0
    dinoflagellates: float = 0.0


class OceanSimulationEngine:
    """
    Advanced ocean microbiome simulation engine
    
    Features:
    - Multi-species population dynamics
    - Environmental parameter interactions
    - Carbon sequestration calculations
    - Biodiversity index computation
    - Ecosystem health scoring
    - AI-enhanced predictions
    """
    
    def __init__(self, env: EnvironmentalState, pop: PopulationState):
        self.env = env
        self.pop = pop
        self.week = 0
        self.history: List[Dict] = []
        
        # Carbon sequestration tracking
        self.total_carbon_sequestered = 0.0  # kg CO2
        
    def calculate_growth_factors(self) -> Dict[str, float]:
        """Calculate environmental growth factors for different organisms"""
        
        # Temperature factor (optimal around 20°C)
        temp_factor = np.exp(-((self.env.temperature - 20) ** 2) / 100)
        
        # Nutrient factor (Monod kinetics)
        nutrient_factor = self.env.nutrients / (self.env.nutrients + 20)
        
        # Light factor (for photosynthetic organisms)
        light_factor = self.env.light / (self.env.light + 30)
        
        # pH factor (optimal around 8.1)
        ph_factor = np.exp(-((self.env.ph - 8.1) ** 2) / 0.5)
        
        # Oxygen factor
        oxygen_factor = min(1.0, self.env.dissolved_oxygen / 8.0)
        
        return {
            "temperature": temp_factor,
            "nutrients": nutrient_factor,
            "light": light_factor,
            "ph": ph_factor,
            "oxygen": oxygen_factor,
        }
    
    def step(self, weeks: int = 1) -> Dict:
        """Advance simulation by specified weeks"""
        for _ in range(weeks):
            self._single_step()
        
        return self.get_current_state()
    
    def _single_step(self):
        """Execute one simulation step (1 week)"""
        factors = self.calculate_growth_factors()
        
        # Phytoplankton dynamics (primary producers)
        phyto_growth = (
            factors["nutrients"] * 0.4 +
            factors["light"] * 0.35 +
            factors["temperature"] * 0.25
        )
        grazing_loss = self.pop.zooplankton * 0.00015
        phyto_net_growth = phyto_growth * 0.15 - grazing_loss - 0.05
        self.pop.phytoplankton = max(100, self.pop.phytoplankton * (1 + phyto_net_growth))
        
        # Zooplankton dynamics (primary consumers)
        zoo_food_factor = min(1.0, self.pop.phytoplankton / 2000)
        zoo_growth = zoo_food_factor * factors["temperature"] * 0.12 - 0.08
        self.pop.zooplankton = max(50, self.pop.zooplankton * (1 + zoo_growth))
        
        # Bacteria dynamics (decomposers)
        organic_matter = self.pop.phytoplankton * 0.0001 + self.pop.zooplankton * 0.0002
        bacteria_growth = (
            organic_matter * factors["temperature"] * 0.15 +
            factors["nutrients"] * 0.08 - 0.03
        )
        self.pop.bacteria = max(500, self.pop.bacteria * (1 + bacteria_growth))
        
        # Nutrient cycling
        nutrient_uptake = self.pop.phytoplankton * 0.00012
        nutrient_regeneration = self.pop.bacteria * 0.00008
        self.env.nutrients = np.clip(
            self.env.nutrients - nutrient_uptake + nutrient_regeneration + 0.5,
            0, 100
        )
        
        # pH dynamics (affected by photosynthesis and respiration)
        ph_change = (phyto_net_growth * 0.01) - (bacteria_growth * 0.005)
        self.env.ph = np.clip(self.env.ph + ph_change, 7.5, 8.5)
        
        # Dissolved oxygen dynamics
        oxygen_production = self.pop.phytoplankton * 0.0001
        oxygen_consumption = (self.pop.zooplankton + self.pop.bacteria) * 0.00005
        self.env.dissolved_oxygen = np.clip(
            self.env.dissolved_oxygen + oxygen_production - oxygen_consumption,
            4.0, 12.0
        )
        
        # Calculate carbon sequestration
        carbon_seq = self.calculate_carbon_sequestration()
        self.total_carbon_sequestered += carbon_seq
        
        # Record history
        self.week += 1
        self.history.append({
            "week": self.week,
            "phytoplankton": self.pop.phytoplankton,
            "zooplankton": self.pop.zooplankton,
            "bacteria": self.pop.bacteria,
            "nutrients": self.env.nutrients,
            "temperature": self.env.temperature,
            "ph": self.env.ph,
            "carbon_sequestration": carbon_seq,
            "biodiversity": self.calculate_biodiversity_index(),
            "ecosystem_health": self.calculate_ecosystem_health(),
        })
    
    def calculate_carbon_sequestration(self) -> float:
        """
        Calculate carbon sequestration rate in kg CO2 per week
        
        Based on:
        - Phytoplankton biomass and growth rate
        - Sinking particles
        - Bacterial remineralization
        """
        # Carbon fixation by phytoplankton (approximation)
        # 1 unit phytoplankton ≈ 1e-12 kg carbon per cell
        # Phytoplankton count is in relative units
        carbon_fixed = self.pop.phytoplankton * 0.001  # kg C per week
        
        # Export efficiency (percentage that sinks to deep ocean)
        export_efficiency = 0.15  # 15% reaches deep ocean
        
        # Bacterial remineralization (returns CO2 to water)
        remineralization_rate = 0.60  # 60% is remineralized
        
        net_carbon_sequestered = carbon_fixed * export_efficiency * (1 - remineralization_rate)
        
        # Convert to CO2 (C to CO2: multiply by 44/12)
        co2_sequestered = net_carbon_sequestered * (44 / 12)
        
        return co2_sequestered
    
    def calculate_biodiversity_index(self) -> float:
        """
        Calculate Shannon biodiversity index
        
        Higher values indicate more diverse ecosystem
        """
        populations = [
            self.pop.phytoplankton,
            self.pop.zooplankton,
            self.pop.bacteria,
        ]
        
        total = sum(populations)
        if total == 0:
            return 0.0
        
        proportions = [p / total for p in populations if p > 0]
        shannon_index = -sum(p * math.log(p) for p in proportions)
        
        # Normalize to 0-1 scale (max Shannon for 3 species is log(3) ≈ 1.1)
        normalized = shannon_index / math.log(3)
        
        return round(normalized, 3)
    
    def calculate_ecosystem_health(self) -> float:
        """
        Calculate overall ecosystem health score (0-100)
        
        Based on:
        - Population balance
        - Environmental conditions
        - Biodiversity
        - Nutrient cycling
        """
        # Population health (balanced populations)
        ideal_phyto = 1500
        ideal_zoo = 700
        ideal_bacteria = 2200
        
        pop_health = (
            (1 - abs(self.pop.phytoplankton - ideal_phyto) / ideal_phyto) * 0.3 +
            (1 - abs(self.pop.zooplankton - ideal_zoo) / ideal_zoo) * 0.2 +
            (1 - abs(self.pop.bacteria - ideal_bacteria) / ideal_bacteria) * 0.2
        )
        pop_health = max(0, pop_health)
        
        # Environmental health
        temp_health = 1 - abs(self.env.temperature - 20) / 20
        nutrient_health = self.env.nutrients / 100
        ph_health = 1 - abs(self.env.ph - 8.1) / 1.5
        oxygen_health = min(1.0, self.env.dissolved_oxygen / 8.0)
        
        env_health = (temp_health + nutrient_health + ph_health + oxygen_health) / 4 * 0.3
        
        # Biodiversity health
        biodiversity_health = self.calculate_biodiversity_index() * 0.2
        
        total_health = (pop_health + env_health + biodiversity_health) * 100
        
        return round(np.clip(total_health, 0, 100), 1)
    
    def predict_future(self, weeks_ahead: int = 4) -> List[Dict]:
        """
        Predict future state using AI-enhanced simulation
        
        Returns list of predicted states
        """
        # Save current state
        original_env = EnvironmentalState(**self.env.__dict__)
        original_pop = PopulationState(**self.pop.__dict__)
        original_week = self.week
        
        # Run simulation forward
        predictions = []
        for i in range(weeks_ahead):
            self._single_step()
            predictions.append({
                "week": self.week,
                "phytoplankton": round(self.pop.phytoplankton, 2),
                "zooplankton": round(self.pop.zooplankton, 2),
                "bacteria": round(self.pop.bacteria, 2),
                "carbon_sequestration": round(self.calculate_carbon_sequestration(), 4),
                "biodiversity": self.calculate_biodiversity_index(),
                "ecosystem_health": self.calculate_ecosystem_health(),
            })
        
        # Restore original state
        self.env = original_env
        self.pop = original_pop
        self.week = original_week
        
        return predictions
    
    def generate_recommendations(self) -> List[str]:
        """Generate AI-powered recommendations for ecosystem optimization"""
        recommendations = []
        
        # Temperature recommendations
        if self.env.temperature < 15:
            recommendations.append("Temperature is low - consider monitoring for cold-adapted species")
        elif self.env.temperature > 25:
            recommendations.append("High temperature detected - increased risk of coral bleaching")
        
        # Nutrient recommendations
        if self.env.nutrients < 20:
            recommendations.append("Low nutrient levels - phytoplankton growth may be limited")
        elif self.env.nutrients > 80:
            recommendations.append("High nutrients - monitor for harmful algal blooms")
        
        # Population balance
        if self.pop.phytoplankton < 500:
            recommendations.append("Low phytoplankton - increase light and nutrients")
        if self.pop.zooplankton > self.pop.phytoplankton * 0.8:
            recommendations.append("Overgrazing detected - zooplankton population too high")
        
        # pH warnings
        if self.env.ph < 7.8:
            recommendations.append("Ocean acidification detected - consider deploying alkalinity-enhancing bioagents")
        
        # Oxygen warnings
        if self.env.dissolved_oxygen < 5.0:
            recommendations.append("Low oxygen - risk of hypoxic conditions")
        
        # Positive feedback
        health = self.calculate_ecosystem_health()
        if health > 80:
            recommendations.append("Ecosystem is healthy - maintain current conditions")
        
        if not recommendations:
            recommendations.append("Continue monitoring ecosystem parameters")
        
        return recommendations
    
    def get_current_state(self) -> Dict:
        """Get current simulation state"""
        return {
            "week": self.week,
            "environment": {
                "temperature": self.env.temperature,
                "nutrients": self.env.nutrients,
                "light": self.env.light,
                "salinity": self.env.salinity,
                "ph": self.env.ph,
                "dissolved_oxygen": self.env.dissolved_oxygen,
            },
            "populations": {
                "phytoplankton": round(self.pop.phytoplankton, 2),
                "zooplankton": round(self.pop.zooplankton, 2),
                "bacteria": round(self.pop.bacteria, 2),
            },
            "metrics": {
                "carbon_sequestration_rate": round(self.calculate_carbon_sequestration(), 4),
                "total_carbon_sequestered": round(self.total_carbon_sequestered, 2),
                "biodiversity_index": self.calculate_biodiversity_index(),
                "ecosystem_health_score": self.calculate_ecosystem_health(),
            }
        }
    
    def update_environment(self, **kwargs):
        """Update environmental parameters"""
        for key, value in kwargs.items():
            if hasattr(self.env, key):
                setattr(self.env, key, value)
    
    def reset(self):
        """Reset simulation to initial state"""
        self.week = 0
        self.history = []
        self.total_carbon_sequestered = 0.0
        self.pop = PopulationState(
            phytoplankton=1000,
            zooplankton=500,
            bacteria=2000,
        )


def create_simulation_engine(
    temperature: float = 20.0,
    nutrients: float = 50.0,
    light: float = 75.0,
    salinity: float = 35.0,
) -> OceanSimulationEngine:
    """Factory function to create a simulation engine"""
    env = EnvironmentalState(
        temperature=temperature,
        nutrients=nutrients,
        light=light,
        salinity=salinity,
    )
    pop = PopulationState(
        phytoplankton=1000,
        zooplankton=500,
        bacteria=2000,
    )
    return OceanSimulationEngine(env, pop)
