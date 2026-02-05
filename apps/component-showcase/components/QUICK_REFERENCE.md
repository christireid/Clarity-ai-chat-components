# Glassmorphism Components - Quick Reference

## Import

```tsx
import {
  GlassMessageBubble,
  GlassToolCard,
  GlassStatusBadge,
  GlassActionButton,
  GlassPanel,
  GlassInputContainer,
  GlassCard,
  GlassDivider,
  GlassIconContainer,
} from '@/components/glass-molecules'
```

## Component Quick Reference

### GlassMessageBubble

**When to use**: Chat message display

```tsx
<GlassMessageBubble variant="assistant" avatar={...} timestamp={...} actions={...}>
  Message content
</GlassMessageBubble>
```

**Variants**: `user` | `assistant` | `system`

---

### GlassToolCard

**When to use**: Tool/plugin execution display

```tsx
<GlassToolCard
  icon={Globe}
  title="web_search"
  status="running"
  duration="1.2s"
  badge={...}
/>
```

**Status**: `idle` | `running` | `completed` | `error`

---

### GlassStatusBadge

**When to use**: Status indicators, tags, labels

```tsx
<GlassStatusBadge variant="success" size="md" pulse icon={CheckCircle}>
  Online
</GlassStatusBadge>
```

**Variants**: `default` | `success` | `warning` | `error` | `info`
**Sizes**: `sm` | `md` | `lg`

---

### GlassActionButton

**When to use**: All interactive buttons

```tsx
<GlassActionButton variant="default" size="md" icon={Send} glow>
  Send
</GlassActionButton>
```

**Variants**: `default` | `subtle` | `strong` | `ghost`
**Sizes**: `sm` | `md` | `lg`

---

### GlassPanel

**When to use**: Content sections, containers

```tsx
<GlassPanel variant="default" padding="md" shadow="lg" glow>
  Content
</GlassPanel>
```

**Variants**: `default` | `subtle` | `strong`
**Padding**: `none` | `sm` | `md` | `lg`
**Shadow**: `none` | `sm` | `md` | `lg`

---

### GlassInputContainer

**When to use**: Wrapping form inputs

```tsx
<GlassInputContainer focused={isFocused} icon={<Search />} actions={...}>
  <Input />
</GlassInputContainer>
```

**Variants**: `default` | `subtle` | `strong`

---

### GlassCard

**When to use**: Complete card with header/footer

```tsx
<GlassCard header={...} footer={...}>
  Card content
</GlassCard>
```

---

### GlassDivider

**When to use**: Section separators

```tsx
<GlassDivider orientation="horizontal" variant="gradient" />
```

**Orientation**: `horizontal` | `vertical`
**Variants**: `solid` | `gradient`

---

### GlassIconContainer

**When to use**: Consistent icon display

```tsx
<GlassIconContainer icon={Brain} size="md" variant="primary" />
```

**Sizes**: `sm` | `md` | `lg`
**Variants**: `primary` | `success` | `warning` | `error` | `info`

---

## Common Patterns

### Chat Message
```tsx
<GlassMessageBubble
  variant="assistant"
  avatar={<Avatar />}
  actions={<MessageActions />}
>
  {content}
</GlassMessageBubble>
```

### Tool Execution
```tsx
<GlassToolCard
  icon={Terminal}
  title="tool_name"
  status="running"
  badge={<GlassStatusBadge variant="warning">Running</GlassStatusBadge>}
/>
```

### Status Indicator
```tsx
<GlassStatusBadge variant="success" pulse icon={CheckCircle}>
  Active
</GlassStatusBadge>
```

### Primary Action
```tsx
<GlassActionButton variant="strong" glow icon={Send}>
  Send
</GlassActionButton>
```

### Form Input
```tsx
<GlassInputContainer icon={<Search />} actions={<SendButton />}>
  <Input />
</GlassInputContainer>
```

### Content Card
```tsx
<GlassCard
  header={<Header />}
  footer={<Actions />}
>
  {content}
</GlassCard>
```

---

## Variant Guidelines

### Glass Intensity
- **subtle**: Background panels, secondary content
- **default**: Main content, primary containers
- **strong**: Important content, focused elements

### Status Colors
- **default**: Neutral, unknown state
- **success**: Completed, active, online
- **warning**: In progress, caution
- **error**: Failed, offline, critical
- **info**: Information, secondary status

### Button Styles
- **default**: Standard actions
- **subtle**: Secondary actions
- **strong**: Primary actions
- **ghost**: Tertiary actions, icon buttons

---

## Accessibility

All components include:
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ ARIA attributes where applicable
- ✅ Color contrast compliance
- ✅ Screen reader compatibility

---

## Performance Tips

1. **Avoid deep nesting** of glass effects
2. **Limit glow effects** to 2-3 per screen
3. **Use memo** for heavy children components
4. **Prefer callbacks** over inline functions
5. **Batch state updates** when possible

---

## Dark Mode

All components automatically support dark mode via CSS variables:
- No additional configuration needed
- Colors adjust automatically
- Test in both themes

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ backdrop-filter requires modern browsers
- ⚠️ Fallback: solid backgrounds in older browsers

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Glass effect not visible | Ensure parent has background |
| Component not responsive | Use max-width utilities |
| Dark mode not working | Check CSS variable setup |
| Icons not showing | Verify lucide-react import |
| Spacing issues | Use className for layout only |

---

## Examples Location

- **Full demos**: `/glass-demo` page
- **Usage examples**: `components/USAGE_EXAMPLES.tsx`
- **Documentation**: `components/GLASS_MOLECULES_README.md`

---

## Support

1. Check demo page: `/glass-demo`
2. Review examples: `USAGE_EXAMPLES.tsx`
3. Read docs: `GLASS_MOLECULES_README.md`
4. Check source: `components/glass-molecules.tsx`

---

## Version

Current version: 1.0.0
Last updated: 2024
