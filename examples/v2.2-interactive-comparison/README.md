# v2.2 Interactive Comparison Demo

**Side-by-side comparison tool for v2.1 vs v2.2 visual refinements**

---

## 🎯 Purpose

This interactive demo allows you to toggle between v2.1 and v2.2 styling to see the exact visual differences.

---

## 🚀 Quick Start

```bash
cd examples/v2.2-interactive-comparison
npm install
npm run dev
```

Open http://localhost:3000

---

## ✨ Features

### 1. Toggle View
Switch between v2.1 and v2.2 styling with one click to see differences.

### 2. Component Gallery
See all refined components side-by-side:
- Buttons (all variants)
- Inputs (all states)
- Cards (default and hoverable)
- Badges (all variants)
- Dialogs
- Chat components

### 3. Measurement Overlay
Shows exact measurements:
- Shadow opacity values
- Border widths
- Hover lift distances
- Focus ring widths
- Animation timings

### 4. Export Comparison
Export side-by-side screenshots for documentation or marketing.

---

## 🎨 What to Compare

### Shadow Differences
- **v2.1**: `rgba(0,0,0,0.05)` - Standard
- **v2.2**: `rgba(0,0,0,0.04)` - 20% softer

Toggle between them to see the whisper-soft difference.

### Border Differences
- **v2.1**: `border-2` (2px solid) or `border` (1px, 100% opacity)
- **v2.2**: `border` (1px at 40% opacity)

Notice how v2.2 borders are present but don't compete.

### Focus State Differences
- **v2.1**: Hard 2px ring
- **v2.2**: Soft 1px ring + outer glow

Tab through elements to feel the modern focus experience.

### Hover Differences
- **v2.1**: 2px lift (noticeable)
- **v2.2**: 1px lift (barely-there but satisfying)

Hover over buttons and cards to compare.

---

## 📊 Metrics Display

The demo shows exact measurements:

```
Button Shadow (Default):
v2.1: 0 1px 2px 0 rgba(0,0,0,0.05)
v2.2: 0 1px 2px rgba(0,0,0,0.04)
Reduction: 20%

Button Hover Lift:
v2.1: 2px
v2.2: 1px
Reduction: 50%

Input Border:
v2.1: 2px at 100% opacity
v2.2: 1px at 40% opacity
Weight Reduction: 84%

Focus Ring:
v2.1: 2px hard ring
v2.2: 1px soft ring + 3px glow
Modern: Yes ✨
```

---

## 🎯 Use Cases

### For Developers
- See exact visual changes before upgrading
- Understand the refinement philosophy
- Learn the new design patterns
- Verify in your context

### For Designers
- Compare design systems
- Learn premium UI patterns
- Understand subtle refinements
- Create mockups with confidence

### For Product Managers
- Show stakeholders the improvements
- Demonstrate value of upgrade
- Compare with competitors
- Make informed decisions

### For Marketing
- Create before/after screenshots
- Generate comparison graphics
- Build promotional materials
- Demonstrate quality improvement

---

## 💡 Interactive Features

### Slow Motion Mode
Slow down animations to 10x speed to see every detail of the refinement.

### Dark Mode Toggle
Compare v2.1 vs v2.2 in both light and dark modes.

### Measurement Tool
Click any element to see its exact shadow, border, and spacing values.

### Screenshot Export
Export high-quality comparison images for documentation.

---

## 🎨 Code Example

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'

export default function ComparisonDemo() {
  const [version, setVersion] = useState<'v2.1' | 'v2.2'>('v2.2')
  
  return (
    <div className="p-8">
      {/* Toggle */}
      <div className="mb-8">
        <Button onClick={() => setVersion(v => v === 'v2.1' ? 'v2.2' : 'v2.1')}>
          Currently viewing: {version}
        </Button>
      </div>
      
      {/* Component with conditional classes */}
      <div className={version === 'v2.1' ? 'v2-1-styles' : 'v2-2-styles'}>
        <Button>Compare Me</Button>
      </div>
    </div>
  )
}
```

---

## 📸 Export Options

### Screenshot Formats
- PNG (high quality)
- JPG (smaller size)
- SVG (vector, if applicable)

### Export Modes
- Single component
- Component grid
- Full page
- Custom selection

---

## 🎯 Quick Comparison Checklist

Use this while exploring the demo:

- [ ] Button shadow is noticeably softer in v2.2
- [ ] Input border is much lighter in v2.2
- [ ] Focus states glow in v2.2 (vs hard ring in v2.1)
- [ ] Hover lift is more subtle in v2.2 (1px vs 2px)
- [ ] Badges have no border in v2.2
- [ ] Card borders are subtler in v2.2
- [ ] Dialog backdrop is lighter in v2.2
- [ ] Overall feel is more refined in v2.2

**If all checked:** You understand the v2.2 refinements! ✅

---

**Explore the demo to truly understand the v2.2 visual elevation!** 🎨
