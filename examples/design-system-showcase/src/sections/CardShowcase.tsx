/**
 * Card Showcase
 * 
 * Demonstrates card components and composition patterns
 */

import { Card } from '@clarity-chat/primitives'

export function CardShowcase() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Card Components</h2>
        <p className="text-muted-foreground">
          Container components with consistent styling and interactive states
        </p>
      </div>

      {/* Basic Cards */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Basic Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="font-semibold mb-2">Default Card</h4>
            <p className="text-sm text-muted-foreground">
              A simple card with default styling and subtle shadow
            </p>
          </Card>
          <Card className="p-6 ring-2 ring-primary/50">
            <h4 className="font-semibold mb-2">Selected Card</h4>
            <p className="text-sm text-muted-foreground">
              Card with ring-2 ring-primary/50 for selected state
            </p>
          </Card>
          <Card className="p-6 bg-primary/5">
            <h4 className="font-semibold mb-2">Highlighted Card</h4>
            <p className="text-sm text-muted-foreground">
              Card with subtle background tint for emphasis
            </p>
          </Card>
        </div>
      </section>

      {/* Interactive Cards */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Interactive Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Hover to Interact</h4>
                <p className="text-sm text-muted-foreground">
                  This card lifts on hover with smooth animation
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:ring-primary/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Ring Highlight</h4>
                <p className="text-sm text-muted-foreground">
                  This card shows ring on hover
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Card Grid */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Card Grid Example</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Analytics', value: '2,543', change: '+12%' },
            { icon: '👥', title: 'Users', value: '1,234', change: '+8%' },
            { icon: '💰', title: 'Revenue', value: '$45.2K', change: '+23%' },
            { icon: '⚡', title: 'Performance', value: '99.9%', change: '+0.1%' },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
              <div className="text-sm text-green-600 mt-1">{stat.change}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Card with Header */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Card with Header</h3>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border/50">
            <h4 className="font-semibold">Card Header</h4>
            <p className="text-sm text-muted-foreground">Subtitle or description</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              This card has a distinct header section with gradient background
              and border separator.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Action
              </button>
              <button className="px-4 py-2 ring-1 ring-border/50 rounded-md text-sm font-medium hover:bg-muted/30 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* Card List */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Card List Example</h3>
        <div className="space-y-3">
          {[
            { title: 'First Item', desc: 'Description for the first item', time: '2 min ago' },
            { title: 'Second Item', desc: 'Description for the second item', time: '5 min ago' },
            { title: 'Third Item', desc: 'Description for the third item', time: '10 min ago' },
          ].map((item, i) => (
            <Card 
              key={i}
              className="p-4 cursor-pointer transition-all duration-200 hover:bg-muted/30 hover:shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { Card } from '@clarity-chat/primitives'

// Basic card
<Card className="p-6">
  <h3 className="font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">
    Card content goes here
  </p>
</Card>

// Interactive card with hover
<Card className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]">
  <h3 className="font-semibold mb-2">Hover Me</h3>
  <p className="text-sm text-muted-foreground">
    This card lifts on hover
  </p>
</Card>

// Selected card
<Card className="p-6 ring-2 ring-primary/50 shadow-sm">
  <h3 className="font-semibold mb-2">Selected</h3>
  <p className="text-sm text-muted-foreground">
    Currently active
  </p>
</Card>`}</code>
        </pre>
      </section>

      {/* Pattern Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Card Pattern Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Base Styling</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• rounded-lg (8px radius)</li>
              <li>• ring-1 ring-border/30</li>
              <li>• shadow-xs (subtle depth)</li>
              <li>• bg-card text-card-foreground</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Interactive Hover</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• hover:shadow-sm (elevation)</li>
              <li>• hover:-translate-y-[2px] (lift)</li>
              <li>• hover:ring-border/70 (subtle)</li>
              <li>• transition-all duration-200</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Selected State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ring-2 ring-primary/50</li>
              <li>• shadow-sm (elevated)</li>
              <li>• Maintains all styling</li>
              <li>• Clear visual feedback</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Composition</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Flexible container</li>
              <li>• Works with any content</li>
              <li>• Stackable components</li>
              <li>• Grid-friendly</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
