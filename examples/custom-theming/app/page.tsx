'use client'

import { ThemingDemo } from '@/components/theming-demo'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <ThemingDemo />
      </ErrorBoundary>
    </main>
  )
}
