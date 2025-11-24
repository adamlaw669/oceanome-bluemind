import type React from "react"
import { Header } from "@/components/header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">{children}</div>
    </div>
  )
}
