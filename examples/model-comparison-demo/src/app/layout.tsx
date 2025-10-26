import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Model Comparison Demo - Clarity Chat',
  description: 'Compare AI model responses side-by-side with streaming support',
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
