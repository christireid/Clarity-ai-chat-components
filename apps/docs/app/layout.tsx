import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import '@/styles/globals.css'
import '@/styles/syntax-highlighting.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Layout/Footer'
import { AnalyticsScript } from '@/lib/analytics'
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
    default: mod.ScrollProgress,
  }))
)

// Lazy load toast manager for better initial bundle
const ToastManager = dynamic(() =>
  import('@/components/UI/ToastManager').then((mod) => ({
    default: mod.ToastManager,
  }))
)

// Lazy load mobile bottom nav
const MobileBottomNav = dynamic(() =>
  import('@/components/Navigation/MobileBottomNav').then((mod) => ({
    default: mod.MobileBottomNav,
  }))
)

// Font CSS classes using system font stacks (no external font loading required)
const fontClasses = {
  sans: 'font-sans',
  mono: 'font-mono',
}

export const metadata: Metadata = {
  title: {
    default: 'Clarity Chat UI - Beautiful, Accessible React Components',
    template: '%s | Clarity Chat UI',
  },
  description:
    'A comprehensive React UI library for building beautiful, accessible chat interfaces with 200+ components, 95+ hooks, and 150+ animations.',
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
      className={`${fontClasses.sans} ${fontClasses.mono}`}
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
      <body className="font-sans antialiased">
        <AnalyticsScript />
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
            <MobileBottomNav />
          </div>
          <ToastManager />
        </Providers>
      </body>
    </html>
  )
}
