import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Clarity Chat - Premium AI Chat Components for React',
    template: '%s | Clarity Chat',
  },
  description:
    'Ship production-ready AI chat interfaces in hours, not months. 70+ components, WCAG AAA accessible, enterprise features included.',
  keywords: [
    'react',
    'chat components',
    'ai chat',
    'chatbot ui',
    'react components',
    'typescript',
    'accessibility',
    'wcag',
    'enterprise',
  ],
  authors: [{ name: 'Code & Clarity', url: 'https://codeclarity.ai' }],
  creator: 'Code & Clarity',
  publisher: 'Code & Clarity',
  metadataBase: new URL('https://clarity-chat.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clarity-chat.dev',
    title: 'Clarity Chat - Premium AI Chat Components for React',
    description:
      'Ship production-ready AI chat interfaces in hours, not months. 70+ components, WCAG AAA accessible.',
    siteName: 'Clarity Chat',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clarity Chat - AI Chat Components',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarity Chat - Premium AI Chat Components for React',
    description:
      'Ship production-ready AI chat interfaces in hours, not months. 70+ components, WCAG AAA accessible.',
    creator: '@clarity_chat',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

