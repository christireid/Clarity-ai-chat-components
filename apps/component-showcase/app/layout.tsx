import type { Metadata } from 'next'
import './globals.css'
import './markdown-loader' // Pre-load markdown dependencies
import { Sidebar } from '@/components/sidebar'
import {
  PerformanceMonitorProvider,
  PerformanceMonitorDisplay,
} from '@/components/performance-monitor'

export const metadata: Metadata = {
  title: 'Clarity Chat Component Showcase',
  description:
    'Comprehensive showcase of all Clarity Chat components organized by category',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <PerformanceMonitorProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen p-8 transition-all duration-300">
            {children}
          </main>
          <PerformanceMonitorDisplay />
        </PerformanceMonitorProvider>
      </body>
    </html>
  )
}
