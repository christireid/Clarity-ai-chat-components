import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="compare"
      description="Utility hook for comparing values. Used internally for performance optimization."
      category="API Reference - Hooks"
      estimatedDate="Q3 2026"
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
