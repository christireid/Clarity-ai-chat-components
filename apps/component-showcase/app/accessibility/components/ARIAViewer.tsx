'use client'

import { useState } from 'react'
import { Search, Code2, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ARIAAttribute {
  name: string
  value: string
  element: string
  valid: boolean
  description?: string
}

export function ARIAViewer() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const ariaAttributes: ARIAAttribute[] = [
    {
      name: 'aria-label',
      value: 'Send message',
      element: 'button.send-button',
      valid: true,
      description: 'Provides accessible name for the send button',
    },
    {
      name: 'aria-live',
      value: 'polite',
      element: 'div.chat-messages',
      valid: true,
      description: 'Announces new messages to screen readers',
    },
    {
      name: 'aria-multiline',
      value: 'true',
      element: 'textarea.message-input',
      valid: true,
      description: 'Indicates multi-line text input',
    },
    {
      name: 'aria-expanded',
      value: 'false',
      element: 'button.menu-toggle',
      valid: true,
      description: 'Indicates collapsed state of menu',
    },
    {
      name: 'aria-describedby',
      value: 'error-message',
      element: 'input.email',
      valid: true,
      description: 'Links input to error message',
    },
    {
      name: 'aria-invalid',
      value: 'true',
      element: 'input.email',
      valid: true,
      description: 'Indicates validation error',
    },
    {
      name: 'aria-hidden',
      value: 'true',
      element: 'span.icon',
      valid: true,
      description: 'Hides decorative icon from screen readers',
    },
    {
      name: 'aria-labelledby',
      value: 'dialog-title',
      element: 'div.dialog',
      valid: true,
      description: 'References dialog title element',
    },
  ]

  const filteredAttributes = ariaAttributes.filter(
    (attr) =>
      attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.element.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="glass-panel p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ARIA attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold text-green-500">{ariaAttributes.length}</p>
          <p className="text-sm text-muted-foreground">Total Attributes</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold text-green-500">
            {ariaAttributes.filter((a) => a.valid).length}
          </p>
          <p className="text-sm text-muted-foreground">Valid</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold text-red-500">
            {ariaAttributes.filter((a) => !a.valid).length}
          </p>
          <p className="text-sm text-muted-foreground">Issues</p>
        </div>
      </div>

      {/* Attributes List */}
      <div className="space-y-3">
        {filteredAttributes.map((attr, index) => (
          <div key={index} className="glass-panel p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'icon-container-sm',
                    attr.valid ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {attr.valid ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <code className="font-mono text-sm">{attr.name}</code>
                    <span className="badge-glass text-xs">{attr.element}</span>
                  </h4>
                  {attr.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {attr.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${attr.name}="${attr.value}"`)}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied === `${attr.name}="${attr.value}"` ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="glass-panel p-3 bg-background/30">
              <div className="flex items-center gap-2 text-sm font-mono">
                <Code2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{attr.name}=</span>
                <span className="text-primary">"{attr.value}"</span>
              </div>
            </div>
          </div>
        ))}

        {filteredAttributes.length === 0 && (
          <div className="glass-panel p-8 text-center">
            <p className="text-muted-foreground">
              No ARIA attributes found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Common ARIA Patterns */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Common ARIA Patterns</h3>
        <div className="space-y-3">
          {[
            {
              pattern: 'Button with Icon',
              code: '<button aria-label="Send message"><SendIcon /></button>',
            },
            {
              pattern: 'Live Region',
              code: '<div aria-live="polite" aria-atomic="true">New message</div>',
            },
            {
              pattern: 'Expandable Section',
              code: '<button aria-expanded="false" aria-controls="content-id">Toggle</button>',
            },
            {
              pattern: 'Form Error',
              code: '<input aria-invalid="true" aria-describedby="error-id" />',
            },
          ].map((pattern, index) => (
            <div key={index} className="glass-panel p-3 bg-background/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{pattern.pattern}</p>
                <button
                  onClick={() => handleCopy(pattern.code)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copied === pattern.code ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <code className="text-xs font-mono text-muted-foreground break-all">
                {pattern.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
