'use client'

/**
 * Prompts Component
 *
 * A prompt template selector with categories, search, and customization options.
 * Inspired by Ant Design X's Prompts component for AI chat interfaces.
 *
 * Features:
 * - Categorized prompt templates
 * - Search and filtering
 * - Customizable prompt variables
 * - Recent/favorite prompts
 * - Keyboard navigation
 * - Multiple display variants
 *
 * @example
 * ```tsx
 * <Prompts
 *   items={[
 *     {
 *       key: 'summarize',
 *       title: 'Summarize',
 *       description: 'Summarize the following text',
 *       icon: <FileTextIcon />,
 *       category: 'writing',
 *     },
 *     {
 *       key: 'translate',
 *       title: 'Translate',
 *       description: 'Translate to {{language}}',
 *       icon: <LanguagesIcon />,
 *       category: 'language',
 *       variables: [{ name: 'language', label: 'Target Language' }],
 *     },
 *   ]}
 *   onSelect={(prompt, variables) => console.log(prompt, variables)}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from './animation-constants'

// ============================================================================
// Types
// ============================================================================

/** Prompt variable for customization */
export interface PromptVariable {
  /** Variable name (used in template as {{name}}) */
  name: string
  /** Display label */
  label: string
  /** Default value */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Variable type */
  type?: 'text' | 'select' | 'number'
  /** Options for select type */
  options?: { value: string; label: string }[]
  /** Whether required */
  required?: boolean
}

/** Single prompt item */
export interface PromptItem {
  /** Unique key */
  key: string
  /** Prompt title */
  title: string
  /** Prompt description or template */
  description: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Category for grouping */
  category?: string
  /** Tags for search */
  tags?: string[]
  /** Variables for customization */
  variables?: PromptVariable[]
  /** Whether disabled */
  disabled?: boolean
  /** Custom data */
  data?: Record<string, unknown>
}

/** Prompt category */
export interface PromptCategory {
  /** Category key */
  key: string
  /** Category label */
  label: string
  /** Category icon */
  icon?: React.ReactNode
  /** Category description */
  description?: string
}

/** Display variant */
export type PromptsVariant = 'list' | 'grid' | 'compact' | 'cards'

/** Size variant */
export type PromptsSize = 'sm' | 'md' | 'lg'

/** Props for Prompts component */
export interface PromptsProps {
  /** Prompt items */
  items: PromptItem[]
  /** Categories for grouping */
  categories?: PromptCategory[]
  /** Display variant */
  variant?: PromptsVariant
  /** Size variant */
  size?: PromptsSize
  /** Whether to show search */
  showSearch?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Whether to show categories filter */
  showCategories?: boolean
  /** Whether to show recent prompts */
  showRecent?: boolean
  /** Recent prompt keys */
  recentKeys?: string[]
  /** Maximum recent prompts to show */
  maxRecent?: number
  /** Whether to show favorites */
  showFavorites?: boolean
  /** Favorite prompt keys */
  favoriteKeys?: string[]
  /** Selected prompt key */
  selectedKey?: string
  /** Expanded prompt key (for variable editing) */
  expandedKey?: string
  /** Whether to allow multi-select */
  multiSelect?: boolean
  /** Selected keys for multi-select */
  selectedKeys?: string[]
  /** Empty state content */
  emptyContent?: React.ReactNode
  /** Header content */
  header?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Callback when prompt selected */
  onSelect?: (prompt: PromptItem, variables?: Record<string, string>) => void
  /** Callback when prompt expanded */
  onExpand?: (key: string | null) => void
  /** Callback when favorite toggled */
  onFavoriteToggle?: (key: string, isFavorite: boolean) => void
  /** Callback when search changes */
  onSearch?: (query: string) => void
  /** Callback when category changes */
  onCategoryChange?: (category: string | null) => void
}

/** Hook options */
export interface UsePromptsOptions {
  /** Initial items */
  items?: PromptItem[]
  /** Initial categories */
  categories?: PromptCategory[]
  /** Storage key for recent/favorites */
  storageKey?: string
  /** Maximum recent prompts */
  maxRecent?: number
  /** Callback when prompt used */
  onPromptUsed?: (prompt: PromptItem) => void
}

