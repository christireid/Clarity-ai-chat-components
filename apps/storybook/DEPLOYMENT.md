# 🎨 Storybook - Deployment Guide

**Purpose**: Component library showcase and interactive documentation
**Last Updated**: 2025-11-17

---

## 📦 What's Included

The Storybook contains:
- **70+ Component Stories** - All components with interactive controls
- **MDX Documentation** - Introduction, Getting Started, Design Principles, FAQ
- **Accessibility Testing** - Built-in a11y addon
- **Dark Mode** - Theme switcher
- **Interactive Controls** - Modify props in real-time
- **Responsive Preview** - Mobile/tablet/desktop views

---

## 🚀 Quick Deploy

### Option 1: Chromatic (Recommended for Storybook)

**Why Chromatic**:
- ✅ Built specifically for Storybook
- ✅ Visual regression testing
- ✅ Review changes before merging
- ✅ Free for open source
- ✅ Automatic deploys on PR

**Steps**:

1. **Sign up**: https://www.chromatic.com
2. **Install Chromatic**:
   ```bash
   npm install --save-dev chromatic
   ```

3. **Get Project Token** from Chromatic dashboard

4. **Add to package.json**:
   ```json
   {
     "scripts": {
       "chromatic": "chromatic --project-token=<your-token>"
     }
   }
   ```

5. **Deploy**:
   ```bash
   npm run chromatic
   ```

6. **Setup CI** (.github/workflows/chromatic.yml):
   ```yaml
   name: 'Chromatic'
   on: push

   jobs:
     chromatic:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
           with:
             fetch-depth: 0
         - uses: actions/setup-node@v4
           with:
             node-version: 18
         - run: npm ci
         - run: npm run chromatic
           env:
             CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
   ```

7. **Add secret**: GitHub → Settings → Secrets → CHROMATIC_PROJECT_TOKEN

**Result**: Storybook deployed to `https://[branch]--[project-id].chromatic.com`

---

### Option 2: Vercel

**Steps**:

1. **Build Storybook**:
   ```bash
   cd apps/storybook
   npm run build
   ```

2. **Deploy**:
   ```bash
   vercel --cwd apps/storybook ./storybook-static
   ```

3. **Or configure in vercel.json**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "storybook-static",
     "framework": null
   }
   ```

4. **Custom Domain** (optional):
   - storybook.clarity-chat.dev
   - components.clarity-chat.dev

---

### Option 3: Netlify

**Steps**:

1. **Create netlify.toml**:
   ```toml
   [build]
     base = "apps/storybook"
     publish = "storybook-static"
     command = "npm run build"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "SAMEORIGIN"
       X-Content-Type-Options = "nosniff"
   ```

2. **Deploy**:
   ```bash
   netlify deploy --dir=storybook-static --prod
   ```

3. **Or connect via Git** in Netlify dashboard

---

### Option 4: GitHub Pages

**Steps**:

1. **Add to package.json**:
   ```json
   {
     "scripts": {
       "deploy-storybook": "storybook build && npx storybook-to-ghpages"
     }
   }
   ```

2. **Install deployer**:
   ```bash
   npm install --save-dev @storybook/storybook-deployer
   ```

3. **Deploy**:
   ```bash
   npm run deploy-storybook
   ```

**Result**: Available at `https://[username].github.io/[repo]/`

---

## 🔧 Build & Test Locally

### Development

```bash
# From root
npm run storybook

# Or from storybook directory
cd apps/storybook
npm run dev
```

Runs at: `http://localhost:6006`

### Production Build

```bash
# Build static files
npm run build

# Preview built version
npx http-server storybook-static
```

### Test Build

Check that:
- [ ] All stories load without errors
- [ ] Controls work for all components
- [ ] Dark mode toggles correctly
- [ ] Accessibility tab shows no violations
- [ ] Responsive views work
- [ ] All MDX docs render correctly

---

## 🎨 Configuration

### Main Config

`apps/storybook/.storybook/main.ts`:
```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

### Preview Config

`apps/storybook/.storybook/preview.ts`:
```typescript
import type { Preview } from '@storybook/react'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
```

---

## 🔗 Cross-Linking with Docs

### Add "View in Storybook" Links to Docs

In component documentation pages:

```mdx
## Interactive Demo

