"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { SimulationControls } from "@/components/simulation-controls"
import { DataVisualization } from "@/components/data-visualization"
import { StatCard } from "@/components/stat-card"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

interface SimulationState {
  id?: number
  temperature: number
  nutrients: number
  light: number
  salinity: number
  week: number
  phytoplankton: number
  zooplankton: number
  bacteria: number
  carbon_sequestration_rate: number
  biodiversity_index: number
  ecosystem_health_score: number
  history: any[]
}

export default function ActionLabPage() {
  const { user } = useAuth()
  const [isRunning, setIsRunning] = useState(false)
  const [state, setState] = useState<SimulationState | null>(null)
  const [simulationId, setSimulationId] = useState<number | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize simulation
  useEffect(() => {
    const initSimulation = async () => {
      try {
        const sim = await apiClient.createSimulation({
          name: "Action Lab Simulation",
          description: "Interactive simulation from Action Lab",
        })
        setSimulationId(sim.id)
        setState({
          id: sim.id,
          temperature: sim.temperature,
          nutrients: sim.nutrients,
          light: sim.light,
          salinity: sim.salinity,
          week: sim.week,
          phytoplankton: sim.phytoplankton,
          zooplankton: sim.zooplankton,
          bacteria: sim.bacteria,
          carbon_sequestration_rate: sim.carbon_sequestration_rate,
          biodiversity_index: sim.biodiversity_index,
          ecosystem_health_score: sim.ecosystem_health_score,
          history: [],
        })
      } catch (error) {
        console.error("Failed to initialize simulation:", error)
      }
    }

    if (user) {
      initSimulation()
    }
  }, [user])

  const handlePlay = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = async () => {
    setIsRunning(false)
    if (!simulationId) return
    
    try {
      const sim = await apiClient.resetSimulation(simulationId)
      setState({
        ...state!,
        week: sim.week,
        phytoplankton: sim.phytoplankton,
        zooplankton: sim.zooplankton,
        bacteria: sim.bacteria,
        history: [],
      })
    } catch (error) {
      console.error("Failed to reset simulation:", error)
    }
  }

  const handleParameterChange = async (params: {
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }) => {
    if (!simulationId || !state) return
    
    try {
      const sim = await apiClient.updateSimulation(simulationId, params)
      setState({
        ...state,
        temperature: sim.temperature,
        nutrients: sim.nutrients,
        light: sim.light,
        salinity: sim.salinity,
      })
    } catch (error) {
      console.error("Failed to update parameters:", error)
    }
  }

  const handleStep = async () => {
    if (!simulationId) return
    
    try {
      const sim = await apiClient.stepSimulation(simulationId, 1)
      const fullSim = await apiClient.getSimulation(simulationId)
      setState({
        id: sim.id,
        temperature: sim.temperature,
        nutrients: sim.nutrients,
        light: sim.light,
        salinity: sim.salinity,
        week: sim.week,
        phytoplankton: sim.phytoplankton,
        zooplankton: sim.zooplankton,
        bacteria: sim.bacteria,
        carbon_sequestration_rate: sim.carbon_sequestration_rate,
        biodiversity_index: sim.biodiversity_index,
        ecosystem_health_score: sim.ecosystem_health_score,
        history: fullSim.history || [],
      })
    } catch (error) {
      console.error("Failed to step simulation:", error)
    }
  }

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
      return
    }

    animationRef.current = setInterval(async () => {
      await handleStep()
    }, 1000)

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isRunning, simulationId])

  if (!state) {
    return <div className="flex items-center justify-center min-h-screen">Loading simulation...</div>
  }

  // Prepare chart data
  const chartData = (state?.history || []).map((s: any) => ({
    name: `Week ${s.week}`,
    phytoplankton: s.phytoplankton,
    zooplankton: s.zooplankton,
    bacteria: s.bacteria,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Header showNav={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Action Lab</h1>
          <p className="text-lg text-muted-foreground">Design and run your own ecosystem experiments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <SimulationControls
              state={state}
              isRunning={isRunning}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onParameterChange={handleParameterChange}
              onStep={handleStep}
            />

            {/* Export Options */}
            <div className="bg-card rounded-lg border border-border p-6 mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Export</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download Data
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
              </div>
            </div>
          </div>

          {/* Simulation Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard label="Week" value={state.week} description="Current simulation time" />
              <StatCard
                label="Ecosystem Score"
                value={Math.round(state.ecosystem_health_score)}
                unit="/100"
                description="Overall health index"
              />
            </div>

            {/* Main Visualization */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Population Dynamics</h2>
              {chartData.length > 1 ? (
                <DataVisualization type="area" data={chartData} dataKey="phytoplankton" />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Run simulation to generate data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Population Stats */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Current Populations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Phytoplankton</h3>
              <p className="text-3xl font-bold text-accent">{Math.round(state.phytoplankton).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Primary producers</p>
              <div className="mt-3 bg-border rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Zooplankton</h3>
              <p className="text-3xl font-bold text-secondary">{Math.round(state.zooplankton).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Primary consumers</p>
              <div className="mt-3 bg-border rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Bacteria</h3>
              <p className="text-3xl font-bold text-primary">{Math.round(state.bacteria).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Decomposers & recyclers</p>
              <div className="mt-3 bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
