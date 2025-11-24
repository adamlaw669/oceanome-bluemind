"use client"

import type { Microbe } from "@/lib/educational-content"
import { Button } from "@/components/ui/button"

interface MicrobeCardProps {
  microbe: Microbe
  onLearnMore?: (id: string) => void
}

export function MicrobeCard({ microbe, onLearnMore }: MicrobeCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl">{microbe.icon}</div>
        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-medium">{microbe.role}</span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{microbe.name}</h3>
      <p className="text-xs text-muted-foreground mb-3 italic">{microbe.scientificName}</p>
      <p className="text-sm text-muted-foreground mb-4">{microbe.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <p className="text-muted-foreground font-medium">Cell Type</p>
          <p className="text-foreground">{microbe.cellType}</p>
        </div>
        <div>
          <p className="text-muted-foreground font-medium">Size</p>
          <p className="text-foreground">{microbe.size}</p>
        </div>
        <div>
          <p className="text-muted-foreground font-medium">Depth</p>
          <p className="text-foreground">{microbe.depth}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground font-medium mb-2">Key Features</p>
        <ul className="space-y-1">
          {microbe.features.slice(0, 2).map((feature, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              • {feature}
            </li>
          ))}
        </ul>
      </div>

      {onLearnMore && (
        <Button
          size="sm"
          onClick={() => onLearnMore(microbe.id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Learn More
        </Button>
      )}
    </div>
  )
}
