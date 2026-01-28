# OKLCH Color System

> Perceptually uniform color system for AI chat components

## Overview

Clarity AI Chat Components uses the **OKLCH color space** for AI-specific color variables. OKLCH
(Lightness, Chroma, Hue) provides perceptually uniform colors that look consistent across different
displays and lighting conditions.

### Why OKLCH?

1. **Perceptual Uniformity**: Colors with the same lightness appear equally bright to the human eye
2. **Predictable Gradients**: Smooth, natural-looking color transitions
3. **Wide Gamut Support**: Access to more vivid colors on modern displays
4. **Intuitive Adjustments**: Easy to lighten, darken, or adjust saturation predictably

### Comparison with HSL

| Feature               | HSL             | OKLCH              |
| --------------------- | --------------- | ------------------ |
| Perceptual uniformity | ❌ No           | ✅ Yes             |
| Wide gamut support    | ❌ Limited      | ✅ Full P3+        |
| Lightness accuracy    | ❌ Mathematical | ✅ Perceptual      |
| Browser support       | ✅ Universal    | ✅ Modern browsers |

---

## OKLCH Format

```css
oklch(lightness chroma hue / alpha)
```

### Components

#### Lightness (L)

- **Range**: 0-100% (or 0-1 as decimal)
- **Description**: Perceptual brightness
- **Examples**:
  - `0%` = Pure black
  - `50%` = Middle gray (perceptually)
  - `100%` = Pure white

#### Chroma (C)

- **Range**: 0-0.5 (typical), can go higher
- **Description**: Saturation/vividness
- **Examples**:
  - `0` = Grayscale
  - `0.05` = Subtle color
  - `0.15` = Vivid color
  - `0.4` = Maximum saturation (display-dependent)

#### Hue (H)

- **Range**: 0-360 degrees
- **Description**: Color angle on color wheel
- **Examples**:
  - `0°` / `360°` = Red
  - `120°` = Green
  - `180°` = Cyan
  - `240°` = Blue
  - `280°` = Purple

#### Alpha (optional)

- **Range**: 0-1
- **Description**: Opacity
- **Examples**:
  - `0` = Fully transparent
  - `0.5` = Semi-transparent
  - `1` = Fully opaque

---

## AI-Specific Colors

### Color Variables

| Variable         | Light Mode            | Dark Mode             | Purpose                      |
| ---------------- | --------------------- | --------------------- | ---------------------------- |
| `--ai-assistant` | `oklch(96% 0.02 220)` | `oklch(25% 0.04 220)` | Assistant message background |
| `--ai-user`      | `oklch(92% 0.06 260)` | `oklch(30% 0.08 260)` | User message background      |
| `--ai-system`    | `oklch(95% 0.03 180)` | `oklch(22% 0.05 180)` | System message background    |
| `--ai-thinking`  | `oklch(94% 0.04 280)` | `oklch(28% 0.06 280)` | Thinking/reasoning indicator |
| `--ai-tool`      | `oklch(93% 0.05 160)` | `oklch(27% 0.07 160)` | Tool execution indicator     |
| `--ai-error`     | `oklch(91% 0.12 25)`  | `oklch(35% 0.15 25)`  | Error state                  |

### Color Semantics

#### Assistant (Blue-gray, 220°)

- **Purpose**: AI assistant responses
- **Characteristics**: Calm, trustworthy, professional
- **Usage**: Message bubbles, assistant indicators

#### User (Blue-purple, 260°)

- **Purpose**: User messages and inputs
- **Characteristics**: Personal, distinct, friendly
- **Usage**: User message bubbles, input highlights

#### System (Cyan, 180°)

- **Purpose**: System notifications and metadata
- **Characteristics**: Neutral, informative, non-intrusive
- **Usage**: Status messages, system notifications

#### Thinking (Purple, 280°)

- **Purpose**: AI reasoning/thinking indicators
- **Characteristics**: Active processing, contemplative
- **Usage**: Loading states, thinking indicators

#### Tool (Green, 160°)

- **Purpose**: Tool execution and function calls
- **Characteristics**: Action-oriented, productive
- **Usage**: Tool call indicators, function execution

#### Error (Red, 25°)

- **Purpose**: Error states and warnings
- **Characteristics**: Attention-grabbing, cautionary
- **Usage**: Error messages, validation failures

---

## Usage Examples

### CSS Variables

```css
.message-assistant {
  background: var(--ai-assistant);
}

.message-user {
  background: var(--ai-user);
}

.thinking-indicator {
  background: var(--ai-thinking);
}
```

### Tailwind Classes

```tsx
// Assistant message
<div className="bg-ai-assistant">
  AI response here
</div>

// User message
<div className="bg-ai-user">
  User message here
</div>

// Tool indicator
<div className="bg-ai-tool">
  Tool executing...
</div>
```

### With Alpha Channel

