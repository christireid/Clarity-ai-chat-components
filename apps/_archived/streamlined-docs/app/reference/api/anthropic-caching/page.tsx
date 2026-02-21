import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Anthropic Caching Reference"
      description="Reference documentation for Anthropic's prompt caching. Details on cache behavior, pricing, and best practices."
      category="API Reference"
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
