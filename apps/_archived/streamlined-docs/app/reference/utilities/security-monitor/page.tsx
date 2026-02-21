import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Security Monitor"
      description="Utility for monitoring security events. Detect and prevent security issues in conversations."
      category="API Reference - Utilities"
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
