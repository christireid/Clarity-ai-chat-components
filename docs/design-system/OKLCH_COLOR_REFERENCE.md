# OKLCH Color Reference

> Visual reference guide for all OKLCH colors in the Clarity AI Chat Components design system

**Last Updated**: January 28, 2026
**Version**: 2.0.0

---

## Color Format

All colors use OKLCH format with perceptual uniformity:

```
oklch(lightness chroma hue / alpha)
```

- **Lightness**: 0-100% (perceptual brightness)
- **Chroma**: 0-0.4 (color intensity)
- **Hue**: 0-360deg (color angle)
- **Alpha**: 0-1 (opacity, optional)

---

## Primary Colors (Blue-Purple)

**Hue**: 265° (blue-purple)
**Use**: Brand identity, buttons, links, focus states

### Light Mode

| Shade | OKLCH Value | Contrast on White | Use Case |
|-------|-------------|-------------------|----------|
| 50 | `oklch(95% 0.05 265)` | 1.2:1 | Subtle backgrounds |
| 100 | `oklch(90% 0.08 265)` | 1.5:1 | Light backgrounds |
| 200 | `oklch(80% 0.12 265)` | 2.1:1 | Hover states |
| 300 | `oklch(70% 0.15 265)` | 3.2:1 | Disabled states |
| 400 | `oklch(65% 0.18 265)` | 4.1:1 | Secondary actions |
| 500 | `oklch(60% 0.20 265)` | **4.84:1** ✅ | Primary buttons (AA) |
| 600 | `oklch(55% 0.20 265)` | **7.12:1** ✅ | Links (AAA) |
| 700 | `oklch(45% 0.18 265)` | 10.5:1 | Dark accents |
| 800 | `oklch(35% 0.15 265)` | 14.2:1 | Very dark |
| 900 | `oklch(25% 0.12 265)` | 17.8:1 | Near black |

### Dark Mode

| Shade | OKLCH Value | Contrast on Dark | Use Case |
|-------|-------------|------------------|----------|
| 50 | `oklch(25% 0.12 265)` | 1.8:1 | Very dark backgrounds |
| 100 | `oklch(35% 0.15 265)` | 2.4:1 | Dark backgrounds |
| 200 | `oklch(45% 0.18 265)` | 3.5:1 | Disabled states |
| 300 | `oklch(55% 0.20 265)` | 5.2:1 | Secondary actions |
| 400 | `oklch(60% 0.22 265)` | 6.8:1 | Hover states |
| 500 | `oklch(65% 0.22 265)` | **7.89:1** ✅ | Primary buttons (AAA) |
| 600 | `oklch(70% 0.22 265)` | **10.24:1** ✅ | Links (AAA) |
| 700 | `oklch(75% 0.20 265)` | 12.1:1 | Light accents |
| 800 | `oklch(80% 0.18 265)` | 14.5:1 | Very light |
| 900 | `oklch(90% 0.15 265)` | 18.2:1 | Near white |

---

## Secondary Colors (Purple)

**Hue**: 300° (purple)
**Use**: Complementary accents, highlights

### Light Mode

| Shade | OKLCH Value | Purpose |
|-------|-------------|---------|
| 500 | `oklch(60% 0.19 300)` | Base secondary |

### Dark Mode

| Shade | OKLCH Value | Purpose |
|-------|-------------|---------|
| 500 | `oklch(65% 0.21 300)` | Base secondary (enhanced) |

---

## Accent Colors (Warm Pink)

**Hue**: 340° (pink-magenta)
**Use**: CTAs, highlights, attention-grabbing elements

### Light Mode

| Shade | OKLCH Value | Purpose |
|-------|-------------|---------|
| 500 | `oklch(60% 0.20 340)` | Base accent |

### Dark Mode

| Shade | OKLCH Value | Purpose |
|-------|-------------|---------|
| 500 | `oklch(65% 0.22 340)` | Base accent (enhanced) |

---

## Semantic Colors

### Success (Forest Green)

**Hue**: 145° (green)
**Contrast**: 4.51:1 (light) / 6.21:1 (dark)

```css
/* Light Mode */
--oklch-success: oklch(55% 0.18 145);  /* WCAG AA ✅ */

/* Dark Mode */
--oklch-success: oklch(60% 0.20 145);  /* Enhanced visibility */
```

**Use Cases**:
- Success messages
- Confirmation dialogs
- Positive status indicators
- Checkmarks and ticks

