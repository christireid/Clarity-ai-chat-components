import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="TokenCounter API"
      description="API endpoint for token counting. Get accurate token counts for text, messages, and conversations."
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
