'use client'

import { Welcome, type WelcomeSuggestion } from '@clarity-chat/react'
import {
  Blocks,
  Code,
  FileText,
  GitBranch,
  Layout,
  Braces,
  Database,
} from 'lucide-react'

const suggestions: WelcomeSuggestion[] = [
  {
    text: 'Create a React card component with TypeScript props for title, description, image, and actions',
    icon: <Code className="h-5 w-5" />,
    category: 'Code',
  },
  {
    text: 'Create a mermaid flowchart diagram showing a user authentication flow',
    icon: <GitBranch className="h-5 w-5" />,
    category: 'Diagram',
  },
  {
    text: 'Write comprehensive API documentation for a REST endpoint with examples',
    icon: <FileText className="h-5 w-5" />,
    category: 'Document',
  },
  {
    text: 'Build a responsive dashboard HTML layout with sidebar, header, and content grid',
    icon: <Layout className="h-5 w-5" />,
    category: 'HTML',
  },
  {
    text: 'Create a JSON schema for an e-commerce product catalog with nested categories',
    icon: <Braces className="h-5 w-5" />,
    category: 'JSON',
  },
  {
    text: 'Create a TypeScript utility module with date formatting, string helpers, and validation functions',
    icon: <Database className="h-5 w-5" />,
    category: 'Code',
  },
]

interface ArtifactWelcomeScreenProps {
  onSuggestionClick: (text: string) => void
}

export function ArtifactWelcomeScreen({
  onSuggestionClick,
}: ArtifactWelcomeScreenProps) {
  return (
    <Welcome
      title="Artifact Studio"
      description="Create code, documents, diagrams, and interactive previews. Artifacts appear in the side panel where you can edit, version, and export them."
      logo={
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Blocks className="h-8 w-8 text-white" />
        </div>
      }
      variant="centered"
      suggestions={suggestions}
      onSuggestionClick={(s) => onSuggestionClick(s.text)}
      footer={
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-muted/30">Code</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Documents</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">Diagrams</span>
          <span className="px-2 py-1 rounded-full bg-muted/30">
            HTML Preview
          </span>
          <span className="px-2 py-1 rounded-full bg-muted/30">
            Version History
          </span>
        </div>
      }
    />
  )
}
