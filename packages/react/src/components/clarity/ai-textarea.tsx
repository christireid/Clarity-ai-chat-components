'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { Sparkles, Loader2, Check, X, Wand2 } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface AISuggestion {
  id: string
  text: string
  type: 'completion' | 'improvement' | 'expansion' | 'correction'
}

export interface AITextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> {
  value?: string
  onChange?: (value: string) => void
  onRequestSuggestion?: (
    text: string,
    cursorPosition: number
  ) => Promise<AISuggestion[]>
  onAcceptSuggestion?: (suggestion: AISuggestion) => void
  suggestions?: AISuggestion[]
  isLoadingSuggestions?: boolean
  showAIButton?: boolean
  aiButtonPosition?: 'inside' | 'outside'
  placeholder?: string
  autoSuggest?: boolean
  autoSuggestDelay?: number
  minCharsForSuggestion?: number
  className?: string
  containerClassName?: string
}

export interface InlineSuggestionProps {
  suggestion: string
  onAccept: () => void
  onReject: () => void
  className?: string
}

export interface SuggestionPopoverProps {
  suggestions: AISuggestion[]
  onSelect: (suggestion: AISuggestion) => void
  isLoading?: boolean
  className?: string
}

// ============================================================================
// AI TEXTAREA - Main component with AI-powered suggestions
// ============================================================================

