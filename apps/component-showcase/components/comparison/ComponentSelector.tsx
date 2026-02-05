'use client'

import { useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ComponentOption {
  id: string
  name: string
  category: string
  description: string
}

const AVAILABLE_COMPONENTS: ComponentOption[] = [
  // Chat Components
  { id: 'chat-basic', name: 'Basic Chat', category: 'Chat', description: 'Simple chat interface' },
  { id: 'chat-streaming', name: 'Streaming Chat', category: 'Chat', description: 'Real-time streaming' },
  { id: 'chat-memory', name: 'Chat with Memory', category: 'Chat', description: 'Context-aware chat' },

  // Message Components
  { id: 'message-bubble', name: 'Message Bubble', category: 'Messages', description: 'Standard message display' },
  { id: 'message-streaming', name: 'Streaming Message', category: 'Messages', description: 'Animated typing effect' },
  { id: 'message-code', name: 'Code Message', category: 'Messages', description: 'Syntax highlighted messages' },

  // Input Components
  { id: 'input-basic', name: 'Basic Input', category: 'Input', description: 'Text input field' },
  { id: 'input-voice', name: 'Voice Input', category: 'Input', description: 'Speech-to-text input' },
  { id: 'input-file', name: 'File Upload Input', category: 'Input', description: 'Drag and drop files' },

  // AI Reasoning
  { id: 'thinking-indicator', name: 'Thinking Indicator', category: 'AI Reasoning', description: 'AI processing state' },
  { id: 'chain-of-thought', name: 'Chain of Thought', category: 'AI Reasoning', description: 'Step-by-step reasoning' },
  { id: 'agent-panel', name: 'Agent Panel', category: 'AI Reasoning', description: 'Multi-agent coordination' },

  // Tools
  { id: 'tool-card', name: 'Tool Card', category: 'Tools', description: 'Tool execution display' },
  { id: 'tool-result', name: 'Tool Result', category: 'Tools', description: 'Tool output formatting' },

  // Token Management
  { id: 'token-counter', name: 'Token Counter', category: 'Token', description: 'Real-time token count' },
  { id: 'token-budget', name: 'Token Budget', category: 'Token', description: 'Usage tracking' },

  // Primitives
  { id: 'button-primary', name: 'Primary Button', category: 'Primitives', description: 'Main action button' },
  { id: 'button-secondary', name: 'Secondary Button', category: 'Primitives', description: 'Secondary actions' },
  { id: 'dialog', name: 'Dialog', category: 'Primitives', description: 'Modal dialogs' },
  { id: 'tooltip', name: 'Tooltip', category: 'Primitives', description: 'Contextual hints' },
]

interface ComponentSelectorProps {
  label: string
  selectedComponent: string | null
  onSelect: (componentId: string) => void
  excludeComponent?: string | null
}

export function ComponentSelector({
  label,
  selectedComponent,
  onSelect,
  excludeComponent,
}: ComponentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredComponents = AVAILABLE_COMPONENTS.filter((comp) => {
    if (comp.id === excludeComponent) return false
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      comp.name.toLowerCase().includes(query) ||
      comp.category.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query)
    )
  })

  const groupedComponents = filteredComponents.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = []
    acc[comp.category].push(comp)
    return acc
  }, {} as Record<string, ComponentOption[]>)

  const selectedComp = AVAILABLE_COMPONENTS.find((c) => c.id === selectedComponent)

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>

      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'glass-card w-full p-4 flex items-center justify-between text-left transition-all',
          isOpen && 'ring-2 ring-primary'
        )}
      >
        <div className="flex-1">
          {selectedComp ? (
            <>
              <div className="font-medium">{selectedComp.name}</div>
              <div className="text-sm text-muted-foreground">{selectedComp.category}</div>
            </>
          ) : (
            <div className="text-muted-foreground">Select a component...</div>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-[500px] overflow-y-auto z-50">
            {/* Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-panel text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Component List */}
            {Object.entries(groupedComponents).map(([category, components]) => (
              <div key={category} className="mb-3 last:mb-0">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wide">
                  {category}
                </div>
                {components.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onSelect(comp.id)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2',
                      selectedComponent === comp.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {selectedComponent === comp.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{comp.name}</div>
                      <div className={cn(
                        "text-xs truncate",
                        selectedComponent === comp.id
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      )}>
                        {comp.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {filteredComponents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No components found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
