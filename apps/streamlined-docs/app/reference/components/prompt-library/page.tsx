'use client'

import React, { useState } from 'react'
import { PromptLibrary } from '@clarity-chat/react'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { Section } from '@/components/Docs/Section'
import { BookOpen, Search, Share2, GitBranch, Tag, TrendingUp } from 'lucide-react'
import type { PromptTemplate } from '@clarity-chat/react'

const mockTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Code Review Assistant',
    description: 'Review code for best practices, security issues, and improvements',
    template: `Review the following {{language}} code for:
- Best practices
- Security vulnerabilities
- Performance optimizations
- Code readability

Code:
{{code}}`,
    variables: [
      { name: 'language', required: true, type: 'string', description: 'Programming language' },
      { name: 'code', required: true, type: 'string', description: 'Code to review' },
    ],
    version: '1.0.0',
    tags: ['coding', 'review', 'security'],
  },
  {
    id: '2',
    name: 'Technical Documentation Writer',
    description: 'Generate clear technical documentation from code or specifications',
    template: `Generate comprehensive technical documentation for:

Component: {{component_name}}
Purpose: {{purpose}}

Include:
- Overview and key features
- Installation instructions
- Usage examples
- API reference
- Best practices`,
    variables: [
      { name: 'component_name', required: true, type: 'string' },
      { name: 'purpose', required: true, type: 'string' },
    ],
    version: '2.1.0',
    tags: ['writing', 'documentation', 'technical'],
  },
  {
    id: '3',
    name: 'Data Analysis Report',
    description: 'Analyze data and generate insights with visualizations',
    template: `Analyze the following dataset and provide:
1. Summary statistics
2. Key trends and patterns
3. Actionable insights
4. Recommendations

Dataset: {{dataset}}
Focus areas: {{focus_areas}}`,
    variables: [
      { name: 'dataset', required: true, type: 'string' },
      { name: 'focus_areas', required: false, type: 'string', default: 'general analysis' },
    ],
    version: '1.5.0',
    tags: ['analysis', 'data', 'reporting'],
  },
  {
    id: '4',
    name: 'Email Composer',
    description: 'Compose professional emails with appropriate tone and structure',
    template: `Compose a professional email with the following details:

Recipient: {{recipient}}
Subject: {{subject}}
Tone: {{tone}}
Key points: {{key_points}}

Format the email with proper greeting, body, and closing.`,
    variables: [
      { name: 'recipient', required: true, type: 'string' },
      { name: 'subject', required: true, type: 'string' },
      { name: 'tone', required: false, type: 'string', default: 'professional' },
      { name: 'key_points', required: true, type: 'string' },
    ],
    version: '1.2.0',
    tags: ['communication', 'email', 'writing'],
  },
]

