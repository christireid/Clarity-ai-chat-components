import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clarity Chat Marketing',
  description: 'Clarity Chat marketing site placeholder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
