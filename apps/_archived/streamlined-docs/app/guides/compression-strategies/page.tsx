import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Compression Strategies"
      description="Comprehensive guide to text compression strategies. Compare extractive, abstractive, and hybrid approaches with performance benchmarks."
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
