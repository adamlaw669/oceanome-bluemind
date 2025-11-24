// Simple simulation engine for ocean microbiome
export interface SimulationState {
  temperature: number
  nutrients: number
  light: number
  salinity: number
  week: number
  phytoplankton: number
  zooplankton: number
  bacteria: number
  history: SimulationSnapshot[]
}

export interface SimulationSnapshot {
  week: number
  temperature: number
  nutrients: number
  phytoplankton: number
  zooplankton: number
  bacteria: number
}

export class SimulationEngine {
  private state: SimulationState

  constructor(initialState?: Partial<SimulationState>) {
    this.state = {
      temperature: initialState?.temperature ?? 20,
      nutrients: initialState?.nutrients ?? 50,
      light: initialState?.light ?? 75,
      salinity: initialState?.salinity ?? 35,
      week: 0,
      phytoplankton: 1000,
      zooplankton: 500,
      bacteria: 2000,
      history: [],
    }
  }

  getState(): SimulationState {
    return this.state
  }

  updateParameters(params: {
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }): void {
    if (params.temperature !== undefined) this.state.temperature = Math.max(0, Math.min(35, params.temperature))
    if (params.nutrients !== undefined) this.state.nutrients = Math.max(0, Math.min(100, params.nutrients))
    if (params.light !== undefined) this.state.light = Math.max(0, Math.min(100, params.light))
    if (params.salinity !== undefined) this.state.salinity = Math.max(30, Math.min(40, params.salinity))
  }

  step(): void {
    // Record current state
    this.state.history.push({
      week: this.state.week,
      temperature: this.state.temperature,
      nutrients: this.state.nutrients,
      phytoplankton: this.state.phytoplankton,
      zooplankton: this.state.zooplankton,
      bacteria: this.state.bacteria,
    })

    // Simple ecosystem dynamics based on environmental factors
    const tempFactor = 1 - Math.abs(this.state.temperature - 20) / 30
    const nutrientFactor = this.state.nutrients / 100
    const lightFactor = this.state.light / 100

    // Phytoplankton growth based on nutrients, light, and temperature
    const phytoGrowth = 1 + (nutrientFactor * 0.3 + lightFactor * 0.2 + tempFactor * 0.1) * 0.1
    this.state.phytoplankton = Math.max(100, this.state.phytoplankton * phytoGrowth - this.state.zooplankton * 0.1)

    // Zooplankton growth based on phytoplankton availability
    const zooGrowth = 1 + (this.state.phytoplankton / 5000) * 0.15 - 0.08
    this.state.zooplankton = Math.max(50, this.state.zooplankton * zooGrowth)

    // Bacteria growth based on organic matter and temperature
    const bacteriaGrowth = 1 + (tempFactor * 0.12 + nutrientFactor * 0.1) * 0.1 - 0.02
    this.state.bacteria = Math.max(500, this.state.bacteria * bacteriaGrowth)

    // Nutrient depletion from phytoplankton uptake
    this.state.nutrients = Math.max(0, this.state.nutrients - this.state.phytoplankton * 0.0001)

    // Natural nutrient regeneration
    this.state.nutrients = Math.min(100, this.state.nutrients + 0.5)

    this.state.week++
  }

  runForWeeks(weeks: number): void {
    for (let i = 0; i < weeks; i++) {
      this.step()
    }
  }

  reset(): void {
    this.state.week = 0
    this.state.phytoplankton = 1000
    this.state.zooplankton = 500
    this.state.bacteria = 2000
    this.state.history = []
  }
}
