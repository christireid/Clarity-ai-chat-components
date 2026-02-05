'use client'

import { cn } from '@clarity-chat/primitives'
import {
  GraduationCap,
  Layers,
  Code2,
  Plug,
  Brain,
  Zap,
  Palette,
} from 'lucide-react'

interface SuggestionCard {
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
}

const SUGGESTIONS: SuggestionCard[] = [
  {
    icon: <Layers className="h-5 w-5 text-blue-500" />,
    title: 'Core Components',
    description: 'Learn about ChatWindow, ChatInput, and MessageBubble',
    prompt: 'What are the core components in Clarity Chat and how do they work together?',
  },
  {
    icon: <Code2 className="h-5 w-5 text-green-500" />,
    title: 'Hooks & State',
    description: 'Explore useClarityChat and useStreaming hooks',
    prompt: 'How do I use the useClarityChat hook to manage chat state?',
  },
  {
    icon: <Plug className="h-5 w-5 text-orange-500" />,
    title: 'Provider Adapters',
    description: 'Set up OpenAI, Anthropic, or Google adapters',
    prompt: 'How do I set up the Anthropic adapter to use Claude 3.5 Sonnet?',
  },
  {
    icon: <Brain className="h-5 w-5 text-purple-500" />,
    title: 'Memory System',
    description: 'Configure conversation memory strategies',
    prompt: 'Explain the different memory strategies available in Clarity Chat.',
  },
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    title: 'Token Optimization',
    description: 'Reduce costs with smart token management',
    prompt: 'How can I optimize token usage and reduce API costs with Clarity Chat?',
  },
  {
    icon: <Palette className="h-5 w-5 text-pink-500" />,
    title: 'Full App Setup',
    description: 'Build a complete chat application from scratch',
    prompt: 'Show me a complete example of setting up a ClarityChatApp with all features enabled.',
  },
]

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void
  className?: string
}

export function WelcomeScreen({ onSuggestionClick, className }: WelcomeScreenProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center h-full px-8', className)}>
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Learn Clarity Chat Components
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Ask me anything about the Clarity Chat library. I can explain components,
            show code examples, describe hooks, and help you build chat applications.
            Try typing <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">/</kbd> for
            commands or <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">@</kbd> to
            mention a specific component.
          </p>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={cn(
                'flex flex-col items-start gap-2 p-4 rounded-xl border bg-card/50',
                'hover:bg-card hover:shadow-md hover:border-primary/20',
                'transition-all duration-200 text-left group'
              )}
            >
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                {suggestion.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{suggestion.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {suggestion.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-xs text-muted-foreground/60 pt-2">
          Powered by a RAG knowledge base with 30+ documented components, hooks, and APIs
        </p>
      </div>
    </div>
  )
}
