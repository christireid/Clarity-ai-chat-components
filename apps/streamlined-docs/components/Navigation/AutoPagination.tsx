'use client'

import { usePathname } from 'next/navigation'
import { getPaginationFromNav } from '@/lib/pagination-helper'
import { Pagination } from './Pagination'

/**
 * AutoPagination component that automatically determines
 * previous and next pages based on the current pathname
 * and the navigation structure.
 *
 * Usage:
 * ```tsx
 * // Instead of manually specifying prev/next:
 * <Pagination
 *   previous={{ title: 'Foo', href: '/foo' }}
 *   next={{ title: 'Bar', href: '/bar' }}
 * />
 *
 * // Just use:
 * <AutoPagination />
 * ```
 */
export function AutoPagination() {
  const pathname = usePathname()
  const { prev, next } = getPaginationFromNav(pathname)

  if (!prev && !next) {
    return null
  }

  return <Pagination prev={prev} next={next} />
}
