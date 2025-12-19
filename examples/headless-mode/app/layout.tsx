import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Headless Mode - Clarity Chat',
  description: 'Use Clarity Chat hooks with your own custom UI',
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
