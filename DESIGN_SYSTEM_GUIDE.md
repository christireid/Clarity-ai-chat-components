# Clarity Chat Components - Design System Guide

## 🎨 Ant Design-Inspired Design System

**Last Updated**: November 3, 2025  
**Version**: 1.0.0

---

## Overview

This design system brings Ant Design's polished aesthetic to the Clarity Chat Components library. Our approach emphasizes:

- **Clarity**: Enhanced visual hierarchy with better shadows and borders
- **Efficiency**: Smooth transitions and hover states for better feedback
- **Elegance**: Refined spacing, rounded corners, and subtle animations
- **Accessibility**: WCAG AAA compliant focus states and interactions

---

## Design Tokens

### Border Widths
```css
border-1  /* Previous: 1px - Basic borders */
border-2  /* New Default: 2px - Enhanced definition */
```

**Usage**:
- Default borders: `border-2`
- Subtle dividers: `border` (1px)
- Emphasis borders: `border-2`

### Border Radius
```css
rounded-sm   /* 0.125rem (2px) - Minimal rounding */
rounded-md   /* 0.375rem (6px) - Moderate */
rounded-lg   /* 0.5rem (8px) - Standard (buttons, inputs) */
rounded-xl   /* 0.75rem (12px) - Cards, containers */
rounded-2xl  /* 1rem (16px) - Dialogs, drawers */
rounded-full /* 9999px - Pills, avatars, badges */
```

**Usage**:
- Buttons: `rounded-lg`
- Cards: `rounded-xl`
- Modals/Dialogs: `rounded-2xl`
- Badges: `rounded-full`
- Avatars: `rounded-full`

### Shadow System

#### Level 1: Subtle (sm)
```css
shadow-sm
/* 0 1px 2px 0 rgba(0,0,0,0.05) */
```
**Use for**: Inputs, badges, small UI elements

#### Level 2: Raised (md)
```css
shadow-md
/* 0 4px 6px -1px rgba(0,0,0,0.1) */
```
**Use for**: Buttons on hover, cards on hover

#### Level 3: Floating (lg)
```css
shadow-lg
/* 0 10px 15px -3px rgba(0,0,0,0.1) */
```
**Use for**: Popovers, dropdowns, context menus

#### Level 4: Elevated (xl)
```css
shadow-xl
/* 0 20px 25px -5px rgba(0,0,0,0.1) */
```
**Use for**: Dialogs, command palette

#### Level 5: Maximum (2xl)
```css
shadow-2xl
/* 0 25px 50px -12px rgba(0,0,0,0.25) */
```
**Use for**: Drawers, full-screen overlays

### Transitions

#### Standard Transition
```css
transition-all duration-200
```
**Timing**: 200ms for all properties  
**Easing**: Default cubic-bezier (ease)

#### Use Cases
- Hover states
- Focus states
- Color changes
- Size changes
- Transform changes

### Hover Effects

#### Lift Effect
```css
hover:-translate-y-0.5 hover:shadow-md
```
**Use for**: 
- Primary buttons
- Secondary buttons
- Interactive cards
- Clickable elements

#### Subtle Hover
```css
hover:shadow-sm
```
**Use for**:
- Ghost buttons
- Outline buttons
- List items

### Backdrop Blur

```css
backdrop-blur-sm  /* 4px - Subtle */
backdrop-blur-md  /* 12px - Standard */
backdrop-blur-lg  /* 16px - Strong */
```

**Usage**:
- Dialog overlays: `backdrop-blur-md`
- Drawer overlays: `backdrop-blur-md`
- Popover backgrounds: `backdrop-blur-sm`
- Chat input: `backdrop-blur-sm`

---

## Component Specifications

### Button

**Default State**:
```tsx
className="rounded-lg shadow-sm hover:-translate-y-0.5 hover:shadow-md"
```

**Variants**:
- `default`: Primary action, lift on hover, shadow-md
- `secondary`: Secondary action, lift on hover
- `outline`: border-2, subtle hover
- `ghost`: No border, subtle hover
- `destructive`: Red theme, lift on hover
- `success`: Green theme, lift on hover

**Sizes**:
- `sm`: h-8, px-3, text-xs
- `default`: h-10, px-4, py-2
- `lg`: h-12, px-8, text-base
- `icon`: h-10, w-10

