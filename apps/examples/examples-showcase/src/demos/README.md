# Examples Showcase Demos

This directory contains interactive demonstrations of various Clarity Chat Components features.

## Available Demos

### StreamingShowcase.tsx
**Comprehensive streaming message demonstration**

Features:
- Real-time message streaming simulation
- Token-by-token rendering
- Multiple streaming scenarios (Fast, Normal, Slow, Code, Multiline)
- Glassmorphism styled containers
- Smooth animations with Framer Motion
- Streaming indicators and statistics
- Multi-stream comparison view

[View Documentation](../STREAMING_DEMO.md)

### PromptSuggestionsDemo.tsx
**Prompt suggestions and autocomplete**

Features:
- Slash command suggestions
- Mention (@) suggestions
- Context-aware autocomplete
- Keyboard navigation
- Glassmorphism UI

### FollowUpSuggestionsDemo.tsx
**Context-aware follow-up prompts**

Features:
- 5 conversation scenarios (Getting Started, Code, Support, Research, Writing)
- Multiple suggestion categories
- Interactive layout switcher (chips/cards/list)
- Glassmorphism styled suggestion chips
- Smooth animations and transitions
- Confidence scoring and filtering
- Real-time selection feedback

[View Full Documentation](./FOLLOWUP_SUGGESTIONS.md)

### FollowUpSuggestionsAdvanced.tsx
**Advanced follow-up demonstrations**

Features:
- Layout comparison view
- Dynamic confidence filtering with slider
- Animated context switching (auto-rotates every 5 seconds)
- Enhanced glassmorphism effects
- Spring physics animations
- Interactive controls

## Running Demos

From the examples-showcase directory:

```bash
pnpm dev
```

Then navigate to the specific demo tab in the showcase application.

## Creating New Demos

To create a new demo:

1. Create a new file in `src/demos/YourDemo.tsx`
2. Export a default component
3. Add lazy loading in `App.tsx`:
   ```tsx
   const YourDemo = lazy(() => import('./demos/YourDemo'))
   ```
4. Add to the view type union
5. Add navigation button in the nav bar
6. Add case in the renderView switch

## Demo Structure

Each demo should follow this structure:

```tsx
import React from 'react'
import { motion } from 'framer-motion'

export const YourDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold">Your Demo Title</h1>
          <p className="text-xl">Description</p>
        </motion.div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Your demo content */}
        </div>
      </div>
    </div>
  )
}

export default YourDemo
```

## Styling Guidelines

### Glassmorphism
```tsx
const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
  light: 'backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl',
  dark: 'backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl',
}
```

### Gradients
```tsx
// Background gradients
className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"

// Text gradients
className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"

// Button gradients
className="bg-gradient-to-r from-blue-500 to-cyan-500"
```

### Animations
```tsx
// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

## Performance Best Practices

1. **Lazy Loading**: Use `React.lazy()` for code splitting
2. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
3. **Suspense**: Provide loading fallbacks
4. **Animation**: Keep animations under 60fps, use `transform` and `opacity`
5. **Cleanup**: Always cleanup timeouts, intervals, and event listeners

## Accessibility

- Use semantic HTML
- Add ARIA labels to interactive elements
- Support keyboard navigation
- Respect prefers-reduced-motion
- Ensure color contrast meets WCAG standards

## Testing

Each demo should have:
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error handling
- [ ] Browser compatibility testing

## Documentation

Each demo should have:
- Component documentation
- Props interface
- Usage examples
- Integration guide
- Known limitations
