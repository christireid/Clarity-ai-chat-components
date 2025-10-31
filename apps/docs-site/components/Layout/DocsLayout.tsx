'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar, type NavItem } from '@/components/Navigation/Sidebar'
import { TableOfContents } from './TableOfContents'
import clsx from 'clsx'

interface DocsLayoutProps {
  children: React.ReactNode
  navigation: NavItem[]
  tableOfContents?: {
    title: string
    id: string
    level: number
  }[]
}

export function DocsLayout({
  children,
  navigation,
  tableOfContents,
}: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="container-docs">
      <div className="flex gap-8 py-8">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-bg-primary border-r border-border lg:border-0 transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="p-6">
            <Sidebar navigation={navigation} />
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <article className="prose prose-lg dark:prose-invert max-w-3xl">
            {children}
          </article>
        </main>

        {/* Table of Contents */}
        {tableOfContents && tableOfContents.length > 0 && (
          <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="py-6">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
