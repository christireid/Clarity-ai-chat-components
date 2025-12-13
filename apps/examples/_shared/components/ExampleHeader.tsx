import React from 'react'

export interface ExampleHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  backLink?: string
  backLabel?: string
  actions?: React.ReactNode
  variant?: 'light' | 'dark'
}

export function ExampleHeader({
  title,
  subtitle,
  icon,
  backLink = '/',
  backLabel = '← Back to Docs',
  actions,
  variant = 'light',
}: ExampleHeaderProps) {
  const isDark = variant === 'dark'

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        isDark
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1
                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {actions}
            <a
              href={backLink}
              className={`px-3 py-1.5 text-sm transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {backLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ExampleHeader
