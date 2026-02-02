'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  ChevronDown,
  Paintbrush,
  Settings,
  Eye,
  RefreshCw,
} from 'lucide-react'

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  destructive: string
}

export interface ThemeConfig {
  mode: ThemeMode
  colors?: Partial<ThemeColors>
  radius?: number
  fontFamily?: string
}

// Theme Context
interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: ThemeConfig) => void
  resolvedMode: 'light' | 'dark'
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useThemeContext() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

// Theme Provider
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeConfig
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = { mode: 'system' },
  storageKey = 'ai-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeConfig>(defaultTheme)
  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(
    'light'
  )

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setThemeState(JSON.parse(stored))
      } catch {
        // Invalid JSON, use default
      }
    }
  }, [storageKey])

  React.useEffect(() => {
    const updateResolvedMode = () => {
      if (theme.mode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedMode(isDark ? 'dark' : 'light')
      } else {
        setResolvedMode(theme.mode)
      }
    }

    updateResolvedMode()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateResolvedMode)
    return () => mediaQuery.removeEventListener('change', updateResolvedMode)
  }, [theme.mode])

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedMode)

    if (theme.radius !== undefined) {
      root.style.setProperty('--radius', `${theme.radius}rem`)
    }

    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--${key}`, value)
        }
      })
    }
  }, [theme, resolvedMode])

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, JSON.stringify(newTheme))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Theme Toggle Button
interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedMode } = useThemeContext()

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(theme.mode)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme({ ...theme, mode: modes[nextIndex] })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
    >
      {resolvedMode === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Theme Mode Selector
interface ThemeModeSelectorProps {
  className?: string
}

export function ThemeModeSelector({ className }: ThemeModeSelectorProps) {
  const { theme, setTheme } = useThemeContext()

  const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {modes.find((m) => m.value === theme.mode)?.icon}
          <span className="ml-2">
            {modes.find((m) => m.value === theme.mode)?.label}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {modes.map((mode) => (
          <DropdownMenuItem
            key={mode.value}
            onClick={() => setTheme({ ...theme, mode: mode.value })}
          >
            {mode.icon}
            <span className="ml-2">{mode.label}</span>
            {theme.mode === mode.value && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Color Preset Selector
interface ColorPreset {
  name: string
  colors: Partial<ThemeColors>
}

const defaultPresets: ColorPreset[] = [
  {
    name: 'Default',
    colors: { primary: 'hsl(222.2 47.4% 11.2%)' },
  },
  {
    name: 'Blue',
    colors: { primary: 'hsl(221.2 83.2% 53.3%)' },
  },
  {
    name: 'Green',
    colors: { primary: 'hsl(142.1 76.2% 36.3%)' },
  },
  {
    name: 'Orange',
    colors: { primary: 'hsl(24.6 95% 53.1%)' },
  },
  {
    name: 'Rose',
    colors: { primary: 'hsl(346.8 77.2% 49.8%)' },
  },
  {
    name: 'Purple',
    colors: { primary: 'hsl(262.1 83.3% 57.8%)' },
  },
]

interface ColorPresetSelectorProps {
  presets?: ColorPreset[]
  className?: string
}

export function ColorPresetSelector({
  presets = defaultPresets,
  className,
}: ColorPresetSelectorProps) {
  const { theme, setTheme } = useThemeContext()

  return (
    <div className={cn('space-y-3', className)}>
      <Label>Color Theme</Label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            className={cn(
              'gap-2',
              theme.colors?.primary === preset.colors.primary && 'border-accent'
            )}
            onClick={() => setTheme({ ...theme, colors: preset.colors })}
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: preset.colors.primary }}
            />
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Radius Selector
interface RadiusSelectorProps {
  className?: string
}

export function RadiusSelector({ className }: RadiusSelectorProps) {
  const { theme, setTheme } = useThemeContext()

  const radiusOptions = [0, 0.3, 0.5, 0.75, 1]

  return (
    <div className={cn('space-y-3', className)}>
      <Label>Border Radius</Label>
      <div className="flex gap-2">
        {radiusOptions.map((radius) => (
          <Button
            key={radius}
            variant="outline"
            size="sm"
            className={cn(
              'h-10 w-10 p-0',
              theme.radius === radius && 'border-accent'
            )}
            onClick={() => setTheme({ ...theme, radius })}
          >
            <div
              className="h-6 w-6 border-2 border-foreground"
              style={{ borderRadius: `${radius * 8}px` }}
            />
          </Button>
        ))}
      </div>
    </div>
  )
}

// Theme Settings Panel
interface ThemeSettingsPanelProps {
  className?: string
}

export function ThemeSettingsPanel({ className }: ThemeSettingsPanelProps) {
  const { theme, setTheme } = useThemeContext()

  const resetTheme = () => {
    setTheme({ mode: 'system' })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Appearance</Label>
          <ThemeModeSelector />
        </div>

        <ColorPresetSelector />
        <RadiusSelector />

        <Button
          variant="outline"
          onClick={resetTheme}
          className="w-full bg-transparent"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  )
}

// Theme Preview Card
interface ThemePreviewProps {
  theme?: ThemeConfig
  className?: string
}

export function ThemePreview({
  theme: previewTheme,
  className,
}: ThemePreviewProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-accent" />
          <div className="space-y-1">
            <div className="h-3 w-20 rounded bg-foreground" />
            <div className="h-2 w-16 rounded bg-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact Theme Switcher (for headers/navbars)
interface CompactThemeSwitcherProps {
  className?: string
}

export function CompactThemeSwitcher({ className }: CompactThemeSwitcherProps) {
  const { theme, setTheme, resolvedMode } = useThemeContext()

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full bg-muted p-1',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-full',
          theme.mode === 'light' && 'bg-background shadow-sm'
        )}
        onClick={() => setTheme({ ...theme, mode: 'light' })}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-full',
          theme.mode === 'dark' && 'bg-background shadow-sm'
        )}
        onClick={() => setTheme({ ...theme, mode: 'dark' })}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-full',
          theme.mode === 'system' && 'bg-background shadow-sm'
        )}
        onClick={() => setTheme({ ...theme, mode: 'system' })}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )
}
