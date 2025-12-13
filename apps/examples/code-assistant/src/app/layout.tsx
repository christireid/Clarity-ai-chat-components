import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Code Assistant Demo',
  description: 'AI-powered code assistant with syntax highlighting, debugging, and code generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
