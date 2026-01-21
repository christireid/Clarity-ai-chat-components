import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'PromptLibrary - Enterprise Template Management',
  description: 'Advanced template library with marketplace, sharing, and community features for enterprise prompt management.',
}

import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

const promptLibraryProps: Prop[] = [
  {
    name: 'initialTemplates',
    type: 'PromptTemplate[]',
    description: 'Initial set of prompt templates to display.',
  },
  {
    name: 'enableSharing',
    type: 'boolean',
    default: 'false',
    description: 'Enable template sharing and marketplace features.',
  },
  {
    name: 'currentUser',
    type: '{ id: string; name: string }',
    description: 'Current user information for template sharing.',
  },
  {
    name: 'onTemplateCreate',
    type: '(template: PromptTemplate) => void',
    description: 'Callback when a new template is created.',
  },
  {
    name: 'onTemplateUpdate',
    type: '(template: PromptTemplate) => void',
    description: 'Callback when a template is updated.',
  },
  {
    name: 'onTemplateDelete',
    type: '(templateId: string) => void',
    description: 'Callback when a template is deleted.',
  },
  {
    name: 'onTemplateShare',
    type: '(template: PromptTemplate) => void',
    description: 'Callback when a template is shared to marketplace.',
  },
  {
    name: 'onTemplateImport',
    type: '(templates: PromptTemplate[]) => void',
    description: 'Callback when templates are imported.',
  },
]