```css
/* Semi-transparent overlay */
.thinking-overlay {
  background: oklch(94% 0.04 280 / 0.9);
}

/* Subtle highlight */
.tool-highlight {
  border-color: oklch(93% 0.05 160 / 0.3);
}
```

---

## Design Guidelines

### Light Mode

- **Lightness**: 91-96% (very light backgrounds)
- **Chroma**: 0.02-0.12 (subtle to moderate saturation)
- **Purpose**: Soft, readable backgrounds that don't overwhelm

### Dark Mode

- **Lightness**: 22-35% (dark backgrounds)
- **Chroma**: 0.04-0.15 (slightly more saturated than light mode)
- **Purpose**: Visible in dark environments without eye strain

### Accessibility Considerations

1. **Contrast Ratios**: All AI colors meet WCAG AA standards when paired with appropriate text
   colors
2. **Perceptual Uniformity**: Colors with the same lightness appear equally bright
3. **Color Blindness**: Hue-based semantics supplemented with icons/labels
4. **Dark Mode**: Increased saturation compensates for reduced perceived brightness

---

## Color Modifications

### Adjusting Lightness

```css
/* Lighter variant */
oklch(98% 0.02 220) /* Original: 96% */

/* Darker variant */
oklch(88% 0.02 220) /* Original: 96% */
```

### Adjusting Saturation

```css
/* More saturated */
oklch(96% 0.08 220) /* Original: 0.02 */

/* Less saturated (grayer) */
oklch(96% 0.01 220) /* Original: 0.02 */
```

### Adjusting Hue

```css
/* Shift toward cyan */
oklch(96% 0.02 200) /* Original: 220 */

/* Shift toward blue */
oklch(96% 0.02 240) /* Original: 220 */
```

---

## Testing Colors

### Format Validation

Use the test utilities to validate OKLCH colors:

```typescript
import { isValidOklchFormat, validateOklchRanges } from '@/styles/__tests__/colors.test'

// Check format
isValidOklchFormat('oklch(96% 0.02 220)') // true

// Validate ranges
validateOklchRanges('oklch(96% 0.02 220)')
// { valid: true, errors: [] }
```

### Visual Testing

```bash
# Run style tests
pnpm test src/styles/__tests__/colors.test.ts

# Check all styles
pnpm test src/styles
```

---

## Browser Support

OKLCH is supported in:

- ✅ Chrome 111+
- ✅ Edge 111+
- ✅ Safari 15.4+
- ✅ Firefox 113+

### Fallbacks

For older browsers, CSS automatically falls back to the closest sRGB color. No additional polyfills
needed.

```css
/* Modern browsers use OKLCH */
.message {
  background: var(--ai-assistant);
}

/* If you need explicit fallback */
.message {
  background: #f0f4f8; /* Fallback */
  background: var(--ai-assistant); /* OKLCH (preferred) */
}
```

---

## Migration from HSL

### Before (HSL)

```css
:root {
  --assistant-bg: hsl(220, 20%, 96%);
}
```

### After (OKLCH)

```css
:root {
  --ai-assistant: oklch(96% 0.02 220);
}
```

### Benefits

1. **Perceptually uniform**: Colors appear equally bright
2. **Better gradients**: Smoother color transitions
3. **More colors**: Access to P3 color gamut
4. **Easier to maintain**: Predictable adjustments

---

## Advanced Topics

### Color Interpolation

OKLCH provides better color interpolation than HSL:

```css
/* Smooth gradient in OKLCH */
.gradient {
  background: linear-gradient(135deg, var(--ai-assistant), var(--ai-thinking));
}
```

### Dynamic Color Generation

```typescript
function generateAIColor(hue: number, mode: 'light' | 'dark') {
  const lightness = mode === 'light' ? 94 : 28
  const chroma = mode === 'light' ? 0.04 : 0.06

  return `oklch(${lightness}% ${chroma} ${hue})`
}

// Generate custom AI color
const customColor = generateAIColor(300, 'light')
// Result: "oklch(94% 0.04 300)"
```

### Color Mixing

```css
/* Mix two AI colors (50/50) */
.mixed {
  background: color-mix(in oklch, var(--ai-assistant) 50%, var(--ai-tool) 50%);
}
```

---

## Resources

### Official Specifications

- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#ok-lab)
- [OKLCH Color Picker](https://oklch.com/)

### Tools

- [OKLCH Color Picker](https://oklch.com/)
- [Color.js](https://colorjs.io/) - JavaScript color manipulation
- [Culori](https://culorijs.org/) - Color conversion library

### Further Reading

- [Why OKLCH?](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Perceptual Color Spaces](https://programmingdesignsystems.com/color/perceptually-uniform-color-spaces/)

---

## Contributing

When adding new AI-specific colors:

1. Use OKLCH format
2. Provide both light and dark mode variants
3. Document the semantic purpose
4. Add tests to `colors.test.ts`
5. Update Tailwind config
6. Update this documentation

---

**Last Updated**: January 28, 2026 **Version**: 1.0.0
