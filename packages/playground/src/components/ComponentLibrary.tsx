/**
 * Component Library Sidebar
 *
 * A beautifully designed template browser with:
 * - Search and filtering
 * - Category grouping with icons
 * - Smooth animations
 * - Template previews
 * - Keyboard navigation
 */

import { useState, useMemo, useCallback } from 'react'
import {
  Search,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Zap,
  Sliders,
  Cpu,
  Brain,
  Layers,
  X,
  Check,
} from 'lucide-react'
import { templates, templateCategories } from '../templates/index'
import type { PlaygroundTemplate } from '../types'

interface ComponentLibraryProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  'getting-started': Sparkles,
  'chat-components': MessageSquare,
  streaming: Zap,
  controls: Sliders,
  advanced: Cpu,
  memory: Brain,
  patterns: Layers,
}

// Group templates by category
const getGroupedTemplates = (): Record<string, PlaygroundTemplate[]> => {
  const grouped: Record<string, PlaygroundTemplate[]> = {}

  for (const template of templates) {
    const categoryKey = template.category
    if (!grouped[categoryKey]) {
      grouped[categoryKey] = []
    }
    grouped[categoryKey].push(template)
  }

  return grouped
}

// Template Card Component
function TemplateCard({
  template,
  isSelected,
  onClick,
}: {
  template: PlaygroundTemplate
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`
        group w-full text-left p-3 rounded-xl transition-all duration-200
        border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${
          isSelected
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-500 shadow-md'
            : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Load ${template.name} template`}
    >
      <div className="flex items-start gap-3">
        {/* Selection indicator */}
        <div
          className={`
            w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
            transition-all duration-200
            ${
              isSelected
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
            }
          `}
        >
          {isSelected ? (
            <Check className="w-3 h-3" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-current opacity-50" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`font-medium text-sm mb-0.5 transition-colors ${
              isSelected
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {template.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {template.description}
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// Category Section Component
function CategorySection({
  categoryKey,
  categoryInfo,
  templates,
  selectedTemplate,
  onTemplateChange,
  defaultExpanded = true,
}: {
  categoryKey: string
  categoryInfo: { label: string; description: string; icon: string }
  templates: PlaygroundTemplate[]
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const Icon = categoryIcons[categoryKey] || Layers
  const hasSelectedTemplate = templates.some((t) => t.id === selectedTemplate)

  return (
    <div className="animate-fade-in">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <div
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center
              ${
                hasSelectedTemplate
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }
            `}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {categoryInfo.label}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              ({templates.length})
            </span>
          </div>
        </div>
        <div
          className={`
            text-gray-400 transition-transform duration-200
            ${isExpanded ? 'rotate-0' : '-rotate-90'}
          `}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Templates List */}
      {isExpanded && (
        <div className="mt-1 space-y-1 pl-2 animate-fade-in-down">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onClick={() => onTemplateChange(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Main Component Library
export function ComponentLibrary({
  selectedTemplate,
  onTemplateChange,
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const groupedTemplates = useMemo(() => getGroupedTemplates(), [])

  // Filter templates based on search
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return null
    }

    const query = searchQuery.toLowerCase()
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        t.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <nav className="flex flex-col h-full" aria-label="Component templates">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-9 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredResults ? (
          // Search Results
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? 's' : ''}
            </div>
            {filteredResults.length === 0 ? (
              <div className="py-8 text-center">
                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No templates found
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredResults.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => {
                      onTemplateChange(template.id)
                      setSearchQuery('')
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Category Groups
          Object.entries(templateCategories).map(
            ([categoryKey, categoryInfo]) => {
              const categoryTemplates = groupedTemplates[categoryKey]
              if (!categoryTemplates || categoryTemplates.length === 0)
                return null

              return (
                <CategorySection
                  key={categoryKey}
                  categoryKey={categoryKey}
                  categoryInfo={categoryInfo}
                  templates={categoryTemplates}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={onTemplateChange}
                  defaultExpanded={categoryKey === 'getting-started'}
                />
              )
            }
          )
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{templates.length} templates</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Clarity Chat
          </span>
        </div>
      </div>
    </nav>
  )
}
