// LocalStorage-based API client for BlueMind (Standalone Mode)
// This replaces the backend API with localStorage for full offline functionality

interface ApiError {
  detail: string
}

// API response types
export interface SimulationResponse {
  id: number
  user_id: number
  name: string
  description?: string
  scenario_type?: string
  temperature: number
  nutrients: number
  light: number
  salinity: number
  ph: number
  dissolved_oxygen: number
  week: number
  phytoplankton: number
  zooplankton: number
  bacteria: number
  carbon_sequestration_rate: number
  biodiversity_index: number
  ecosystem_health_score: number
  is_running: boolean
  created_at: string
  updated_at: string
}

export interface SensorZoneResponse {
  id: number
  user_id: number
  name: string
  location: string
  latitude: number
  longitude: number
  depth?: number
  created_at: string
}

export interface SensorReadingResponse {
  zone_id: number
  temperature: number
  salinity: number
  ph: number
  dissolved_oxygen: number
  chlorophyll: number
  turbidity: number
  timestamp: string
}

export interface DashboardStatsResponse {
  total_simulations: number
  active_sensors: number
  total_carbon_sequestered: number
  average_ecosystem_health: number
  total_microbe_populations: number
}

export interface UserResponse {
  id: number
  email: string
  name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface SimulationHistoryResponse {
  week: number
  temperature: number
  nutrients: number
  phytoplankton: number
  zooplankton: number
  bacteria: number
  carbon_sequestration: number
  biodiversity_index: number
  ecosystem_health: number
}

export interface SimulationWithHistory extends SimulationResponse {
  history: SimulationHistoryResponse[]
}

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'bluemind_users',
  CURRENT_USER: 'bluemind_current_user',
  TOKEN: 'access_token',
  SIMULATIONS: 'bluemind_simulations',
  SENSOR_ZONES: 'bluemind_sensor_zones',
  SENSOR_READINGS: 'bluemind_sensor_readings',
}

class ApiClient {
  private token: string | null = null

