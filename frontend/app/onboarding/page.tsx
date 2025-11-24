"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ChevronRight } from "lucide-react"

const onboardingSteps = [
  {
    id: 1,
    title: "Understanding Microbes",
    description:
      "Ocean microbes are tiny organisms that form the base of marine food webs and regulate global biogeochemical cycles.",
    content:
      "These single-celled organisms include bacteria, archaea, and plankton. They produce over half of the oxygen we breathe and absorb massive amounts of CO2.",
    icon: "🔬",
  },
  {
    id: 2,
    title: "The Marine Food Web",
    description: "Explore how energy flows through ocean ecosystems, from photosynthetic microbes to larger organisms.",
    content:
      "Phytoplankton convert sunlight to organic matter. Zooplankton consume phytoplankton. Bacteria decompose organic matter and cycle nutrients. This creates a complex web of interactions.",
    icon: "🌊",
  },
  {
    id: 3,
    title: "Environmental Factors",
    description: "Learn how temperature, nutrients, light, and salinity influence microbial populations.",
    content:
      "Different microbes thrive in different conditions. Some prefer cold, deep waters. Others flourish in warm surface layers. Nutrient availability can limit or promote growth.",
    icon: "🌡️",
  },
  {
    id: 4,
    title: "Running Simulations",
    description: "Use the Action Lab to manipulate variables and predict ecosystem changes.",
    content:
      "In the Action Lab, you can adjust temperature, nutrient levels, and other factors. Watch how populations respond and how the ecosystem evolves.",
    icon: "⚙️",
  },
  {
    id: 5,
    title: "Ready to Explore!",
    description: "You now understand the basics. Head to the dashboard to start your first simulation.",
    content:
      "Begin with pre-built scenarios or create your own. Discover how sensitive ocean ecosystems are to environmental changes.",
    icon: "🚀",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      router.push("/dashboard")
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl border border-border p-12 mb-8">
          <div className="text-6xl mb-6">{step.icon}</div>

          <h1 className="text-4xl font-bold text-foreground mb-4">{step.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{step.description}</p>

          <div className="bg-accent/10 rounded-lg border border-accent/30 p-6">
            <p className="text-foreground leading-relaxed">{step.content}</p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 justify-center mb-8">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentStep ? "bg-accent" : "bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>

          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {isLastStep ? "Start Dashboard" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