export default function PromptLibraryPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    console.log('Selected template:', template)
  }

  const handleTemplateEdit = (template: PromptTemplate) => {
    console.log('Edit template:', template)
  }

  const handleTemplateCreate = () => {
    console.log('Create new template')
  }

  const handleTemplateShare = (template: PromptTemplate) => {
    console.log('Share template:', template)
  }

  const handleTemplateImport = (templates: PromptTemplate[]) => {
    console.log('Import templates:', templates)
  }

  return (
    <DocumentationPage
      title="PromptLibrary"
      description="A comprehensive prompt template library for managing, organizing, and sharing reusable AI prompts with variables, versioning, and collaboration features."
      icon={BookOpen}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Search,
          label: 'Search & Filter',
          description: 'Find templates quickly with search and category filters',
        },
        {
          icon: Tag,
          label: 'Variables',
          description: 'Dynamic templates with validated variable substitution',
        },
        {
          icon: GitBranch,
          label: 'Versioning',
          description: 'Track template versions and changes over time',
        },
        {
          icon: Share2,
          label: 'Sharing',
          description: 'Export, import, and share templates with your team',
        },
      ]}
      tableOfContents={[
        { id: 'overview', title: 'Overview', level: 1 },
        { id: 'installation', title: 'Installation', level: 1 },
        { id: 'usage', title: 'Basic Usage', level: 1 },
        { id: 'demo', title: 'Live Demo', level: 1 },
        { id: 'props', title: 'Props', level: 1 },
        { id: 'template-structure', title: 'Template Structure', level: 1 },
        { id: 'variables', title: 'Template Variables', level: 1 },
        { id: 'versioning', title: 'Prompt Versioning', level: 1 },
        { id: 'categories', title: 'Categories', level: 1 },
        { id: 'sharing', title: 'Sharing & Import/Export', level: 1 },
        { id: 'analytics', title: 'Analytics & A/B Testing', level: 1 },
        { id: 'examples', title: 'Examples', level: 1 },
        { id: 'related', title: 'Related', level: 1 },
      ]}
      relatedAPIs={[
        {
          name: 'usePromptLibrary',
          type: 'hook',
          description: 'React hook for programmatic prompt library management',
          href: '/reference/hooks/use-prompt-library',
        },
        {
          name: 'usePromptRecipe',
          type: 'hook',
          description: 'Build prompts from recipes using the toon DSL',
          href: '/reference/hooks/use-prompt-recipe',
        },
        {
          name: 'PromptPlayground',
          type: 'component',
          description: 'Test and refine prompts with live preview',
          href: '/reference/components/prompt-playground',
        },
        {
          name: 'PromptVersionHistory',
          type: 'component',
          description: 'View and manage prompt version history',
          href: '/reference/components/prompt-version-history',
        },
      ]}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-muted-foreground mb-4">
          PromptLibrary is a comprehensive solution for managing AI prompt templates. It provides
          a visual interface for browsing, searching, and organizing prompts with support for
          template variables, versioning, analytics, and team collaboration.
        </p>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Key Features</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong>Template Management:</strong> Create, edit, and organize prompt templates
            </li>
            <li>
              • <strong>Variable System:</strong> Define dynamic variables with validation and
              defaults
            </li>
            <li>
              • <strong>Search & Filter:</strong> Find templates by name, description, tags, or
              category
            </li>
            <li>
              • <strong>Version Control:</strong> Track template changes and rollback to previous
              versions
            </li>
            <li>
              • <strong>Sharing:</strong> Import/export templates as JSON for team collaboration
            </li>
            <li>
              • <strong>Analytics:</strong> Track usage, performance, and quality metrics (optional)
            </li>
            <li>
              • <strong>A/B Testing:</strong> Test multiple template variations (optional)
            </li>
          </ul>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Package Installation</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code>npm install @clarity-chat/react</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Import</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`import { PromptLibrary } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'`}</code>
            </pre>
          </div>
        </div>
      </Section>

      {/* Basic Usage */}
      <Section id="usage" title="Basic Usage">
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { PromptLibrary } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'

const myTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Code Review',
    description: 'Review code for best practices',
    template: 'Review this {{language}} code:\\n\\n{{code}}',
    variables: [
      { name: 'language', required: true, type: 'string' },
      { name: 'code', required: true, type: 'string' },
    ],
    tags: ['coding', 'review'],
  },
]

