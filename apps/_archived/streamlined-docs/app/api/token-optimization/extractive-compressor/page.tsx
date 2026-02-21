import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="ExtractivCompressor API"
      description="API endpoint for extractive compression. Fast compression that preserves exact sentences from the original text."
      category="API Reference - Token Optimization"
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
