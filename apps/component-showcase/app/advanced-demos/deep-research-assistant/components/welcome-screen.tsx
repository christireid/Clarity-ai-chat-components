'use client'

import { memo } from 'react'
import { Welcome, type WelcomeSuggestion } from '@clarity-chat/react'
import { Globe, Search, BarChart3, BookOpen, Microscope } from 'lucide-react'

const suggestions: WelcomeSuggestion[] = [
  {
    text: 'Research the latest AI frameworks for building chat applications in 2024-2025, comparing their features and community adoption',
    icon: <Microscope className="h-4 w-4" />,
    category: 'Research',
  },
  {
    text: 'Analyze the current market trends in AI-powered developer tools and how they impact React ecosystem',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'Analysis',
  },
  {
    text: 'Compare the top 5 React chat UI libraries: features, performance, bundle size, and community support',
    icon: <Search className="h-4 w-4" />,
    category: 'Comparison',
  },
  {
    text: 'Find and summarize recent academic papers on RAG systems and their practical applications in production',
    icon: <BookOpen className="h-4 w-4" />,
    category: 'Academic',
  },
]

interface ResearchWelcomeScreenProps {
  onSuggestionClick: (text: string) => void
}

export const ResearchWelcomeScreen = memo(function ResearchWelcomeScreen({
  onSuggestionClick,
}: ResearchWelcomeScreenProps) {
  return (
    <Welcome
      title="Deep Research Assistant"
      description="Perform multi-step research with enriched sources, MCP server tools, and cross-referenced findings. Use /research for deep analysis or ask any question."
      logo={
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Globe className="h-8 w-8 text-white" />
        </div>
      }
      variant="centered"
      suggestions={suggestions}
      onSuggestionClick={(s) => onSuggestionClick(s.text)}
      footer={
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-muted/30">
            MCP Servers
          </span>
          <span className="px-2 py-1 rounded-full bg-muted/30">
            Deep Research
          </span>
          <span className="px-2 py-1 rounded-full bg-muted/30">
            Tool Plugins
          </span>
          <span className="px-2 py-1 rounded-full bg-muted/30">
            Enriched Sources
          </span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Citations</span>
        </div>
      }
    />
  )
})
