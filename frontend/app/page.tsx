"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Waves, Droplet, Brain, BookOpen, Zap } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Explore the Living <span className="text-primary">Ocean</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Oceanome is an interactive simulator that lets you understand and manipulate ocean microbiome ecosystems.
              See how these microscopic organisms shape our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => router.push("/auth/signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/learn")}>
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.1),transparent_50%)]"></div>
            <Waves className="w-48 h-48 text-accent/30" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Interactive Simulation",
                desc: "Manipulate variables and watch the ecosystem respond in real-time",
              },
              {
                icon: Droplet,
                title: "Real Science",
                desc: "Based on authentic oceanographic research and microbial ecology",
              },
              {
                icon: BookOpen,
                title: "Educational Content",
                desc: "Learn about different microbes and their ecological roles",
              },
              {
                icon: Zap,
                title: "Live Predictions",
                desc: "See how changes in nutrients, temperature, and light affect populations",
              },
              { icon: Waves, title: "Scenario Builder", desc: "Create and test environmental scenarios" },
              { icon: Brain, title: "Expert Insights", desc: "Understand the science behind ocean ecosystems" },
            ].map((feature, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition">
                <feature.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Dive Deep?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Join thousands learning about ocean microbiomes through interactive exploration.
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => router.push("/auth/signup")}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Waves className="w-6 h-6 text-accent" />
                <h3 className="font-bold text-foreground">Oceanome</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Understanding ocean microbiomes through interactive simulation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">Dashboard</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Action Lab</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Learn</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">Documentation</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">FAQ</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Support</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">About</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Blog</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Contact</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Oceanome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
