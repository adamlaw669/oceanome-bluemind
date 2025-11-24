export interface Microbe {
  id: string
  name: string
  scientificName: string
  description: string
  icon: string
  role: string
  cellType: string
  size: string
  depth: string
  features: string[]
}

export interface Lesson {
  id: string
  title: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: number
  description: string
  content: string
  keyTakeaways: string[]
  relatedMicrobes: string[]
}

export const microbes: Microbe[] = [
  {
    id: "prochlorococcus",
    name: "Prochlorococcus",
    scientificName: "Prochlorococcus marinus",
    description:
      "The most abundant photosynthetic organism on Earth, responsible for about 20% of global oxygen production.",
    icon: "🟢",
    role: "Primary Producer",
    cellType: "Prokaryote",
    size: "0.5-0.8 μm",
    depth: "0-200 m (euphotic zone)",
    features: [
      "Produces ~20% of Earth's oxygen",
      "Ultra-small size enables efficient nutrient uptake",
      "Exists in multiple ecotypes adapted to different light conditions",
      "Temperature dependent growth",
    ],
  },
  {
    id: "vibrio",
    name: "Vibrio",
    scientificName: "Vibrio species",
    description:
      "A diverse genus of heterotrophic bacteria found in marine environments, playing important roles in nutrient cycling.",
    icon: "🦠",
    role: "Decomposer",
    cellType: "Prokaryote",
    size: "0.5-1.5 μm",
    depth: "0-2000+ m",
    features: [
      "Degrades complex organic matter",
      "Important in nutrient recycling",
      "Some species are bioluminescent",
      "Highly motile with flagella",
    ],
  },
  {
    id: "sar11",
    name: "SAR11",
    scientificName: "Pelagibacter ubiquitus",
    description: "One of the most abundant organisms on Earth, this bacterium is central to the microbial loop.",
    icon: "⭐",
    role: "Decomposer",
    cellType: "Prokaryote",
    size: "0.4-0.5 μm",
    depth: "0-200 m",
    features: [
      "~1-2% of all life on Earth",
      "Minimal genome (only 1.5 Mb)",
      "Extremely energy efficient",
      "Critical role in carbon cycling",
    ],
  },
  {
    id: "phaeocystis",
    name: "Phaeocystis",
    scientificName: "Phaeocystis species",
    description:
      "A colonial alga that can form massive harmful algal blooms, but also contributes significantly to primary production.",
    icon: "🌀",
    role: "Primary Producer",
    cellType: "Eukaryote",
    size: "2-8 μm (cells), cm-m (colonies)",
    depth: "0-50 m",
    features: [
      "Can form toxic blooms",
      "Produces dimethyl sulfide (DMS)",
      "Important food source for zooplankton",
      "Colonial and solitary forms",
    ],
  },
  {
    id: "emiliania",
    name: "Emiliania",
    scientificName: "Emiliania huxleyi",
    description:
      "A coccolithophore that produces beautiful calcium carbonate shells, influencing ocean color and carbon cycling.",
    icon: "✨",
    role: "Primary Producer",
    cellType: "Eukaryote",
    size: "4-6 μm",
    depth: "0-100 m",
    features: [
      "Creates calcium carbonate coccoliths",
      "Can be seen from space (white water blooms)",
      "Important in biological carbon pump",
      "Forms protective shell",
    ],
  },
]

export const lessons: Lesson[] = [
  {
    id: "intro-to-microbes",
    title: "Introduction to Ocean Microbes",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: 5,
    description: "Learn the basics of marine microorganisms and their importance to ocean ecosystems.",
    content: `Ocean microbes are the foundation of marine life. Despite their microscopic size, they collectively weigh more than all fish in the ocean. These organisms drive nutrient cycles, produce oxygen, and form the base of marine food webs.

There are two main types of microbes: prokaryotes (bacteria and archaea) and eukaryotes (protists and some algae). Prokaryotes are typically smaller and more metabolically diverse. Eukaryotes include many photosynthetic organisms that produce oxygen.`,
    keyTakeaways: [
      "Microbes are the most abundant organisms in the ocean",
      "They drive critical biogeochemical cycles",
      "Two main groups: prokaryotes and eukaryotes",
    ],
    relatedMicrobes: ["prochlorococcus", "vibrio", "sar11"],
  },
  {
    id: "carbon-cycle",
    title: "The Ocean Carbon Cycle",
    category: "Biogeochemistry",
    difficulty: "Intermediate",
    duration: 8,
    description: "Understand how microbes help regulate Earth's climate by cycling carbon.",
    content: `The ocean carbon cycle is driven by microbes at every step. Photosynthetic microbes (phytoplankton) convert dissolved CO2 into organic matter. Zooplankton consume phytoplankton, and bacteria decompose organic matter, returning CO2 to the water. Some organic matter sinks to the deep ocean, sequestering carbon for centuries.

This biological carbon pump is crucial for climate regulation. About 50% of the CO2 fixed by photosynthesis in the ocean is due to microbes.`,
    keyTakeaways: [
      "Microbes drive the biological carbon pump",
      "Phytoplankton fix CO2 through photosynthesis",
      "Decomposition returns carbon to the water",
    ],
    relatedMicrobes: ["prochlorococcus", "phaeocystis", "emiliania"],
  },
  {
    id: "nutrient-cycling",
    title: "Nutrient Cycling in the Ocean",
    category: "Biogeochemistry",
    difficulty: "Intermediate",
    duration: 7,
    description: "Explore how nitrogen, phosphorus, and iron cycle through microbial communities.",
    content: `Nutrients like nitrogen, phosphorus, and iron are essential for microbial growth. Nitrogen fixers convert atmospheric N2 into ammonium that other organisms can use. Heterotrophic bacteria decompose organic matter, releasing nutrients back into the water.

Different microbes specialize in different nutrients. Some are limited by nitrogen, others by phosphorus or iron. Understanding these limitations is key to predicting ecosystem responses to environmental change.`,
    keyTakeaways: [
      "Nutrient availability limits microbial growth",
      "Nitrogen fixation is performed by specialized bacteria",
      "Decomposition regenerates nutrients",
    ],
    relatedMicrobes: ["vibrio", "sar11"],
  },
  {
    id: "adaptation-extremes",
    title: "Microbial Adaptation to Extreme Environments",
    category: "Ecology",
    difficulty: "Advanced",
    duration: 10,
    description: "Discover how microbes thrive in the most extreme ocean conditions.",
    content: `Ocean microbes colonize every environment, from warm surface waters to cold, high-pressure depths. Some exist in oxygen-free zones. Others in extremely salty waters. This remarkable adaptability is due to their genetic flexibility and rapid evolution.

Extremophiles have evolved specialized proteins and metabolic pathways to survive harsh conditions. These adaptations include salt pumps, pressure-resistant membranes, and chemosynthetic pathways that don't require light or oxygen.`,
    keyTakeaways: [
      "Microbes survive in extreme conditions",
      "Rapid evolution enables quick adaptation",
      "Specialized proteins handle stress",
    ],
    relatedMicrobes: ["vibrio"],
  },
]
