import React from 'react'
import { ThemeProvider } from '@clarity-chat/react'

interface ThemeShowcaseProps {
  children: React.ReactNode
  themes?: string[]
  title?: string
}

const defaultThemes = ['clarity-light', 'clarity-dark', 'sunset', 'ocean', 'forest']

export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({
  children,
  themes = defaultThemes,
  title = 'Theme Variations'
}) => {
  return (
    <div className="my-8 space-y-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-6">
        {themes.map((theme) => (
          <div key={theme} className="space-y-2">
            <h4 className="text-sm font-semibold capitalize text-gray-700 dark:text-gray-300">
              {theme.replace(/-/g, ' ')}
            </h4>
            <ThemeProvider defaultTheme={{ preset: theme }}>
              <div className="p-6 rounded-xl border-2 border-border bg-background text-foreground shadow-sm">
                {children}
              </div>
            </ThemeProvider>
          </div>
        ))}
      </div>
    </div>
  )
}
