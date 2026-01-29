import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Chat Interface"
      description="Interactive chat interface for testing and experimenting with Clarity Chat components in real-time."
      category="Tools"
      estimatedDate="Q2 2026"
      priority="low"
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
