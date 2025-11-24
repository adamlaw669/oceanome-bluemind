"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DataVisualizationProps {
  type: "line" | "bar" | "area"
  data: any[]
  dataKey: string
  stroke?: string
  fill?: string
}

export function DataVisualization({
  type,
  data,
  dataKey,
  stroke = "#00d4ff",
  fill = "#00d4ff",
}: DataVisualizationProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === "line" && (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={{ fill: stroke, r: 4 }} />
        </LineChart>
      )}
      {type === "bar" && (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
          <Legend />
          <Bar dataKey={dataKey} fill={fill} radius={8} />
        </BarChart>
      )}
      {type === "area" && (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
          <Legend />
          <Area type="monotone" dataKey={dataKey} fill={fill} stroke={stroke} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}
