import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="ExtractivCompressor"
      description="Extractive summarization compressor that preserves key sentences from the original text. Fast and maintains exact wording."
      category="API Reference - Classes"
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
