'use client'

import { MultiProviderChat } from '@/components/multi-provider-chat'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <MultiProviderChat />
      </ErrorBoundary>
    </main>
  )
}
