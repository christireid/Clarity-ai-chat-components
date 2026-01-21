import { Metadata } from 'next'
import { IntelliSenseHelpersPage } from './IntelliSenseHelpersPage'

export const metadata: Metadata = {
  title: 'IntelliSense Helpers - Clarity Chat',
  description: 'TypeScript IntelliSense helpers for better developer experience',
}

export default function Page() {
  return <IntelliSenseHelpersPage />
}