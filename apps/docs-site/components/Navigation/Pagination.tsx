import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  prev?: {
    title: string
    href: string
  }
  next?: {
    title: string
    href: string
  }
}

export function Pagination({ prev, next }: PaginationProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Page navigation"
      className="flex justify-between gap-4 pt-8 mt-8 border-t border-border"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all flex-1 max-w-sm"
        >
          <ChevronLeft className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 transition-colors" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-tertiary mb-1">Previous</div>
            <div className="font-medium text-text-primary truncate">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all flex-1 max-w-sm text-right"
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-tertiary mb-1">Next</div>
            <div className="font-medium text-text-primary truncate">
              {next.title}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 transition-colors" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
