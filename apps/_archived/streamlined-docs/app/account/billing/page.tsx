import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Account Billing"
      description="Manage your account billing and subscription. View usage, update payment methods, and access invoices."
      category="Account"
      estimatedDate="Q3 2026"
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
