/**
 * Enhanced Template System Example
 *
 * Demonstrates the complete template system with:
 * - Template library management
 * - Community marketplace
 * - Sharing and collaboration
 * - Import/export functionality
 */

'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@clarity-chat/react'
import { PromptLibrary } from '@clarity-chat/react'
import { TemplateMarketplace } from '@clarity-chat/react'
import { Button } from '@clarity-chat/react'
import { Badge } from '@clarity-chat/react'
import { Card, CardContent, CardHeader, CardTitle } from '@clarity-chat/react'
import type { PromptTemplate, SharedTemplate } from '@clarity-chat/react'

// Sample templates for demonstration
const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: 'writing-essay',
    name: 'Essay Writer',
    description: 'Professional essay writing assistant with structured outline and research guidance',
    template: `Write a well-structured essay on the topic: {{topic}}

Requirements:
- Length: {{word_count}} words
- Style: {{writing_style}}
- Include {{num_sources}} sources
- Target audience: {{audience}}

Structure your essay with:
1. Introduction with thesis statement
2. Body paragraphs with evidence
3. Counterarguments and rebuttals
4. Conclusion with implications

Make it engaging and well-supported.`,
    variables: [
      { name: 'topic', description: 'The essay topic', type: 'string', required: true },
      { name: 'word_count', description: 'Target word count', type: 'number', default: '1500', required: true },
      { name: 'writing_style', description: 'Academic, conversational, etc.', type: 'string', default: 'academic', required: true },
      { name: 'num_sources', description: 'Number of sources to include', type: 'number', default: '5', required: false },
      { name: 'audience', description: 'Target audience', type: 'string', default: 'general', required: false },
    ],
    tags: ['writing', 'academic', 'research'],
    version: '2.1.0',
  },
  {
    id: 'code-reviewer',
    name: 'Code Review Assistant',
    description: 'Comprehensive code review with best practices and security checks',
    template: `Review the following code for:

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Readability, maintainability, performance
3. **Security**: Potential vulnerabilities, input validation
4. **Best Practices**: Language-specific conventions, design patterns
5. **Testing**: Test coverage, edge cases

Code to review:
\`\`\`{{language}}
{{code}}
\`\`\`

Additional context: {{context}}

Provide specific, actionable feedback with examples where possible.`,
    variables: [
      { name: 'language', description: 'Programming language', type: 'string', required: true },
      { name: 'code', description: 'Code to review', type: 'string', required: true },
      { name: 'context', description: 'Additional context or requirements', type: 'string', required: false },
    ],
    tags: ['coding', 'review', 'quality'],
    version: '1.3.0',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Report',
    description: 'Generate comprehensive data analysis reports with visualizations and insights',
    template: `Analyze the following dataset and create a comprehensive report:

Dataset: {{dataset_description}}
Analysis Goals: {{goals}}
Key Metrics: {{metrics}}
Time Period: {{time_period}}

Report Structure:
1. Executive Summary
2. Data Overview and Quality Assessment
3. Key Findings and Insights
4. Visualizations and Charts Description
5. Recommendations and Next Steps
6. Methodology and Assumptions

Focus on actionable insights and clear explanations.`,
    variables: [
      { name: 'dataset_description', description: 'Description of the dataset', type: 'string', required: true },
      { name: 'goals', description: 'Analysis objectives', type: 'string', required: true },
      { name: 'metrics', description: 'Key metrics to analyze', type: 'string', required: true },
      { name: 'time_period', description: 'Analysis time period', type: 'string', required: false },
    ],
    tags: ['analysis', 'data', 'reporting'],
    version: '1.0.0',
  },
]

