'use client'

import { useState } from 'react'
import { BookOpen, Search as SearchIcon } from 'lucide-react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  DocumentationViewer,
  DocumentationSearch,
} from '@/components/docs'
import {
  componentDocsDatabase,
  getAllCategories,
  getComponentsByCategory,
} from '@/lib/component-docs-data'

export default function DocumentationPage() {
  const [selectedComponent, setSelectedComponent] = useState(
    componentDocsDatabase[0]?.name || ''
  )

  const currentDocs = componentDocsDatabase.find(
    (doc) => doc.name === selectedComponent
  )

  const categories = getAllCategories()

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Component Documentation"
        description="Interactive documentation viewer with props tables, code examples, and best practices for all Clarity Chat components."
        icon={BookOpen}
        badge="Interactive"
      />

      {/* Search Bar */}
      <ComponentSection
        title="Search Documentation"
        description="Find components by name, category, or functionality"
        icon={SearchIcon}
      >
        <DocumentationSearch
          onSelectComponent={setSelectedComponent}
        />
      </ComponentSection>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Sidebar - Component List */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Components</h3>
            <div className="space-y-4">
              {categories.map((category) => {
                const components = getComponentsByCategory(category)
                return (
                  <div key={category}>
                    <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {components.map((doc) => (
                        <button
                          key={doc.name}
                          onClick={() => setSelectedComponent(doc.name)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedComponent === doc.name
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-background/50 text-muted-foreground'
                          }`}
                        >
                          {doc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Documentation Viewer */}
        <div className="lg:col-span-3">
          {currentDocs ? (
            <DocumentationViewer docs={currentDocs} />
          ) : (
            <div className="glass-card p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Select a component to view its documentation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <ComponentSection
        title="Documentation Coverage"
        description="Overview of available documentation"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-3xl font-bold gradient-text">
              {componentDocsDatabase.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Components Documented
            </p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold gradient-text">
              {componentDocsDatabase.reduce(
                (acc, doc) => acc + doc.examples.length,
                0
              )}
            </p>
            <p className="text-sm text-muted-foreground">Code Examples</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold gradient-text">
              {componentDocsDatabase.reduce(
                (acc, doc) => acc + doc.bestPractices.length,
                0
              )}
            </p>
            <p className="text-sm text-muted-foreground">Best Practices</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold gradient-text">
              {componentDocsDatabase.reduce(
                (acc, doc) => acc + doc.troubleshooting.length,
                0
              )}
            </p>
            <p className="text-sm text-muted-foreground">Troubleshooting Guides</p>
          </div>
        </div>
      </ComponentSection>
    </div>
  )
}
