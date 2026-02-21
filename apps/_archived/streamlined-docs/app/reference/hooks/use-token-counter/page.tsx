import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="useTokenCounter"
      description="Hook for counting tokens in real-time. Provides token counts for input text and messages."
      category="API Reference - Hooks"
      estimatedDate="April 2026"
      priority="medium"
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