<Callout type="info">
  **Try it out**: View this component in [Storybook](https://storybook.clarity-chat.dev/?path=/story/components-chatwindow--default) for interactive controls and live examples.
</Callout>
```

### Add "View Docs" Links from Storybook

In story files:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ChatWindow } from '@clarity-chat/react'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    docs: {
      description: {
        component: 'A complete chat interface with message display, input, and controls. [View full documentation →](https://docs.clarity-chat.dev/reference/components/chat-window)'
      }
    }
  }
}

export default meta
```

---

## 📊 Analytics (Optional)

### Add Google Analytics

```typescript
// .storybook/preview.ts
import { addons } from '@storybook/preview-api'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Google Analytics
  const script = document.createElement('script')
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date())
  gtag('config', 'G-XXXXXXXXXX')
}
```

---

## 🎯 Best Practices

### Story Organization

```
stories/
├── Introduction.mdx              # Homepage
├── GettingStarted.mdx           # Setup guide
├── DesignPrinciples.mdx         # Design system
├── Accessibility.mdx            # A11y guide
├── Components/
│   ├── ChatWindow.stories.tsx
│   ├── Message.stories.tsx
│   └── ...
├── Hooks/
│   ├── useChat.stories.tsx
│   └── ...
└── Examples/
    ├── BasicChat.stories.tsx
    └── ...
```

### Write Good Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ChatWindow } from '@clarity-chat/react'

// 1. Good meta configuration
const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'fullscreen', // or 'centered', 'padded'
    docs: {
      description: {
        component: 'Detailed description here'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    messages: { control: 'object' },
    onSendMessage: { action: 'sent' },
  }
}

export default meta
type Story = StoryObj<typeof ChatWindow>

// 2. Default story
export const Default: Story = {
  args: {
    messages: [],
    placeholder: 'Type a message...'
  }
}

// 3. Variants
export const WithMessages: Story = {
  args: {
    messages: [
      { id: '1', role: 'user', content: 'Hello!' },
      { id: '2', role: 'assistant', content: 'Hi there!' }
    ]
  }
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
}

export const Dark: Story = {
  ...Default,
  parameters: {
    backgrounds: { default: 'dark' }
  }
}
```

---

## 🧪 Testing

### Accessibility Testing

Built-in with `@storybook/addon-a11y`:

1. Open any story
2. Click "Accessibility" tab
3. Review violations
4. Fix issues
5. Repeat until 0 violations

### Visual Regression Testing (with Chromatic)

```bash
# Take snapshots
npm run chromatic

# Review changes in Chromatic UI
# Accept or reject visual changes
```

### Interaction Testing

```tsx
import { userEvent, within } from '@storybook/test'

export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox'), 'Hello!')
    await userEvent.click(canvas.getByRole('button', { name: /send/i }))

    // Assert message appears
    await canvas.findByText('Hello!')
  }
}
```

---

## 📋 Pre-Deployment Checklist

- [ ] All stories load without errors
- [ ] All components have at least 1 story
- [ ] Accessibility violations resolved
- [ ] Dark mode works on all stories
- [ ] Controls are properly configured
- [ ] Docs are written for complex components
- [ ] Introduction page is welcoming
- [ ] Getting Started guide is clear
- [ ] Design Principles are documented

---

## 🎉 Post-Deployment

### Share Your Storybook

- Add badge to README:
  ```markdown
  [![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.clarity-chat.dev)
  ```

- Link from docs site:
  - Header navigation → "Storybook"
  - Component pages → "View in Storybook"

### Monitor Usage

- Track with analytics
- Gather feedback
- Update stories based on user questions
- Add new stories for commonly requested features

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
**Fix**: Ensure `@clarity-chat/react` is built first
```bash
npm run build --workspace=@clarity-chat/react
npm run build --workspace=@clarity-chat/storybook
```

### Stories Don't Load

**Error**: Components not rendering
**Fix**: Check imports are correct, ensure CSS is loaded

### Dark Mode Not Working

**Fix**: Ensure `storybook-dark-mode` addon is installed and configured

---

## 🔗 Resources

- [Storybook Docs](https://storybook.js.org/docs)
- [Chromatic](https://www.chromatic.com/docs)
- [Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)

---

**Deployment Status**: Ready for Production ✅
**Recommended Platform**: Chromatic
**URL**: https://[project-id].chromatic.com
