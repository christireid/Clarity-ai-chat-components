'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, FileCode, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  category: string
  description: string
  code: string
  dependencies?: Record<string, string>
}

interface TemplateSelectorProps {
  templates: Template[]
  selectedId: string
  onSelect: (id: string) => void
}

export function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Filter templates with debounced search
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         template.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Reset focused index when filters change
  useEffect(() => {
    setFocusedIndex(-1)
  }, [debouncedSearch, selectedCategory])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredTemplates.length) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev =>
          prev < filteredTemplates.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        onSelect(filteredTemplates[focusedIndex].id)
      } else if (e.key === 'Escape') {
        setSearch('')
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredTemplates, focusedIndex, onSelect])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-template-item]')
      const focusedItem = items[focusedIndex] as HTMLElement
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [focusedIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group/selector relative bg-white dark:bg-gray-900/80 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.2)]"
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(244,114,182,0.25) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Templates
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
              "bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm",
              "focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all",
              "placeholder:text-gray-400"
            )}
            aria-label="Search templates"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2" role="tablist" aria-label="Template categories">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                selectedCategory === category
                  ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-[0_2px_8px_rgba(99,102,241,0.3)] scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 hover:shadow-sm'
              )}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-controls="template-list"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Template List */}
      <div
        ref={listRef}
        id="template-list"
        className="overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 400px)' }}
        role="tabpanel"
      >
        <AnimatePresence mode="wait">
          {filteredTemplates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                No templates found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {filteredTemplates.map((template, index) => {
                const isSelected = selectedId === template.id
                const isFocused = focusedIndex === index

                return (
                  <motion.button
                    key={template.id}
                    data-template-item
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onSelect(template.id)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    className={cn(
                      "w-full text-left p-4 transition-all duration-300 relative",
                      "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500",
                      isSelected && 'bg-gradient-to-r from-brand-50 to-purple-50/50 dark:from-brand-900/30 dark:to-purple-900/20 border-l-4 border-brand-500 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]',
                      !isSelected && isFocused && 'bg-gray-50 dark:bg-gray-800/50',
                      !isSelected && !isFocused && 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                    )}
                    aria-selected={isSelected}
                    aria-label={`Select ${template.name} template`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <Sparkles className="w-4 h-4 text-brand-600" />
                          </motion.div>
                        )}
                        <h3 className={cn(
                          "font-medium truncate",
                          isSelected ? "text-brand-900 dark:text-brand-100" : "text-gray-900 dark:text-white"
                        )}>
                          {template.name}
                        </h3>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded flex-shrink-0",
                        isSelected
                          ? "bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      )}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            {debouncedSearch && (
              <span className="ml-1">
                for "{debouncedSearch}"
              </span>
            )}
          </span>
          <span className="text-gray-400 dark:text-gray-500 hidden sm:block">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
              ↑↓
            </kbd>{' '}
            navigate · <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
              Enter
            </kbd>{' '}
            select
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
