import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Analytics Console Demo - Clarity Chat',
  description: 'Real-time AI analytics dashboard with token tracking, cost monitoring, and performance metrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
