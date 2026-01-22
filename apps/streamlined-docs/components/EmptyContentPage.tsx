'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumbs } from './Navigation/Breadcrumbs'

interface EmptyContentPageProps {
  title?: string
  section?: string
}

/**
 * Universal empty content page component for the Streamlined Docs shell.
 * This component is used across all pages to indicate content has been
 * intentionally removed while maintaining structural integrity.
 */
export function EmptyContentPage({ title, section }: EmptyContentPageProps) {
  const pathname = usePathname()

  // Generate title from pathname if not provided
  const pageTitle = title || generateTitleFromPath(pathname)
  const pageSection = section || generateSectionFromPath(pathname)

  return (
    <div className="min-h-[60vh] flex flex-col">
      <Breadcrumbs />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        {/* Section badge */}
        {pageSection && (
          <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            {pageSection}
          </div>
        )}

        {/* Page title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent max-w-3xl">
          {pageTitle}
        </h1>

        {/* Empty state notice */}
        <div className="max-w-2xl">
          <div className="p-6 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10">
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Content intentionally omitted</strong>
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              This is a streamlined documentation shell. Page structure, navigation, and layout
              are finalized. Content will be integrated in future phases without structural changes.
            </p>
          </div>
        </div>

        {/* Path indicator for development */}
        <div className="mt-8 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-600 font-mono">
            {pathname}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Generate a human-readable title from the pathname
 */
function generateTitleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] || 'Home'

  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate section name from the pathname
 */
function generateSectionFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const sectionMap: Record<string, string> = {
    'get-started': 'Get Started',
    'build': 'Build',
    'explore': 'Explore',
    'api': 'API',
    'about': 'About',
    'contributing': 'Contributing',
    'changelog': 'Changelog',
    'license': 'License',
    'playground': 'Playground',
    'why-clarity': 'Why Clarity',
  }

  return sectionMap[segments[0]] || null
}
