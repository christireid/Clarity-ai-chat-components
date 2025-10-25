import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Streaming Chat Demo',
  description: 'Real-time AI chat with Server-Sent Events streaming',
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
