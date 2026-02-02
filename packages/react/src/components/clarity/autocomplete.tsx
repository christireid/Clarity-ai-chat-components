'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { Check, X, ChevronDown, Search, Loader2, Sparkles } from 'lucide-react'

interface AutocompleteOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  emptyMessage?: string
  loading?: boolean
  disabled?: boolean
  allowCustom?: boolean
  className?: string
}

export function Autocomplete({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  loading = false,
  disabled = false,
  allowCustom = false,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = React.useMemo(() => {
    if (!query) return options
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()) ||
        opt.description?.toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query])

  const handleSelect = (val: string) => {
    onChange?.(val)
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={(val) => {
              setQuery(val)
              onSearch?.(val)
            }}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {allowCustom && query ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleSelect(query)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Use &ldquo;{query}&rdquo;
                    </Button>
                  ) : (
                    emptyMessage
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {option.icon}
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                      {value === option.value && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Multi-select autocomplete
interface MultiAutocompleteProps {
  options: AutocompleteOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  onSearch?: (query: string) => void
  placeholder?: string
  emptyMessage?: string
  loading?: boolean
  disabled?: boolean
  max?: number
  className?: string
}

export function MultiAutocomplete({
  options,
  value = [],
  onChange,
  onSearch,
  placeholder = 'Select items...',
  emptyMessage = 'No results found.',
  loading = false,
  disabled = false,
  max,
  className,
}: MultiAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const filteredOptions = React.useMemo(() => {
    if (!query) return options
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()) ||
        opt.description?.toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query])

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val))
    } else if (!max || value.length < max) {
      onChange?.([...value, val])
    }
  }

  const handleRemove = (val: string) => {
    onChange?.(value.filter((v) => v !== val))
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between min-h-[40px] h-auto bg-transparent"
          >
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((opt) => (
                  <Badge key={opt.value} variant="secondary" className="mr-1">
                    {opt.label}
                    <button
                      className="ml-1 rounded-full outline-none hover:bg-secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(opt.value)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              value={query}
              onValueChange={(val) => {
                setQuery(val)
                onSearch?.(val)
              }}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={
                          option.disabled ||
                          (max &&
                            value.length >= max &&
                            !value.includes(option.value))
                        }
                        onSelect={() => handleSelect(option.value)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {option.icon}
                          <div className="flex flex-col">
                            <span>{option.label}</span>
                            {option.description && (
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {value.includes(option.value) && (
                          <Check className="h-4 w-4 text-accent" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {max && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {max} selected
        </p>
      )}
    </div>
  )
}

// Inline autocomplete for text input
interface InlineAutocompleteProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  onSuggest?: (query: string) => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export function InlineAutocomplete({
  value,
  onChange,
  suggestions,
  onSuggest,
  placeholder,
  loading = false,
  className,
}: InlineAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value) {
      onSuggest?.(value)
      setOpen(suggestions.length > 0)
    } else {
      setOpen(false)
    }
    setSelectedIndex(0)
  }, [value, onSuggest, suggestions.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          onChange(suggestions[selectedIndex])
          setOpen(false)
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-md">
          {suggestions.map((suggestion, i) => (
            <button
              key={suggestion}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-secondary',
                i === selectedIndex && 'bg-secondary'
              )}
              onClick={() => {
                onChange(suggestion)
                setOpen(false)
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Tags input with autocomplete
interface TagsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  placeholder?: string
  max?: number
  className?: string
}

export function TagsInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  max,
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag) && (!max || value.length < max)) {
      onChange([...value, tag])
      setInputValue('')
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className="flex flex-wrap gap-1 p-2 min-h-[40px] rounded-md border border-input bg-background cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              className="ml-1 rounded-full outline-none hover:bg-secondary"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"
          disabled={max !== undefined && value.length >= max}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="py-1 bg-popover border border-border rounded-md shadow-md">
          {filteredSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              className="w-full px-3 py-2 text-left text-sm hover:bg-secondary"
              onMouseDown={() => addTag(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {max && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {max} tags
        </p>
      )}
    </div>
  )
}
