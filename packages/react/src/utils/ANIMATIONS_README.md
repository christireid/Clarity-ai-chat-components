# Animation Utilities for Clarity Chat

Comprehensive animation utilities for Clarity Chat built on top of framer-motion. Provides animation presets, custom hooks, and orchestration utilities for smooth, performant UI animations.

## Features

- **Pre-configured Animation Presets**: Ready-to-use animation configurations for common patterns
- **Custom Animation Hooks**: React hooks for message animations, streaming text, and status-based animations
- **Reduced Motion Support**: Automatic accessibility support for users who prefer reduced motion
- **Animation Orchestration**: Utilities for staggering, sequencing, and paralleling animations
- **Type-Safe**: Full TypeScript support with proper types for all animations and transitions

## Installation

The animation utilities are part of `@clarity-chat/react`:

```typescript
import {
  fadeIn,
  slideInUp,
  useMessageAnimation,
  stagger,
} from '@clarity-chat/react/utils/animations'
```

## Duration Constants

Consistent timing values for animations:

```typescript
import { DURATION } from '@clarity-chat/react/utils/animations'

DURATION.FAST       // 0.15s
DURATION.NORMAL     // 0.3s
DURATION.SLOW       // 0.5s
DURATION.VERY_SLOW  // 0.8s
```

## Easing Constants

Pre-configured easing curves and spring configurations:

```typescript
import { EASING } from '@clarity-chat/react/utils/animations'

EASING.ease              // [0.25, 0.46, 0.45, 0.94]
EASING.easeInOut         // [0.42, 0, 0.58, 1]
EASING.spring            // { type: 'spring', stiffness: 100, damping: 10 }
EASING.bounce            // { type: 'spring', stiffness: 200, damping: 12 }
EASING.gentleSpring      // { type: 'spring', stiffness: 80, damping: 15 }
```

## Animation Presets

### Fade Animations

```typescript
import { motion } from 'framer-motion'
import { fadeIn, fadeOut } from '@clarity-chat/react/utils/animations'

// Fade in
<motion.div variants={fadeIn} initial="initial" animate="animate">
  Hello
</motion.div>

// Fade out
<motion.div variants={fadeOut} initial="initial" animate="animate">
  Goodbye
</motion.div>
```

### Slide Animations

```typescript
import { slideInLeft, slideInRight, slideInUp, slideInDown } from '@clarity-chat/react/utils/animations'

// Slide in from left
<motion.div variants={slideInLeft} initial="initial" animate="animate">
  Content
</motion.div>

// Slide in from right
<motion.div variants={slideInRight} initial="initial" animate="animate">
  Content
</motion.div>

// Slide in from top
<motion.div variants={slideInUp} initial="initial" animate="animate">
  Content
</motion.div>

// Slide in from bottom
<motion.div variants={slideInDown} initial="initial" animate="animate">
  Content
</motion.div>
```

### Scale Animations

```typescript
import { scaleIn, scaleOut } from '@clarity-chat/react/utils/animations'

// Scale in
<motion.div variants={scaleIn} initial="initial" animate="animate">
  Content
</motion.div>

// Scale out
<motion.div variants={scaleOut} initial="initial" animate="animate">
  Content
</motion.div>
```

### Message Animations

```typescript
import { messageEnter, messageExit } from '@clarity-chat/react/utils/animations'

// Enter animation for messages
<motion.div variants={messageEnter} initial="initial" animate="animate" exit="exit">
  Message content
</motion.div>

// Exit animation for messages
<motion.div variants={messageExit} initial="initial" animate="animate" exit="exit">
  Message content
</motion.div>
```

### Specialized Animations

```typescript
import { thinkingPulse, toolCardFlip, progressFill } from '@clarity-chat/react/utils/animations'

// Thinking pulse indicator
<motion.div variants={thinkingPulse} animate="animate">
  Thinking...
</motion.div>

// Tool card flip animation
<motion.div variants={toolCardFlip} initial="initial" animate="animate">
  Tool Card
</motion.div>

// Progress bar fill
<motion.div variants={progressFill} initial="initial" animate="animate">
  <div style={{ width: '100%', height: '4px' }} />
</motion.div>
```

## Animation Hooks

### useMessageAnimation

Provides staggered animation for messages in a list:

```typescript
import { useMessageAnimation } from '@clarity-chat/react/utils/animations'
import { motion } from 'framer-motion'

function MessageList({ messages }) {
  return (
    <div>
      {messages.map((msg, index) => {
        const { variant, transition } = useMessageAnimation(index, 50)
        return (
          <motion.div
            key={msg.id}
            variants={variant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            {msg.content}
          </motion.div>
        )
      })}
    </div>
  )
}
```