### Input

**Default State**:
```tsx
className="rounded-lg border-2 hover:border-input/80 focus:border-primary focus:shadow-sm"
```

**Sizes**:
- `sm`: h-8, px-2, text-xs
- `default`: h-10, px-3
- `lg`: h-12, text-base

**States**:
- Default: border-input
- Focus: border-primary with shadow-sm
- Error: border-destructive
- Success: border-green-500
- Disabled: bg-muted, opacity-50

### Card

**Default State**:
```tsx
className="rounded-xl border-2 shadow-sm"
```

**Variants**:
- `bordered`: With border (default: true)
- `hoverable`: Lift effect + shadow-md on hover

**Sub-components**:
- `CardHeader`: px-6, py-5, border-b
- `CardTitle`: text-lg, font-semibold
- `CardDescription`: text-sm, text-muted-foreground
- `CardContent`: px-6, pt-0
- `CardFooter`: px-6, pt-0

### Badge

**Default State**:
```tsx
className="rounded-full border px-2.5 py-0.5 shadow-sm hover:shadow"
```

**Variants**:
- `default`: bg-primary/90, shadow-sm
- `secondary`: bg-secondary
- `destructive`: bg-destructive/90
- `outline`: border-2, transparent bg
- `success`: bg-green-500, shadow-green-500/20
- `warning`: bg-yellow-500, shadow-yellow-500/20
- `info`: bg-blue-500, shadow-blue-500/20

### Dialog

**Container**:
```tsx
className="rounded-2xl border-2 shadow-2xl"
```

**Backdrop**:
```tsx
className="bg-black/60 backdrop-blur-md"
```

**Sizes**:
- `sm`: max-w-sm
- `md`: max-w-md
- `lg`: max-w-lg
- `xl`: max-w-xl
- `full`: max-w-full

### Drawer

**Container**:
```tsx
className="border-2 shadow-2xl rounded-{edge}-2xl"
```
- Left drawer: `rounded-r-2xl`
- Right drawer: `rounded-l-2xl`
- Top drawer: `rounded-b-2xl`
- Bottom drawer: `rounded-t-2xl`

### Avatar

**Default State**:
```tsx
className="rounded-full border-2 border-background shadow-sm"
```

**Fallback**:
```tsx
className="bg-gradient-to-br from-primary/20 to-primary/40"
```

**Status Indicator**:
- Online: Pulsing green dot
- Offline: Gray dot
- Away: Yellow dot
- Busy: Red dot

### Empty State

**Icon Container**:
```tsx
className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm border border-primary/10"
```

**Typography**:
- Title: text-xl, font-semibold
- Description: text-base, text-muted-foreground, leading-relaxed

---

## Animation Guidelines

### Hover Animations
```tsx
// Lift effect
hover:-translate-y-0.5 
transition-all duration-200

// Shadow enhancement
hover:shadow-md
```

### Focus Animations
```tsx
// Focus ring
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2

// Input focus
focus:border-primary 
focus:shadow-sm
```

### State Transitions
```tsx
// Scale down on click
active:translate-y-0 
active:shadow-sm

// Fade in
animate-in fade-in-0 zoom-in-95
```

---

## Color Usage

### Primary Colors
- **Primary**: Main brand color for CTAs
- **Secondary**: Supporting actions
- **Accent**: Hover states and highlights

### Semantic Colors
- **Success**: Green-500 with shadow-green-500/20
- **Warning**: Yellow-500 with shadow-yellow-500/20
- **Error/Destructive**: Red/Destructive with shadow
- **Info**: Blue-500 with shadow-blue-500/20

### Background Colors
- **Background**: Main background (bg-background)
- **Card**: Elevated surface (bg-card)
- **Muted**: Subtle background (bg-muted)
- **Accent**: Interactive hover (bg-accent)

---

## Spacing Scale

### Padding
```css
p-2   /* 0.5rem (8px) - Compact */
p-3   /* 0.75rem (12px) - Comfortable */
p-4   /* 1rem (16px) - Standard */
p-5   /* 1.25rem (20px) - Spacious */
p-6   /* 1.5rem (24px) - Extra spacious */
```

