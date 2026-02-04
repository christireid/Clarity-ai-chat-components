'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  Paintbrush,
  Eye,
  Sliders,
  Type,
  Square,
  Circle,
} from 'lucide-react'

// ============================================================================
// THEME SWITCHER DEMO
// ============================================================================
function ThemeSwitcherDemo() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  const themes = [
    { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Theme Switcher</CardTitle>
        <CardDescription>Light, dark, and system theme options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Segmented Control */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Segmented Control
            </p>
            <div className="inline-flex items-center p-1 bg-muted rounded-lg">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                    theme === t.id
                      ? 'bg-background text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Toggle */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Icon Toggle</p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Card Options */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Card Options</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    'p-4 border rounded-lg text-center transition-colors',
                    theme === t.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                >
                  <div className="w-10 h-10 mx-auto rounded-lg bg-muted flex items-center justify-center mb-2">
                    {t.icon}
                  </div>
                  <p className="text-sm font-medium">{t.label}</p>
                  {theme === t.id && (
                    <Check className="h-4 w-4 text-primary mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COLOR PALETTE DEMO
// ============================================================================
function ColorPaletteDemo() {
  const [selectedColor, setSelectedColor] = useState('blue')

  const colors = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'cyan', class: 'bg-cyan-500' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Color Palette</CardTitle>
        <CardDescription>Customize accent colors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Color Swatches */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Primary Color</p>
            <div className="flex items-center gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    'w-10 h-10 rounded-full transition-transform',
                    color.class,
                    selectedColor === color.name &&
                      'ring-2 ring-offset-2 ring-offset-background scale-110'
                  )}
                >
                  {selectedColor === color.name && (
                    <Check className="h-5 w-5 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-muted-foreground mb-3">Preview</p>
            <div className="space-y-3">
              <Button
                className={cn(
                  selectedColor === 'blue' && 'bg-blue-500 hover:bg-blue-600',
                  selectedColor === 'purple' &&
                    'bg-purple-500 hover:bg-purple-600',
                  selectedColor === 'green' &&
                    'bg-green-500 hover:bg-green-600',
                  selectedColor === 'orange' &&
                    'bg-orange-500 hover:bg-orange-600',
                  selectedColor === 'pink' && 'bg-pink-500 hover:bg-pink-600',
                  selectedColor === 'cyan' && 'bg-cyan-500 hover:bg-cyan-600'
                )}
              >
                Primary Button
              </Button>
              <Badge
                className={cn(
                  selectedColor === 'blue' && 'bg-blue-500/20 text-blue-600',
                  selectedColor === 'purple' &&
                    'bg-purple-500/20 text-purple-600',
                  selectedColor === 'green' && 'bg-green-500/20 text-green-600',
                  selectedColor === 'orange' &&
                    'bg-orange-500/20 text-orange-600',
                  selectedColor === 'pink' && 'bg-pink-500/20 text-pink-600',
                  selectedColor === 'cyan' && 'bg-cyan-500/20 text-cyan-600'
                )}
              >
                Badge
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// THEME PRESETS DEMO
// ============================================================================
function ThemePresetsDemo() {
  const [preset, setPreset] = useState('default')

  const presets = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean and minimal',
      colors: ['#3b82f6', '#6366f1', '#1e293b'],
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Earthy tones',
      colors: ['#22c55e', '#84cc16', '#365314'],
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm and vibrant',
      colors: ['#f97316', '#ef4444', '#7c2d12'],
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Cool and calm',
      colors: ['#06b6d4', '#0ea5e9', '#164e63'],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Theme Presets</CardTitle>
        <CardDescription>Pre-designed color schemes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={cn(
                'p-4 border rounded-lg text-left transition-colors',
                preset === p.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                {preset === p.id && <Check className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex items-center gap-2 mt-3">
                {p.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// APPEARANCE SETTINGS DEMO
// ============================================================================
function AppearanceSettingsDemo() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    'medium'
  )
  const [radius, setRadius] = useState<'none' | 'small' | 'medium' | 'large'>(
    'medium'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appearance Settings</CardTitle>
        <CardDescription>Fine-tune the interface</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Font Size</span>
            </div>
            <div className="flex items-center gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize(size)}
                  className="capitalize"
                >
                  {size}
                </Button>
              ))}
            </div>
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p
                className={cn(
                  fontSize === 'small' && 'text-xs',
                  fontSize === 'medium' && 'text-sm',
                  fontSize === 'large' && 'text-base'
                )}
              >
                Preview text at {fontSize} size
              </p>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Border Radius</span>
            </div>
            <div className="flex items-center gap-2">
              {(['none', 'small', 'medium', 'large'] as const).map((r) => (
                <Button
                  key={r}
                  variant={radius === r ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRadius(r)}
                  className="capitalize"
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div
                className={cn(
                  'w-16 h-16 bg-primary',
                  radius === 'none' && 'rounded-none',
                  radius === 'small' && 'rounded-sm',
                  radius === 'medium' && 'rounded-lg',
                  radius === 'large' && 'rounded-2xl'
                )}
              />
              <Button
                className={cn(
                  radius === 'none' && 'rounded-none',
                  radius === 'small' && 'rounded-sm',
                  radius === 'medium' && 'rounded-lg',
                  radius === 'large' && 'rounded-2xl'
                )}
              >
                Button Preview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ThemePage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -right-40 opacity-20" />
        <div className="orb-cyan bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Theme"
        description="Theme customization, color palettes, and appearance settings"
        icon={Palette}
        badge="4+ Components"
      />

      <Tabs defaultValue="switcher" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="switcher">Theme Switcher</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="switcher">
          <ComponentSection
            title="Theme Switcher"
            description="Light/dark mode controls"
          >
            <ThemeSwitcherDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="colors">
          <ComponentSection
            title="Color Palette"
            description="Accent color customization"
          >
            <ColorPaletteDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="presets">
          <ComponentSection
            title="Theme Presets"
            description="Pre-made color schemes"
          >
            <ThemePresetsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="appearance">
          <ComponentSection
            title="Appearance Settings"
            description="UI customization options"
          >
            <AppearanceSettingsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
