import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '{{EXAMPLE_TITLE}}',
  description: '{{EXAMPLE_DESCRIPTION}}',
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
