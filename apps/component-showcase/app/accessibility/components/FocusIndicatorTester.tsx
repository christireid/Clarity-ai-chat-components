'use client'

import { useState } from 'react'
import { Focus, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

export function FocusIndicatorTester() {
  const [selectedStyle, setSelectedStyle] = useState<string>('default')

  const focusStyles = [
    {
      id: 'default',
      name: 'Default Browser',
      style: 'focus:outline-2 focus:outline-blue-500 focus:outline-offset-2',
      description: 'Browser default focus style',
      wcag: true,
    },
    {
      id: 'ring',
      name: 'Ring Style',
      style: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
      description: 'Tailwind ring utility',
      wcag: true,
    },
    {
      id: 'solid',
      name: 'Solid Border',
      style: 'focus:border-2 focus:border-blue-500',
      description: 'Solid border focus',
      wcag: true,
    },
    {
      id: 'shadow',
      name: 'Box Shadow',
      style: 'focus:shadow-lg focus:shadow-blue-500/50',
      description: 'Shadow-based focus',
      wcag: false,
    },
    {
      id: 'underline',
      name: 'Underline',
      style: 'focus:border-b-2 focus:border-blue-500',
      description: 'Underline focus',
      wcag: false,
    },
    {
      id: 'inset',
      name: 'Inset Ring',
      style: 'focus:ring-2 focus:ring-inset focus:ring-primary',
      description: 'Inset ring style',
      wcag: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Select Focus Style</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {focusStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={cn(
                'glass-panel p-4 text-left transition-all',
                selectedStyle === style.id && 'ring-2 ring-primary'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{style.name}</span>
                {style.wcag ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Test Area */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Test Focus Indicators</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tab through the elements below to test the focus style
        </p>

        <div className="space-y-4">
          {/* Buttons */}
          <div>
            <label className="text-sm font-medium mb-2 block">Buttons</label>
            <div className="flex flex-wrap gap-3">
              {['Primary', 'Secondary', 'Danger'].map((label) => (
                <button
                  key={label}
                  className={cn(
                    'px-4 py-2 rounded-lg glass font-medium text-sm',
                    focusStyles.find((s) => s.id === selectedStyle)?.style
                  )}
                >
                  {label} Button
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div>
            <label className="text-sm font-medium mb-2 block">Input Fields</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Text input"
                className={cn(
                  'w-full px-3 py-2 rounded-lg glass',
                  focusStyles.find((s) => s.id === selectedStyle)?.style
                )}
              />
              <input
                type="email"
                placeholder="Email input"
                className={cn(
                  'w-full px-3 py-2 rounded-lg glass',
                  focusStyles.find((s) => s.id === selectedStyle)?.style
                )}
              />
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="text-sm font-medium mb-2 block">Textarea</label>
            <textarea
              placeholder="Type your message..."
              rows={3}
              className={cn(
                'w-full px-3 py-2 rounded-lg glass resize-none',
                focusStyles.find((s) => s.id === selectedStyle)?.style
              )}
            />
          </div>

          {/* Links */}
          <div>
            <label className="text-sm font-medium mb-2 block">Links</label>
            <div className="flex flex-wrap gap-4">
              {['Learn more', 'Documentation', 'Contact us'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className={cn(
                    'text-primary hover:underline',
                    focusStyles.find((s) => s.id === selectedStyle)?.style
                  )}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div>
            <label className="text-sm font-medium mb-2 block">Checkboxes</label>
            <div className="space-y-2">
              {['Option 1', 'Option 2', 'Option 3'].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className={cn(
                      'w-4 h-4 rounded border-border',
                      focusStyles.find((s) => s.id === selectedStyle)?.style
                    )}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Radio Buttons */}
          <div>
            <label className="text-sm font-medium mb-2 block">Radio Buttons</label>
            <div className="space-y-2">
              {['Choice A', 'Choice B', 'Choice C'].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="test-radio"
                    className={cn(
                      'w-4 h-4',
                      focusStyles.find((s) => s.id === selectedStyle)?.style
                    )}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Focus Visibility Requirements */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">WCAG Focus Requirements</h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 border-l-4 border-green-500 bg-background/30">
            <p className="font-medium text-sm mb-2">✓ Required (WCAG 2.1 Level AA)</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Focus indicator must be visible</li>
              <li>• Minimum 3:1 contrast ratio against background</li>
              <li>• Must not be obscured by other content</li>
            </ul>
          </div>

          <div className="glass-panel p-4 border-l-4 border-blue-500 bg-background/30">
            <p className="font-medium text-sm mb-2">✓ Enhanced (WCAG 2.2 Level AAA)</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Minimum area equal to 2px border</li>
              <li>• 3:1 contrast against adjacent colors</li>
              <li>• Consistent across all focusable elements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Focus Indicator Best Practices</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="glass-panel p-4 bg-background/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-medium text-sm">Do</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use high contrast colors</li>
              <li>• Make focus visible on all elements</li>
              <li>• Use consistent styling</li>
              <li>• Test with keyboard navigation</li>
            </ul>
          </div>

          <div className="glass-panel p-4 bg-background/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-sm">Don't</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Remove outline without replacement</li>
              <li>• Use low contrast colors</li>
              <li>• Hide focus on click</li>
              <li>• Use only color to indicate focus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">CSS Examples</h3>
        <div className="space-y-3">
          {[
            {
              name: 'Tailwind Ring',
              code: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
            },
            {
              name: 'Custom Outline',
              code: 'focus:outline-2 focus:outline-blue-500 focus:outline-offset-2',
            },
            {
              name: 'Remove & Replace',
              code: 'focus:outline-none focus:ring-2 focus:ring-primary',
            },
            {
              name: 'Enhanced Visibility',
              code: 'focus:ring-4 focus:ring-primary/50 focus:border-primary',
            },
          ].map((example, index) => (
            <div key={index} className="glass-panel p-3 bg-background/30">
              <p className="font-medium text-sm mb-2">{example.name}</p>
              <code className="text-xs font-mono text-muted-foreground break-all">
                {example.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
