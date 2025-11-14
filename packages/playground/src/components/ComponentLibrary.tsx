/**
 * Component Library Sidebar
 * Browse and select component templates
 */


interface ComponentLibraryProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const categories = {
  'Getting Started': ['basic', 'streaming', 'conversation'],
  'Chat Components': ['chat-window'],
}

export function ComponentLibrary({
  selectedTemplate,
  onTemplateChange,
}: ComponentLibraryProps) {
  return (
    <nav className="p-4" aria-label="Component templates">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
        Templates
      </h2>

      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            {category}
          </h3>
          <div className="space-y-1">
            {items.map((template) => {
              const isSelected = selectedTemplate === template
              const templateName = template
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              
              return (
                <button
                  key={template}
                  onClick={() => onTemplateChange(template)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onTemplateChange(template)
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
                  aria-label={`Load ${templateName} template`}
                >
                  {templateName}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
