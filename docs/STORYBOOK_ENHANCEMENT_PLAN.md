# Storybook Enhancement Plan

## Current State Analysis

### ✅ What's Already Great

**Configuration (main.ts):**
- ✅ Storybook 8 with React + Vite
- ✅ Good addon selection:
  - addon-links
  - addon-essentials (critical addons bundled)
  - addon-interactions (play functions)
  - addon-a11y (accessibility testing)
  - addon-measure & addon-outline (design tools)
- ✅ Autodocs enabled with 'tag'
- ✅ TypeScript with react-docgen-typescript
- ✅ Smart prop filtering (excludes node_modules except @clarity-chat)
- ✅ Proper workspace aliasing
- ✅ Telemetry disabled
- ✅ Story store JSON enabled

**Configuration (preview.tsx):**
- ✅ ThemeProvider integration
- ✅ Dynamic theme switching (light/dark/system)
- ✅ Multiple theme presets
- ✅ Comprehensive story sorting
- ✅ Accessibility config with specific rules
- ✅ Controls expanded by default
- ✅ Proper viewport presets
- ✅ Background options
- ✅ Locale switcher (i18n ready)
- ✅ Table of contents for docs
- ✅ Source code visible

**Story Coverage:**
- ✅ 100+ story files
- ✅ Comprehensive component coverage
- ✅ Complex examples (hooks, templates, composite)

---

## Recommended Enhancements

### 1. Essential Addons (Missing)

#### A. `@storybook/addon-designs` ⭐⭐⭐
**Priority: High**
**Purpose:** Embed Figma designs, Sketch files, or images alongside stories

```bash
npm install @storybook/addon-designs
```

Benefits:
- Design-dev parity
- Visual reference for implementation
- Easier design reviews

#### B. `@storybook/addon-coverage` ⭐⭐⭐
**Priority: High**
**Purpose:** Code coverage reporting from interaction tests

```bash
npm install @storybook/addon-coverage
```

Benefits:
- Track test coverage
- Identify untested code
- CI/CD integration

#### C. `@chromatic-com/storybook` ⭐⭐
**Priority: Medium**
**Purpose:** Visual regression testing

```bash
npm install @chromatic-com/storybook
```

Benefits:
- Catch visual bugs
- Review UI changes
- Automated visual testing

#### D. `@storybook/addon-performance` ⭐⭐
**Priority: Medium**
**Purpose:** Performance monitoring for stories

```bash
npm install storybook-addon-performance
```

Benefits:
- Identify slow renders
- Track component performance
- Optimize React components

#### E. `@storybook/addon-storysource` ⭐
**Priority: Low (already have source in docs)**
**Purpose:** Show story source code

---

### 2. Story Pattern Improvements

#### A. Add Play Functions for Interactive Stories

**Current:** Basic stories
**Enhanced:** Interactive testing with play functions

```typescript
// Example: ChatInput.stories.tsx
import { expect, userEvent, within } from '@storybook/test'

export const UserTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type a message...')

    await userEvent.type(input, 'Hello, world!')
    await expect(input).toHaveValue('Hello, world!')

    const sendButton = canvas.getByRole('button', { name: /send/i })
    await userEvent.click(sendButton)
  }
}
```

#### B. Add Visual Regression Tests

Using `@chromatic-com/storybook`:

```typescript
export const Default: Story = {
  parameters: {
    chromatic: {
      viewports: [320, 768, 1200],
      delay: 300,
    },
  },
}
```

#### C. Enhance Args Tables

```typescript
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'The visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
        category: 'Appearance',
      },
    },
  },
} satisfies Meta<typeof Button>
```

#### D. Add Component Composition Examples

```typescript
// Show how components work together
export const CompleteChat: Story = {
  render: () => (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <MessageList messages={sampleMessages} />
      <ChatInput onSend={action('send')} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
```

---

### 3. Documentation Enhancements

#### A. Add MDX Documentation Pages

Create comprehensive guides:

```mdx
<!-- stories/getting-started.mdx -->
import { Meta } from '@storybook/blocks'

<Meta title="Getting Started/Installation" />

# Installing Clarity Chat

Quick start guide for adding Clarity Chat to your project.

## Installation

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { ChatWindow } from '@clarity-chat/react'

function App() {
  return <ChatWindow messages={[]} />
}
\`\`\`
```

#### B. Add Design Tokens Documentation

```mdx
<!-- stories/design-system/tokens.mdx -->
# Design Tokens

Color palette, spacing, typography definitions.

import { ColorPalette, ColorItem } from '@storybook/blocks'

<ColorPalette>
  <ColorItem
    title="Primary"
    subtitle="Main brand color"
    colors={{ primary: '#3b82f6' }}
  />
</ColorPalette>
```

#### C. Add Component Status Badges

```typescript
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs', 'stable'], // or 'beta', 'deprecated', 'experimental'
  parameters: {
    status: {
      type: 'stable',
    },
    docs: {
      description: {
        component: 'A flexible button component with multiple variants and sizes.',
      },
    },
  },
}
```

---

### 4. Testing & Quality

#### A. Interaction Testing Setup

```typescript
// .storybook/preview.tsx
export const preview: Preview = {
  parameters: {
    // ... existing
    test: {
      dangerouslyIgnoreUnhandledErrors: false,
      clearMocks: true,
    },
  },
}
```

#### B. Accessibility Testing Improvements

```typescript
// Add more comprehensive a11y checks
export const AccessibleButton: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'landmark-one-main', enabled: true },
          { id: 'region', enabled: true },
        ],
      },
    },
  },
}
```

#### C. Performance Monitoring

```typescript
export const HeavyList: Story = {
  parameters: {
    performance: {
      allowedGroups: ['client'],
      interactions: [
        {
          name: 'Render 100 items',
          run: async ({ mount }) => {
            const component = await mount()
            // measure render time
          },
        },
      ],
    },
  },
}
```

