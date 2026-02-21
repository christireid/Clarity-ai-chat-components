'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to avoid tiktoken WASM issues during static generation
const StructuredInputBuilderContent = dynamic(
  () => import('./content').then((mod) => mod.StructuredInputBuilderContent),
  { ssr: false }
)

export function StructuredInputBuilderWrapper() {
  return <StructuredInputBuilderContent />
}