function MyApp() {
  const handleTemplateSelect = (template: PromptTemplate) => {
    console.log('Selected:', template)
  }

  return (
    <PromptLibrary
      initialTemplates={myTemplates}
      onTemplateSelect={handleTemplateSelect}
      onTemplateCreate={() => console.log('Create new template')}
    />
  )
}`}</code>
        </pre>
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <div className="border rounded-lg bg-card p-6">
          <PromptLibrary
            initialTemplates={mockTemplates}
            enableSharing={true}
            enableAnalytics={true}
            onTemplateSelect={handleTemplateSelect}
            onTemplateEdit={handleTemplateEdit}
            onTemplateCreate={handleTemplateCreate}
            onTemplateShare={handleTemplateShare}
            onTemplateImport={handleTemplateImport}
          />

          {selectedTemplate && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Selected Template:</h4>
              <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
            </div>
          )}
        </div>
      </Section>

      {/* Props */}
      <Section id="props" title="Props">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>initialTemplates</code>
                </td>
                <td className="py-3 px-4">
                  <code>PromptTemplate[]</code>
                </td>
                <td className="py-3 px-4">
                  <code>[]</code>
                </td>
                <td className="py-3 px-4">Initial templates to display in the library</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>enableSharing</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>true</code>
                </td>
                <td className="py-3 px-4">Enable import/export and sharing features</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>enableCollaboration</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>false</code>
                </td>
                <td className="py-3 px-4">Enable collaboration features (comments, history)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>enableAnalytics</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>true</code>
                </td>
                <td className="py-3 px-4">Show analytics data (usage, performance, quality)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>enableABTesting</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>false</code>
                </td>
                <td className="py-3 px-4">Enable A/B testing features for templates</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>categories</code>
                </td>
                <td className="py-3 px-4">
                  <code>Category[]</code>
                </td>
                <td className="py-3 px-4">Default categories</td>
                <td className="py-3 px-4">Custom categories with icons and colors</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onTemplateSelect</code>
                </td>
                <td className="py-3 px-4">
                  <code>(template) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Called when a template is selected</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onTemplateEdit</code>
                </td>
                <td className="py-3 px-4">
                  <code>(template) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Called when edit button is clicked</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onTemplateCreate</code>
                </td>
                <td className="py-3 px-4">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Called when create new template button is clicked</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onTemplateShare</code>
                </td>
                <td className="py-3 px-4">
                  <code>(template) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Called when share button is clicked</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onTemplateImport</code>
                </td>
                <td className="py-3 px-4">
                  <code>(templates) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Called when templates are imported</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>className</code>
                </td>
                <td className="py-3 px-4">
                  <code>string</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Template Structure */}
      <Section id="template-structure" title="Template Structure">
        <p className="text-muted-foreground mb-4">
          Each template in the library follows a structured format:
        </p>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`interface PromptTemplate {
  // Unique identifier
  id: string

  // Template metadata
  name: string
  description?: string
  version?: string
  tags?: string[]

  // Template content with variable placeholders
  template: string

  // Variable definitions
  variables?: PromptVariable[]

  // Additional metadata
  metadata?: Record<string, unknown>
}`}</code>
        </pre>
      </Section>

      {/* Template Variables */}
      <Section id="variables" title="Template Variables">
        <p className="text-muted-foreground mb-4">
          Templates support dynamic variables with validation, defaults, and type safety:
        </p>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`interface PromptVariable {
  name: string                              // Variable name
  description?: string                      // Human-readable description
  type?: 'string' | 'number' | 'boolean'    // Data type
  default?: unknown                         // Default value
  required?: boolean                        // Is required?
  validate?: (value: unknown) => boolean    // Custom validation
}`}</code>
        </pre>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Variable Usage Example</h4>
          <pre className="text-sm">
            <code>{`const template: PromptTemplate = {
  id: '1',
  name: 'API Documentation',
  template: \`Generate API docs for {{endpoint_name}}

Method: {{method}}
Description: {{description}}
Authentication: {{auth_required}}\`,

  variables: [
    {
      name: 'endpoint_name',
      required: true,
      type: 'string',
      description: 'Name of the API endpoint',
    },
    {
      name: 'method',
      required: true,
      type: 'string',
      default: 'GET',
      validate: (val) => ['GET', 'POST', 'PUT', 'DELETE'].includes(val),
    },
    {
      name: 'description',
      required: false,
      type: 'string',
    },
    {
      name: 'auth_required',
      required: false,
      type: 'boolean',
      default: true,
    },
  ],
}`}</code>
          </pre>
        </div>
      </Section>

      {/* Versioning */}
      <Section id="versioning" title="Prompt Versioning">
        <p className="text-muted-foreground mb-4">
          Track changes to your prompts over time with built-in version control:
        </p>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { usePromptLibrary } from '@clarity-chat/react'

