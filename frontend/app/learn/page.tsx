"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MicrobeCard } from "@/components/microbe-card"
import { Button } from "@/components/ui/button"
import { microbes, lessons } from "@/lib/educational-content"
import { BookOpen, Microscope, ChevronDown } from "lucide-react"

export default function LearnPage() {
  const [expandedMicrobe, setExpandedMicrobe] = useState<string | null>(null)
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["All", ...new Set(lessons.map((l) => l.category))]
  const filteredLessons =
    selectedCategory && selectedCategory !== "All" ? lessons.filter((l) => l.category === selectedCategory) : lessons

  return (
    <div className="min-h-screen bg-background">
      <Header showNav={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Learning Center</h1>
          <p className="text-lg text-muted-foreground">Explore ocean microbiomes and improve your understanding</p>
        </div>

        {/* Microbes Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Microscope className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">Key Microorganisms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microbes.map((microbe) => (
              <MicrobeCard
                key={microbe.id}
                microbe={microbe}
                onLearnMore={(id) => setExpandedMicrobe(expandedMicrobe === id ? null : id)}
              />
            ))}
          </div>

          {/* Microbe Details Modal */}
          {expandedMicrobe && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                  {(() => {
                    const microbe = microbes.find((m) => m.id === expandedMicrobe)
                    if (!microbe) return null
                    return (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-5xl mb-3">{microbe.icon}</p>
                            <h3 className="text-2xl font-bold text-foreground">{microbe.name}</h3>
                            <p className="text-muted-foreground italic mb-4">{microbe.scientificName}</p>
                          </div>
                          <button
                            onClick={() => setExpandedMicrobe(null)}
                            className="text-2xl text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </div>

                        <p className="text-foreground mb-6">{microbe.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-background rounded-lg p-4">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Cell Type</p>
                            <p className="text-foreground font-semibold">{microbe.cellType}</p>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Size</p>
                            <p className="text-foreground font-semibold">{microbe.size}</p>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Depth Range</p>
                            <p className="text-foreground font-semibold">{microbe.depth}</p>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <p className="text-sm text-muted-foreground font-medium mb-1">Role</p>
                            <p className="text-foreground font-semibold">{microbe.role}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {microbe.features.map((feature, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Lessons Section */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">Educational Lessons</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat || (cat === "All" && !selectedCategory) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-card/80 transition"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                      <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{lesson.duration} min</span>
                      <span>{lesson.category}</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition ${expandedLesson === lesson.id ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedLesson === lesson.id && (
                  <div className="bg-background/50 border-t border-border p-6">
                    <div className="prose prose-invert max-w-none mb-6">
                      <p className="text-foreground whitespace-pre-wrap">{lesson.content}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Takeaways</h4>
                      <ul className="space-y-2">
                        {lesson.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-accent">✓</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