  constructor() {
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      this.initializeStorage()
    }
  }

  private initializeStorage() {
    if (typeof window === "undefined") return
    
    // Initialize storage structures if they don't exist
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIMULATIONS)) {
      localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SENSOR_ZONES)) {
      localStorage.setItem(STORAGE_KEYS.SENSOR_ZONES, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SENSOR_READINGS)) {
      localStorage.setItem(STORAGE_KEYS.SENSOR_READINGS, JSON.stringify([]))
    }
  }

  private getStorage<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private setStorage<T>(key: string, data: T[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
  }

  private getCurrentUserId(): number {
    if (typeof window === "undefined") return 1
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return userData ? JSON.parse(userData).id : 1
  }

  private generateId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
  }

  private calculateSimulationMetrics(state: {
    temperature: number
    nutrients: number
    light: number
    salinity: number
    phytoplankton: number
    zooplankton: number
    bacteria: number
  }) {
    // Calculate pH based on temperature and salinity
    const ph = 8.2 - (state.temperature - 20) * 0.01 + (state.salinity - 35) * 0.02

    // Calculate dissolved oxygen (higher in cooler water)
    const dissolved_oxygen = 8 - (state.temperature - 10) * 0.15

    // Carbon sequestration rate (based on phytoplankton activity)
    const carbon_sequestration_rate = (state.phytoplankton / 1000) * (state.nutrients / 100) * 10

    // Biodiversity index (balance of populations)
    const totalPop = state.phytoplankton + state.zooplankton + state.bacteria
    const phytoRatio = state.phytoplankton / totalPop
    const zooRatio = state.zooplankton / totalPop
    const bacteriaRatio = state.bacteria / totalPop
    const biodiversity_index = 1 - Math.abs(0.33 - phytoRatio) - Math.abs(0.33 - zooRatio) - Math.abs(0.33 - bacteriaRatio)

    // Ecosystem health score (0-100)
    const tempHealth = 100 - Math.abs(state.temperature - 20) * 3
    const nutrientHealth = state.nutrients
    const populationHealth = Math.min(100, (totalPop / 5000) * 100)
    const ecosystem_health_score = (tempHealth + nutrientHealth + populationHealth) / 3

    return {
      ph: Math.max(7, Math.min(9, ph)),
      dissolved_oxygen: Math.max(4, Math.min(12, dissolved_oxygen)),
      carbon_sequestration_rate: Math.max(0, carbon_sequestration_rate),
      biodiversity_index: Math.max(0, Math.min(1, biodiversity_index)),
      ecosystem_health_score: Math.max(0, Math.min(100, ecosystem_health_score)),
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      } else {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }
  }

  // ========== Auth APIs ==========

  async signup(email: string, password: string, name: string): Promise<UserResponse> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    
    const users = this.getStorage<any>(STORAGE_KEYS.USERS)
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: this.generateId(users),
      email,
      password, // In production, this should be hashed
      name,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    this.setStorage(STORAGE_KEYS.USERS, users)

    return { id: newUser.id, email: newUser.email, name: newUser.name }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    
    const users = this.getStorage<any>(STORAGE_KEYS.USERS)
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const token = `token_${user.id}_${Date.now()}`
    this.setToken(token)
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
    }))

    return { access_token: token, token_type: "bearer" }
  }

  async getCurrentUser(): Promise<UserResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (!this.token) {
      throw new Error("Not authenticated")
    }

    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (!userData) {
      throw new Error("User not found")
    }

    return JSON.parse(userData)
  }

  logout() {
    this.setToken(null)
  }

  // ========== Simulation APIs ==========

  async createSimulation(data: {
    name: string
    description?: string
    scenario_type?: string
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }): Promise<SimulationResponse> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const simulations = this.getStorage<SimulationResponse>(STORAGE_KEYS.SIMULATIONS)
    const userId = this.getCurrentUserId()

    const initialState = {
      temperature: data.temperature ?? 20,
      nutrients: data.nutrients ?? 50,
      light: data.light ?? 75,
      salinity: data.salinity ?? 35,
      phytoplankton: 1000,
      zooplankton: 500,
      bacteria: 2000,
    }

    const metrics = this.calculateSimulationMetrics(initialState)

    const newSimulation: SimulationResponse = {
      id: this.generateId(simulations),
      user_id: userId,
      name: data.name,
      description: data.description,
      scenario_type: data.scenario_type,
      ...initialState,
      ...metrics,
      week: 0,
      is_running: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    simulations.push(newSimulation)
    this.setStorage(STORAGE_KEYS.SIMULATIONS, simulations)

    return newSimulation
  }

  async getSimulations(): Promise<SimulationResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = this.getStorage<SimulationResponse>(STORAGE_KEYS.SIMULATIONS)
    const userId = this.getCurrentUserId()
    
    return simulations.filter(s => s.user_id === userId)
  }

  async getSimulation(id: number): Promise<SimulationWithHistory> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = this.getStorage<any>(STORAGE_KEYS.SIMULATIONS)
    const simulation = simulations.find((s: any) => s.id === id)

    if (!simulation) {
      throw new Error("Simulation not found")
    }

    return simulation
  }

  async updateSimulation(id: number, data: {
    name?: string
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }): Promise<SimulationResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = this.getStorage<SimulationResponse>(STORAGE_KEYS.SIMULATIONS)
    const index = simulations.findIndex(s => s.id === id)

    if (index === -1) {
      throw new Error("Simulation not found")
    }

    const updated = {
      ...simulations[index],
      ...data,
      updated_at: new Date().toISOString(),
    }

    // Recalculate metrics with new parameters
    const metrics = this.calculateSimulationMetrics(updated)
    Object.assign(updated, metrics)

    simulations[index] = updated
    this.setStorage(STORAGE_KEYS.SIMULATIONS, simulations)

    return updated
  }

  async stepSimulation(id: number, weeks: number = 1): Promise<SimulationResponse> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const simulations = this.getStorage<any>(STORAGE_KEYS.SIMULATIONS)
    const index = simulations.findIndex((s: any) => s.id === id)

    if (index === -1) {
      throw new Error("Simulation not found")
    }

    const sim = simulations[index]

    // Save current state to history
    if (!sim.history) sim.history = []
    
    sim.history.push({
      week: sim.week,
      temperature: sim.temperature,
      nutrients: sim.nutrients,
      phytoplankton: sim.phytoplankton,
      zooplankton: sim.zooplankton,
      bacteria: sim.bacteria,
      carbon_sequestration: sim.carbon_sequestration_rate,
      biodiversity_index: sim.biodiversity_index,
      ecosystem_health: sim.ecosystem_health_score,
    })

    // Run simulation step
    const tempFactor = 1 - Math.abs(sim.temperature - 20) / 30
    const nutrientFactor = sim.nutrients / 100
    const lightFactor = sim.light / 100

    // Phytoplankton growth
    const phytoGrowth = 1 + (nutrientFactor * 0.3 + lightFactor * 0.2 + tempFactor * 0.1) * 0.1
    sim.phytoplankton = Math.max(100, sim.phytoplankton * phytoGrowth - sim.zooplankton * 0.1)

    // Zooplankton growth
    const zooGrowth = 1 + (sim.phytoplankton / 5000) * 0.15 - 0.08
    sim.zooplankton = Math.max(50, sim.zooplankton * zooGrowth)

    // Bacteria growth
    const bacteriaGrowth = 1 + (tempFactor * 0.12 + nutrientFactor * 0.1) * 0.1 - 0.02
    sim.bacteria = Math.max(500, sim.bacteria * bacteriaGrowth)

    // Nutrient dynamics
    sim.nutrients = Math.max(0, sim.nutrients - sim.phytoplankton * 0.0001)
    sim.nutrients = Math.min(100, sim.nutrients + 0.5)

    sim.week += weeks

    // Recalculate metrics
    const metrics = this.calculateSimulationMetrics(sim)
    Object.assign(sim, metrics)

    sim.updated_at = new Date().toISOString()

    simulations[index] = sim
    this.setStorage(STORAGE_KEYS.SIMULATIONS, simulations)

    return sim
  }

  async resetSimulation(id: number): Promise<SimulationResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = this.getStorage<SimulationResponse>(STORAGE_KEYS.SIMULATIONS)
    const index = simulations.findIndex(s => s.id === id)

    if (index === -1) {
      throw new Error("Simulation not found")
    }

    const sim: any = simulations[index]
    sim.week = 0
    sim.phytoplankton = 1000
    sim.zooplankton = 500
    sim.bacteria = 2000
    sim.history = []
    sim.updated_at = new Date().toISOString()

    const metrics = this.calculateSimulationMetrics(sim)
    Object.assign(sim, metrics)

    simulations[index] = sim
    this.setStorage(STORAGE_KEYS.SIMULATIONS, simulations)

    return sim
  }

  async deleteSimulation(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = this.getStorage<SimulationResponse>(STORAGE_KEYS.SIMULATIONS)
    const filtered = simulations.filter(s => s.id !== id)
    this.setStorage(STORAGE_KEYS.SIMULATIONS, filtered)
  }

  async predictFuture(id: number, weeks_ahead: number = 4): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Simple prediction based on current trends
    const sim = await this.getSimulation(id)
    const predictions = []

    for (let i = 1; i <= weeks_ahead; i++) {
      predictions.push({
        week: sim.week + i,
        phytoplankton: sim.phytoplankton * (1 + Math.random() * 0.1 - 0.05),
        zooplankton: sim.zooplankton * (1 + Math.random() * 0.1 - 0.05),
        bacteria: sim.bacteria * (1 + Math.random() * 0.08 - 0.04),
      })
    }

    return { predictions }
  }

  // ========== Sensor APIs ==========

  async createSensorZone(data: {
    name: string
    location: string
    latitude: number
    longitude: number
    depth?: number
  }): Promise<SensorZoneResponse> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const zones = this.getStorage<SensorZoneResponse>(STORAGE_KEYS.SENSOR_ZONES)
    const userId = this.getCurrentUserId()

    const newZone: SensorZoneResponse = {
      id: this.generateId(zones),
      user_id: userId,
      ...data,
      created_at: new Date().toISOString(),
    }

    zones.push(newZone)
    this.setStorage(STORAGE_KEYS.SENSOR_ZONES, zones)

    return newZone
  }

  async getSensorZones(): Promise<SensorZoneResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const zones = this.getStorage<SensorZoneResponse>(STORAGE_KEYS.SENSOR_ZONES)
    const userId = this.getCurrentUserId()
    
    return zones.filter(z => z.user_id === userId)
  }

  async getSensorZone(id: number): Promise<SensorZoneResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const zones = this.getStorage<SensorZoneResponse>(STORAGE_KEYS.SENSOR_ZONES)
    const zone = zones.find(z => z.id === id)

    if (!zone) {
      throw new Error("Sensor zone not found")
    }

    return zone
  }

  async getCurrentReading(zoneId: number): Promise<SensorReadingResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Generate realistic sensor readings
    return {
      zone_id: zoneId,
      temperature: 18 + Math.random() * 8,
      salinity: 33 + Math.random() * 4,
      ph: 7.8 + Math.random() * 0.6,
      dissolved_oxygen: 6 + Math.random() * 3,
      chlorophyll: 0.5 + Math.random() * 2,
      turbidity: 1 + Math.random() * 4,
      timestamp: new Date().toISOString(),
    }
  }

  async deleteSensorZone(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const zones = this.getStorage<SensorZoneResponse>(STORAGE_KEYS.SENSOR_ZONES)
    const filtered = zones.filter(z => z.id !== id)
    this.setStorage(STORAGE_KEYS.SENSOR_ZONES, filtered)
  }

  async simulateEvent(zoneId: number, eventType: string): Promise<SensorReadingResponse> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Simulate different event types
    const baseReading = await this.getCurrentReading(zoneId)
    
    switch(eventType) {
      case "heatwave":
        baseReading.temperature += 5
        baseReading.dissolved_oxygen -= 2
        break
      case "storm":
        baseReading.turbidity += 10
        baseReading.salinity -= 2
        break
      case "algal_bloom":
        baseReading.chlorophyll += 5
        baseReading.ph += 0.3
        break
    }

    return baseReading
  }

  // ========== Dashboard APIs ==========

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const simulations = await this.getSimulations()
    const zones = await this.getSensorZones()

    const total_simulations = simulations.length
    const active_sensors = zones.length
    const total_carbon_sequestered = simulations.reduce((sum, s) => sum + s.carbon_sequestration_rate, 0)
    const average_ecosystem_health = simulations.length > 0
      ? simulations.reduce((sum, s) => sum + s.ecosystem_health_score, 0) / simulations.length
      : 0
    const total_microbe_populations = simulations.reduce(
      (sum, s) => sum + s.phytoplankton + s.zooplankton + s.bacteria,
      0
    )

    return {
      total_simulations,
      active_sensors,
      total_carbon_sequestered,
      average_ecosystem_health,
      total_microbe_populations,
    }
  }

  // ========== WebSocket (Simulated) ==========

  connectSensorStream(zoneId: number, onMessage: (data: any) => void) {
    // Simulate real-time sensor updates with setInterval
    const interval = setInterval(async () => {
      const reading = await this.getCurrentReading(zoneId)
      onMessage(reading)
    }, 2000) // Update every 2 seconds

    // Return a mock WebSocket-like object
    return {
      close: () => clearInterval(interval),
      onmessage: null,
      onerror: null,
    } as any
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for testing/custom instances
export default ApiClient
