/**
 * Component Library Sidebar
 * Browse and select component templates
 */

import { Search } from 'lucide-react'
import { useState } from 'react'

interface ComponentLibraryProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const categories = {
  'Getting Started': [
    { id: 'basic', name: 'Basic Example', description: 'Simple card and button' },
    { id: 'simple-chat', name: 'Simple Chat', description: 'Chat with messages' },
    { id: 'streaming', name: 'Streaming', description: 'Streaming response demo' },
    { id: 'conversation', name: 'Conversation', description: 'Multi-turn chat' },
  ],
  'Chat Components': [
    { id: 'chat-window', name: 'Chat Window', description: 'Full chat interface' },
    { id: 'message-bubble', name: 'Message Variants', description: 'Different message types' },
    { id: 'chat-input', name: 'Chat Input', description: 'Input with features' },
    { id: 'thinking-indicator', name: 'Thinking Indicator', description: 'Loading states' },
  ],
  'UI Components': [
    { id: 'button-showcase', name: 'Buttons', description: 'All button variants' },
    { id: 'input-showcase', name: 'Inputs', description: 'All input variants' },
    { id: 'card-showcase', name: 'Cards', description: 'Card layouts' },
  ],
  'Advanced': [
    { id: 'all-components', name: 'All Components', description: 'Complete showcase' },
    { id: 'form-example', name: 'Form Example', description: 'Working form' },
    { id: 'full-chat-app', name: 'Full Chat App', description: 'Complete app' },
    { id: 'theme-demo', name: 'Theme Demo', description: 'Light/dark toggle' },
    { id: 'responsive-demo', name: 'Responsive', description: 'Mobile/tablet/desktop' },
  ],
}

export function ComponentLibrary({
  selectedTemplate,
  onTemplateChange,
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter templates based on search
  const filteredCategories = Object.entries(categories).reduce((acc, [category, items]) => {
    const filtered = items.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as typeof categories)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
          Templates
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-3 py-2 text-sm bg-background border border-input/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-input transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No templates found
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((template) => {
                  const isSelected = selectedTemplate === template.id
                  return (
                    <button
                      key={template.id}
                      onClick={() => onTemplateChange(template.id)}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all
                        ${
                          isSelected
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-xs'
                            : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                        }
                      `}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>
                        {template.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">💡 Pro Tip:</p>
          <p>All templates use actual Clarity Chat components. Edit and experiment!</p>
        </div>
      </div>
    </div>
  )
}
