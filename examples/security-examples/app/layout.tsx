import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Security Examples - Clarity Chat',
  description: 'Security features demo including prompt injection detection, PII redaction, and jailbreak prevention',
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
