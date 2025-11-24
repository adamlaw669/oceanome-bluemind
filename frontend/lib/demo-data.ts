// Demo account and sample data for BlueMind
// This helps users try the app immediately without creating an account

export const DEMO_ACCOUNT = {
  email: 'demo@bluemind.com',
  password: 'demo123',
  name: 'Demo User',
}

export function initializeDemoData() {
  if (typeof window === 'undefined') return

  const STORAGE_KEYS = {
    USERS: 'bluemind_users',
    SIMULATIONS: 'bluemind_simulations',
    SENSOR_ZONES: 'bluemind_sensor_zones',
  }

  // Check if demo user already exists
  const usersData = localStorage.getItem(STORAGE_KEYS.USERS)
  const users = usersData ? JSON.parse(usersData) : []

  const demoUserExists = users.find((u: any) => u.email === DEMO_ACCOUNT.email)

  if (!demoUserExists) {
    // Add demo user
    const demoUser = {
      id: 999, // Fixed ID for demo user
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      name: DEMO_ACCOUNT.name,
      created_at: new Date().toISOString(),
    }
    users.push(demoUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

    // Add sample simulations for demo user
    const simulationsData = localStorage.getItem(STORAGE_KEYS.SIMULATIONS)
    const simulations = simulationsData ? JSON.parse(simulationsData) : []

    const demoSimulations = [
      {
        id: 9001,
        user_id: 999,
        name: 'Nutrient-Rich Waters',
        description: 'Exploring phytoplankton growth in high-nutrient conditions',
        scenario_type: 'nutrient_bloom',
        temperature: 22,
        nutrients: 85,
        light: 80,
        salinity: 35,
        ph: 8.15,
        dissolved_oxygen: 7.2,
        week: 12,
        phytoplankton: 2400,
        zooplankton: 1100,
        bacteria: 2800,
        carbon_sequestration_rate: 18.5,
        biodiversity_index: 0.78,
        ecosystem_health_score: 82,
        is_running: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          {
            week: 0,
            temperature: 22,
            nutrients: 85,
            phytoplankton: 1000,
            zooplankton: 500,
            bacteria: 2000,
            carbon_sequestration: 8.5,
            biodiversity_index: 0.65,
            ecosystem_health: 75,
          },
          {
            week: 4,
            temperature: 22,
            nutrients: 78,
            phytoplankton: 1600,
            zooplankton: 750,
            bacteria: 2300,
            carbon_sequestration: 12.5,
            biodiversity_index: 0.72,
            ecosystem_health: 78,
          },
          {
            week: 8,
            temperature: 22,
            nutrients: 82,
            phytoplankton: 2100,
            zooplankton: 950,
            bacteria: 2600,
            carbon_sequestration: 16.2,
            biodiversity_index: 0.75,
            ecosystem_health: 80,
          },
        ],
      },
      {
        id: 9002,
        user_id: 999,
        name: 'Temperature Impact Study',
        description: 'Analyzing ecosystem response to temperature changes',
        scenario_type: 'temperature_shift',
        temperature: 18,
        nutrients: 50,
        light: 75,
        salinity: 35,
        ph: 8.22,
        dissolved_oxygen: 8.8,
        week: 8,
        phytoplankton: 1350,
        zooplankton: 680,
        bacteria: 2100,
        carbon_sequestration_rate: 10.2,
        biodiversity_index: 0.81,
        ecosystem_health_score: 76,
        is_running: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          {
            week: 0,
            temperature: 18,
            nutrients: 50,
            phytoplankton: 1000,
            zooplankton: 500,
            bacteria: 2000,
            carbon_sequestration: 5.0,
            biodiversity_index: 0.65,
            ecosystem_health: 70,
          },
          {
            week: 4,
            temperature: 18,
            nutrients: 48,
            phytoplankton: 1150,
            zooplankton: 580,
            bacteria: 2050,
            carbon_sequestration: 7.5,
            biodiversity_index: 0.73,
            ecosystem_health: 73,
          },
        ],
      },
      {
        id: 9003,
        user_id: 999,
        name: 'Coastal Ecosystem Baseline',
        description: 'Standard coastal conditions monitoring',
        scenario_type: 'baseline',
        temperature: 20,
        nutrients: 50,
        light: 75,
        salinity: 35,
        ph: 8.2,
        dissolved_oxygen: 8.0,
        week: 0,
        phytoplankton: 1000,
        zooplankton: 500,
        bacteria: 2000,
        carbon_sequestration_rate: 5.0,
        biodiversity_index: 0.65,
        ecosystem_health_score: 75,
        is_running: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [],
      },
    ]

    simulations.push(...demoSimulations)
    localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations))

    // Add sample sensor zones for demo user
    const zonesData = localStorage.getItem(STORAGE_KEYS.SENSOR_ZONES)
    const zones = zonesData ? JSON.parse(zonesData) : []

    const demoZones = [
      {
        id: 8001,
        user_id: 999,
        name: 'Pacific Coastal Zone',
        location: 'California Coast',
        latitude: 36.9741,
        longitude: -122.0308,
        depth: 50,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 8002,
        user_id: 999,
        name: 'Coral Reef Monitoring',
        location: 'Great Barrier Reef',
        latitude: -18.2871,
        longitude: 147.6992,
        depth: 25,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    zones.push(...demoZones)
    localStorage.setItem(STORAGE_KEYS.SENSOR_ZONES, JSON.stringify(zones))

    console.log('✅ Demo account initialized with sample data!')
  }
}