### Gap
```css
gap-1   /* 0.25rem (4px) - Tight */
gap-2   /* 0.5rem (8px) - Standard */
gap-3   /* 0.75rem (12px) - Comfortable */
gap-4   /* 1rem (16px) - Spacious */
```

---

## Accessibility Standards

### Focus Indicators
All interactive elements must have visible focus states:
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### Color Contrast
- **Text on Background**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1 (WCAG AA)
- **Interactive Elements**: Minimum 3:1 for all states

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows visual hierarchy
- Escape closes overlays
- Enter/Space activates buttons

---

## Best Practices

### When to Use Shadows

✅ **DO USE**:
- On hover for interactive elements
- To show elevated state
- To distinguish layers (dialog over page)
- For depth hierarchy

❌ **DON'T USE**:
- On every element (visual noise)
- Without hover states on interactive elements
- When flat design is more appropriate

### When to Use Hover Effects

✅ **DO USE**:
- Buttons and CTAs
- Cards and list items
- Interactive elements
- Clickable areas

❌ **DON'T USE**:
- On static text
- On disabled elements
- On non-interactive decorative elements

### When to Use Backdrop Blur

✅ **DO USE**:
- Modal overlays
- Drawer backgrounds
- Sticky headers
- Floating panels

❌ **DON'T USE**:
- On solid backgrounds
- When performance is critical
- On static content areas

---

## Migration from Previous Version

### Border Changes
```tsx
// Before
<Card className="border rounded-lg" />

// After  
<Card className="border-2 rounded-xl" />
```

### Button Changes
```tsx
// Before
<Button className="rounded-md shadow" />

// After
<Button className="rounded-lg shadow-sm hover:-translate-y-0.5 hover:shadow-md" />
```

### Input Changes
```tsx
// Before
<Input className="border rounded-md" />

// After
<Input className="border-2 rounded-lg hover:border-input/80 focus:shadow-sm" />
```

### Dialog Changes
```tsx
// Before
<Dialog>
  <DialogContent className="rounded-lg border shadow-xl" />
</Dialog>

// After
<Dialog>
  <DialogContent className="rounded-2xl border-2 shadow-2xl backdrop-blur-md" />
</Dialog>
```

---

## Component Examples

### Primary Button
```tsx
<Button 
  variant="default" 
  className="shadow-sm hover:-translate-y-0.5 hover:shadow-md"
>
  Click Me
</Button>
```

### Interactive Card
```tsx
<Card 
  hoverable 
  className="rounded-xl border-2 hover:shadow-lg hover:-translate-y-0.5"
>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Enhanced Input
```tsx
<Input 
  placeholder="Type here..." 
  className="rounded-lg border-2 focus:border-primary focus:shadow-sm"
/>
```

### Badge with Shadow
```tsx
<Badge variant="success" className="shadow-sm hover:shadow-green-500/20">
  Active
</Badge>
```

---

## Performance Considerations

### Shadow Performance
- Shadows use GPU compositing
- Multiple shadows may impact low-end devices
- Use `will-change: transform` sparingly

### Transition Performance
- All transitions use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, or `top/left`
- Use `motion.div` from Framer Motion for complex animations

### Backdrop Blur
- May impact performance on older browsers
- Fallback to solid colors on unsupported browsers
- Test on target devices

---

## Browser Support

### Full Support
✅ Chrome/Edge 92+
✅ Firefox 103+
✅ Safari 15.4+

### Partial Support
⚠️ Older browsers may not support:
- Backdrop blur effects
- Some shadow effects
- Complex transforms

### Fallbacks
All components degrade gracefully:
- Backdrop blur → Solid background
- Shadows → Border emphasis
- Transforms → Static positioning

---

## Dark Mode Considerations

### Shadows in Dark Mode
Shadows are automatically adjusted in dark mode:
- Lighter shadow colors
- Reduced opacity
- Better contrast against dark backgrounds

### Colors in Dark Mode
All semantic colors have dark mode variants:
- Success: Brighter greens
- Error: Softer reds
- Warning: Adjusted yellows
- Info: Enhanced blues

---

## Customization

### Overriding Defaults

#### Custom Shadow
```tsx
<Button className="shadow-none hover:shadow-lg">
  Custom Shadow
</Button>
```

#### Custom Border Radius
```tsx
<Card className="rounded-3xl">
  Extra Rounded Card