**Parameters:**
- `index` - Index of the message in the list
- `staggerDelay` - Delay between messages in milliseconds (default: 50)

**Returns:**
- `variant` - Framer Motion variants for the animation
- `transition` - Transition configuration

### useStreamingAnimation

Handles animations for streaming text with cursor blink:

```typescript
import { useStreamingAnimation } from '@clarity-chat/react/utils/animations'
import { motion } from 'framer-motion'

function StreamingMessage({ isStreaming, text }) {
  const streaming = useStreamingAnimation(isStreaming, true)

  return (
    <motion.div>
      <span>{text}</span>
      <motion.span animate={streaming.cursorAnimation}>
        │
      </motion.span>
    </motion.div>
  )
}
```

**Parameters:**
- `isStreaming` - Whether text is currently streaming
- `showCursor` - Whether to show cursor blink animation

**Returns:**
- `cursorAnimation` - Cursor blink animation
- `containerVariant` - Container variant label
- `textVariant` - Text variant label
- `isActive` - Whether streaming is active

### useStatusAnimation

Status-based animations for loading, success, and error states:

```typescript
import { useStatusAnimation } from '@clarity-chat/react/utils/animations'
import { motion } from 'framer-motion'

function ToolResult({ status }) {
  const { variant, transition } = useStatusAnimation(status, {
    pulse: true,
    scale: true,
  })

  return (
    <motion.div
      variants={variant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      {status === 'loading' && <span>Loading...</span>}
      {status === 'success' && <span>Success!</span>}
      {status === 'error' && <span>Error occurred</span>}
      {status === 'idle' && null}
    </motion.div>
  )
}
```

**Parameters:**
- `status` - Current status: 'idle' | 'loading' | 'success' | 'error'
- `config.pulse` - Enable pulse animation for loading state
- `config.scale` - Enable scale animation

**Returns:**
- `variant` - Variants for the animation
- `transition` - Transition configuration

### useReducedMotion

Hook to detect if user prefers reduced motion:

```typescript
import { useReducedMotion } from '@clarity-chat/react/utils/animations'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1] }}
    >
      Content
    </motion.div>
  )
}
```

### useAnimationPerformance

Hook for monitoring animation performance:

```typescript
import { useAnimationPerformance } from '@clarity-chat/react/utils/animations'

function MyComponent() {
  const { prefersReducedMotion, isSupported, supportsGPUAcceleration } =
    useAnimationPerformance()

  return (
    <div>
      {supportsGPUAcceleration ? (
        <span>GPU accelerated animations</span>
      ) : (
        <span>Software animations</span>
      )}
    </div>
  )
}
```

## Animation Orchestration

### stagger

Create staggered animations for lists:

```typescript
import { stagger, fadeIn } from '@clarity-chat/react/utils/animations'
import { motion } from 'framer-motion'

const containerVariants = stagger(fadeIn, {
  stagger: 0.1,
  delayChildren: 0,
  direction: 'forward',
})

function List({ items }) {
  return (
    <motion.div variants={containerVariants} initial="initial" animate="animate">
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeIn}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

**Parameters:**
- `variants` - Base variants to apply
- `config.stagger` - Delay between items (seconds)
- `config.delayChildren` - Delay before children animate (ms)
- `config.direction` - 'forward' or 'reverse'

### sequence

Create sequential animations:

```typescript
import { sequence } from '@clarity-chat/react/utils/animations'

const transitions = [
  { duration: 0.3 },
  { duration: 0.2 },
  { duration: 0.4 },
]

const sequentialTransition = sequence(transitions, 100)
```

### parallel

Create parallel animations (all at once):

```typescript
import { parallel } from '@clarity-chat/react/utils/animations'

const parallelTransition = parallel({
  duration: 0.3,
  ease: 'easeInOut',
})
```

### mergeVariants

Combine multiple animation variants:

```typescript
import { mergeVariants, fadeIn, slideInUp } from '@clarity-chat/react/utils/animations'

const combined = mergeVariants(fadeIn, slideInUp)
```

## Transition Presets

Pre-configured transition objects:

```typescript
import { TRANSITION_PRESETS } from '@clarity-chat/react/utils/animations'

TRANSITION_PRESETS.fast         // 150ms with easeInOut
TRANSITION_PRESETS.normal       // 300ms with easeInOut
TRANSITION_PRESETS.slow         // 500ms with easeInOut
TRANSITION_PRESETS.spring       // Spring animation
TRANSITION_PRESETS.gentleSpring // Gentle spring animation
```

## Accessing Presets by Key

```typescript
import { getAnimationPreset, getTransitionPreset } from '@clarity-chat/react/utils/animations'

