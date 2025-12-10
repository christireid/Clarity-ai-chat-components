import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting Started - Clarity Chat',
  description: 'Get started with Clarity Chat - installation, setup, and your first chat interface.',
}

/**
 * Redirects to the canonical Quick Start guide.
 * The primary getting started content is at /learn/quick-start.
 */
export default function GettingStartedGuidePage() {
  redirect('/learn/quick-start')
}
