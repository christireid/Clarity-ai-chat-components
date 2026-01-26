# Storybook Configuration

This directory contains the Storybook configuration for Clarity Chat Components, including custom
addons for peer dependency testing and bundle size analysis.

## Overview

The Storybook setup includes:

1. **Custom Addons** - Specialized tools for development
2. **Peer Dependency Testing** - Simulate missing dependencies
3. **Bundle Size Display** - View component bundle sizes
4. **Accessibility Testing** - WCAG compliance checking
5. **Theme Preview** - Test all theme presets

## Directory Structure

```
.storybook/
├── addons/
│   ├── clarity-a11y/          # Custom accessibility addon
│   ├── peer-dependency-simulator/  # Test missing dependencies
│   └── bundle-size-display/   # View bundle sizes
├── blocks/                    # Custom doc blocks
├── main.ts                    # Main configuration
├── preview.tsx                # Preview configuration
├── manager.ts                 # Manager UI configuration
├── globals.css                # Global styles
└── README.md                  # This file
```

## Custom Addons

### 1. Peer Dependency Simulator

**Location:** `addons/peer-dependency-simulator/`

Allows testing component behavior when optional peer dependencies are missing.

#### Features

- Toggle any optional peer dependency on/off
- See real-time notifications when dependencies change
- View bundle size impact of each dependency
- Test fallback UIs and error handling

#### Usage

1. Click the **Package Icon** (📦) in the Storybook toolbar
2. Select an optional dependency to simulate as missing
3. Observe how components adapt with fallback UIs
4. Toggle back to restore functionality

#### Implementation

**register.tsx** - Toolbar UI and controls

- Lists all peer dependencies with sizes
- Shows required vs optional status
- Tracks which dependencies are "missing"
- Updates global state when toggled

**preview.tsx** - Preview decorator

- Intercepts module imports
- Shows warning banner when peers are missing
- Passes missing peer info to components

### 2. Bundle Size Display

**Location:** `addons/bundle-size-display/`

Shows bundle size information for components and their dependencies.

#### Features

- Component raw size and gzipped size
- Total size including dependencies
- Dependency breakdown with individual sizes
- Required vs optional dependency indicators
- Bundle optimization tips

#### Usage

1. Click the **Database Icon** (💾) in the Storybook toolbar
2. View the bundle size panel below the story
3. See total bundle size with all dependencies
4. Review individual dependency contributions

#### Bundle Size Data

The addon tracks bundle sizes for common component configurations:

- **ClarityChat**: 45KB (12KB gzipped)
  - Total with deps: ~285KB

- **ChatInput**: 8KB (2.5KB gzipped)
  - Total with deps: ~158KB

- **EnhancedMarkdownRenderer**: 25KB (7KB gzipped)
  - Total with deps: ~600KB (includes markdown ecosystem)

### 3. Clarity A11y Addon

**Location:** `addons/clarity-a11y/`

Custom accessibility testing addon built on @storybook/addon-a11y.

#### Features

- Real-time WCAG compliance checking
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility
- ARIA attribute validation

## Configuration Files

### main.ts

Main Storybook configuration:

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@vueless/storybook-dark-mode',
    '@storybook/addon-docs',
    './.storybook/addons/clarity-a11y/register.tsx',
    './.storybook/addons/peer-dependency-simulator/register.tsx',
    './.storybook/addons/bundle-size-display/register.tsx',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
```

**Key Features:**

- TypeScript story support
- MDX documentation pages
- Custom addon loading
- Vite-based build system
- Monorepo path resolution

### preview.tsx

Preview configuration with decorators:

```typescript
import { withReducedMotion } from './decorators/reduced-motion'
import { withTheme } from './decorators/theme'
import { withPeerDependencySimulation } from './addons/peer-dependency-simulator/preview'

