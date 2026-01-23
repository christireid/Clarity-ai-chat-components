'use client'

import { useState, useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  PROMPT_TEMPLATES,
  getDefaultPromptTemplate,
  type PromptTemplate,
} from '@/lib/ai/promptTemplates'

export interface PromptSelectorProps {
  value?: string
  onChange?: (templateId: string) => void
  className?: string
  variant?: 'dropdown' | 'tabs' | 'cards'
}

const STORAGE_KEY = 'clarity-docs-prompt-mode'

export function PromptSelector({
  value,
  onChange,
  className,
  variant = 'dropdown',
}: PromptSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(
    value || getDefaultPromptTemplate().id
  )
  const [showMenu, setShowMenu] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    if (!value) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSelectedId(saved)
        onChange?.(saved)
      }
    }
  }, [value, onChange])

  const handleSelect = (templateId: string) => {
    setSelectedId(templateId)
    localStorage.setItem(STORAGE_KEY, templateId)
    onChange?.(templateId)
    setShowMenu(false)
  }

  const selectedTemplate =
    PROMPT_TEMPLATES.find(t => t.id === selectedId) || PROMPT_TEMPLATES[0]

  if (variant === 'tabs') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>AI Mode</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROMPT_TEMPLATES.map(template => {
            const isSelected = template.id === selectedId

            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  'flex items-center gap-2',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                <span>{template.emoji}</span>
                <span>{template.name}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          {selectedTemplate.description}
        </p>
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Choose Your AI Assistant Mode</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROMPT_TEMPLATES.map(template => {
            const isSelected = template.id === selectedId

            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={cn(
                  'p-4 rounded-lg text-left',
                  'transition-all duration-200',
                  'border-2',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{template.emoji}</span>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-primary text-primary-foreground">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {template.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Default: dropdown variant
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md',
          'bg-secondary hover:bg-secondary/80',
          'transition-colors text-sm font-medium',
          'min-w-[200px] justify-between'
        )}
      >
        <div className="flex items-center gap-2">
          <span>{selectedTemplate.emoji}</span>
          <span>{selectedTemplate.name}</span>
        </div>
        <Sparkles className="w-4 h-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={cn(
                'absolute left-0 top-full mt-2 z-50',
                'bg-popover border border-border rounded-lg shadow-lg',
                'min-w-[320px] max-w-[400px] p-2'
              )}
            >
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                Select AI Mode
              </div>

              <div className="space-y-1">
                {PROMPT_TEMPLATES.map(template => {
                  const isSelected = template.id === selectedId

                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template.id)}
                      className={cn(
                        'w-full px-3 py-2 rounded-md text-left',
                        'transition-colors',
                        'flex items-start gap-3',
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <span className="text-xl flex-shrink-0">
                        {template.emoji}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm">
                            {template.name}
                          </span>
                          {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded',
                                isSelected
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-secondary text-secondary-foreground'
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="border-t border-border mt-2 pt-2 px-2">
                <p className="text-xs text-muted-foreground">
                  Your preference is saved locally
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Compact mode selector (for toolbar)
 */
export function CompactPromptSelector({
  value,
  onChange,
  className,
}: Omit<PromptSelectorProps, 'variant'>) {
  return (
    <PromptSelector
      value={value}
      onChange={onChange}
      className={className}
      variant="dropdown"
    />
  )
}

/**
 * Get current selected prompt template from localStorage
 */
export function useSelectedPrompt(): [PromptTemplate, (id: string) => void] {
  const [template, setTemplate] = useState<PromptTemplate>(getDefaultPromptTemplate())

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const found = PROMPT_TEMPLATES.find(t => t.id === saved)
      if (found) setTemplate(found)
    }
  }, [])

  const setPromptById = (id: string) => {
    const found = PROMPT_TEMPLATES.find(t => t.id === id)
    if (found) {
      setTemplate(found)
      localStorage.setItem(STORAGE_KEY, id)
    }
  }

  return [template, setPromptById]
}
