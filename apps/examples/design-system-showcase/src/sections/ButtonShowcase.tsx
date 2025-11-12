/**
 * Button Showcase
 * 
 * Demonstrates all button variants, sizes, and states
 */

import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

export function ButtonShowcase() {
  const [loading, setLoading] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Button Components</h2>
        <p className="text-muted-foreground">
          Interactive buttons with refined hover effects, focus states, and loading indicators
        </p>
      </div>

      {/* Variants */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleLoadingClick}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Buttons with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Button>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Button>
          <Button variant="destructive">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Interactive Example</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Hover over buttons to see the refined animations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Default State</p>
            <Button className="w-full">Hover Me</Button>
            <p className="text-xs text-muted-foreground">
              shadow-xs • translate-y-0
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Hover State</p>
            <div className="relative">
              <Button className="w-full shadow-sm -translate-y-[2px]">Hovered</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              shadow-sm • -translate-y-[2px]
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Focus State</p>
            <Button className="w-full ring-[3px] ring-ring/50 ring-offset-1">
              Focused
            </Button>
            <p className="text-xs text-muted-foreground">
              ring-[3px] • ring-ring/50
            </p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { Button } from '@clarity-chat/primitives'

// Primary action
<Button variant="default">Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// With loading state
<Button loading={isLoading}>
  Submit
</Button>

// With icon
<Button>
  <IconPlus className="w-4 h-4 mr-2" />
  Add Item
</Button>`}</code>
        </pre>
      </section>

      {/* Pattern Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Button Pattern Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Base Styling</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• rounded-md (6px radius)</li>
              <li>• shadow-xs (default state)</li>
              <li>• ring-offset-background</li>
              <li>• transition-all duration-200</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Hover Effects</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• hover:shadow-sm (elevated)</li>
              <li>• hover:-translate-y-[2px] (lift)</li>
              <li>• active:translate-y-0 (press)</li>
              <li>• active:shadow-xs (pressed)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Focus State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• focus-visible:outline-none</li>
              <li>• focus-visible:ring-[3px]</li>
              <li>• focus-visible:ring-ring/50</li>
              <li>• focus-visible:ring-offset-1</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Disabled State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• disabled:pointer-events-none</li>
              <li>• disabled:opacity-50</li>
              <li>• No hover effects</li>
              <li>• Cursor: not-allowed</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
