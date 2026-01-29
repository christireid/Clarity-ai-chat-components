import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Backend Integration Guide"
      description="Complete guide for integrating Clarity Chat with your backend. Covers Express, Fastify, Hono, and custom server implementations with security best practices."
      category="Guides"
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
