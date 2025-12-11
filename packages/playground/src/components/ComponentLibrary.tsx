/**
 * Component Library Sidebar
 * Browse and select component templates
 */

import { templates, templateCategories } from '../templates/index'
import type { PlaygroundTemplate } from '../types'

interface ComponentLibraryProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
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

export function ComponentLibrary({
  selectedTemplate,
  onTemplateChange,
}: ComponentLibraryProps) {
  const groupedTemplates = getGroupedTemplates()

  return (
    <nav className="p-4" aria-label="Component templates">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
        Templates
      </h2>

      {Object.entries(templateCategories).map(([categoryKey, categoryInfo]) => {
        const categoryTemplates = groupedTemplates[categoryKey]
        if (!categoryTemplates || categoryTemplates.length === 0) return null

        return (
          <div key={categoryKey} className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </h3>
            <div className="space-y-1">
              {categoryTemplates.map((template) => {
                const isSelected = selectedTemplate === template.id

                return (
                  <button
                    key={template.id}
                    onClick={() => onTemplateChange(template.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onTemplateChange(template.id)
                      }
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                      ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    aria-pressed={isSelected}
                    aria-label={`Load ${template.name} template`}
                    title={template.description}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {template.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
