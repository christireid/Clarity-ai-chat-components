import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { SearchDialog } from '@/components/search-dialog'
import { AppErrorBoundary } from '@/components/app-error-boundary'

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
        <AppErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <Sidebar />
          <SearchDialog />
          <main
            id="main-content"
            className="ml-0 md:ml-64 min-h-screen p-4 pt-16 md:p-8 md:pt-8 transition-all duration-300"
          >
            {children}
          </main>
        </AppErrorBoundary>
      </body>
    </html>
  )
}
