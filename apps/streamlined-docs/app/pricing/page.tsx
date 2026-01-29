import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Pricing"
      description="View pricing plans and options for Clarity Chat. Compare features and find the right plan for your needs."
      category="Info"
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
