'use client'

import { usePlayground } from '../context/PlaygroundContext'
import { componentDefinitions } from '../config/components'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { useState, useRef, useEffect } from 'react'

export function ComponentSelector() {
  const { selectedComponent, setSelectedComponent, getComponentDefinition } = usePlayground()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const component = getComponentDefinition()
  const categorizedComponents = componentDefinitions.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = []
    }
    acc[comp.category].push(comp)
    return acc
  }, {} as Record<string, typeof componentDefinitions>)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Component</h2>
        <p className="text-sm text-muted-foreground">
          Select a component to customize
        </p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass-panel p-4 flex items-center justify-between hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
        >
          <div className="flex-1 text-left">
            <div className="font-medium">{component?.name}</div>
            <div className="text-sm text-muted-foreground">{component?.category}</div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card max-h-[500px] overflow-y-auto z-50 shadow-xl">
            {Object.entries(categorizedComponents).map(([category, components]) => (
              <div key={category} className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {components.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedComponent(comp.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg flex items-center justify-between hover:bg-white/80 dark:hover:bg-white/10 transition-colors',
                      selectedComponent === comp.id &&
                        'bg-primary/10 border border-primary/30'
                    )}
                  >
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{comp.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {comp.description}
                      </div>
                    </div>
                    {selectedComponent === comp.id && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {component && (
        <div className="glass-panel p-4 space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Import:</span>
            <code className="ml-2 px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-xs font-mono">
              {component.importPath}
            </code>
          </div>
          <p className="text-sm text-muted-foreground">{component.description}</p>
        </div>
      )}
    </div>
  )
}
