'use client'

import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '@clarity-chat/primitives'

export default function InteractiveComparison() {
  const [showV21, setShowV21] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">v2.1 vs v2.2 Interactive Comparison</h1>
            <p className="text-muted-foreground mt-2">
              Toggle to see the exact visual differences
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Currently viewing: <strong>{showV21 ? 'v2.1' : 'v2.2'}</strong>
            </span>
            <Button 
              onClick={() => setShowV21(!showV21)}
              variant={showV21 ? 'destructive' : 'success'}
            >
              {showV21 ? 'Switch to v2.2 ✨' : 'Switch to v2.1'}
            </Button>
          </div>
        </div>

        {/* Version Indicator */}
        <Card className={showV21 ? 'border-destructive/60' : 'border-green-500/60'}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {showV21 ? '📦 v2.1 Style (Old)' : '✨ v2.2 Style (New - Premium)'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {showV21 
                    ? 'Good quality - solid borders, moderate shadows, functional focus states'
                    : 'Premium quality - subtle borders, whisper-soft shadows, modern focus glows'
                  }
                </p>
              </div>
              <Badge variant={showV21 ? 'destructive' : 'success'} className="text-sm px-3 py-1">
                {showV21 ? 'OLD' : 'NEW ✨'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Button Comparison */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🔘 Button Variants</h2>
          <Card className={showV21 ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle>Notice the shadow and hover differences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="default"
                  className={showV21 ? 'shadow-sm hover:-translate-y-0.5 focus-visible:ring-2' : ''}
                >
                  Default
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button 
                  variant="outline"
                  className={showV21 ? 'border-2' : ''}
                >
                  Outline
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs space-y-1">
                <div><strong>Shadow:</strong> {showV21 ? '0 1px 2px rgba(0,0,0,0.05)' : '0 1px 2px rgba(0,0,0,0.04) ✨ 20% softer'}</div>
                <div><strong>Hover lift:</strong> {showV21 ? '2px' : '1px ✨'}</div>
                <div><strong>Focus:</strong> {showV21 ? 'Hard 2px ring' : 'Soft 1px ring + glow ✨'}</div>
                <div><strong>Outline border:</strong> {showV21 ? '2px solid' : '1px at 40% opacity ✨'}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Comparison */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📝 Input States</h2>
          <Card className={showV21 ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle>Focus an input to see the glow effect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input 
                  placeholder={showV21 ? "v2.1 - Standard border (2px)" : "v2.2 - Subtle border (1px at 40%) ✨"}
                  className={showV21 ? 'border-2 focus-visible:ring-2' : ''}
                />
                <Input 
                  placeholder="Focus me to see the difference"
                  className={showV21 ? 'border-2 focus-visible:ring-2' : ''}
                />
              </div>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs space-y-1">
                <div><strong>Border:</strong> {showV21 ? '2px solid at 100%' : '1px at 40% opacity ✨'}</div>
                <div><strong>Hover:</strong> {showV21 ? 'None' : 'Border darkens to 60% ✨'}</div>
                <div><strong>Focus border:</strong> {showV21 ? '2px solid' : '1px at 100% ✨'}</div>
                <div><strong>Focus ring:</strong> {showV21 ? '2px hard ring' : '1px soft ring + outer glow ✨'}</div>
                <div><strong>Placeholder:</strong> {showV21 ? '100% opacity' : '60% opacity ✨'}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge Comparison */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🏷️ Badge Redesign</h2>
          <Card className={showV21 ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle>Major visual change in v2.2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {showV21 ? (
                  <>
                    {/* Simulated v2.1 style */}
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/90 text-primary-foreground shadow-sm">
                      Default (v2.1)
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-600 text-white shadow-sm">
                      Success (v2.1)
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-destructive/90 text-destructive-foreground shadow-sm">
                      Error (v2.1)
                    </span>
                  </>
                ) : (
                  <>
                    {/* v2.2 style (automatic) */}
                    <Badge variant="default">Default (v2.2) ✨</Badge>
                    <Badge variant="success">Success (v2.2) ✨</Badge>
                    <Badge variant="destructive">Error (v2.2) ✨</Badge>
                  </>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs space-y-1">
                <div><strong>Border:</strong> {showV21 ? 'Yes (1px solid)' : 'No ✨'}</div>
                <div><strong>Background:</strong> {showV21 ? 'Solid (90% opacity)' : 'Transparent (10% opacity) ✨'}</div>
                <div><strong>Text color:</strong> {showV21 ? 'White' : 'Semantic color ✨'}</div>
                <div><strong>Shadow:</strong> {showV21 ? 'Yes (shadow-sm)' : 'No ✨'}</div>
                <div><strong>Feel:</strong> {showV21 ? 'Prominent' : 'Subtle, modern ✨'}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Comparison */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🃏 Card Refinements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card 
              hoverable 
              className={showV21 ? 'border-2' : ''}
            >
              <CardHeader>
                <CardTitle>Hoverable Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hover over this card to see the lift effect
                </p>
                <div className="mt-3 text-xs space-y-1 p-2 bg-muted/30 rounded">
                  <div><strong>Border:</strong> {showV21 ? '1px at 100%' : '1px at 40% ✨'}</div>
                  <div><strong>Hover lift:</strong> {showV21 ? '2px' : '1px ✨'}</div>
                  <div><strong>Hover shadow:</strong> {showV21 ? 'shadow-md (heavy)' : 'shadow-lg (refined) ✨'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className={showV21 ? 'border-2' : ''}>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notice the border and shadow subtlety
                </p>
                <div className="mt-3 text-xs space-y-1 p-2 bg-muted/30 rounded">
                  <div><strong>Border opacity:</strong> {showV21 ? '100%' : '40% ✨'}</div>
                  <div><strong>Shadow:</strong> {showV21 ? 'Standard' : 'Refined (40% softer) ✨'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Metrics Summary */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📊 Overall Metrics</h2>
          <Card className={showV21 ? 'border-2' : ''}>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {showV21 ? '0.05-0.1' : '0.04-0.06'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Shadow Opacity Range
                  </div>
                  {!showV21 && <div className="text-xs text-green-600 mt-1">40% softer ✨</div>}
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {showV21 ? '2px' : '1px'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Default Border Weight
                  </div>
                  {!showV21 && <div className="text-xs text-green-600 mt-1">50% lighter ✨</div>}
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {showV21 ? '2px' : '1px'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hover Lift Distance
                  </div>
                  {!showV21 && <div className="text-xs text-green-600 mt-1">50% subtler ✨</div>}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/40">
                <div className="text-center">
                  <div className="text-xl font-semibold mb-2">
                    {showV21 ? '⭐⭐⭐⭐' : '⭐⭐⭐⭐⭐'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {showV21 ? 'Good Quality' : 'Premium Quality (AI SDK Elements Level)'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Instructions */}
        <Card className={showV21 ? 'border-2' : ''}>
          <CardHeader>
            <CardTitle>💡 How to Use This Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Use the toggle button at the top to switch between v2.1 and v2.2</li>
              <li>Hover over buttons and cards to feel the difference in lift</li>
              <li>Tab through elements to see focus state differences</li>
              <li>Compare the metrics in each component's info box</li>
              <li>Notice the overall refinement in v2.2</li>
            </ol>
            
            <div className="mt-4 p-3 bg-primary/10 text-primary rounded-lg text-sm">
              <strong>Key Insight:</strong> The differences are subtle individually, but compound into 
              a significantly more refined, premium appearance overall. That's the power of systematic 
              design refinement.
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Clarity Chat v2.2 - Premium visual quality with comprehensive features</p>
          <p className="mt-2">Zero breaking changes. Instant upgrade. $0 cost.</p>
        </div>
      </div>
    </div>
  )
}
