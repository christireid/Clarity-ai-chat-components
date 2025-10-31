import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemePreview {
  name: Theme
  label: string
  icon: React.ReactNode
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
  }
}

export interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  showPreview?: boolean
  compact?: boolean
  className?: string
}

const defaultThemes: ThemePreview[] = [
  {
    name: 'light',
    label: 'Light',
    icon: (
      <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
    colors: {
      background: '#ffffff',
      foreground: '#0a0a0a',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
  },
  {
    name: 'dark',
    label: 'Dark',
    icon: (
      <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V2.09998H0.499976C0.279062 2.09998 0.0999756 2.27906 0.0999756 2.49998C0.0999756 2.72089 0.279062 2.89998 0.499976 2.89998H2.09998V4.49998C2.09998 4.72089 2.27906 4.89998 2.49998 4.89998C2.72089 4.89998 2.89998 4.72089 2.89998 4.49998V2.89998H4.49998C4.72089 2.89998 4.89998 2.72089 4.89998 2.49998C4.89998 2.27906 4.72089 2.09998 4.49998 2.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8887C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.889 5.82642C13.8213 5.56709 13.742 5.31398 13.6514 5.06881L13.5766 4.87435L13.4782 4.64326C13.4348 4.53891 13.3895 4.43577 13.3425 4.33389C13.2853 4.21375 13.2261 4.09578 13.1649 3.98005L12.9804 3.67188C12.9181 3.57351 12.8538 3.47688 12.7876 3.38207L12.6553 3.20508L12.6226 3.16432C12.5906 3.12459 12.5584 3.08573 12.5259 3.0477C12.5062 3.02547 12.4863 3.00379 12.4662 2.98257L12.3158 2.84529C12.2744 2.80858 12.2323 2.77281 12.1897 2.73795L12.1558 2.71163L11.9405 2.53034L11.6991 2.34995L11.4651 2.18908L11.205 2.02287L10.9225 1.86548L10.6201 1.71449L10.3503 1.58996L10.1463 1.50053C9.94241 1.41806 9.73416 1.34487 9.52254 1.28125L9.26853 1.20762L8.99407 1.14599C8.85424 1.11661 8.71295 1.09073 8.57052 1.06843L8.54406 0.98184Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
    colors: {
      background: '#0a0a0a',
      foreground: '#fafafa',
      primary: '#3b82f6',
      secondary: '#94a3b8',
      accent: '#f59e0b',
    },
  },
  {
    name: 'system',
    label: 'System',
    icon: (
      <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 2C0.447715 2 0 2.44772 0 3V11C0 11.5523 0.447715 12 1 12H14C14.5523 12 15 11.5523 15 11V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V11H1L1 3Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path d="M3 13H12V14H3V13Z" fill="currentColor" />
      </svg>
    ),
    colors: {
      background: '#f5f5f5',
      foreground: '#171717',
      primary: '#3b82f6',
      secondary: '#71717a',
      accent: '#f59e0b',
    },
  },
]

export const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ currentTheme, onThemeChange, showPreview = true, compact = false, className }, ref) => {
    const [hoveredTheme, setHoveredTheme] = React.useState<Theme | null>(null)
    const [isAnimating, setIsAnimating] = React.useState(false)

    const handleThemeChange = (theme: Theme) => {
      setIsAnimating(true)
      onThemeChange(theme)
      
      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
    }

    return (
      <div ref={ref} className={cn('relative', className)}>
        {/* Theme Options */}
        <div
          className={cn(
            'flex gap-2',
            compact ? 'flex-row' : 'flex-col sm:flex-row'
          )}
        >
          {defaultThemes.map((theme, index) => {
            const isActive = currentTheme === theme.name
            const isHovered = hoveredTheme === theme.name
            const previewTheme = hoveredTheme || currentTheme

            return (
              <motion.button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                onMouseEnter={() => setHoveredTheme(theme.name)}
                onMouseLeave={() => setHoveredTheme(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: ANIMATION_DURATION.normal / 1000,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-lg',
                  'border-2 transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted',
                  compact && 'flex-col text-center px-3 py-2'
                )}
              >
                {/* Icon */}
                <motion.div
                  animate={
                    isActive
                      ? {
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.2, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'flex-shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {theme.icon}
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    'text-sm font-medium',
                    compact && 'text-xs',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {theme.label}
                </span>

                {/* Active Indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Live Preview */}
        {showPreview && !compact && (
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredTheme || currentTheme}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                duration: ANIMATION_DURATION.fast / 1000,
                ease: ANIMATION_EASING.out,
              }}
              className="mt-4 p-4 rounded-lg border overflow-hidden"
            >
              {defaultThemes
                .filter(t => t.name === (hoveredTheme || currentTheme))
                .map(theme => (
                  <div key={theme.name}>
                    <div className="text-sm font-medium mb-3">Preview</div>
                    <div className="space-y-2">
                      {/* Color Swatches */}
                      <div className="flex gap-2">
                        {Object.entries(theme.colors).map(([name, color]) => (
                          <motion.div
                            key={name}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: 'spring',
                              stiffness: 200,
                              damping: 15,
                            }}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-muted-foreground capitalize">
                              {name}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Sample UI Elements */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 p-3 rounded border"
                        style={{
                          backgroundColor: theme.colors.background,
                          color: theme.colors.foreground,
                        }}
                      >
                        <div className="text-sm font-medium mb-2">Sample Content</div>
                        <div className="flex gap-2">
                          <div
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: theme.colors.background,
                            }}
                          >
                            Primary
                          </div>
                          <div
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: theme.colors.secondary,
                              color: theme.colors.background,
                            }}
                          >
                            Secondary
                          </div>
                          <div
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: theme.colors.accent,
                              color: theme.colors.background,
                            }}
                          >
                            Accent
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }
)

ThemeSwitcher.displayName = 'ThemeSwitcher'

// Hook for theme management
export const useTheme = () => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    
    const stored = localStorage.getItem('theme') as Theme
    return stored || 'system'
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
