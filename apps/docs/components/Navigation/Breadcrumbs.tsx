'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return { href, label }
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-text-secondary mb-8"
    >
      <Link
        href="/"
        className="hover:text-text-primary transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <Fragment key={crumb.href}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-text-primary font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
