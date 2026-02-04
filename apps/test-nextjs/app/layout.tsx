import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clarity Chat - Next.js Test',
  description: 'Smoke test for @clarity-chat/react in Next.js App Router',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
