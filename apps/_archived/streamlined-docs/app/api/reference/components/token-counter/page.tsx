import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="TokenCounter Component API"
      description="API documentation for the TokenCounter component. Display real-time token counts in your UI."
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
