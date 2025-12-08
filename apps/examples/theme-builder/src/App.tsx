/**
 * Theme Builder
 *
 * Interactive tool for customizing the design system theme
 */

import { useState } from 'react'
import { Button, Card, Input } from '@clarity-chat/primitives'

interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    border: string
  }
  radius: string
  shadows: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '221.2 83.2% 53.3%',
    secondary: '210 40% 96.1%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
  },
  radius: '0.5rem',
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
}

const presets = {
  default: defaultTheme,
  ocean: {
    ...defaultTheme,
    colors: {
      primary: '199 89% 48%',
      secondary: '195 53% 79%',
      background: '0 0% 100%',
      foreground: '199 18% 20%',
      border: '195 20% 85%',
    },
  },
  forest: {
    ...defaultTheme,
    colors: {
      primary: '142 76% 36%',
      secondary: '142 30% 85%',
      background: '0 0% 100%',
      foreground: '142 20% 15%',
      border: '142 15% 80%',
    },
  },
  sunset: {
    ...defaultTheme,
    colors: {
      primary: '14 100% 57%',
      secondary: '14 100% 92%',
      background: '0 0% 100%',
      foreground: '14 20% 15%',
      border: '14 30% 85%',
    },
  },
}

export default function App() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  )

  const updateColor = (key: keyof ThemeConfig['colors'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }))
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.style.setProperty('--primary', theme.colors.primary)
    root.style.setProperty('--secondary', theme.colors.secondary)
    root.style.setProperty('--background', theme.colors.background)
    root.style.setProperty('--foreground', theme.colors.foreground)
    root.style.setProperty('--border', theme.colors.border)
    root.style.setProperty('--radius', theme.radius)
  }

  const exportTheme = () => {
    const css = `:root {
  --primary: ${theme.colors.primary};
  --secondary: ${theme.colors.secondary};
  --background: ${theme.colors.background};
  --foreground: ${theme.colors.foreground};
  --border: ${theme.colors.border};
  --radius: ${theme.radius};
}`

    navigator.clipboard.writeText(css)
    alert('Theme CSS copied to clipboard!')
  }

  const loadPreset = (presetName: keyof typeof presets) => {
    setTheme(presets[presetName])
    setTimeout(() => applyTheme(), 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Theme Builder</h1>
          <p className="text-sm text-muted-foreground">
            Customize your design system theme
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Theme Editor Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="space-y-6 sticky top-24">
              {/* Presets */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Theme Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(presets).map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset as keyof typeof presets)}
                      className="capitalize"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Colors */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Colors</h3>
                <div className="space-y-4">
                  {Object.entries(theme.colors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium capitalize">
                        {key}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateColor(
                              key as keyof ThemeConfig['colors'],
                              e.target.value
                            )
                          }
                          className="font-mono text-xs"
                        />
                        <button
                          onClick={() =>
                            setActiveColorPicker(
                              activeColorPicker === key ? null : key
                            )
                          }
                          className="w-10 h-10 rounded-md ring-1 ring-border/50 shadow-xs"
                          style={{ backgroundColor: `hsl(${value})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Border Radius */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Border Radius</h3>
                <Input
                  value={theme.radius}
                  onChange={(e) =>
                    setTheme((prev) => ({ ...prev, radius: e.target.value }))
                  }
                  placeholder="0.5rem"
                />
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={applyTheme} className="flex-1">
                  Apply Theme
                </Button>
                <Button
                  onClick={exportTheme}
                  variant="outline"
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </div>
          </aside>

          {/* Preview */}
          <main className="col-span-12 lg:col-span-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Component Preview
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  See how your theme looks across different components
                </p>
              </div>

              {/* Buttons */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </Card>

              {/* Form */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Form Elements</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Input Field</label>
                    <Input placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focused Input</label>
                    <Input
                      placeholder="Focused state"
                      className="ring-[3px] ring-ring/50"
                    />
                  </div>
                </div>
              </Card>

              {/* Cards */}
              <div>
                <h3 className="font-medium mb-4">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-2">Default Card</h4>
                    <p className="text-sm text-muted-foreground">
                      A basic card with default styling
                    </p>
                  </Card>
                  <Card className="p-6 ring-2 ring-primary/50">
                    <h4 className="font-semibold mb-2">Selected Card</h4>
                    <p className="text-sm text-muted-foreground">
                      With ring-2 ring-primary/50
                    </p>
                  </Card>
                  <Card className="p-6 cursor-pointer hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200">
                    <h4 className="font-semibold mb-2">Hover Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Interactive with hover effect
                    </p>
                  </Card>
                </div>
              </div>

              {/* Typography */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Typography</h3>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <h2 className="text-3xl font-bold">Heading 2</h2>
                  <h3 className="text-2xl font-bold">Heading 3</h3>
                  <h4 className="text-xl font-semibold">Heading 4</h4>
                  <p className="text-base">Body text - Regular paragraph</p>
                  <p className="text-sm text-muted-foreground">
                    Small text - Muted foreground
                  </p>
                </div>
              </Card>

              {/* Status Colors */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Status Colors</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                    Primary status message
                  </div>
                  <div className="p-3 rounded-md bg-green-500/10 text-green-600 ring-1 ring-green-500/20">
                    Success status message
                  </div>
                  <div className="p-3 rounded-md bg-yellow-500/10 text-yellow-600 ring-1 ring-yellow-500/20">
                    Warning status message
                  </div>
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                    Error status message
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