/** Hook return type */
export interface UsePromptsReturn {
  /** All prompt items */
  items: PromptItem[]
  /** Filtered items */
  filteredItems: PromptItem[]
  /** Categories */
  categories: PromptCategory[]
  /** Search query */
  searchQuery: string
  /** Set search query */
  setSearchQuery: (query: string) => void
  /** Active category */
  activeCategory: string | null
  /** Set active category */
  setActiveCategory: (category: string | null) => void
  /** Recent prompt keys */
  recentKeys: string[]
  /** Favorite prompt keys */
  favoriteKeys: string[]
  /** Add to recent */
  addToRecent: (key: string) => void
  /** Toggle favorite */
  toggleFavorite: (key: string) => void
  /** Use a prompt (adds to recent, returns processed template) */
  usePrompt: (key: string, variables?: Record<string, string>) => string | null
  /** Get prompt by key */
  getPrompt: (key: string) => PromptItem | undefined
  /** Add prompt */
  addPrompt: (prompt: PromptItem) => void
  /** Remove prompt */
  removePrompt: (key: string) => void
  /** Update prompt */
  updatePrompt: (key: string, updates: Partial<PromptItem>) => void
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing prompts
 */
export function usePrompts(options: UsePromptsOptions = {}): UsePromptsReturn {
  const {
    items: initialItems = [],
    categories: initialCategories = [],
    storageKey = 'prompts-state',
    maxRecent = 5,
    onPromptUsed,
  } = options

  const [items, setItems] = React.useState<PromptItem[]>(initialItems)
  const [categories] = React.useState<PromptCategory[]>(initialCategories)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const [recentKeys, setRecentKeys] = React.useState<string[]>([])
  const [favoriteKeys, setFavoriteKeys] = React.useState<string[]>([])

  // Load from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const data = JSON.parse(stored)
          if (data.recentKeys) setRecentKeys(data.recentKeys)
          if (data.favoriteKeys) setFavoriteKeys(data.favoriteKeys)
        }
      } catch (e) {
        console.warn('Failed to load prompts state:', e)
      }
    }
  }, [storageKey])

  // Save to storage
  const saveToStorage = React.useCallback(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ recentKeys, favoriteKeys }))
      } catch (e) {
        console.warn('Failed to save prompts state:', e)
      }
    }
  }, [storageKey, recentKeys, favoriteKeys])

  React.useEffect(() => {
    saveToStorage()
  }, [saveToStorage])

  // Filter items
  const filteredItems = React.useMemo(() => {
    let filtered = items

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [items, activeCategory, searchQuery])

  const addToRecent = React.useCallback(
    (key: string) => {
      setRecentKeys((prev) => {
        const filtered = prev.filter((k) => k !== key)
        return [key, ...filtered].slice(0, maxRecent)
      })
    },
    [maxRecent]
  )

  const toggleFavorite = React.useCallback((key: string) => {
    setFavoriteKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }, [])

  const getPrompt = React.useCallback(
    (key: string) => items.find((item) => item.key === key),
    [items]
  )

  const usePrompt = React.useCallback(
    (key: string, variables?: Record<string, string>) => {
      const prompt = getPrompt(key)
      if (!prompt) return null

      addToRecent(key)
      onPromptUsed?.(prompt)

      // Process template with variables
      let text = prompt.description
      if (variables) {
        Object.entries(variables).forEach(([name, value]) => {
          text = text.replace(new RegExp(`\\{\\{${name}\\}\\}`, 'g'), value)
        })
      }

      return text
    },
    [getPrompt, addToRecent, onPromptUsed]
  )

  const addPrompt = React.useCallback((prompt: PromptItem) => {
    setItems((prev) => [...prev, prompt])
  }, [])

  const removePrompt = React.useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const updatePrompt = React.useCallback((key: string, updates: Partial<PromptItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...updates } : item))
    )
  }, [])

  return {
    items,
    filteredItems,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    recentKeys,
    favoriteKeys,
    addToRecent,
    toggleFavorite,
    usePrompt,
    getPrompt,
    addPrompt,
    removePrompt,
    updatePrompt,
  }
}

// ============================================================================
// Sub-components
// ============================================================================

interface PromptCardProps {
  item: PromptItem
  variant: PromptsVariant
  size: PromptsSize
  isSelected: boolean
  isExpanded: boolean
  isFavorite: boolean
  showFavorites: boolean
  onSelect: () => void
  onExpand: () => void
  onFavoriteToggle: () => void
  onSubmit: (variables: Record<string, string>) => void
}

