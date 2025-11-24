"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { DataVisualization } from "@/components/data-visualization"
import { useAuth } from "@/lib/auth-context"
import { mockSimulationTimeline, mockNutrientData } from "@/lib/mock-data"
import { Play, Plus, TrendingUp, Droplets, Thermometer, Wind } from "lucide-react"

const scenarios = [
  {
    id: 1,
    name: "Nutrient Bloom",
    description: "Watch phytoplankton flourish with increased nutrients",
    difficulty: "Beginner",
    duration: "5 min",
    icon: TrendingUp,
  },
  {
    id: 2,
    name: "Temperature Shift",
    description: "Explore ecosystem responses to warming waters",
    difficulty: "Intermediate",
    duration: "8 min",
    icon: Thermometer,
  },
  {
    id: 3,
    name: "Oxygen Minimum",
    description: "Investigate hypoxic zone formation and microbial adaptation",
    difficulty: "Advanced",
    duration: "12 min",
    icon: Wind,
  },
  {
    id: 4,
    name: "Coastal Upwelling",
    description: "Study nutrient-rich water bringing life to shallow zones",
    difficulty: "Intermediate",
    duration: "10 min",
    icon: Droplets,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    simulations: 0,
    ecosystemHealth: 0,
    avgSpeciesCount: 0,
    totalMicrobes: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { apiClient } = await import("@/lib/api-client")
        const dashboardStats = await apiClient.getDashboardStats()
        setStats({
          simulations: dashboardStats.total_simulations,
          ecosystemHealth: dashboardStats.average_ecosystem_health,
          avgSpeciesCount: Math.round(dashboardStats.total_microbe_populations / Math.max(dashboardStats.total_simulations, 1)),
          totalMicrobes: dashboardStats.total_microbe_populations,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNav={true} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.name || "Explorer"}!</h1>
          <p className="text-lg text-muted-foreground">Explore your ocean microbiome simulations and experiments</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Simulations Run"
            value={stats.simulations}
            description="Total ecosystem experiments"
            icon={<Play className="w-6 h-6" />}
          />
          <StatCard
            label="Ecosystem Health"
            value={stats.ecosystemHealth}
            unit="%"
            description="Current average score"
            trend={5}
          />
          <StatCard
            label="Avg Species Count"
            value={stats.avgSpeciesCount}
            description="Microbes per simulation"
            icon={<Droplets className="w-6 h-6" />}
          />
          <StatCard
            label="Total Microbes"
            value={stats.totalMicrobes}
            description="Across all simulations"
            trend={-2}
          />
        </div>

        {/* Simulation Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Ecosystem Population Trends</h2>
            <DataVisualization type="area" data={mockSimulationTimeline} dataKey="phytoplankton" />
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Nutrient Levels</h2>
            <div className="space-y-4">
              {mockNutrientData.map((nutrient) => (
                <div key={nutrient.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{nutrient.name}</span>
                    <span className="text-sm text-muted-foreground">{nutrient.value}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${nutrient.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Preset Scenarios</h2>
            <Button
              onClick={() => router.push("/action-lab")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Custom
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenarios.map((scenario) => {
              const IconComponent = scenario.icon
              return (
                <div
                  key={scenario.id}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent transition cursor-pointer group"
                  onClick={() => router.push(`/action-lab?scenario=${scenario.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{scenario.duration}</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
