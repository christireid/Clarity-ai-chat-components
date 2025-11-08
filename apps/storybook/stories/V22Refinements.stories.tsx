import type { Meta, StoryObj } from '@storybook/react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@clarity-chat/primitives'

/**
 * # v2.2 Visual Refinements
 * 
 * This story showcases the premium visual refinements in v2.2 that match AI SDK Elements quality.
 * 
 * ## Key Improvements:
 * - **Whisper-Soft Shadows**: 40% softer for premium elevation
 * - **Refined Borders**: 1px with subtle opacity (vs 2px solid)
 * - **Soft Focus Glows**: Modern halos replace harsh rings
 * - **Subtle Animations**: 1px lift, butter-smooth 60fps
 * - **Perfect Typography**: Refined weights and hierarchy
 * 
 * ## What Changed:
 * - All components automatically use refined styling
 * - Zero breaking changes - your code stays the same
 * - Instant upgrade to premium quality
 */
const meta = {
  title: '🎨 v2.2 Refinements/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive showcase of v2.2 visual refinements. Notice the whisper-soft shadows, refined borders, and smooth animations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RefinedShadows: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Shadow Hierarchy (40% Softer)</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-xl bg-card border border-border/40 shadow-xs">
            <code className="text-xs">shadow-xs</code>
            <p className="text-sm text-muted-foreground mt-2">Ultra-soft (NEW)</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/40 shadow-sm">
            <code className="text-xs">shadow-sm</code>
            <p className="text-sm text-muted-foreground mt-2">Subtle (refined)</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/40 shadow-md">
            <code className="text-xs">shadow-md</code>
            <p className="text-sm text-muted-foreground mt-2">Medium (refined)</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const RefinedButtons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Button Refinements</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Notice: Softer shadows (shadow-xs), 1px hover lift, soft focus glows
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline (1px border)</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4">
          💡 Hover over buttons to see 1px subtle lift. Tab to see soft focus glows.
        </p>
      </div>
    </div>
  ),
}

export const RefinedInputs: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Input Refinements</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Notice: Light borders (1px at 40%), soft focus glows, responsive hover
        </p>
        <div className="space-y-3 max-w-md">
          <Input placeholder="Default input - subtle border" />
          <Input placeholder="Click to see soft focus glow" />
          <Input variant="error" error="Error state with soft red glow" />
          <Input variant="success" placeholder="Success state with soft green glow" />
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4">
          💡 Click into inputs to see refined focus states with soft outer glows.
        </p>
      </div>
    </div>
  ),
}

export const RefinedBadges: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Badge Redesign</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Major change: Borderless with transparent backgrounds (10% opacity)
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline (has border)</Badge>
          <Badge variant="subtle">Subtle</Badge>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4">
          💡 Notice: No borders (except outline), transparent backgrounds, colored text
        </p>
      </div>
    </div>
  ),
}

export const RefinedCards: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Card Refinements</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>
                Subtle border (40% opacity), refined shadow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Notice the light border and soft shadow.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardHeader>
              <CardTitle>Hoverable Card</CardTitle>
              <CardDescription>
                Hover to see 1px lift and refined shadow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Hover over this card to see subtle refinements.</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4">
          💡 Hover the right card to see barely-there 1px lift
        </p>
      </div>
    </div>
  ),
}

export const FocusStateComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Focus State Evolution</h3>
        <p className="text-sm text-muted-foreground mb-4">
          v2.2 introduces soft focus glows instead of hard rings
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Tab through these elements:</p>
            <div className="flex flex-wrap gap-3">
              <Button>Button 1</Button>
              <Button variant="outline">Button 2</Button>
              <Input placeholder="Input 3" className="max-w-xs" />
              <Badge variant="default" tabIndex={0}>Badge 4</Badge>
            </div>
          </div>
          
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <div className="space-y-2 text-sm">
                <div><strong>v2.1 Focus:</strong> Hard 2px ring at 100% opacity</div>
                <div><strong>v2.2 Focus:</strong> Soft 1px ring at 50% opacity + 3px outer glow ✨</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Result: More accessible (more visible) and more elegant (softer)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
}

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Clarity Chat v2.2</h2>
        <p className="text-lg text-muted-foreground">
          Premium Visual Quality - AI SDK Elements Standard
        </p>
        <div className="flex gap-2 justify-center">
          <Badge variant="success">Premium Quality</Badge>
          <Badge variant="info">69 Components</Badge>
          <Badge variant="default">$0 Cost</Badge>
        </div>
      </div>

      {/* Refinement highlights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>🌫️ Whisper-Soft Shadows</CardTitle>
            <CardDescription>40% opacity reduction for refined elegance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button>Hover to feel the subtle lift</Button>
              <p className="text-xs text-muted-foreground">
                1px lift instead of 2px - barely perceptible but satisfying
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📏 Refined Borders</CardTitle>
            <CardDescription>1px with 40% opacity creates clean separation</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Light border that doesn't compete" />
            <p className="text-xs text-muted-foreground mt-2">
              Border at 40% opacity - present but not prominent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✨ Soft Focus Glows</CardTitle>
            <CardDescription>Modern halos replace harsh rings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input placeholder="Tab to see soft glow" />
              <p className="text-xs text-muted-foreground">
                Accessible AND elegant - best of both worlds
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏷️ Cleaner Badges</CardTitle>
            <CardDescription>Borderless with transparent backgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              No borders, transparent backgrounds, colored text
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom stats */}
      <Card>
        <CardContent className="py-6">
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">40%</div>
              <div className="text-xs text-muted-foreground">Softer Shadows</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50%</div>
              <div className="text-xs text-muted-foreground">Lighter Borders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1px</div>
              <div className="text-xs text-muted-foreground">Hover Lift</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">⭐⭐⭐⭐⭐</div>
              <div className="text-xs text-muted-foreground">Premium Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}