function PromptCard({
  item,
  variant,
  size,
  isSelected,
  isExpanded,
  isFavorite,
  showFavorites,
  onSelect,
  onExpand,
  onFavoriteToggle,
  onSubmit,
}: PromptCardProps) {
  const [variables, setVariables] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    item.variables?.forEach((v) => {
      initial[v.name] = v.defaultValue || ''
    })
    return initial
  })

  const hasVariables = item.variables && item.variables.length > 0

  const handleSelect = () => {
    if (hasVariables && !isExpanded) {
      onExpand()
    } else if (!hasVariables) {
      onSelect()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(variables)
  }

  const sizeClasses = {
    sm: 'prompts-card-sm',
    md: 'prompts-card-md',
    lg: 'prompts-card-lg',
  }

  const variantClasses = {
    list: 'prompts-card-list',
    grid: 'prompts-card-grid',
    compact: 'prompts-card-compact',
    cards: 'prompts-card-cards',
  }

  return (
    <motion.div
      className={`prompts-card ${variantClasses[variant]} ${sizeClasses[size]} ${
        isSelected ? 'prompts-card-selected' : ''
      } ${isExpanded ? 'prompts-card-expanded' : ''} ${
        item.disabled ? 'prompts-card-disabled' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: DURATION_SECONDS.fast, ease: EASING_FRAMER }}
      viewport={{ once: true }}
      layout
    >
      <button
        type="button"
        className="prompts-card-main"
        onClick={handleSelect}
        disabled={item.disabled}
      >
        {item.icon && <span className="prompts-card-icon">{item.icon}</span>}
        <div className="prompts-card-content">
          <span className="prompts-card-title">{item.title}</span>
          {variant !== 'compact' && (
            <span className="prompts-card-description">{item.description}</span>
          )}
        </div>
        {hasVariables && (
          <span className="prompts-card-expand-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        )}
      </button>

      {showFavorites && (
        <button
          type="button"
          className={`prompts-card-favorite ${isFavorite ? 'prompts-card-favorite-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteToggle()
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {isExpanded && hasVariables && (
          <motion.form
            className="prompts-card-variables"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.normal, ease: EASING_FRAMER }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
          >
            {item.variables!.map((variable) => (
              <div key={variable.name} className="prompts-variable">
                <label className="prompts-variable-label">
                  {variable.label}
                  {variable.required && <span className="prompts-variable-required">*</span>}
                </label>
                {variable.type === 'select' && variable.options ? (
                  <select
                    className="prompts-variable-select"
                    value={variables[variable.name] || ''}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.name]: e.target.value }))
                    }
                    required={variable.required}
                  >
                    <option value="">Select...</option>
                    {variable.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : variable.type === 'number' ? (
                  <input
                    type="number"
                    className="prompts-variable-input"
                    value={variables[variable.name] || ''}
                    placeholder={variable.placeholder}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.name]: e.target.value }))
                    }
                    required={variable.required}
                  />
                ) : (
                  <input
                    type="text"
                    className="prompts-variable-input"
                    value={variables[variable.name] || ''}
                    placeholder={variable.placeholder}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.name]: e.target.value }))
                    }
                    required={variable.required}
                  />
                )}
              </div>
            ))}
            <div className="prompts-variable-actions">
              <button
                type="button"
                className="prompts-variable-cancel"
                onClick={() => onExpand()}
              >
                Cancel
              </button>
              <button type="submit" className="prompts-variable-submit">
                Use Prompt
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Prompts component for prompt template selection
 */