**Color-Blind Safe**: ✅ Distinguishable from error in all types

### Warning (Amber)

**Hue**: 70° (yellow-orange)
**Contrast**: 7.82:1 with dark text (light mode)

```css
/* Light Mode */
--oklch-warning: oklch(75% 0.18 70);   /* Use dark foreground */

/* Dark Mode */
--oklch-warning: oklch(80% 0.20 70);   /* Brighter for visibility */
```

**Use Cases**:
- Warning messages
- Caution notices
- Attention indicators
- Pending states

**Color-Blind Safe**: ✅ High lightness separates from other states

### Error (Warm Red)

**Hue**: 25° (red-orange)
**Contrast**: 4.84:1 (light) / 7.12:1 (dark)

```css
/* Light Mode */
--oklch-error: oklch(55% 0.22 25);     /* WCAG AA ✅ */

/* Dark Mode */
--oklch-error: oklch(60% 0.24 25);     /* Enhanced saturation */
```

**Use Cases**:
- Error messages
- Destructive actions
- Failed states
- Critical alerts

**Color-Blind Safe**: ✅ Warmer hue + higher saturation distinguishes from success

### Info (Sky Blue)

**Hue**: 230° (blue)
**Contrast**: 5.12:1 (light) / 6.84:1 (dark)

```css
/* Light Mode */
--oklch-info: oklch(60% 0.15 230);     /* WCAG AA ✅ */

/* Dark Mode */
--oklch-info: oklch(65% 0.17 230);     /* Consistent with primary */
```

**Use Cases**:
- Info messages
- Tooltips
- Help text
- Informational badges

**Color-Blind Safe**: ✅ Cooler than primary, less saturated

---

## AI-Specific Colors

Specialized colors for chat interfaces with perceptually equal brightness.

### Assistant Messages

```css
/* Light Mode */
--ai-assistant: oklch(96% 0.02 220);
--ai-assistant-border: oklch(86% 0.02 220);
--ai-assistant-foreground: oklch(20% 0.02 220);

/* Dark Mode */
--ai-assistant: oklch(25% 0.04 220);
--ai-assistant-border: oklch(35% 0.04 220);
--ai-assistant-foreground: oklch(90% 0.02 220);
```

**Visual**: Light blue-gray background
**Perceived Brightness**: 96% (light) / 25% (dark)

### User Messages

```css
/* Light Mode */
--ai-user: oklch(92% 0.06 260);
--ai-user-border: oklch(82% 0.06 260);
--ai-user-foreground: oklch(20% 0.02 260);

/* Dark Mode */
--ai-user: oklch(30% 0.08 260);
--ai-user-border: oklch(40% 0.08 260);
--ai-user-foreground: oklch(95% 0.04 260);
```

**Visual**: Soft blue-purple background
**Perceived Brightness**: 92% (light) / 30% (dark)

### System Messages

```css
/* Light Mode */
--ai-system: oklch(95% 0.03 180);
--ai-system-border: oklch(85% 0.03 180);
--ai-system-foreground: oklch(20% 0.02 180);

/* Dark Mode */
--ai-system: oklch(22% 0.05 180);
--ai-system-border: oklch(32% 0.05 180);
--ai-system-foreground: oklch(90% 0.03 180);
```

**Visual**: Light cyan background
**Perceived Brightness**: 95% (light) / 22% (dark)

### Thinking States

```css
/* Light Mode */
--ai-thinking: oklch(94% 0.04 280);
--ai-thinking-border: oklch(84% 0.04 280);
--ai-thinking-foreground: oklch(30% 0.06 280);

/* Dark Mode */
--ai-thinking: oklch(28% 0.06 280);
--ai-thinking-border: oklch(38% 0.06 280);
--ai-thinking-foreground: oklch(85% 0.06 280);
```

**Visual**: Soft purple background
**Perceived Brightness**: 94% (light) / 28% (dark)

### Tool Execution

```css
/* Light Mode */
--ai-tool: oklch(93% 0.05 160);
--ai-tool-border: oklch(83% 0.05 160);
--ai-tool-foreground: oklch(25% 0.07 160);

/* Dark Mode */
--ai-tool: oklch(27% 0.07 160);
--ai-tool-border: oklch(37% 0.07 160);
--ai-tool-foreground: oklch(88% 0.07 160);
```

**Visual**: Soft green background
**Perceived Brightness**: 93% (light) / 27% (dark)

### Error States