</Card>
```

#### Disable Hover Effects
```tsx
<Button className="hover:translate-y-0 hover:shadow-sm">
  No Lift
</Button>
```

---

## Testing Checklist

### Visual Testing
- [ ] Hover states work correctly
- [ ] Shadows render properly
- [ ] Borders have correct width
- [ ] Rounded corners look smooth
- [ ] Transitions are smooth

### Accessibility Testing
- [ ] Focus visible on all interactive elements
- [ ] Tab navigation works properly
- [ ] Color contrast meets WCAG AA
- [ ] Screen readers announce correctly
- [ ] Keyboard shortcuts work

### Performance Testing
- [ ] No layout shifts on hover
- [ ] Smooth 60fps animations
- [ ] Fast paint times
- [ ] Low memory usage

### Cross-Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## Component Status

| Component | UI Enhanced | Build Status | Lint Status |
|-----------|-------------|--------------|-------------|
| Button | ✅ | ✅ | ✅ |
| Input | ✅ | ✅ | ✅ |
| Card | ✅ | ✅ | ✅ |
| Badge | ✅ | ✅ | ✅ |
| Avatar | ✅ | ✅ | ✅ |
| Textarea | ✅ | ✅ | ✅ |
| Dialog | ✅ | ✅ | ✅ |
| Drawer | ✅ | ✅ | ✅ |
| Popover | ✅ | ✅ | ✅ |
| Tooltip | ✅ | ✅ | ✅ |
| Scroll Area | ✅ | ✅ | ✅ |
| Chat Input | ✅ | ✅ | ✅ |
| Message | ✅ | ✅ | ✅ |
| Empty State | ✅ | ✅ | ✅ |
| Streaming Message | ✅ | ✅ | ✅ |
| Command Palette | ✅ | ✅ | ✅ |
| Context Menu | ✅ | ✅ | ✅ |
| Toast | ✅ | ✅ | ✅ |
| Citation Card | ✅ | ✅ | ✅ |
| Tool Invocation Card | ✅ | ✅ | ✅ |
| Context Card | ✅ | ✅ | ✅ |
| Interactive Card | ✅ | ✅ | ✅ |
| Progress | ✅ | ✅ | ✅ |
| Skeleton | ✅ | ✅ | ✅ |
| Feedback Animation | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ |
| Retry Button | ✅ | ✅ | ✅ |

**Total**: 27 components | **All Enhanced**: ✅

---

## Design Decision Log

### Why border-2?
Provides better definition without being too heavy. Creates clear visual boundaries that work in both light and dark modes.

### Why rounded-xl for cards?
Softer than rounded-lg but not as extreme as rounded-2xl. Creates a modern, friendly appearance while maintaining professionalism.

### Why hover:-translate-y-0.5?
Subtle lift effect provides tactile feedback without being distracting. 0.5px is the sweet spot for perceived interaction.

### Why backdrop-blur-md?
Medium blur (12px) provides good depth separation while maintaining readability of content behind overlays.

### Why transition-all duration-200?
200ms is fast enough to feel instant but slow enough to be perceived. Matches human reaction time for optimal UX.

---

## Future Roadmap

### Phase 1 (Complete) ✅
- [x] Apply Ant Design principles to all components
- [x] Implement shadow hierarchy
- [x] Add hover effects
- [x] Enhance borders and corners

### Phase 2 (Future)
- [ ] Dark mode color refinements
- [ ] Reduced motion preferences
- [ ] Custom theme builder
- [ ] Animation presets

### Phase 3 (Future)
- [ ] Component composition patterns
- [ ] Advanced interaction states
- [ ] Micro-interactions library
- [ ] Performance optimizations

---

## Resources

### Design Inspiration
- [Ant Design](https://ant.design/)
- [Tailwind UI](https://tailwindui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Implementation
- Tailwind CSS for utility classes
- Framer Motion for animations
- Radix UI for accessible primitives
- CVA (Class Variance Authority) for variants

---

## Support

### Questions?
- Check the component documentation
- Review Storybook examples
- Refer to TROUBLESHOOTING.md

### Issues?
- File a GitHub issue
- Include component name and reproduction steps
- Provide browser/device information

---

**Design System Version**: 1.0.0  
**Last Updated**: November 3, 2025  
**Maintained by**: Clarity Chat Team  
**License**: MIT

