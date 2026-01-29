import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="GenerativeUI"
      description="The GenerativeUI component renders AI-generated user interfaces dynamically. It supports tool calls, interactive forms, data visualizations, and custom component rendering based on AI responses."
      category="API Reference - Components"
      estimatedDate="February 2026"
      priority="high"
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
