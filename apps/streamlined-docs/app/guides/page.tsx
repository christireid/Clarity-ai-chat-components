import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Guides Overview"
      description="Overview of all guides and tutorials. Find the right guide for your use case."
      category="Guides"
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
