import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clarity Chat Quickstart',
  description: 'Get started with Clarity Chat in 5 minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
