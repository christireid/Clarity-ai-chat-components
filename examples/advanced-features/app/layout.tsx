import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advanced Features - Clarity Chat',
  description: 'Advanced AI chat features including enhanced suggestions, summarization, battery awareness, and performance analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
