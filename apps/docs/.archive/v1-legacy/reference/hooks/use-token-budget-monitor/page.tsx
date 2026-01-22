import type { Metadata } from 'next'
import { UseTokenBudgetMonitorWrapper } from './wrapper'

export const metadata: Metadata = {
  title: 'useTokenBudgetMonitor | Clarity Chat',
  description:
    'Real-time token budget monitoring with threshold-based warnings, automatic trimming, and immediate cost awareness.',
}

export default function UseTokenBudgetMonitorPage() {
  return <UseTokenBudgetMonitorWrapper />
}