function VersionedPrompts() {
  const { versions, templates } = usePromptLibrary()

  // Create a new version
  const handleUpdate = (templateId: string, newContent: string) => {
    versions.create(templateId, newContent, 'Updated for better clarity')
  }

  // Get version history
  const history = versions.getAll(templateId)

  // Rollback to previous version
  const handleRollback = (templateId: string, versionId: string) => {
    versions.rollback(templateId, versionId)
  }

  return (
    <PromptLibrary
      initialTemplates={templates.getAll()}
      enableCollaboration={true}
    />
  )
}`}</code>
        </pre>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Version Features</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Automatic semantic versioning (1.0.0 → 1.0.1 → 1.1.0)</li>
            <li>• Version comparison with diff highlighting</li>
            <li>• Rollback to any previous version</li>
            <li>• Version notes and change descriptions</li>
            <li>• Active version management</li>
          </ul>
        </div>
      </Section>

      {/* Categories */}
      <Section id="categories" title="Categories">
        <p className="text-muted-foreground mb-4">
          Organize templates into categories with custom icons and colors:
        </p>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { PromptLibrary } from '@clarity-chat/react'
import { Code, FileText, BarChart } from 'lucide-react'

const customCategories = [
  {
    id: 'coding',
    name: 'Coding',
    icon: <Code className="w-4 h-4" />,
    color: 'bg-green-500',
  },
  {
    id: 'writing',
    name: 'Writing',
    icon: <FileText className="w-4 h-4" />,
    color: 'bg-blue-500',
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: <BarChart className="w-4 h-4" />,
    color: 'bg-purple-500',
  },
]

function CategorizedLibrary() {
  return (
    <PromptLibrary
      categories={customCategories}
      initialTemplates={templates}
    />
  )
}`}</code>
        </pre>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Default Categories</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li>• Writing</li>
            <li>• Coding</li>
            <li>• Design</li>
            <li>• Analysis</li>
            <li>• Communication</li>
            <li>• Automation</li>
          </ul>
        </div>
      </Section>

      {/* Sharing */}
      <Section id="sharing" title="Sharing & Import/Export">
        <p className="text-muted-foreground mb-4">
          Share templates with your team or across projects using JSON export/import:
        </p>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { usePromptLibrary } from '@clarity-chat/react'

function TemplateSharing() {
  const library = usePromptLibrary()

  // Export all templates
  const handleExport = () => {
    const json = library.export()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prompts.json'
    a.click()
  }

  // Import templates
  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const json = e.target?.result as string
      const success = library.import(json)
      if (success) {
        console.log('Templates imported successfully')
      }
    }
    reader.readAsText(file)
  }

  return (
    <PromptLibrary
      enableSharing={true}
      onTemplateImport={(templates) => console.log('Imported:', templates)}
    />
  )
}`}</code>
        </pre>
      </Section>

      {/* Analytics */}
      <Section id="analytics" title="Analytics & A/B Testing">
        <p className="text-muted-foreground mb-4">
          Track template performance and run A/B tests to optimize your prompts:
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Analytics Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Usage metrics (total uses, unique users)</li>
              <li>• Performance metrics (latency, token count)</li>
              <li>• Quality metrics (success rate, satisfaction)</li>
              <li>• Cost tracking</li>
            </ul>
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">A/B Testing Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Multiple template variants</li>
              <li>• Traffic allocation control</li>
              <li>• Statistical significance testing</li>
              <li>• Winner determination</li>
            </ul>
          </div>
        </div>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`<PromptLibrary
  enableAnalytics={true}
  enableABTesting={true}
  initialTemplates={templates}
/>`}</code>
        </pre>
      </Section>

      {/* Examples */}
      <Section id="examples" title="Examples">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Complete Integration Example</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`import { PromptLibrary, usePromptLibrary } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'

function MyPromptManager() {
  const library = usePromptLibrary({
    persist: true,  // Save to localStorage
    storageKey: 'my-prompts',
    currentUser: {
      id: 'user-123',
      name: 'John Doe',
    },
  })

  const handleSelect = (template: PromptTemplate) => {
    // Use the template in your application
    const { template: content, variables } = template

    // Render with variable values
    const rendered = renderTemplate(content, {
      language: 'TypeScript',
      code: myCode,
    })

    sendToAI(rendered)
  }

  const handleCreate = () => {
    // Create new template
    const newTemplate = library.templates.add({
      name: 'My Custom Template',
      template: 'Your prompt here with {{variables}}',
      variables: [
        { name: 'variables', required: true, type: 'string' },
      ],
      tags: ['custom'],
    })
  }

  return (
    <PromptLibrary
      initialTemplates={library.state.templates}
      onTemplateSelect={handleSelect}
      onTemplateCreate={handleCreate}
      enableSharing={true}
      enableAnalytics={true}
    />
  )
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Custom Categories</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`import { PromptLibrary } from '@clarity-chat/react'
import { Sparkles, Zap, Brain } from 'lucide-react'

const categories = [
  {
    id: 'creative',
    name: 'Creative',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-pink-500',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-yellow-500',
  },
  {
    id: 'research',
    name: 'Research',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-indigo-500',
  },
]

<PromptLibrary
  categories={categories}
  initialTemplates={templates}
/>`}</code>
            </pre>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
