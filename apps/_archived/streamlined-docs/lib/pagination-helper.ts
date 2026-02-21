import type { NavItem } from '@/components/Navigation/Sidebar'
import {
  learnNavigation,
  referenceNavigation,
  cookbookNavigation,
  examplesNavigation,
} from './navigation'

export interface PaginationLink {
  title: string
  href: string
}

export interface Pagination {
  prev?: PaginationLink
  next?: PaginationLink
}

/**
 * Flattens a navigation tree into a linear array of pages
 * Handles up to 3 levels of nesting
 */
function flattenNavigation(nav: NavItem[]): PaginationLink[] {
  const pages: PaginationLink[] = []

  function traverse(items: NavItem[]) {
    for (const item of items) {
      // If item has a direct href, add it
      if (item.href) {
        pages.push({ title: item.title, href: item.href })
      }

      // If item has nested items, traverse them
      if (item.items) {
        traverse(item.items)
      }
    }
  }

  traverse(nav)
  return pages
}

/**
 * Determines which navigation section a path belongs to
 */
function getNavigationForPath(pathname: string): NavItem[] {
  if (pathname.startsWith('/learn') || pathname.startsWith('/guides')) {
    return learnNavigation
  }
  if (pathname.startsWith('/reference')) {
    return referenceNavigation
  }
  if (pathname.startsWith('/cookbook')) {
    return cookbookNavigation
  }
  if (pathname.startsWith('/examples')) {
    return examplesNavigation
  }
  // Default to learn navigation
  return learnNavigation
}

/**
 * Gets the previous and next pages for a given pathname
 * Automatically determines the navigation section and finds adjacent pages
 */
export function getPaginationFromNav(pathname: string): Pagination {
  const navigation = getNavigationForPath(pathname)
  const allPages = flattenNavigation(navigation)

  // Normalize pathname (remove trailing slash)
  const normalizedPath = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname

  const currentIndex = allPages.findIndex(
    (page) => page.href === normalizedPath
  )

  if (currentIndex === -1) {
    return {}
  }

  return {
    prev: currentIndex > 0 ? allPages[currentIndex - 1] : undefined,
    next:
      currentIndex < allPages.length - 1
        ? allPages[currentIndex + 1]
        : undefined,
  }
}

/**
 * Gets all pages for a navigation section
 * Useful for generating sitemaps or search indexes
 */
export function getAllPagesForSection(
  section: 'learn' | 'reference' | 'cookbook' | 'examples'
): PaginationLink[] {
  const navigationMap = {
    learn: learnNavigation,
    reference: referenceNavigation,
    cookbook: cookbookNavigation,
    examples: examplesNavigation,
  }

  return flattenNavigation(navigationMap[section])
}

/**
 * Gets the section title for a given pathname
 */
export function getSectionTitle(pathname: string): string {
  if (pathname.startsWith('/learn')) return 'Learn'
  if (pathname.startsWith('/guides')) return 'Guides'
  if (pathname.startsWith('/reference')) return 'Reference'
  if (pathname.startsWith('/cookbook')) return 'Cookbook'
  if (pathname.startsWith('/examples')) return 'Examples'
  return ''
}