export function AITextarea({
  value = '',
  onChange,
  onRequestSuggestion,
  onAcceptSuggestion,
  suggestions: externalSuggestions,
  isLoadingSuggestions: externalLoading,
  showAIButton = true,
  aiButtonPosition = 'inside',
  placeholder = 'Start typing...',
  autoSuggest = false,
  autoSuggestDelay = 500,
  minCharsForSuggestion = 10,
  className,
  containerClassName,
  ...props
}: AITextareaProps) {
  const [internalValue, setInternalValue] = React.useState(value)
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [inlineSuggestion, setInlineSuggestion] = React.useState<string | null>(
    null
  )
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  const currentValue = value ?? internalValue
  const currentLoading = externalLoading ?? isLoading
  const currentSuggestions = externalSuggestions ?? suggestions

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
    setCursorPosition(e.target.selectionStart)

    // Clear inline suggestion when user types
    setInlineSuggestion(null)

    // Auto-suggest logic
    if (
      autoSuggest &&
      onRequestSuggestion &&
      newValue.length >= minCharsForSuggestion
    ) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        requestSuggestions(newValue, e.target.selectionStart)
      }, autoSuggestDelay)
    }
  }

  const requestSuggestions = async (text: string, position: number) => {
    if (!onRequestSuggestion) return

    setIsLoading(true)
    try {
      const newSuggestions = await onRequestSuggestion(text, position)
      setSuggestions(newSuggestions)
      if (newSuggestions.length > 0) {
        // Show first completion as inline ghost text
        const completion = newSuggestions.find((s) => s.type === 'completion')
        if (completion) {
          setInlineSuggestion(completion.text)
        }
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIButtonClick = () => {
    if (textareaRef.current) {
      requestSuggestions(currentValue, textareaRef.current.selectionStart)
    }
  }

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    const newValue = applySuggestion(currentValue, suggestion, cursorPosition)
    setInternalValue(newValue)
    onChange?.(newValue)
    onAcceptSuggestion?.(suggestion)
    setShowSuggestions(false)
    setInlineSuggestion(null)
    textareaRef.current?.focus()
  }

  const handleAcceptInline = () => {
    if (inlineSuggestion) {
      const newValue = currentValue + inlineSuggestion
      setInternalValue(newValue)
      onChange?.(newValue)
      setInlineSuggestion(null)
      textareaRef.current?.focus()
    }
  }

  const handleRejectInline = () => {
    setInlineSuggestion(null)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab to accept inline suggestion
    if (e.key === 'Tab' && inlineSuggestion) {
      e.preventDefault()
      handleAcceptInline()
    }
    // Escape to reject inline suggestion
    if (e.key === 'Escape' && inlineSuggestion) {
      e.preventDefault()
      handleRejectInline()
    }
  }

  const applySuggestion = (
    text: string,
    suggestion: AISuggestion,
    position: number
  ): string => {
    switch (suggestion.type) {
      case 'completion':
        return text + suggestion.text
      case 'improvement':
      case 'correction':
        return suggestion.text
      case 'expansion':
        return text.slice(0, position) + suggestion.text + text.slice(position)
      default:
        return text + suggestion.text
    }
  }

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className={cn('relative', containerClassName)}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'resize-none',
            showAIButton && aiButtonPosition === 'inside' && 'pr-12',
            className
          )}
          {...props}
        />

        {/* Inline ghost suggestion */}
        {inlineSuggestion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="p-3 text-sm whitespace-pre-wrap break-words">
              <span className="invisible">{currentValue}</span>
              <span className="text-muted-foreground/50">
                {inlineSuggestion}
              </span>
            </div>
          </div>
        )}

        {/* AI Button (inside) */}
        {showAIButton && aiButtonPosition === 'inside' && (
          <div className="absolute right-2 bottom-2">
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleAIButtonClick}
                  disabled={
                    currentLoading ||
                    currentValue.length < minCharsForSuggestion
                  }
                >
                  {currentLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <SuggestionPopover
                  suggestions={currentSuggestions}
                  onSelect={handleAcceptSuggestion}
                  isLoading={currentLoading}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Inline suggestion accept/reject buttons */}
      {inlineSuggestion && (
        <InlineSuggestionControls
          onAccept={handleAcceptInline}
          onReject={handleRejectInline}
        />
      )}

      {/* AI Button (outside) */}
      {showAIButton && aiButtonPosition === 'outside' && (
        <div className="mt-2 flex justify-end">
          <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIButtonClick}
                disabled={
                  currentLoading || currentValue.length < minCharsForSuggestion
                }
              >
                {currentLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                AI Suggestions
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <SuggestionPopover
                suggestions={currentSuggestions}
                onSelect={handleAcceptSuggestion}
                isLoading={currentLoading}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// INLINE SUGGESTION CONTROLS
// ============================================================================

function InlineSuggestionControls({
  onAccept,
  onReject,
}: {
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md border border-border p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={onAccept}
      >
        <Check className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onReject}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      <span className="text-[10px] text-muted-foreground px-1">
        Tab to accept
      </span>
    </div>
  )
}

// ============================================================================
// SUGGESTION POPOVER
// ============================================================================

export function SuggestionPopover({
  suggestions,
  onSelect,
  isLoading,
  className,
}: SuggestionPopoverProps) {
  const typeLabels = {
    completion: 'Complete',
    improvement: 'Improve',
    expansion: 'Expand',
    correction: 'Fix',
  }

  const typeColors = {
    completion:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    improvement:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expansion:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    correction:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  }

  if (isLoading) {
    return (
      <div
        className={cn('p-4 flex items-center justify-center gap-2', className)}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Getting suggestions...
        </span>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">
          No suggestions available
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Try writing more content
        </p>
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-border', className)}>
      <div className="p-2 bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI Suggestions
        </p>
      </div>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          className="w-full text-left p-3 hover:bg-accent transition-colors"
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded',
                typeColors[suggestion.type]
              )}
            >
              {typeLabels[suggestion.type]}
            </span>
          </div>
          <p className="text-sm line-clamp-2">{suggestion.text}</p>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// USE AI SUGGESTIONS HOOK
// ============================================================================

export interface UseAISuggestionsOptions {
  onGenerate?: (text: string) => Promise<AISuggestion[]>
  debounceMs?: number
}

export function useAISuggestions(options: UseAISuggestionsOptions = {}) {
  const { onGenerate, debounceMs = 500 } = options
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  const generateSuggestions = React.useCallback(
    async (text: string) => {
      if (!onGenerate) return

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const newSuggestions = await onGenerate(text)
          setSuggestions(newSuggestions)
        } catch (error) {
          console.error('Failed to generate suggestions:', error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }, debounceMs)
    },
    [onGenerate, debounceMs]
  )

  const clearSuggestions = React.useCallback(() => {
    setSuggestions([])
  }, [])

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    suggestions,
    isLoading,
    generateSuggestions,
    clearSuggestions,
  }
}