export default {
  decorators: [withReducedMotion, withTheme, withPeerDependencySimulation],

  globalTypes: {
    reduceMotion: {
      /* ... */
    },
    themeMode: {
      /* ... */
    },
    themePreset: {
      /* ... */
    },
  },
}
```

**Decorators:**

1. **withReducedMotion** - Simulates prefers-reduced-motion
2. **withTheme** - Provides theme context
3. **withPeerDependencySimulation** - Tests missing dependencies

## Peer Dependencies in Storybook

Storybook has **all peer dependencies installed** to enable comprehensive testing.

### Required Peers (Always Installed)

```json
{
  "react": "^19.0.0",
  "framer-motion": "^12.23.25",
  "lucide-react": "^0.500.0",
  "zod": "^3.24.0"
}
```

### Optional Peers (Installed for Testing)

```json
{
  "flowtoken": "^1.0.40",
  "mermaid": "^11.0.0",
  "pdfjs-dist": "^4.0.0",
  "mammoth": "^1.8.0",
  "cohere-ai": "^7.0.0",
  "shiki": "^3.0.0",
  "jszip": "^3.10.0",
  "prismjs": "^1.30.0",
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "rehype-highlight": "^7.0.2"
}
```

## Testing Fallback UIs

### Story Structure

Stories demonstrating fallback behavior:

```typescript
// Foundation/FallbackBehavior.stories.tsx
export const PDFUploadFallback: Story = {
  render: () => <PDFFallbackDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Shows PDF upload fallback when pdfjs-dist is missing'
      }
    }
  }
}
```

### Testing Workflow

1. **Open a fallback story** (e.g., "Foundation/Fallback Behavior")
2. **Use the peer dependency simulator** to mark a dependency as missing
3. **Observe the component** adapt with appropriate fallback UI
4. **Check the console** for any warnings or errors
5. **Verify accessibility** of fallback messages
6. **Test interaction** with fallback UI elements

## Bundle Size Guidelines

### Size Budgets

- **Core component**: < 15KB (uncompressed)
- **With required peers**: < 300KB total
- **With markdown support**: < 500KB total
- **With document processing**: < 3MB total

### Optimization Tips

1. **Tree-shaking** - Only import what you use
2. **Code splitting** - Lazy load heavy features
3. **Optional peers** - Install only needed dependencies
4. **Dynamic imports** - Load on demand

## Development

### Running Storybook

```bash
# Start dev server
pnpm dev

# Build static site
pnpm build

# Preview built site
pnpm preview
```

### Adding a New Story

1. Create file in `stories/` directory:

   ```
   stories/Components/Chat/MyComponent.stories.tsx
   ```

2. Use the story template:

   ```typescript
   import type { Meta, StoryObj } from '@storybook/react'
   import { MyComponent } from '@clarity-chat/react'

   const meta: Meta<typeof MyComponent> = {
     title: 'Components/Chat/MyComponent',
     component: MyComponent,
     parameters: {
       docs: {
         description: {
           component: 'Description here',
         },
       },
     },
   }

   export default meta
   type Story = StoryObj<typeof MyComponent>

   export const Default: Story = {
     args: {
       // props here
     },
   }
   ```

3. Document peer requirements in story notes:
   ```typescript
   export const WithPDF: Story = {
     args: { enablePDF: true },
     parameters: {
       docs: {
         description: {
           story: 'Requires `pdfjs-dist` to be installed',
         },
       },
     },
   }
   ```

### Creating Custom Addons

1. Create addon directory:

   ```
   .storybook/addons/my-addon/
   ├── register.tsx  # Manager UI
   └── preview.tsx   # Preview decorator (optional)
   ```

2. Register in `main.ts`:

   ```typescript
   addons: ['./.storybook/addons/my-addon/register.tsx']
   ```

3. Add to preview if needed:

   ```typescript
   import { withMyAddon } from './addons/my-addon/preview'

   export default {
     decorators: [withMyAddon],
   }
   ```

## Visual Testing with Chromatic

### Setup

```bash
# Set Chromatic token
export CHROMATIC_PROJECT_TOKEN=your-token

# Run visual tests
pnpm chromatic
```

### Workflow

1. **Push changes** to create snapshots
2. **Review changes** in Chromatic UI
3. **Accept or reject** visual diffs
4. **Merge PR** when approved

## Accessibility Testing

### Automated Tests

- Color contrast ratios
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Screen reader support

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Ensure focus is visible
   - Test Escape key for modals

2. **Screen Reader**
   - Use VoiceOver (Mac) or NVDA (Windows)
   - Verify all content is announced
   - Check heading hierarchy

3. **Reduced Motion**
   - Toggle "Reduce Motion" in toolbar
   - Verify animations are minimal
   - Check transitions are instant

## Troubleshooting

### Module Resolution Errors

If imports fail, check `viteFinal` in `main.ts`:

```typescript
config.resolve.alias = [
  {
    find: '@clarity-chat/react',
    replacement: path.resolve(__dirname, '../../../packages/react/src/index.ts'),
  },
]
```

### Missing Dependencies

If a peer is missing in Storybook:

```bash
# Install from monorepo root
pnpm install --filter @clarity-chat/storybook
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf node_modules/.cache
pnpm build
```

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Creating Addons](https://storybook.js.org/docs/react/addons/writing-addons)
- [Accessibility Testing](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)

## Contributing

When adding new features:

1. Add stories demonstrating the feature
2. Document peer dependencies required
3. Show fallback behavior if applicable
4. Add bundle size information
5. Test with missing dependencies
6. Verify accessibility compliance

---

**Last Updated:** January 2026 **Version:** Storybook 8.6+