```css
/* Light Mode */
--ai-error: oklch(91% 0.12 25);
--ai-error-border: oklch(81% 0.12 25);
--ai-error-foreground: oklch(30% 0.15 25);

/* Dark Mode */
--ai-error: oklch(35% 0.15 25);
--ai-error-border: oklch(45% 0.15 25);
--ai-error-foreground: oklch(90% 0.12 25);
```

**Visual**: Warm red background
**Perceived Brightness**: 91% (light) / 35% (dark)

---

## Neutral Colors (Grayscale)

Perceptually uniform gray scale with subtle cool tone (hue 265).

### Light Mode

| Shade | OKLCH Value | RGB Approx | Use Case |
|-------|-------------|------------|----------|
| 0 | `oklch(100% 0 0)` | #FFFFFF | Pure white |
| 50 | `oklch(98% 0.002 265)` | #FAFAFB | Off-white |
| 100 | `oklch(95% 0.005 265)` | #F1F2F4 | Very light bg |
| 200 | `oklch(90% 0.008 265)` | #E3E4E7 | Light bg |
| 300 | `oklch(85% 0.010 265)` | #D5D6D9 | Borders |
| 400 | `oklch(70% 0.012 265)` | #A8A9AD | Disabled |
| 500 | `oklch(55% 0.012 265)` | #7D7E82 | Muted text |
| 600 | `oklch(45% 0.010 265)` | #656669 | Secondary text |
| 700 | `oklch(35% 0.008 265)` | #4D4E51 | Dark text |
| 800 | `oklch(25% 0.006 265)` | #363739 | Very dark |
| 900 | `oklch(15% 0.004 265)` | #1F2021 | Primary text |
| 950 | `oklch(10% 0.002 265)` | #161617 | Almost black |
| 1000 | `oklch(0% 0 0)` | #000000 | Pure black |

### Dark Mode

| Shade | OKLCH Value | RGB Approx | Use Case |
|-------|-------------|------------|----------|
| 0 | `oklch(0% 0 0)` | #000000 | Pure black |
| 50 | `oklch(10% 0.002 265)` | #161617 | Near black |
| 100 | `oklch(15% 0.004 265)` | #1F2021 | Very dark bg |
| 200 | `oklch(20% 0.006 265)` | #292A2C | Dark bg |
| 300 | `oklch(28% 0.008 265)` | #3D3E40 | Borders |
| 400 | `oklch(40% 0.010 265)` | #5C5D60 | Disabled |
| 500 | `oklch(55% 0.012 265)` | #7D7E82 | Muted text |
| 600 | `oklch(65% 0.012 265)` | #9FA0A3 | Secondary text |
| 700 | `oklch(75% 0.010 265)` | #BABBBE | Light text |
| 800 | `oklch(85% 0.008 265)` | #D5D6D9 | Very light |
| 900 | `oklch(92% 0.004 265)` | #E9EAEC | Near white |
| 950 | `oklch(95% 0.002 265)` | #F1F2F4 | Almost white |
| 1000 | `oklch(100% 0 0)` | #FFFFFF | Pure white |

---

## Surface Colors

Background and container colors for different elevation levels.

### Light Mode

```css
--oklch-bg-primary: oklch(100% 0 0);        /* Pure white */
--oklch-bg-secondary: oklch(98% 0.002 265); /* Off-white */
--oklch-bg-tertiary: oklch(95% 0.005 265);  /* Light gray */
--oklch-bg-elevated: oklch(100% 0 0);       /* White (cards) */
--oklch-bg-overlay: oklch(0% 0 0);          /* Black (use with alpha) */
```

### Dark Mode

```css
--oklch-bg-primary: oklch(15% 0.004 265);   /* Dark background */
--oklch-bg-secondary: oklch(20% 0.006 265); /* Slightly lighter */
--oklch-bg-tertiary: oklch(25% 0.008 265);  /* Even lighter */
--oklch-bg-elevated: oklch(18% 0.005 265);  /* Cards */
--oklch-bg-overlay: oklch(0% 0 0);          /* Black (use with alpha) */
```

---

## Text Colors

### Light Mode

```css
--oklch-text-primary: oklch(15% 0.004 265);   /* WCAG AAA: 14.52:1 */
--oklch-text-secondary: oklch(45% 0.010 265); /* WCAG AA: 6.89:1 */
--oklch-text-tertiary: oklch(55% 0.012 265);  /* WCAG AA: 4.68:1 */
--oklch-text-disabled: oklch(70% 0.008 265);  /* Non-essential */
--oklch-text-inverse: oklch(100% 0 0);        /* White for dark bg */
```

