'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to avoid tiktoken WASM issues during static generation
const UseTokenBudgetMonitorContent = dynamic(
  () => import('./content').then((mod) => mod.UseTokenBudgetMonitorContent),
  { ssr: false }
)

export function UseTokenBudgetMonitorWrapper() {
  return <UseTokenBudgetMonitorContent />
}
