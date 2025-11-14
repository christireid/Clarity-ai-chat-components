/**
 * Design Tokens Showcase
 * 
 * Visual demonstration of all design tokens and patterns
 */

export function DesignTokens() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Design Tokens</h2>
        <p className="text-muted-foreground">
          Core design patterns and tokens used throughout the component library
        </p>
      </div>

      {/* Shadow Hierarchy */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Shadow Hierarchy</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Refined shadow scale for depth and elevation
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="h-32 rounded-lg bg-card ring-1 ring-border/30 shadow-xs flex items-center justify-center">
              <span className="text-sm font-medium">shadow-xs</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Default State • 0 1px 2px 0 rgb(0 0 0 / 0.03)
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-32 rounded-lg bg-card ring-1 ring-border/30 shadow-sm flex items-center justify-center">
              <span className="text-sm font-medium">shadow-sm</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Hover State • Subtle elevation
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-32 rounded-lg bg-card ring-1 ring-border/30 shadow-lg flex items-center justify-center">
              <span className="text-sm font-medium">shadow-lg</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Popovers • Medium elevation
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-32 rounded-lg bg-card ring-1 ring-border/30 shadow-xl flex items-center justify-center">
              <span className="text-sm font-medium">shadow-xl</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Dialogs • High elevation
            </p>
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Border Radius Scale</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Consistent radius scale for visual harmony
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="h-24 rounded-sm bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">rounded-sm</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              2px • Small elements
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-md bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">rounded-md</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              6px • Buttons, inputs
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">rounded-lg</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              8px • Cards, containers
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">rounded-full</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Full • Avatars, badges
            </p>
          </div>
        </div>
      </section>

      {/* Ring Borders */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Ring-Based Borders</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Composable ring system for borders and outlines
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-card ring-1 ring-border/50 flex items-center justify-center">
              <code className="text-xs">ring-1 ring-border/50</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Default • Most components
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-card ring-2 ring-primary/50 flex items-center justify-center">
              <code className="text-xs">ring-2 ring-primary/50</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Selected • Active state
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-card ring-[3px] ring-ring/50 ring-offset-1 flex items-center justify-center">
              <code className="text-xs">ring-[3px] ring-ring/50</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Focus • Keyboard navigation
            </p>
          </div>
        </div>
      </section>

      {/* Opacity Scale */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Background Opacity</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Unified approach to background transparency
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-muted/10 ring-1 ring-border/30 flex items-center justify-center">
              <code className="text-xs">bg-muted/10</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Subtle highlights
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-muted/30 ring-1 ring-border/30 flex items-center justify-center">
              <code className="text-xs">bg-muted/30</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Hover states
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-muted/50 ring-1 ring-border/30 flex items-center justify-center">
              <code className="text-xs">bg-muted/50</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Default backgrounds
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <code className="text-xs">bg-primary/10</code>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Brand highlights
            </p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Pattern Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`// Button with refined design patterns
<button className={cn(
  // Base
  'inline-flex items-center justify-center gap-2',
  'rounded-md text-sm font-medium',
  'ring-offset-background transition-all duration-200',
  
  // Visual
  'bg-primary text-primary-foreground',
  'shadow-xs hover:shadow-sm',
  'hover:-translate-y-[2px]',
  
  // Focus
  'focus-visible:outline-none',
  'focus-visible:ring-[3px]',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-offset-1',
  
  // Size
  'h-10 px-4 py-2'
)}>
  Click Me
</button>`}</code>
        </pre>
      </section>
    </div>
  )
}