export function Prompts({
  items,
  categories = [],
  variant = 'list',
  size = 'md',
  showSearch = true,
  searchPlaceholder = 'Search prompts...',
  showCategories = true,
  showRecent = true,
  recentKeys: externalRecentKeys,
  maxRecent = 5,
  showFavorites = true,
  favoriteKeys: externalFavoriteKeys,
  selectedKey,
  expandedKey: externalExpandedKey,
  multiSelect = false,
  selectedKeys = [],
  emptyContent,
  header,
  footer,
  className = '',
  onSelect,
  onExpand,
  onFavoriteToggle,
  onSearch,
  onCategoryChange,
}: PromptsProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const [expandedKey, setExpandedKey] = React.useState<string | null>(
    externalExpandedKey || null
  )
  const [internalRecentKeys, setInternalRecentKeys] = React.useState<string[]>([])
  const [internalFavoriteKeys, setInternalFavoriteKeys] = React.useState<string[]>([])

  const recentKeys = externalRecentKeys || internalRecentKeys
  const favoriteKeys = externalFavoriteKeys || internalFavoriteKeys

  // Filter items
  const filteredItems = React.useMemo(() => {
    let filtered = items

    if (activeCategory) {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [items, activeCategory, searchQuery])

  // Get recent items
  const recentItems = React.useMemo(() => {
    return recentKeys
      .map((key) => items.find((item) => item.key === key))
      .filter(Boolean)
      .slice(0, maxRecent) as PromptItem[]
  }, [items, recentKeys, maxRecent])

  // Get favorite items
  const favoriteItems = React.useMemo(() => {
    return items.filter((item) => favoriteKeys.includes(item.key))
  }, [items, favoriteKeys])

  // Unique categories from items
  const derivedCategories = React.useMemo(() => {
    if (categories.length > 0) return categories

    const categorySet = new Set<string>()
    items.forEach((item) => {
      if (item.category) categorySet.add(item.category)
    })

    return Array.from(categorySet).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
  }, [items, categories])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)
    onCategoryChange?.(category)
  }

  const handleExpand = (key: string | null) => {
    const newKey = expandedKey === key ? null : key
    setExpandedKey(newKey)
    onExpand?.(newKey)
  }

  const handleSelect = (item: PromptItem, variables?: Record<string, string>) => {
    // Add to recent
    if (!externalRecentKeys) {
      setInternalRecentKeys((prev) => {
        const filtered = prev.filter((k) => k !== item.key)
        return [item.key, ...filtered].slice(0, maxRecent)
      })
    }

    onSelect?.(item, variables)
    setExpandedKey(null)
  }

  const handleFavoriteToggle = (key: string) => {
    const isFavorite = favoriteKeys.includes(key)

    if (!externalFavoriteKeys) {
      setInternalFavoriteKeys((prev) =>
        isFavorite ? prev.filter((k) => k !== key) : [...prev, key]
      )
    }

    onFavoriteToggle?.(key, !isFavorite)
  }

  const variantClasses = {
    list: 'prompts-list',
    grid: 'prompts-grid',
    compact: 'prompts-compact',
    cards: 'prompts-cards',
  }

  const renderItems = (itemList: PromptItem[], title?: string) => {
    if (itemList.length === 0) return null

    return (
      <div className="prompts-section">
        {title && <h3 className="prompts-section-title">{title}</h3>}
        <div className={`prompts-items ${variantClasses[variant]}`}>
          <AnimatePresence mode="popLayout">
            {itemList.map((item) => (
              <PromptCard
                key={item.key}
                item={item}
                variant={variant}
                size={size}
                isSelected={
                  multiSelect ? selectedKeys.includes(item.key) : selectedKey === item.key
                }
                isExpanded={expandedKey === item.key}
                isFavorite={favoriteKeys.includes(item.key)}
                showFavorites={showFavorites}
                onSelect={() => handleSelect(item)}
                onExpand={() => handleExpand(item.key)}
                onFavoriteToggle={() => handleFavoriteToggle(item.key)}
                onSubmit={(variables) => handleSelect(item, variables)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className={`prompts ${className}`}>
      {header}

      {/* Search */}
      {showSearch && (
        <div className="prompts-search">
          <svg
            className="prompts-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="prompts-search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              className="prompts-search-clear"
              onClick={() => {
                setSearchQuery('')
                onSearch?.('')
              }}
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Categories */}
      {showCategories && derivedCategories.length > 0 && (
        <div className="prompts-categories">
          <button
            type="button"
            className={`prompts-category ${activeCategory === null ? 'prompts-category-active' : ''}`}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </button>
          {derivedCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`prompts-category ${
                activeCategory === cat.key ? 'prompts-category-active' : ''
              }`}
              onClick={() => handleCategoryChange(cat.key)}
            >
              {cat.icon && <span className="prompts-category-icon">{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prompts-content">
        {/* Recent prompts */}
        {showRecent && recentItems.length > 0 && !searchQuery && !activeCategory && (
          renderItems(recentItems, 'Recent')
        )}

        {/* Favorite prompts */}
        {showFavorites && favoriteItems.length > 0 && !searchQuery && !activeCategory && (
          renderItems(favoriteItems, 'Favorites')
        )}

        {/* All/filtered prompts */}
        {filteredItems.length > 0 ? (
          renderItems(
            filteredItems,
            searchQuery || activeCategory ? undefined : 'All Prompts'
          )
        ) : (
          <div className="prompts-empty">
            {emptyContent || (
              <>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="prompts-empty-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p>No prompts found</p>
              </>
            )}
          </div>
        )}
      </div>

      {footer}
    </div>
  )
}

export default Prompts
