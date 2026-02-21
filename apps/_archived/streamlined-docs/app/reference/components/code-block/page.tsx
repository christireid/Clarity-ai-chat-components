import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="CodeBlock"
      description="Enhanced code block component with syntax highlighting, copy functionality, and language detection. Optimized for displaying code in AI chat responses."
      category="API Reference - Components"
      estimatedDate="March 2026"
      priority="medium"
      relatedLinks={[
        {
          title: 'Getting Started',
          href: '/get-started/quick-start',
          description: 'Quick start guide to get up and running',
        },
        {
          title: 'Token Optimization Guide',
          href: '/guides/token-optimization-mvp',
          description: 'Learn about token optimization strategies',
        },
      ]}
    />
  )
}
