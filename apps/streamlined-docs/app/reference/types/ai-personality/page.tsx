import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="AI Personality Types"
      description="Type definitions for AI personality configuration. Customize AI behavior and tone."
      category="API Reference - Types"
      estimatedDate="Q2 2026"
      priority="low"
      relatedLinks={[
        {
          title: 'Getting Started',
          href: '/get-started/quick-start',
          description: 'Quick start guide',
        },
        {
          title: 'API Reference',
          href: '/api',
          description: 'Complete API documentation',
        },
      ]}
    />
  )
}