// Get animation preset
const fadeInVariant = getAnimationPreset('fadeIn')

// Get transition preset
const fastTransition = getTransitionPreset('fast')
```

## Reduced Motion Support

The animations automatically respect the user's `prefers-reduced-motion` setting:

```typescript
import { getReducedMotionVariants } from '@clarity-chat/react/utils/animations'

// Automatically respects user preference
const variants = getReducedMotionVariants(fadeIn)

// Or explicitly set
const variants = getReducedMotionVariants(fadeIn, true)
```

## Complete Example

```typescript
import { AnimatePresence, motion } from 'framer-motion'
import {
  useMessageAnimation,
  messageEnter,
  messageExit,
  stagger,
  slideInUp,
  TRANSITION_PRESETS,
} from '@clarity-chat/react/utils/animations'

function ChatMessages({ messages, isLoading }) {
  const containerVariants = stagger(slideInUp, { stagger: 0.05 })

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => {
          const { variant, transition } = useMessageAnimation(index, 30)

          return (
            <motion.div
              key={message.id}
              variants={variant}
              transition={transition}
              layout
            >
              <div className="message">
                <div className="role">{message.role}</div>
                <div className="content">{message.content}</div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_PRESETS.gentle}
        >
          <span>AI is thinking...</span>
        </motion.div>
      )}
    </motion.div>
  )
}
```

## Best Practices

1. **Use Presets**: Leverage the pre-configured presets for consistency across your app
2. **Respect Reduced Motion**: Always use the `useReducedMotion()` hook or `getReducedMotionVariants()` function
3. **Appropriate Durations**: Use `DURATION.FAST` for quick interactions, `DURATION.NORMAL` for standard animations
4. **GPU Acceleration**: Use `transform` and `opacity` for best performance, avoid animating layout properties
5. **AnimatePresence**: Always wrap exit animations with `<AnimatePresence>`
6. **Test Accessibility**: Test your animations with reduced motion enabled

## Performance Considerations

- GPU-accelerated properties (transform, opacity) are preferred
- Avoid animating layout-affecting properties (width, height, position)
- Use `will-change: transform` for frequently animated elements
- Consider using `layout` prop in Framer Motion for layout animations
- Monitor animations with `useAnimationPerformance()` hook

## API Reference

### Constants
- `DURATION` - Animation duration presets
- `EASING` - Easing curve and spring configurations
- `ANIMATION_PRESETS` - All animation variants
- `TRANSITION_PRESETS` - Transition configurations

### Presets
- `fadeIn` / `fadeOut` - Opacity animations
- `slideInLeft` / `slideInRight` / `slideInUp` / `slideInDown` - Slide animations
- `scaleIn` / `scaleOut` - Scale animations
- `messageEnter` / `messageExit` - Message animations
- `thinkingPulse` - Pulse animation for loading states
- `toolCardFlip` - 3D flip animation
- `progressFill` - Progress bar animation

### Hooks
- `useMessageAnimation(index, staggerDelay)` - Staggered message animations
- `useStreamingAnimation(isStreaming, showCursor)` - Streaming text animations
- `useStatusAnimation(status, config)` - Status-based animations
- `useReducedMotion()` - Detect reduced motion preference
- `useAnimationPerformance()` - Check animation capabilities

### Utilities
- `stagger(variants, config)` - Create staggered animations
- `sequence(transitions, delay)` - Create sequential animations
- `parallel(transition)` - Create parallel animations
- `mergeVariants(...variants)` - Combine variants
- `getReducedMotionVariants(variants, prefersReducedMotion)` - Get accessible variants
- `getAnimationPreset(key)` - Get preset by key
- `getTransitionPreset(key)` - Get transition by key

## Types

```typescript
type AnimationPresetKey =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'scaleIn'
  | 'scaleOut'
  | 'messageEnter'
  | 'messageExit'
  | 'thinkingPulse'
  | 'toolCardFlip'
  | 'progressFill'

type TransitionPresetKey = 'fast' | 'normal' | 'slow' | 'spring' | 'gentleSpring'

interface AnimationOrchestrationConfig {
  stagger?: number
  direction?: 'forward' | 'reverse'
  delayChildren?: number
}

interface StatusAnimationConfig {
  status: 'idle' | 'loading' | 'success' | 'error'
  pulse?: boolean
  scale?: boolean
}
```

## Contributing

When adding new animations:

1. Add the preset variant to the main animations.ts file
2. Include comprehensive JSDoc comments
3. Add tests to animations.test.ts
4. Update this README with examples
5. Ensure the animation respects reduced motion preferences

## License

MIT - See LICENSE file for details
