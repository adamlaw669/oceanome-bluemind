"use client"

import type React from "react"

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  description?: string
  icon?: React.ReactNode
  trend?: number
}

export function StatCard({ label, value, unit, description, icon, trend }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
          {trend !== undefined && (
            <p
              className={`text-xs mt-2 ${trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && <div className="text-accent ml-2">{icon}</div>}
      </div>
    </div>
  )
}
