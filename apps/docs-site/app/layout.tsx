import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Clarity Chat UI - Beautiful, Accessible React Components',
    template: '%s | Clarity Chat UI',
  },
  description:
    'A comprehensive React UI library for building beautiful, accessible chat interfaces with 70+ components, 30+ hooks, and 150+ animations.',
  keywords: [
    'react',
    'ui library',
    'chat ui',
    'components',
    'typescript',
    'tailwind',
    'framer motion',
    'accessibility',
    'design system',
  ],
  authors: [{ name: 'Clarity Chat Team' }],
  creator: 'Clarity Chat Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clarity-chat.dev',
    title: 'Clarity Chat UI - Beautiful, Accessible React Components',
    description:
      'A comprehensive React UI library for building beautiful, accessible chat interfaces.',
    siteName: 'Clarity Chat UI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarity Chat UI - Beautiful, Accessible React Components',
    description:
      'A comprehensive React UI library for building beautiful, accessible chat interfaces.',
    creator: '@claritychat',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <Providers>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
