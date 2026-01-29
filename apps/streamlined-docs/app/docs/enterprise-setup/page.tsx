import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Enterprise Setup"
      description="Enterprise deployment guide. Set up Clarity Chat for large-scale production deployments."
      category="Documentation"
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
