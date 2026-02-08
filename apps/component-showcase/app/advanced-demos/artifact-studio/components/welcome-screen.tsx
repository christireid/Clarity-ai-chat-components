'use client'

import { Blocks, Code, FileText, GitBranch, Layout, Braces, Database } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void
}

const suggestions = [
  { icon: Code, label: 'Create a React Component', prompt: 'Create a React card component with TypeScript props for title, description, image, and actions', color: 'text-blue-500 bg-blue-500/10' },
  { icon: GitBranch, label: 'Generate a Flowchart', prompt: 'Create a mermaid flowchart diagram showing a user authentication flow', color: 'text-violet-500 bg-violet-500/10' },
  { icon: FileText, label: 'Write Documentation', prompt: 'Write comprehensive API documentation for a REST endpoint with examples', color: 'text-emerald-500 bg-emerald-500/10' },
  { icon: Layout, label: 'Build an HTML Layout', prompt: 'Build a responsive dashboard HTML layout with sidebar, header, and content grid', color: 'text-red-500 bg-red-500/10' },
  { icon: Braces, label: 'Design a Data Schema', prompt: 'Create a JSON schema for an e-commerce product catalog with nested categories', color: 'text-yellow-500 bg-yellow-500/10' },
  { icon: Database, label: 'Create a Utility Module', prompt: 'Create a TypeScript utility module with date formatting, string helpers, and validation functions', color: 'text-cyan-500 bg-cyan-500/10' },
]

export function ArtifactWelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Blocks className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Artifact Studio</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Create code, documents, diagrams, and interactive previews. Artifacts appear in the side panel where you can edit, version, and export them.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestionClick(s.prompt)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center hover:bg-muted/50 transition-all hover:scale-[1.02] border border-transparent hover:border-muted-foreground/10 group"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-medium group-hover:text-primary transition-colors">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-muted/30">Code</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Documents</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Diagrams</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">HTML Preview</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Version History</span>
        </div>
      </div>
    </div>
  )
}
