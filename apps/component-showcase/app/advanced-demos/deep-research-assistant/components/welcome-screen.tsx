'use client'

import { Globe, Search, BarChart3, BookOpen, Newspaper, Microscope } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void
}

const suggestions = [
  { icon: Microscope, label: 'Research AI Frameworks', prompt: 'Research the latest AI frameworks for building chat applications in 2024-2025, comparing their features and community adoption', color: 'text-violet-500 bg-violet-500/10' },
  { icon: BarChart3, label: 'Analyze Market Trends', prompt: 'Analyze the current market trends in AI-powered developer tools and how they impact React ecosystem', color: 'text-blue-500 bg-blue-500/10' },
  { icon: Search, label: 'Compare Technologies', prompt: 'Compare the top 5 React chat UI libraries: features, performance, bundle size, and community support', color: 'text-emerald-500 bg-emerald-500/10' },
  { icon: BookOpen, label: 'Explore Academic Papers', prompt: 'Find and summarize recent academic papers on RAG systems and their practical applications in production', color: 'text-amber-500 bg-amber-500/10' },
]

export function ResearchWelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Deep Research Assistant</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Perform multi-step research with enriched sources, MCP server tools, and cross-referenced findings. Use /research for deep analysis or ask any question.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestionClick(s.prompt)}
              className="flex items-center gap-3 p-3.5 rounded-xl text-left hover:bg-muted/50 transition-all hover:scale-[1.02] border border-transparent hover:border-muted-foreground/10 group"
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium group-hover:text-primary transition-colors">{s.label}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">{s.prompt.slice(0, 50)}...</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-muted/30">MCP Servers</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Deep Research</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Tool Plugins</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Enriched Sources</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Citations</span>
        </div>
      </div>
    </div>
  )
}
