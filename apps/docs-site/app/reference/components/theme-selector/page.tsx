import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Selector Component | Clarity Chat',
  description: 'UI component for selecting and switching between theme presets with visual previews.',
}

export default function ThemeSelectorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Theme Selector</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A flexible theme selection component with visual previews, available in list and dropdown variants.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Theme Selector component provides an intuitive interface for choosing between built-in theme presets.
          It features visual color previews, horizontal/vertical layouts, keyboard navigation, and active theme indication.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Visual theme preview with primary, secondary, and background colors</li>
          <li>Horizontal or vertical layout orientations</li>
          <li>Dropdown variant for compact spaces</li>
          <li>Active theme highlighting with checkmark</li>
          <li>Keyboard navigation support with ARIA radiogroup</li>
          <li>Theme metadata display (name, description)</li>
          <li>Callback for theme change events</li>
          <li>Integration with ThemeProvider context</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemeSelector, ThemeSelectorDropdown } from '@clarity-chat/react'

// List layout
<ThemeSelector 
  showPreview
  orientation="vertical"
  onThemeChange={(theme) => console.log(theme)}
/>

// Dropdown variant
<ThemeSelectorDropdown 
  onThemeChange={(theme) => console.log(theme)}
/>`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">showPreview</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2 font-mono text-sm">true</td>
                <td className="p-2">Show color preview circles</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">orientation</td>
                <td className="p-2 font-mono text-sm">'horizontal' | 'vertical'</td>
                <td className="p-2 font-mono text-sm">'vertical'</td>
                <td className="p-2">Layout direction</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onThemeChange</td>
                <td className="p-2 font-mono text-sm">(theme) =&gt; void</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Theme change callback</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">''</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Settings page
function ThemeSettings() {
  return (
    <div>
      <h3>Choose Theme</h3>
      <ThemeSelector 
        showPreview
        orientation="vertical"
        onThemeChange={(theme) => {
          localStorage.setItem('preferred-theme', theme)
        }}
      />
    </div>
  )
}

// Header dropdown
function Header() {
  return (
    <header>
      <ThemeSelectorDropdown />
    </header>
  )
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}
