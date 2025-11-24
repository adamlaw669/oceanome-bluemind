"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { SimulationState } from "@/lib/simulation-engine"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"

interface SimulationControlsProps {
  state: SimulationState
  isRunning: boolean
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onParameterChange: (params: {
    temperature?: number
    nutrients?: number
    light?: number
    salinity?: number
  }) => void
  onStep: () => void
}

export function SimulationControls({
  state,
  isRunning,
  onPlay,
  onPause,
  onReset,
  onParameterChange,
  onStep,
}: SimulationControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Environmental Controls</h2>

      {/* Playback Controls */}
      <div className="flex gap-2 mb-8">
        <Button
          size="sm"
          onClick={isRunning ? onPause : onPlay}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={onStep} disabled={isRunning}>
          Step (+1 Week)
        </Button>
        <Button size="sm" variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-6">
        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">Temperature</label>
            <span className="text-sm text-accent font-semibold">{state.temperature.toFixed(1)}°C</span>
          </div>
          <Slider
            value={[state.temperature]}
            onValueChange={(value) => onParameterChange({ temperature: value[0] })}
            min={0}
            max={35}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">Optimal: 15-25°C</p>
        </div>

        {/* Nutrients */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">Nutrients</label>
            <span className="text-sm text-accent font-semibold">{state.nutrients.toFixed(1)}%</span>
          </div>
          <Slider
            value={[state.nutrients]}
            onValueChange={(value) => onParameterChange({ nutrients: value[0] })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">Higher nutrients fuel phytoplankton growth</p>
        </div>

        {/* Light */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">Light Intensity</label>
            <span className="text-sm text-accent font-semibold">{state.light.toFixed(1)}%</span>
          </div>
          <Slider
            value={[state.light]}
            onValueChange={(value) => onParameterChange({ light: value[0] })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">Affects photosynthetic organisms</p>
        </div>

        {/* Salinity - Advanced */}
        {showAdvanced && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-foreground">Salinity</label>
              <span className="text-sm text-accent font-semibold">{state.salinity.toFixed(2)} PSU</span>
            </div>
            <Slider
              value={[state.salinity]}
              onValueChange={(value) => onParameterChange({ salinity: value[0] })}
              min={30}
              max={40}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Ocean salinity range</p>
          </div>
        )}
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-accent hover:text-accent/80 mt-6 font-medium flex items-center gap-1"
      >
        <Zap className="w-4 h-4" />
        {showAdvanced ? "Hide" : "Show"} Advanced Controls
      </button>
    </div>
  )
}
