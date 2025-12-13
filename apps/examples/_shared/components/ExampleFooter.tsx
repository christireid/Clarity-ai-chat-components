import React from 'react'

export interface ExampleFooterProps {
  title: string
  subtitle?: string
  docsLink?: string
  githubLink?: string
  variant?: 'light' | 'dark'
}

export function ExampleFooter({
  title,
  subtitle = 'Clarity Chat Components',
  docsLink = '#',
  githubLink = '#',
  variant = 'light',
}: ExampleFooterProps) {
  const isDark = variant === 'dark'

  return (
    <footer
      className={`border-t mt-8 ${
        isDark
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div
          className={`flex items-center justify-between text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <p>
            {title} • {subtitle}
          </p>
          <div className="flex gap-4">
            <a
              href={docsLink}
              className={`transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              Documentation
            </a>
            <a
              href={githubLink}
              className={`transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ExampleFooter
