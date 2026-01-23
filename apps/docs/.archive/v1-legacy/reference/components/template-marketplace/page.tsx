import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TemplateMarketplace - Community Template Discovery',
  description: 'Discover, rate, and install community prompt templates with enterprise marketplace features.',
}

const templateMarketplaceProps: Prop[] = [
  {
    name: 'currentUser',
    type: '{ id: string; name: string }',
    required: true,
    description: 'Current user information for ratings and installations.',
  },
  {
    name: 'installedTemplateIds',
    type: 'Set<string>',
    default: 'new Set()',
    description: 'Set of template IDs that are already installed by the user.',
  },
  {
    name: 'onTemplateInstall',
    type: '(template: SharedTemplate) => void',
    description: 'Callback when a template is installed.',
  },
  {
    name: 'onTemplateFork',
    type: '(template: PromptTemplate) => void',
    description: 'Callback when a template is forked.',
  },
  {
    name: 'onTemplateRate',
    type: '(templateId: string, rating: number, review?: string) => void',
    description: 'Callback when a template is rated.',
  },
  {
    name: 'defaultCategory',
    type: 'string',
    description: 'Default category filter to apply.',
  },
  {
    name: 'enablePreview',
    type: 'boolean',
    default: 'true',
    description: 'Enable template preview functionality.',
  },
  {
    name: 'showRatings',
    type: 'boolean',
    default: 'true',
    description: 'Show rating and review features.',
  },
]