---

### 5. Build & Deployment Improvements

#### A. Optimize Build Configuration

```typescript
// .storybook/main.ts
export default {
  // ... existing
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../vite.config.ts',
      },
    },
    disableTelemetry: true,
    enableCrashReports: false,
  },

  build: {
    test: {
      disabledAddons: [
        '@storybook/addon-docs',
        '@storybook/addon-essentials/docs',
      ],
    },
  },
}
```

#### B. Static Build Optimization

```json
// package.json
{
  "scripts": {
    "build-storybook": "storybook build --webpack-stats-json",
    "build:storybook:analyze": "npx webpack-bundle-analyzer ./storybook-static/webpack-stats.json"
  }
}
```

#### C. Add Storybook Manager Configuration

```typescript
// .storybook/manager.ts
import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

addons.setConfig({
  theme: themes.dark, // or custom theme
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
})
```

---

### 6. Developer Experience

#### A. Add Custom Toolbar Items

```typescript
// .storybook/preview.tsx
export const globalTypes = {
  // ... existing

  density: {
    name: 'Density',
    description: 'UI density setting',
    defaultValue: 'comfortable',
    toolbar: {
      icon: 'grid',
      items: [
        { value: 'compact', title: 'Compact' },
        { value: 'comfortable', title: 'Comfortable' },
        { value: 'spacious', title: 'Spacious' },
      ],
      dynamicTitle: true,
    },
  },
}
```

#### B. Add Story Parameters for Better Organization

```typescript
export const Default: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    pseudo: { hover: true }, // with addon-pseudo-states
    viewport: { defaultViewport: 'mobile' },
    design: {
      type: 'figma',
      url: 'https://figma.com/file/...',
    },
  },
}
```

#### C. Add Story Actions for Events

```typescript
import { action } from '@storybook/addon-actions'

export const Interactive: Story = {
  args: {
    onSend: action('message-sent'),
    onTyping: action('user-typing'),
    onFocus: action('input-focused'),
  },
}
```

---

### 7. Advanced Features

#### A. Component Variants Matrix

Generate all prop combinations automatically:

```typescript
import { generateCombinations } from '@storybook/test'

export const AllVariants: Story = {
  render: () => {
    const variants = ['primary', 'secondary', 'outline']
    const sizes = ['sm', 'md', 'lg']

    return (
      <div className="grid grid-cols-3 gap-4">
        {variants.map(variant =>
          sizes.map(size => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))
        )}
      </div>
    )
  },
}
```

#### B. Dark Mode Testing

```typescript
export const DarkModeTest: Story = {
  decorators: [
    (Story) => (
      <>
        <div className="light bg-white p-8">
          <Story />
        </div>
        <div className="dark bg-gray-900 p-8">
          <Story />
        </div>
      </>
    ),
  ],
}
```

#### C. Responsive Testing Grid

```typescript
export const ResponsiveGrid: Story = {
  render: () => (
    <div className="space-y-8">
      {['mobile', 'tablet', 'desktop'].map(viewport => (
        <div key={viewport}>
          <h3>{viewport}</h3>
          <div style={{ width: viewportSizes[viewport] }}>
            <ChatWindow />
          </div>
        </div>
      ))}
    </div>
  ),
}
```

---

## Implementation Checklist

### Phase 1: Essential Improvements (Week 1)
- [ ] Install recommended addons
- [ ] Add manager.ts configuration
- [ ] Create MDX documentation pages
- [ ] Add component status badges

### Phase 2: Story Enhancements (Week 2)
- [ ] Add play functions to interactive stories
- [ ] Enhance args tables with descriptions
- [ ] Add composition examples
- [ ] Add visual regression test parameters

### Phase 3: Testing & Quality (Week 3)
- [ ] Set up interaction testing
- [ ] Add comprehensive a11y tests
- [ ] Add performance monitoring
- [ ] Set up coverage reporting

### Phase 4: Documentation (Week 4)
- [ ] Create getting started guides
- [ ] Document design tokens
- [ ] Add component usage examples
- [ ] Create best practices guides

### Phase 5: Polish & Deploy (Week 5)
- [ ] Optimize build configuration
- [ ] Add custom toolbar items
- [ ] Create variants matrix stories
- [ ] Set up automated deployment

---

## Recommended Addon Configuration

```typescript
// .storybook/main.ts (enhanced)
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-a11y',
  '@storybook/addon-measure',
  '@storybook/addon-outline',

  // New additions
  '@storybook/addon-designs',
  '@storybook/addon-coverage',
  '@chromatic-com/storybook',
  'storybook-addon-performance',
  'storybook-addon-pseudo-states',
  '@storybook/addon-storysource',
  '@storybook/addon-viewport',
  '@storybook/addon-themes',
],
```

---

## Success Metrics

### Quality
- [ ] 100% component coverage
- [ ] 80%+ code coverage from interaction tests
- [ ] Zero critical a11y violations
- [ ] All components have play functions

### Documentation
- [ ] Every component has MDX docs
- [ ] Design tokens documented
- [ ] Getting started guide
- [ ] Migration guides

### Performance
- [ ] Build time < 3 minutes
- [ ] Story render time < 100ms average
- [ ] Bundle size < 5MB

### Developer Experience
- [ ] Hot reload < 1 second
- [ ] Easy to find components
- [ ] Clear prop documentation
- [ ] Working code examples

---

## Next Steps

1. Review and approve plan
2. Install essential addons
3. Create sample enhanced stories
4. Rollout enhancements gradually
5. Train team on new features

---

**Status:** 📋 Ready for Implementation
**Estimated Timeline:** 5 weeks
**Priority:** High - Storybook is public-facing

