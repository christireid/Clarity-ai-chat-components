import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare - Clarity Chat vs Alternatives',
  description:
    'Compare Clarity Chat with Vercel AI SDK, LangChain, Gradio, and other AI chat solutions. Feature comparison, performance benchmarks, and migration guides.',
  openGraph: {
    title: 'Clarity Chat vs Alternatives - Feature Comparison',
    description:
      'Compare Clarity Chat with Vercel AI SDK, LangChain, and Gradio. See why 200+ components, enterprise features, and WCAG AAA accessibility set us apart.',
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container-docs py-12">{children}</div>
}
