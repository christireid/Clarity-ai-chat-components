'use client'

import { cn } from '@clarity-chat/primitives'
import { Welcome, type WelcomeSuggestion } from '@clarity-chat/react'
import {
  GraduationCap,
  Layers,
  Code2,
  Plug,
  Brain,
  Zap,
  Palette,
} from 'lucide-react'

const suggestions: WelcomeSuggestion[] = [
  {
    text: 'What are the core components in Clarity Chat and how do they work together?',
    icon: <Layers className="h-5 w-5 text-blue-500" />,
    category: 'Components',
  },
  {
    text: 'How do I use the useClarityChat hook to manage chat state?',
    icon: <Code2 className="h-5 w-5 text-green-500" />,
    category: 'Hooks',
  },
  {
    text: 'How do I set up the Anthropic adapter to use Claude 3.5 Sonnet?',
    icon: <Plug className="h-5 w-5 text-orange-500" />,
    category: 'Adapters',
  },
  {
    text: 'Explain the different memory strategies available in Clarity Chat.',
    icon: <Brain className="h-5 w-5 text-purple-500" />,
    category: 'Memory',
  },
  {
    text: 'How can I optimize token usage and reduce API costs with Clarity Chat?',
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    category: 'Optimization',
  },
  {
    text: 'Show me a complete example of setting up a ClarityChatApp with all features enabled.',
    icon: <Palette className="h-5 w-5 text-pink-500" />,
    category: 'Setup',
  },
]

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void
  className?: string
}

export function WelcomeScreen({
  onSuggestionClick,
  className,
}: WelcomeScreenProps) {
  return (
    <Welcome
      title="Learn Clarity Chat Components"
      description="Ask me anything about the Clarity Chat library. I can explain components, show code examples, describe hooks, and help you build chat applications."
      logo={
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
      }
      variant="centered"
      suggestions={suggestions}
      onSuggestionClick={(s) => onSuggestionClick(s.text)}
      className={cn('h-full', className)}
      footer={
        <p className="text-xs text-muted-foreground/60 pt-2">
          Powered by a RAG knowledge base with 30+ documented components, hooks,
          and APIs
        </p>
      }
    />
  )
}