export default function TemplateMarketplacePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>🌟 Community Component</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">TemplateMarketplace</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Community-driven template marketplace for discovering, rating, and sharing
          prompt templates with enterprise collaboration features.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Application (Social) •{' '}
          <strong>Domain:</strong> Template Community •{' '}
          <strong>Features:</strong> Discovery, Ratings, Collaboration
        </p>
      </div>

      <Callout type="info" title="Community-Powered Prompt Engineering">
        <p className="mb-2">
          TemplateMarketplace transforms prompt engineering from an individual practice
          into a collaborative community effort.
        </p>
        <ul className="list-disc list-inside">
          <li><strong>Discovery:</strong> Find battle-tested prompts for any use case</li>
          <li><strong>Quality:</strong> Community ratings ensure template effectiveness</li>
          <li><strong>Collaboration:</strong> Fork, modify, and share improvements</li>
          <li><strong>Learning:</strong> Study successful patterns from expert creators</li>
        </ul>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Marketplace Usage</h2>
        <CodePlayground
          code={`import { TemplateMarketplace } from '@clarity-chat/react'

function BasicMarketplace() {
  const [installedTemplates, setInstalledTemplates] = useState(new Set())

  return (
    <TemplateMarketplace
      currentUser={{ id: 'user-123', name: 'Jane Developer' }}
      installedTemplateIds={installedTemplates}
      onTemplateInstall={(template) => {
        setInstalledTemplates(prev => new Set([...prev, template.id]))
        console.log('Installed:', template.name)
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Basic marketplace integration with installation tracking.
          Users can browse, preview, and install community templates.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Full Community Features</h2>
        <CodePlayground
          code={`import { TemplateMarketplace } from '@clarity-chat/react'

function FullFeaturedMarketplace() {
  const [installedTemplates, setInstalledTemplates] = useState(new Set())
  const [myForkedTemplates, setMyForkedTemplates] = useState([])

  return (
    <TemplateMarketplace
      currentUser={{ id: 'user-123', name: 'Jane Developer' }}
      installedTemplateIds={installedTemplates}
      enablePreview={true}
      showRatings={true}
      onTemplateInstall={(template) => {
        setInstalledTemplates(prev => new Set([...prev, template.id]))
        // Add to user's library
        addToUserLibrary(template)
      }}
      onTemplateFork={(forkedTemplate) => {
        setMyForkedTemplates(prev => [...prev, forkedTemplate])
        // Add forked template to user's personal library
        addToUserLibrary(forkedTemplate)
      }}
      onTemplateRate={(templateId, rating, review) => {
        // Submit rating to community
        submitRating(templateId, rating, review)
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Complete marketplace experience with ratings, forking, and community interaction.
        </p>

        <Callout type="tip" title="Community Engagement">
          <p>Encourage users to:</p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Rate Templates:</strong> Help others find quality prompts</li>
            <li><strong>Fork & Improve:</strong> Build upon community work</li>
            <li><strong>Share Success:</strong> Contribute proven templates back</li>
            <li><strong>Leave Reviews:</strong> Provide context for template usage</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Enterprise Integration</h2>
        <CodePlayground
          code={`import { TemplateMarketplace } from '@clarity-chat/react'

function EnterpriseMarketplace() {
  const [approvedTemplates, setApprovedTemplates] = useState(new Set())
  const [pendingReviews, setPendingReviews] = useState([])

  // Only show approved templates in enterprise environment
  const filteredTemplates = useMemo(() => {
    return allMarketplaceTemplates.filter(template =>
      approvedTemplates.has(template.id)
    )
  }, [allMarketplaceTemplates, approvedTemplates])

  return (
    <div className="space-y-6">
      {/* Admin controls for enterprise */}
      {isAdmin && (
        <div className="bg-yellow-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Template Approval Queue</h3>
          <div className="space-y-2">
            {pendingReviews.map(template => (
              <div key={template.id} className="flex justify-between items-center">
                <span>{template.name} by {template.author.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => approveTemplate(template.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectTemplate(template.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketplace for approved templates only */}
      <TemplateMarketplace
        currentUser={currentUser}
        installedTemplateIds={userInstalledTemplates}
        // Custom template filtering for enterprise
        customTemplates={filteredTemplates}
        onTemplateInstall={(template) => {
          // Enterprise-specific installation logic
          installWithApproval(template)
        }}
      />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Enterprise marketplace with approval workflows, compliance filtering,
          and administrative controls for large organizations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Custom Theming & Branding</h2>
        <CodePlayground
          code={`import { TemplateMarketplace } from '@clarity-chat/react'

function BrandedMarketplace() {
  return (
    <div className="custom-marketplace-theme">
      <style jsx>{\`
        .custom-marketplace-theme {
          --marketplace-primary: #6366f1;
          --marketplace-secondary: #e0e7ff;
          --marketplace-accent: #4f46e5;
        }
      \`}</style>

      <TemplateMarketplace
        currentUser={currentUser}
        className="custom-marketplace"
        // Custom styling
        style={{
          '--primary-color': '#6366f1',
          '--background': '#f8fafc',
          '--card-shadow': '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
        }}
        // Custom empty state
        emptyState={
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share a template in your organization!
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Create First Template
            </button>
          </div>
        }
      />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Customize the marketplace appearance to match your brand and provide
          contextual empty states for better user experience.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Analytics & Insights</h2>
        <CodePlayground
          code={`import { TemplateMarketplace } from '@clarity-chat/react'

function AnalyticsEnabledMarketplace() {
  const [analytics, setAnalytics] = useState({
    views: 0,
    installs: 0,
    ratings: 0,
    searches: 0
  })

  return (
    <div className="space-y-6">
      {/* Analytics dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analytics.views}</div>
          <div className="text-sm text-blue-600">Template Views</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{analytics.installs}</div>
          <div className="text-sm text-green-600">Installs</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{analytics.ratings}</div>
          <div className="text-sm text-yellow-600">Ratings Given</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analytics.searches}</div>
          <div className="text-sm text-purple-600">Searches</div>
        </div>
      </div>

      <TemplateMarketplace
        currentUser={currentUser}
        onTemplateInstall={(template) => {
          setAnalytics(prev => ({ ...prev, installs: prev.installs + 1 }))
          trackEvent('template_installed', { templateId: template.id })
        }}
        onTemplateView={(template) => {
          setAnalytics(prev => ({ ...prev, views: prev.views + 1 }))
          trackEvent('template_viewed', { templateId: template.id })
        }}
        onSearch={(query) => {
          setAnalytics(prev => ({ ...prev, searches: prev.searches + 1 }))
          trackEvent('template_search', { query })
        }}
      />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Track marketplace engagement and usage patterns with comprehensive analytics.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props Reference</h2>
        <PropsTable props={templateMarketplaceProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🔍 Discovery</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Search and filtering</li>
              <li>Category organization</li>
              <li>Template previews</li>
              <li>Usage statistics</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🤝 Community</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Rating and reviews</li>
              <li>Fork and modify</li>
              <li>Author profiles</li>
              <li>Community highlights</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🏢 Enterprise</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Approval workflows</li>
              <li>Compliance filtering</li>
              <li>Analytics integration</li>
              <li>Custom branding</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <Callout type="tip" title="Quality over Quantity">
            <p>Focus on curating high-quality templates rather than accepting everything.
            Community trust depends on consistent quality.</p>
          </Callout>

          <Callout type="info" title="Clear Documentation">
            <p>Encourage template authors to include clear descriptions, usage examples,
            and variable documentation for better discoverability.</p>
          </Callout>

          <Callout type="warning" title="Moderation Guidelines">
            <p>Implement clear community guidelines and moderation processes to maintain
            quality and prevent abuse.</p>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Individual Developers</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Discover proven prompt patterns</li>
              <li>Learn from expert-crafted templates</li>
              <li>Share personal breakthroughs</li>
              <li>Build reputation through contributions</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Development Teams</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Standardize team prompt practices</li>
              <li>Share successful project templates</li>
              <li>Maintain organization-wide consistency</li>
              <li>Onboard new team members quickly</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Enterprise Organizations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Implement approval and governance</li>
              <li>Ensure compliance with policies</li>
              <li>Track template usage analytics</li>
              <li>Centralize prompt management</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Educational Platforms</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Provide learning resources</li>
              <li>Showcase best practices</li>
              <li>Enable peer learning</li>
              <li>Track student progress</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/prompt-library"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">PromptLibrary</h3>
            <p className="text-sm text-muted-foreground">
              Personal template management and organization.
            </p>
          </Link>
          <Link
            href="/cookbook/prompt-engineering"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Prompt Engineering</h3>
            <p className="text-sm text-muted-foreground">
              Best practices for creating effective templates.
            </p>
          </Link>
          <Link
            href="/learn/templates"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Template System</h3>
            <p className="text-sm text-muted-foreground">
              Complete guide to template creation and usage.
            </p>
          </Link>
          <Link
            href="/enterprise/template-governance"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Template Governance</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise template approval and management.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}