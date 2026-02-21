import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="AudioPlayer"
      description="Component for playing audio responses from AI. Supports playback controls, progress tracking, and accessibility features for voice-enabled chat applications."
      category="API Reference - Components"
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