export function EnhancedTemplateSystemExample() {
  const [activeTab, setActiveTab] = useState('library')
  const [installedTemplates, setInstalledTemplates] = useState<Set<string>>(new Set())
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<SharedTemplate[]>([])

  // Initialize marketplace with sample templates
  React.useEffect(() => {
    const initMarketplace = async () => {
      // Simulate sharing templates to marketplace
      const sharedTemplates: SharedTemplate[] = SAMPLE_TEMPLATES.map(template => ({
        ...template,
        author: {
          id: 'demo-user',
          name: 'Demo Author',
          avatar: undefined,
        },
        sharedAt: Date.now() - Math.random() * 86400000 * 7, // Random time in last week
        sharing: {
          isPublic: Math.random() > 0.3, // 70% public
          allowFork: Math.random() > 0.2, // 80% allow fork
          requireAttribution: Math.random() > 0.7, // 30% require attribution
        },
        stats: {
          downloads: Math.floor(Math.random() * 1000),
          forks: Math.floor(Math.random() * 100),
          rating: Math.round((3 + Math.random() * 2) * 10) / 10, // 3.0-5.0
          reviews: Math.floor(Math.random() * 50),
        },
        sharedVersion: template.version || '1.0.0',
      }))

      // Sort by different criteria for demo
      const popular = [...sharedTemplates].sort((a, b) => b.stats.downloads - a.stats.downloads)
      const recent = [...sharedTemplates].sort((a, b) => b.sharedAt - a.sharedAt)
      const topRated = [...sharedTemplates].sort((a, b) => b.stats.rating - a.stats.rating)

      setMarketplaceTemplates(recent) // Default to recent
    }

    initMarketplace()
  }, [])

  const handleTemplateCreate = () => {
    console.log('Create new template')
    // In real app, open template editor
  }

  const handleTemplateSelect = (template: PromptTemplate) => {
    console.log('Selected template:', template.name)
    // In real app, open template in editor or playground
  }

  const handleTemplateEdit = (template: PromptTemplate) => {
    console.log('Edit template:', template.name)
    // In real app, open template editor
  }

  const handleTemplateShare = (template: PromptTemplate) => {
    console.log('Share template:', template.name)
    // In real app, show sharing dialog
  }

  const handleTemplateImport = (templates: PromptTemplate[]) => {
    console.log('Imported templates:', templates.length)
    // In real app, add to library
  }

  const handleMarketplaceInstall = (template: SharedTemplate) => {
    console.log('Installing template:', template.name)
    setInstalledTemplates(prev => new Set(prev).add(template.id))
    // In real app, add to local library
  }

  const handleMarketplacePreview = (template: SharedTemplate) => {
    console.log('Preview template:', template.name)
    // In real app, show preview modal
  }

  const handleMarketplaceRate = (templateId: string, rating: number, review?: string) => {
    console.log('Rated template:', templateId, 'Rating:', rating, 'Review:', review)
    // In real app, submit rating to backend
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Enhanced Template System</h1>
        <p className="text-xl text-muted-foreground">
          Complete template management with sharing, marketplace, and collaboration
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="secondary" className="px-3 py-1">
            📚 Template Library
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🏪 Community Marketplace
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🤝 Sharing & Collaboration
          </Badge>
        </div>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>What's New in Template Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">📚 Enhanced Library</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Advanced search and filtering</li>
                <li>• Template categories and tags</li>
                <li>• Version history and rollback</li>
                <li>• Import/export collections</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">🤝 Community Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Template marketplace</li>
                <li>• Sharing and forking</li>
                <li>• Ratings and reviews</li>
                <li>• Social discovery</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">🎯 Advanced Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A/B testing support</li>
                <li>• Analytics and metrics</li>
                <li>• Deployment management</li>
                <li>• Collaboration tools</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">My Library</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        {/* Template Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <PromptLibrary
            initialTemplates={SAMPLE_TEMPLATES}
            enableSharing={true}
            enableCollaboration={true}
            enableAnalytics={true}
            enableABTesting={true}
            onTemplateSelect={handleTemplateSelect}
            onTemplateEdit={handleTemplateEdit}
            onTemplateCreate={handleTemplateCreate}
            onTemplateShare={handleTemplateShare}
            onTemplateImport={handleTemplateImport}
          />
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          <TemplateMarketplace
            currentUser={{
              id: 'demo-user',
              name: 'Demo User',
              avatar: undefined,
            }}
            installedTemplateIds={installedTemplates}
            onTemplateInstall={handleMarketplaceInstall}
            onTemplatePreview={handleMarketplacePreview}
            onTemplateRate={handleMarketplaceRate}
          />
        </TabsContent>
      </Tabs>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">📚 Managing Templates</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Browse your template library in the "My Library" tab</li>
                <li>Use search and filters to find templates quickly</li>
                <li>Create new templates or edit existing ones</li>
                <li>Share templates publicly or with specific users</li>
                <li>Import/export template collections</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">🏪 Using the Marketplace</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Explore community-shared templates in "Marketplace"</li>
                <li>Preview templates before installing</li>
                <li>Rate and review templates you've used</li>
                <li>Fork templates to create your own variations</li>
                <li>Discover templates by category or popularity</li>
              </ol>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use tags to organize templates by use case (writing, coding, analysis, etc.)</li>
              <li>• Rate templates in the marketplace to help others discover quality templates</li>
              <li>• Fork popular templates and customize them for your specific needs</li>
              <li>• Export your template collection to backup or share with your team</li>
              <li>• Use the marketplace to discover templates for tasks you haven't considered</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedTemplateSystemExample