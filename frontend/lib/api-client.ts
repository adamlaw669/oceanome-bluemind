// API client for BlueMind backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

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

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access_token", token)
      } else {
        localStorage.removeItem("access_token")
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An error occurred",
      }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // ========== Auth APIs ==========

  async signup(email: string, password: string, name: string) {
    return this.request<UserResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  async login(email: string, password: string) {
    const response = await this.request<AuthResponse>(
      "/auth/login-json",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    )
    this.setToken(response.access_token)
    return response
  }

  async getCurrentUser() {
    return this.request<UserResponse>("/auth/me")
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
  }) {
    return this.request<SimulationResponse>("/simulations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSimulations() {
    return this.request<SimulationResponse[]>("/simulations")
  }

  async getSimulation(id: number) {
    return this.request<SimulationWithHistory>(`/simulations/${id}`)
  }

  async updateSimulation(id: number, data: {
    name?: string
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }) {
    return this.request<SimulationResponse>(`/simulations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async stepSimulation(id: number, weeks: number = 1) {
    return this.request<SimulationResponse>(`/simulations/${id}/step?weeks=${weeks}`, {
      method: "POST",
    })
  }

  async resetSimulation(id: number) {
    return this.request<SimulationResponse>(`/simulations/${id}/reset`, {
      method: "POST",
    })
  }

  async deleteSimulation(id: number) {
    return this.request<void>(`/simulations/${id}`, {
      method: "DELETE",
    })
  }

  async predictFuture(id: number, weeks_ahead: number = 4) {
    return this.request<any>(`/simulations/${id}/predict?weeks_ahead=${weeks_ahead}`, {
      method: "POST",
    })
  }

  // ========== Sensor APIs ==========

  async createSensorZone(data: {
    name: string
    location: string
    latitude: number
    longitude: number
    depth?: number
  }) {
    return this.request<SensorZoneResponse>("/sensors/zones", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSensorZones() {
    return this.request<SensorZoneResponse[]>("/sensors/zones")
  }

  async getSensorZone(id: number) {
    return this.request<SensorZoneResponse>(`/sensors/zones/${id}`)
  }

  async getCurrentReading(zoneId: number) {
    return this.request<SensorReadingResponse>(`/sensors/zones/${zoneId}/current`)
  }

  async deleteSensorZone(id: number) {
    return this.request<void>(`/sensors/zones/${id}`, {
      method: "DELETE",
    })
  }

  async simulateEvent(zoneId: number, eventType: string) {
    return this.request<SensorReadingResponse>(`/sensors/zones/${zoneId}/simulate-event?event_type=${eventType}`, {
      method: "POST",
    })
  }

  // ========== Dashboard APIs ==========

  async getDashboardStats() {
    return this.request<DashboardStatsResponse>("/dashboard/stats")
  }

  // ========== WebSocket ==========

  connectSensorStream(zoneId: number, onMessage: (data: any) => void) {
    const wsUrl = this.baseUrl.replace("http", "ws")
    const ws = new WebSocket(`${wsUrl}/ws/sensors/${zoneId}`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return ws
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for testing/custom instances
export default ApiClient
