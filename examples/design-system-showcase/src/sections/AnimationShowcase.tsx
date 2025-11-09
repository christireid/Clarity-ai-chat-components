/**
 * Animation Showcase
 * 
 * Demonstrates animation patterns and transitions
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'

export function AnimationShowcase() {
  const [showFade, setShowFade] = useState(false)
  const [showSlide, setShowSlide] = useState(false)
  const [showScale, setShowScale] = useState(false)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Animation Patterns</h2>
        <p className="text-muted-foreground">
          Subtle, intentional animations that enhance the user experience
        </p>
      </div>

      {/* Transition Durations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Transition Durations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
            className="p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer"
          >
            <div className="text-sm font-medium mb-1">Instant</div>
            <div className="text-xs text-muted-foreground">duration-150</div>
            <div className="text-xs text-muted-foreground mt-2">150ms</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-lg ring-1 ring-primary/30 bg-primary/5 cursor-pointer"
          >
            <div className="text-sm font-medium mb-1">Fast</div>
            <div className="text-xs text-muted-foreground">duration-200</div>
            <div className="text-xs text-muted-foreground mt-2">200ms ⭐</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer"
          >
            <div className="text-sm font-medium mb-1">Normal</div>
            <div className="text-xs text-muted-foreground">duration-300</div>
            <div className="text-xs text-muted-foreground mt-2">300ms</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer"
          >
            <div className="text-sm font-medium mb-1">Slow</div>
            <div className="text-xs text-muted-foreground">duration-500</div>
            <div className="text-xs text-muted-foreground mt-2">500ms</div>
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          ⭐ Most components use duration-200 (200ms) for optimal perceived performance
        </p>
      </section>

      {/* Entrance Animations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Entrance Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fade In */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Fade In</h4>
            <div className="h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center">
              {showFade && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Faded In
                </motion.div>
              )}
            </div>
            <Button size="sm" onClick={() => setShowFade(!showFade)}>
              {showFade ? 'Hide' : 'Show'} Fade
            </Button>
            <pre className="text-xs bg-background rounded p-2 ring-1 ring-border/30">
              <code>{`initial={{ opacity: 0 }}
animate={{ opacity: 1 }}`}</code>
            </pre>
          </div>

          {/* Slide In */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Slide In</h4>
            <div className="h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center overflow-hidden">
              {showSlide && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Slid In
                </motion.div>
              )}
            </div>
            <Button size="sm" onClick={() => setShowSlide(!showSlide)}>
              {showSlide ? 'Hide' : 'Show'} Slide
            </Button>
            <pre className="text-xs bg-background rounded p-2 ring-1 ring-border/30">
              <code>{`initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}`}</code>
            </pre>
          </div>

          {/* Scale In */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Scale In</h4>
            <div className="h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center">
              {showScale && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Scaled In
                </motion.div>
              )}
            </div>
            <Button size="sm" onClick={() => setShowScale(!showScale)}>
              {showScale ? 'Hide' : 'Show'} Scale
            </Button>
            <pre className="text-xs bg-background rounded p-2 ring-1 ring-border/30">
              <code>{`initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Hover Animations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Hover Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lift */}
          <motion.div
            whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs cursor-pointer"
          >
            <h4 className="font-medium mb-2">Lift on Hover</h4>
            <p className="text-sm text-muted-foreground">
              -translate-y-[2px]
            </p>
          </motion.div>

          {/* Scale */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs cursor-pointer"
          >
            <h4 className="font-medium mb-2">Scale on Hover</h4>
            <p className="text-sm text-muted-foreground">
              scale: 1.05
            </p>
          </motion.div>

          {/* Glow */}
          <motion.div
            whileHover={{ boxShadow: '0 0 20px rgb(var(--primary) / 0.3)' }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-lg ring-1 ring-primary/30 bg-primary/5 shadow-xs cursor-pointer"
          >
            <h4 className="font-medium mb-2">Glow on Hover</h4>
            <p className="text-sm text-muted-foreground">
              Custom shadow
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading Animations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Loading Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spinner */}
          <div className="p-6 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-4">Spinner</h4>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>

          {/* Pulse */}
          <div className="p-6 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-4">Pulse</h4>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 bg-primary/20 rounded-full"
            />
          </div>

          {/* Bounce */}
          <div className="p-6 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-4">Bounce</h4>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 bg-primary rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Stagger Animation */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Stagger Animation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="h-24 rounded-lg ring-1 ring-border/30 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-medium"
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Items appear with 100ms delay between each
        </p>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { motion } from 'framer-motion'

// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Hover animation
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Button
</motion.button>

// Loading spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 1, 
    repeat: Infinity, 
    ease: 'linear' 
  }}
  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
/>

// Stagger children
<motion.div>
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>`}</code>
        </pre>
      </section>

      {/* Animation Guidelines */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Animation Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg ring-1 ring-green-500/30 bg-green-500/5">
            <h4 className="font-medium mb-2 text-green-600">✅ Do</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use duration-200 for most interactions</li>
              <li>• Keep animations subtle and purposeful</li>
              <li>• Provide visual feedback for user actions</li>
              <li>• Use easing for natural movement</li>
              <li>• Test on slower devices</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-destructive/30 bg-destructive/5">
            <h4 className="font-medium mb-2 text-destructive">❌ Don't</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Overuse animations</li>
              <li>• Make animations too slow (>500ms)</li>
              <li>• Animate without purpose</li>
              <li>• Use jarring movements</li>
              <li>• Ignore reduced-motion preferences</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
