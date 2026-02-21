import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Compression API Reference"
      description="Complete reference for compression APIs. Compare compression strategies and implementation details."
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
