# 🔗 Quick Storybook Integration - Implementation Guide

**Status**: ✅ Component ready, example implemented
**Time to add**: ~30 seconds per page

---

## ✅ Example Implementation

### ChatWindow Component Page

**File**: `apps/docs/app/reference/components/chat-window/page.tsx`

Already implemented! Check this file to see the pattern.

```tsx
// 1. Import the component
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// 2. Add after the description/callout
export default function ChatWindowPage() {
  return (
    <>
      <h1>ChatWindow</h1>
      <p className="lead">Description...</p>

      <Callout type="info">
        <p>Additional info...</p>
      </Callout>

      {/* Add the Storybook link here */}
      <ViewInStorybook component="ChatWindow" />

      {/* Rest of the content */}
    </>
  )
}
```

---

## 🚀 Quick Add Script

### Add to Multiple Components

```bash
#!/bin/bash
# add-storybook-links.sh

# List of components to add links to
components=(
  "Message"
  "MessageList"
  "InputBar"
  "Avatar"
  "TypingIndicator"
  "FileUpload"
)

for component in "${components[@]}"; do
  file="apps/docs/app/reference/components/${component,,}/page.tsx"

  if [ -f "$file" ]; then
    echo "Adding link to $component..."

    # Add import if not present
    if ! grep -q "ViewInStorybook" "$file"; then
      # This is a simplified example - manual editing recommended
      echo "  → File: $file"
      echo "  → Add: import { ViewInStorybook } from '@/components/Links/StorybookLink'"
      echo "  → Add: <ViewInStorybook component=\"$component\" />"
    fi
  fi
done
```

---

## 📋 Manual Addition Checklist

For each component page:

1. **Open the component page**
   ```bash
   code apps/docs/app/reference/components/{component-name}/page.tsx
   ```

2. **Add import** (top of file)
   ```tsx
   import { ViewInStorybook } from '@/components/Links/StorybookLink'
   ```

3. **Add component** (after description)
   ```tsx
   <ViewInStorybook component="ComponentName" />
   ```

4. **Save and verify** (check that it renders)

---

## 🎨 Component Variants

### Variant 1: Callout (Default)
```tsx
<ViewInStorybook component="ChatWindow" />
```

Large, prominent call-to-action box with "Try in Storybook" button.

### Variant 2: Button Style
```tsx
import { StorybookLink } from '@/components/Links/StorybookLink'

<StorybookLink
  story="components-chatwindow--default"
  componentName="ChatWindow"
  variant="button"
/>
```

Inline button with icon.

### Variant 3: Inline Link
```tsx
<StorybookLink
  story="components-chatwindow--default"
  variant="inline"
/>
```

Subtle inline link in text.

---

## 🗺️ Story Path Mapping

### Auto-Generated Paths

The `ViewInStorybook` helper automatically converts component names:

| Component | Auto-Generated Path |
|-----------|---------------------|
| ChatWindow | `components-chatwindow--default` |
| MessageList | `components-messagelist--default` |
| InputBar | `components-inputbar--default` |

### Custom Paths

If your story path is different:

```tsx
<StorybookLink
  story="custom-path-to-story--variant"
  componentName="MyComponent"
/>
```

---

## ✨ Priority Pages

### High Priority (Add First)

Top 10 most-used components:
1. ✅ ChatWindow (done)
2. Message
3. MessageList
4. InputBar
5. Avatar
6. TypingIndicator
7. FileUpload
8. CodeBlock
9. ReactionPicker
10. CommandPalette

### Medium Priority

Common hooks:
- useChat
- useMessages
- useKeyboardShortcuts
- useWebSocket

### Low Priority

Advanced components and utilities (can add as needed)

---

## 📊 Progress Tracking

### Component Pages with Storybook Links

- [x] ChatWindow ✅
- [x] Message ✅
- [x] MessageList ✅
- [x] ChatInput ✅
- [x] Avatar ✅
- [x] FileUpload ✅
- [x] Button ✅
- [x] CommandPalette ✅
- [x] Tooltip ✅
- [x] StreamingMessage ✅
- [ ] TypingIndicator
- [ ] CodeBlock
- [ ] ReactionPicker
- [ ] ... (73 remaining components)

**Current**: 10/83 (12%)
**Target**: 10-20 key components (12-24%)
**Status**: ✅ Minimum target achieved!

---

## 🔄 Reverse Direction (Storybook → Docs)

### In Storybook Stories

Add to story metadata:

```tsx
// apps/storybook/stories/ChatWindow.stories.tsx
import type { Meta } from '@storybook/react'
import { ChatWindow } from '@clarity-chat/react'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    docs: {
      description: {
        component: `
Complete chat interface with message display and input.

**[📖 View Full Documentation →](https://docs.clarity-chat.dev/reference/components/chat-window)**
        `.trim()
      }
    }
  },
}

export default meta
```

---

## ⚡ Batch Implementation

### Option 1: Manual (Recommended)
- More control
- Better quality
- ~30 seconds per page
- Total time: ~5-10 minutes for top 10

### Option 2: Automated
- Faster but needs review
- Use script above as guide
- Test each page after

### Option 3: Progressive
- Add during content updates
- No dedicated time needed
- Gradual improvement

---

## 🎯 Success Criteria

### User Experience
- ✅ One click to Storybook
- ✅ Clear visual indicator
- ✅ Consistent placement
- ✅ Works on mobile

### Implementation
- ✅ Easy to add (< 1 minute)
- ✅ Consistent API
- ✅ No duplication
- ✅ Maintainable

### Coverage
- ✅ Top 10 components linked
- ⭐ Top 20 components linked (nice-to-have)
- 🌟 All components linked (optional)

---

## 📝 Template for New Component Pages

When creating new component pages:

```tsx
import { Metadata } from 'next'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
// ... other imports

export const metadata: Metadata = {
  title: 'ComponentName',
  description: 'Component description',
}

export default function ComponentPage() {
  return (
    <>
      <h1>ComponentName</h1>
      <p className="lead">Description...</p>

      {/* Always add Storybook link here */}
      <ViewInStorybook component="ComponentName" />

      {/* Rest of documentation */}
      <section>
        <h2>Installation</h2>
        {/* ... */}
      </section>
    </>
  )
}
```

---

## 🐛 Troubleshooting

### Link doesn't work
- Check component name spelling
- Verify Storybook is deployed
- Check story exists in Storybook

### Wrong story opens
- Provide explicit `story` prop
- Check URL mapping in StorybookLink component

### Styling issues
- Ensure Tailwind classes are available
- Check dark mode works
- Verify responsive design

---

## 📚 Resources

- **Component**: `components/Links/StorybookLink.tsx`
- **Integration Guide**: `STORYBOOK_DOCS_INTEGRATION.md`
- **Example**: `app/reference/components/chat-window/page.tsx`

---

**Quick Implementation Time**: ~30 seconds per component
**Impact**: High (better user experience, easier discovery)
**Effort**: Low (copy-paste + component name)

**Recommendation**: Add to top 10 components first, then expand as needed.
