import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Customer Support Chat',
  description: 'AI-powered customer support with conversation history',
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
