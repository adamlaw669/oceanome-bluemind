"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Waves } from 'lucide-react'

interface HeaderProps {
  showNav?: boolean
  onLogout?: () => void
}

export function Header({ showNav = false, onLogout }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Oceanome Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-primary">Oceanome</h1>
        </div>

        {showNav && (
          <nav className="hidden md:flex items-center gap-6">
            <button
              className="text-foreground/70 hover:text-foreground transition"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="text-foreground/70 hover:text-foreground transition"
              onClick={() => router.push("/action-lab")}
            >
              Action Lab
            </button>
            <button
              className="text-foreground/70 hover:text-foreground transition"
              onClick={() => router.push("/learn")}
            >
              Learn
            </button>
          </nav>
        )}

        {showNav && onLogout && (
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  )
}
