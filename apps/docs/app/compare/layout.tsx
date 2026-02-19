import { Metadata } from 'next'
import { LIBRARY_STATS } from '@/lib/library-stats'

export const metadata: Metadata = {
  title: 'Compare - Clarity Chat vs Alternatives',
  description:
    'Compare Clarity Chat with Vercel AI SDK, LangChain, Gradio, and other AI chat solutions. Feature comparison, performance benchmarks, and migration guides.',
  openGraph: {
    title: 'Clarity Chat vs Alternatives - Feature Comparison',
    description: `Compare Clarity Chat with Vercel AI SDK, LangChain, and Gradio. See how ${LIBRARY_STATS.components} components, enterprise features, and WCAG AA accessibility compare.`,
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container-docs py-12">{children}</div>
}
