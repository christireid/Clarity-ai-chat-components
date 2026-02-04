'use client'

import { BasicChat } from '@/components/basic-chat'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <BasicChat />
      </ErrorBoundary>
    </main>
  )
}
