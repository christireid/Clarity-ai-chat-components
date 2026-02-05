'use client'

import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

interface ComponentPreviewProps {
  componentId: string
}

// Mock component renderer - in a real implementation, this would dynamically import and render actual components
function ComponentRenderer({ componentId }: { componentId: string }) {
  // Simulate different component types
  if (componentId.includes('chat')) {
    return (
      <div className="space-y-3">
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl bg-muted p-4">
            <p className="text-sm">Hello! How can I help you today?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground p-4">
            <p className="text-sm">I need help with the component library.</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl bg-muted p-4">
            <p className="text-sm">
              I'd be happy to help! What specific aspect would you like to know about?
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (componentId.includes('message')) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-muted p-4">
          <p className="text-sm mb-2">This is a message component with various features:</p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• Markdown support</li>
            <li>• Code highlighting</li>
            <li>• Streaming animation</li>
          </ul>
        </div>
      </div>
    )
  }

  if (componentId.includes('input')) {
    return (
      <div className="space-y-4">
        <div className="glass-panel rounded-lg p-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-transparent border-none outline-none text-sm"
            disabled
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded-lg glass-panel text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            Send
          </button>
        </div>
      </div>
    )
  }

  if (componentId.includes('button')) {
    return (
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          Primary Button
        </button>
        <button className="px-6 py-2 rounded-lg border border-border text-sm font-medium">
          Secondary Button
        </button>
        <button className="px-6 py-2 rounded-lg bg-muted text-sm font-medium">
          Muted Button
        </button>
      </div>
    )
  }

  if (componentId.includes('thinking') || componentId.includes('reasoning')) {
    return (
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          </div>
          <div>
            <div className="text-sm font-medium">Thinking...</div>
            <div className="text-xs text-muted-foreground">Analyzing your request</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
            <div className="text-sm text-muted-foreground">Understanding context</div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <div className="text-sm text-muted-foreground">Formulating response</div>
          </div>
        </div>
      </div>
    )
  }

  if (componentId.includes('token')) {
    return (
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Token Usage</span>
          <span className="text-xs text-muted-foreground">1,234 / 4,000</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-[30%]" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">70% remaining</div>
      </div>
    )
  }

  // Default preview
  return (
    <div className="glass-panel rounded-lg p-6 text-center">
      <div className="text-sm text-muted-foreground mb-2">Component Preview</div>
      <div className="text-lg font-semibold">{componentId}</div>
    </div>
  )
}

export function ComponentPreview({ componentId }: ComponentPreviewProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ComponentRenderer componentId={componentId} />
    </Suspense>
  )
}
