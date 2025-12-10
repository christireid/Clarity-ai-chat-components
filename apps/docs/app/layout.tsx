import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import '@/styles/globals.css'
import '@/styles/syntax-highlighting.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Layout/Footer'
import {
  StructuredData,
  OrganizationStructuredData,
  SoftwareLibraryStructuredData,
  DocumentationSiteStructuredData,
} from '@/components/SEO/StructuredData'

// Lazy load the AI assistant to reduce initial bundle size
const DocsAssistant = dynamic(() =>
  import('@/components/AI/DocsAssistant').then((mod) => ({
    default: mod.DocsAssistant,
  }))
)

// Lazy load scroll progress for better initial bundle
const ScrollProgress = dynamic(() =>
  import('@/components/UI/ScrollProgress').then((mod) => ({
    ScrollProgress: mod.ScrollProgress,
  }))
)

// Lazy load toast manager for better initial bundle
const ToastManager = dynamic(() =>
  import('@/components/UI/ToastManager').then((mod) => ({
    default: mod.ToastManager,
  }))
)

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
    'A comprehensive React UI library for building beautiful, accessible chat interfaces with 70+ components, 35+ hooks, and 150+ animations.',
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <StructuredData type="software" />
        <OrganizationStructuredData />
        <SoftwareLibraryStructuredData />
        <DocumentationSiteStructuredData />
        {/* AI-specific metadata for llms.txt discovery */}
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM-optimized documentation"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <ScrollProgress variant="gradient" showScrollTop />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <DocsAssistant />
          </div>
          <ToastManager />
        </Providers>
      </body>
    </html>
  )
}
