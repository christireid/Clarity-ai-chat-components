# Documentation Implementation Guide

**For:** Developers working on Clarity Chat documentation  
**Purpose:** Quick reference for implementing documentation improvements

---

## Quick Reference

### Documentation Standards

- **Style Guide:** [`DOCUMENTATION_STYLE_GUIDE.md`](./DOCUMENTATION_STYLE_GUIDE.md)
- **Audit Results:** [`DOCUMENTATION_OVERHAUL_PHASE1_AUDIT.md`](./DOCUMENTATION_OVERHAUL_PHASE1_AUDIT.md)
- **Best Practices:** [`DOCUMENTATION_OVERHAUL_PHASE2_RESEARCH.md`](./DOCUMENTATION_OVERHAUL_PHASE2_RESEARCH.md)

### Key Principles

1. **Show, Don't Tell** - Examples first, theory second
2. **Progressive Disclosure** - Start simple, reveal complexity
3. **Copy-Paste Ready** - All examples should work immediately
4. **Consistent Structure** - Follow templates
5. **Clear, Direct, Friendly** - Write for busy engineers

---

## Writing New Documentation

### Step 1: Choose the Right Template

- **README** → Use README template from style guide
- **Guide** → Use Guide template
- **API Reference** → Use API Reference template
- **Storybook Story** → Use CSF3 format with tracks

### Step 2: Follow Structure

1. Brief description (2-3 sentences)
2. Quick example (if applicable)
3. Detailed explanation
4. More examples (progressive complexity)
5. Related links

### Step 3: Write Code Examples

```tsx
// ✅ Good Example
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

/**
 * Basic chat interface example
 * 
 * This example shows the minimal setup required.
 */
function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**Requirements:**
- ✅ Include imports
- ✅ Add comments explaining "why"
- ✅ Make it copy-pasteable
- ✅ Test that it works

### Step 4: Quality Check

Use the quality checklist from the style guide:

- [ ] Clear, concise writing
- [ ] No typos
- [ ] Consistent terminology
- [ ] Accurate information
- [ ] Up-to-date APIs
- [ ] Working code examples
- [ ] Proper structure
- [ ] Good linking

---

## Creating Storybook Stories

### Step 1: Choose the Track

- **Essentials** - Most common use cases (90% of users)
- **Enterprise** - Advanced patterns, production-ready
- **Composability** - Extending/customizing components
- **Performance** - Optimization examples

### Step 2: Use CSF3 Format

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@clarity-chat/react'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName/Essentials', // Use track in title
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Brief description and quick example`,
      },
    },
  },
  argTypes: {
    // Define all props with descriptions
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const BasicUsage: Story = {
  args: {
    // Props here
  },
  parameters: {
    docs: {
      description: {
        story: `Explanation of this specific example`,
      },
    },
  },
}
```

### Step 3: Add Multiple Examples

- Basic usage (most common)
- With common props
- Edge cases (error, loading, empty)
- Real-world scenarios

### Step 4: Add MDX Docs (Optional)

Create `.mdx` files for narrative documentation:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Components/ComponentName/Overview" />

# ComponentName

Brief overview of the component.

## When to Use

- Use case 1
- Use case 2

## Examples

See the stories below for working examples.
```

---

## Improving Existing Documentation

### Step 1: Assess Current State

- Read the existing doc
- Identify issues (structure, clarity, examples)
- Check if it follows the style guide
- Note missing information

### Step 2: Apply Improvements

1. **Structure** - Reorganize to match template
2. **Examples** - Add/improve code examples
3. **Clarity** - Rewrite unclear sections
4. **Completeness** - Add missing information
5. **Links** - Add cross-references

### Step 3: Update Related Docs

- Update links if structure changed
- Update related guides
- Update README if needed

---

## Common Patterns

### Pattern 1: Component Documentation

```markdown
# ComponentName

Brief description

## Import

\`\`\`tsx
import { ComponentName } from '@clarity-chat/react'
\`\`\`

## Basic Usage

\`\`\`tsx
// Example
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | `string` | - | Description |

## Examples

### Basic

\`\`\`tsx
// Example
\`\`\`

### Advanced

\`\`\`tsx
// Example
\`\`\`

## Related

- [Related Component](./related.md)
```

### Pattern 2: Hook Documentation

```markdown
# useHookName

Brief description

## Import

\`\`\`tsx
import { useHookName } from '@clarity-chat/react'
\`\`\`

## Basic Usage

\`\`\`tsx
// Example
\`\`\`

## Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| param1 | `string` | - | Description |

## Returns

| Value | Type | Description |
|-------|------|-------------|
| value1 | `string` | Description |

## Examples

### Basic

\`\`\`tsx
// Example
\`\`\`

## Related

- [Related Hook](./related.md)
```

### Pattern 3: Guide Documentation

```markdown
# Guide Title

Brief description (2-3 sentences)

## Overview

What this guide covers and who it's for

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## [Main Section]

Content here

## Examples

\`\`\`tsx
// Example
\`\`\`

## Next Steps

- [Related Guide](./related.md)
```

---

## Checklist for New Docs

### Before Writing

- [ ] Check if similar doc exists
- [ ] Review style guide
- [ ] Choose appropriate template
- [ ] Gather examples

### While Writing

- [ ] Follow template structure
- [ ] Use consistent terminology
- [ ] Add working code examples
- [ ] Include imports
- [ ] Add comments to code
- [ ] Link to related content

### After Writing

- [ ] Run quality checklist
- [ ] Test all code examples
- [ ] Check spelling/grammar
- [ ] Verify links work
- [ ] Get review (if needed)
- [ ] Update related docs

---

## Troubleshooting

### Issue: Code example doesn't work

**Solution:**
1. Test the example yourself
2. Check imports
3. Verify API hasn't changed
4. Add missing setup steps

### Issue: Documentation is inconsistent

**Solution:**
1. Review style guide
2. Check similar docs for patterns
3. Apply template consistently
4. Update related docs

### Issue: Too much/little information

**Solution:**
1. Use progressive disclosure
2. Split into multiple pages if too long
3. Add examples if too short
4. Link to detailed docs

---

## Resources

- [Style Guide](./DOCUMENTATION_STYLE_GUIDE.md)
- [Phase 1 Audit](./DOCUMENTATION_OVERHAUL_PHASE1_AUDIT.md)
- [Phase 2 Research](./DOCUMENTATION_OVERHAUL_PHASE2_RESEARCH.md)
- [Choose Your Path](./docs/choose-your-path.md)

---

**Last Updated:** [Date]  
**Version:** 1.0
