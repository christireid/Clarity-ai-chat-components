import StubPage from '@/app/components/StubPage'

export default function Page() {
  return (
    <StubPage
      title="Microphone Setup Help"
      description="Help guide for setting up microphone access for voice input. Troubleshoot common microphone issues."
      category="Help"
      estimatedDate="Q3 2026"
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
