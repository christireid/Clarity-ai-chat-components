import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility - Clarity Chat',
  description: 'Learn about accessibility features and best practices in Clarity Chat.',
}

export default function LearnAccessibilityPage() {
  redirect('/guides/accessibility')
}