export default function PromptLibraryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>🏆 Enterprise Component</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">PromptLibrary</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Enterprise-grade template management with marketplace sharing, community features,
          and comprehensive prompt engineering tools.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Application (Feature-Rich) •{' '}
          <strong>Domain:</strong> Template Management •{' '}
          <strong>Features:</strong> Marketplace, Sharing, Versioning
        </p>
      </div>

      <Callout type="info" title="Evolution from Simple to Enterprise">
        <p className="mb-2">
          PromptLibrary has evolved from a basic template selector to a comprehensive
          enterprise template management system with marketplace capabilities.
        </p>
        <ul className="list-disc list-inside">
          <li><strong>Before:</strong> Simple template list with basic CRUD</li>
          <li><strong>Now:</strong> Full marketplace with sharing, forking, and community features</li>
        </ul>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Template Management</h2>
        <CodePlayground
          code={`import { PromptLibrary } from '@clarity-chat/react'

function BasicTemplateLibrary() {
  const [templates, setTemplates] = useState([])

  return (
    <PromptLibrary
      initialTemplates={templates}
      onTemplateCreate={(template) => {
        setTemplates(prev => [...prev, template])
      }}
      onTemplateUpdate={(template) => {
        setTemplates(prev =>
          prev.map(t => t.id === template.id ? template : t)
        )
      }}
      onTemplateDelete={(templateId) => {
        setTemplates(prev => prev.filter(t => t.id !== templateId))
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Basic template management with create, read, update, and delete operations.
          Perfect for individual users or small teams.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Enterprise Marketplace Features</h2>
        <CodePlayground
          code={`import { PromptLibrary } from '@clarity-chat/react'

function EnterpriseTemplateLibrary() {
  return (
    <PromptLibrary
      initialTemplates={myPrivateTemplates}
      enableSharing={true}
      currentUser={{ id: 'user-123', name: 'Jane Developer' }}
      onTemplateShare={async (template) => {
        // Template is automatically added to marketplace
        console.log('Template shared:', template.name)
      }}
      onTemplateCreate={(template) => {
        // New templates can be shared immediately
        console.log('New template created:', template.name)
      }}
      onTemplateImport={(importedTemplates) => {
        // Handle bulk template import
        console.log(\`Imported \${importedTemplates.length} templates\`)
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Full enterprise features with marketplace sharing, community ratings,
          and advanced template management capabilities.
        </p>

        <Callout type="tip" title="Marketplace Benefits">
          <ul className="list-disc list-inside">
            <li><strong>Knowledge Sharing:</strong> Share successful prompts across teams</li>
            <li><strong>Quality Assurance:</strong> Community ratings and reviews</li>
            <li><strong>Version Control:</strong> Track template evolution and improvements</li>
            <li><strong>Collaboration:</strong> Fork and modify community templates</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Advanced Configuration</h2>
        <CodePlayground
          code={`import { PromptLibrary } from '@clarity-chat/react'

function AdvancedTemplateLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4">
      {/* Custom controls */}
      <div className="flex gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="development">Development</option>
          <option value="writing">Writing</option>
          <option value="analysis">Analysis</option>
        </select>

        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Template library with custom filtering */}
      <PromptLibrary
        initialTemplates={allTemplates}
        enableSharing={true}
        currentUser={currentUser}
        // Custom filtering would be handled by parent component
        onTemplateSelect={(template) => {
          // Apply template to chat
          applyTemplate(template)
        }}
      />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Advanced configuration with custom filtering, search, and integration
          with existing chat applications.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Template Marketplace Integration</h2>
        <CodePlayground
          code={`import { PromptLibrary, TemplateMarketplace } from '@clarity-chat/react'

function UnifiedTemplateSystem() {
  const [activeTab, setActiveTab] = useState('library')
  const [installedTemplates, setInstalledTemplates] = useState(new Set())

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={\`px-4 py-2 \${activeTab === 'library' ? 'border-b-2 border-blue-500' : ''}\`}
          onClick={() => setActiveTab('library')}
        >
          My Library
        </button>
        <button
          className={\`px-4 py-2 \${activeTab === 'marketplace' ? 'border-b-2 border-blue-500' : ''}\`}
          onClick={() => setActiveTab('marketplace')}
        >
          Marketplace
        </button>
      </div>

      {/* Content */}
      {activeTab === 'library' && (
        <PromptLibrary
          initialTemplates={myTemplates}
          enableSharing={true}
          currentUser={currentUser}
          onTemplateShare={(template) => {
            // Template now available in marketplace
            console.log('Shared to marketplace:', template.name)
          }}
        />
      )}

      {activeTab === 'marketplace' && (
        <TemplateMarketplace
          currentUser={currentUser}
          installedTemplateIds={installedTemplates}
          onTemplateInstall={(template) => {
            setInstalledTemplates(prev => new Set([...prev, template.id]))
          }}
          onTemplateFork={(forkedTemplate) => {
            // Add forked template to library
            console.log('Forked template:', forkedTemplate.name)
          }}
        />
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Unified template system combining personal library management with
          community marketplace discovery and collaboration.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props Reference</h2>
        <PropsTable props={promptLibraryProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">📝 Core Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Create and manage templates</li>
              <li>Variable substitution</li>
              <li>Template categorization</li>
              <li>Search and filtering</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🤝 Collaboration</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Template sharing</li>
              <li>Community marketplace</li>
              <li>Fork and modify templates</li>
              <li>Rating and feedback</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🏆 Enterprise</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Bulk import/export</li>
              <li>Version control</li>
              <li>Team permissions</li>
              <li>Analytics and insights</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <Callout type="tip" title="Template Organization">
            <p>Use consistent naming conventions and categorization for better discoverability.</p>
          </Callout>

          <Callout type="info" title="Sharing Guidelines">
            <p>Share templates that have been tested and proven effective. Include usage examples and variable descriptions.</p>
          </Callout>

          <Callout type="warning" title="Security Considerations">
            <p>Be cautious when using community templates. Review code and variables before applying to sensitive contexts.</p>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/template-marketplace"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">TemplateMarketplace</h3>
            <p className="text-sm text-muted-foreground">
              Community template marketplace for discovery and sharing.
            </p>
          </Link>
          <Link
            href="/cookbook/prompt-engineering"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Prompt Engineering</h3>
            <p className="text-sm text-muted-foreground">
              Best practices for creating effective prompt templates.
            </p>
          </Link>
          <Link
            href="/learn/templates"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Template System</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide to template creation and management.
            </p>
          </Link>
          <Link
            href="/enterprise/template-governance"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Template Governance</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise template management and approval workflows.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
