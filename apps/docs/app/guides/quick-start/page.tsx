import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quick Start - Clarity Chat',
  description: 'Build a fully functional AI chat application in under 10 minutes.',
}

/**
 * Redirects to the canonical Quick Start guide.
 * The primary quick start content is at /learn/quick-start.
 */
export default function QuickStartGuidePage() {
  redirect('/learn/quick-start')
}