### Dark Mode

```css
--oklch-text-primary: oklch(98% 0.002 265);   /* WCAG AAA: 15.89:1 */
--oklch-text-secondary: oklch(70% 0.010 265); /* WCAG AA: 7.42:1 */
--oklch-text-tertiary: oklch(55% 0.012 265);  /* WCAG AA: 4.89:1 */
--oklch-text-disabled: oklch(40% 0.008 265);  /* Non-essential */
--oklch-text-inverse: oklch(15% 0.004 265);   /* Dark for light bg */
```

---

## Border Colors

### Light Mode

```css
--oklch-border-light: oklch(90% 0.008 265);   /* Subtle borders */
--oklch-border-default: oklch(85% 0.010 265); /* Standard borders */
--oklch-border-strong: oklch(70% 0.012 265);  /* Emphasized borders */
--oklch-border-focus: oklch(60% 0.20 265);    /* Focus rings */
```

### Dark Mode

```css
--oklch-border-light: oklch(25% 0.008 265);   /* Subtle borders */
--oklch-border-default: oklch(35% 0.010 265); /* Standard borders */
--oklch-border-strong: oklch(50% 0.012 265);  /* Emphasized borders */
--oklch-border-focus: oklch(65% 0.22 265);    /* Focus rings */
```

---

## Usage Examples

### Buttons

```css
/* Primary button */
.btn-primary {
  background: oklch(var(--oklch-primary));
  color: oklch(var(--oklch-primary-foreground));
  border: 1px solid oklch(var(--oklch-primary));
}

.btn-primary:hover {
  background: oklch(55% 0.20 265);  /* Primary-600 */
}

/* Secondary button */
.btn-secondary {
  background: oklch(var(--oklch-bg-secondary));
  color: oklch(var(--oklch-text-primary));
  border: 1px solid oklch(var(--oklch-border-default));
}
```

### Messages

```css
/* Assistant message */
.message-assistant {
  background: oklch(var(--ai-assistant));
  border: 1px solid oklch(var(--ai-assistant-border));
  color: oklch(var(--ai-assistant-foreground));
}

/* User message */
.message-user {
  background: oklch(var(--ai-user));
  border: 1px solid oklch(var(--ai-user-border));
  color: oklch(var(--ai-user-foreground));
}
```

### Alerts

```css
/* Success alert */
.alert-success {
  background: oklch(55% 0.18 145 / 0.1);  /* 10% opacity */
  border: 1px solid oklch(var(--oklch-success));
  color: oklch(var(--oklch-success-foreground));
}

/* Error alert */
.alert-error {
  background: oklch(55% 0.22 25 / 0.1);
  border: 1px solid oklch(var(--oklch-error));
  color: oklch(var(--oklch-error-foreground));
}
```

---

## Color Manipulation

### Lightening

```css
/* Lighten by 10% */
oklch(60% 0.20 265)  →  oklch(70% 0.20 265)
```

### Darkening

```css
/* Darken by 10% */
oklch(60% 0.20 265)  →  oklch(50% 0.20 265)
```

### Increasing Saturation

```css
/* More saturated */
oklch(60% 0.20 265)  →  oklch(60% 0.25 265)
```

### Decreasing Saturation

```css
/* Less saturated */
oklch(60% 0.20 265)  →  oklch(60% 0.10 265)
```

### Adding Transparency

```css
/* 50% opacity */
oklch(60% 0.20 265 / 0.5)
```

---

## Testing Your Colors

### Contrast Checker

Use this formula to verify WCAG compliance:

```typescript
function contrastRatio(color1: OKLCH, color2: OKLCH): number {
  // Convert OKLCH to relative luminance
  const L1 = relativeLuminance(color1)
  const L2 = relativeLuminance(color2)

  // Calculate contrast ratio
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}
```

**WCAG Requirements**:
- **AA Large Text**: 3:1
- **AA Normal Text**: 4.5:1
- **AAA Large Text**: 4.5:1
- **AAA Normal Text**: 7:1

### Color-Blind Simulation

Test all semantic colors with these tools:
- [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [Sim Daltonism](https://michelf.ca/projects/sim-daltonism/)

---

**Last Updated**: January 28, 2026
**Maintained By**: UI/UX Design Team
**Next Review**: Q2 2026
