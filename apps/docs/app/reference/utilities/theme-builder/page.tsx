import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Builder | Clarity Chat',
  description: 'Utility functions for creating, validating, and managing themes.'
}

export default function ThemeBuilderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Theme Builder</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Powerful theme creation and management utilities with color manipulation and validation.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Theme creation from base colors</li>
          <li>Color contrast validation (WCAG compliance)</li>
          <li>HSL/Hex color conversion</li>
          <li>Theme preset management</li>
          <li>Dark mode generation from light themes</li>
          <li>Export/import theme configurations</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { 
  createTheme, 
  validateTheme, 
  hexToHsl 
} from '@clarity-chat/react/theme'

const theme = createTheme({
  primary: '#3b82f6',
  background: '#ffffff'
})

const validation = validateTheme(theme)
if (validation.valid) {
  console.log('Theme is valid!')
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
