# Clarity Chat Storybook

> Comprehensive component documentation, pattern library, and development environment for Clarity
> Chat

[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA-green?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)

### CI Status

[![Chromatic](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/chromatic.yml/badge.svg)](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/chromatic.yml)
[![Accessibility](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/accessibility.yml/badge.svg)](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/accessibility.yml)
[![CI](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/ci.yml/badge.svg)](https://github.com/christireid/Clarity-ai-chat-components/actions/workflows/ci.yml)

---

## 🎉 What's New

The Storybook has been completely redesigned with major improvements:

- ✨ **145 Pages** of comprehensive documentation (123 stories + 22 overviews)
- 📚 **20 Documented Patterns** with best practices and working examples
- 🎨 **11 Professional Themes** (WCAG AA compliant)
- 🗂️ **Clear 7-Section Organization** - Find any component in ≤3 clicks
- 🎯 **Interactive Examples** - Every component with live demos
- ⚡ **Zero Critical Errors** - Clean, production-ready codebase

---

## 🚀 Quick Start

```bash
# From monorepo root
cd apps/storybook

# Install dependencies (if not already installed)
pnpm install

# Start Storybook development server
pnpm dev

# Build static Storybook site
pnpm build

# Run interaction tests
pnpm test-storybook
```

Visit [http://localhost:6006](http://localhost:6006) to view Storybook.

**Pro Tip**: Use the theme switcher in the toolbar to explore all 11 professional theme presets!

---

## 📚 What's Inside

### **145 Total Pages** organized into 7 main sections:

#### 1. **Welcome** (4 pages)

- Introduction and overview
- What's new in the redesign
- Navigation guide
- Getting started

#### 2. **Foundation** (7 pages)

- Getting Started guide
- Design principles
- Color system and themes
- Typography system
- Layout & spacing
- Accessibility standards

#### 3. **Components** (60 pages: 55 stories + 5 overviews)

- **Chat** - Message, MessageList, ChatInput, ChatWindow
- **Streaming** - StreamingMessage, StreamBlock, Cancellation
- **Token Optimization** - Dashboard, Panel, Badge
- **Enterprise** - SSO, Seat Management, API Tokens
- **UI Primitives** - Button, Input, Dialog, Toast, etc.

#### 4. **Advanced Features** (37 pages: 32 stories + 5 overviews)

- **AI** - Agent systems, tool calling
- **Streaming** - Real-time responses, WebSocket
- **Memory** - Context management, persistence
- **RAG** - Document retrieval, citations
- **Enterprise** - Multi-tenancy, RBAC, audit logging

#### 5. **Hooks** (25 pages: 20 stories + 5 overviews)

- **Chat Hooks** - useChat, useChatCore, useMessageOperations
- **Streaming** - useStreaming, useStreamingSSE
- **Performance** - useDebounce, useThrottle, useSmartCache
- **UI Hooks** - useToggle, useClipboard, useMediaQuery
- **State Management** - useLocalStorage, useIndexedDB

#### 6. **Examples** (8 pages: 7 stories + 1 overview)

- Complete use cases and real-world implementations
- Multi-modal chat, model switching, virtualization
- Financial advisor, healthcare assistant demos

#### 7. **Patterns** (8 pages: 3 stories + 5 overviews) ⭐ NEW!

- **20 Documented Patterns** with best practices
- **Chat Patterns** - Multi-turn conversations, branching, threading
- **Form Patterns** - Multi-step forms, validation, auto-save
- **Layout Patterns** - Mobile-first, split-view, virtual scrolling
- **AI Patterns** - Streaming, token optimization, RAG integration

---

## 🎯 Features

### ✨ Interactive Demos

Every component includes live, interactive examples with real state management.

### 🧪 Automated Tests

23 interaction test stories with ~90 test steps verify component behavior.

### ♿ Accessibility

All components are WCAG 2.1 Level AA compliant with:

- Full keyboard navigation
- Screen reader support
- Proper ARIA attributes
- Color contrast (4.5:1+)

### 📖 Comprehensive Documentation

Each component includes:

- Clear descriptions
- Feature lists
- Use cases
- Code examples
- API references

### 🎨 Theme Support

Built-in theme switcher with multiple presets:

- System (auto)
- Light/Dark modes
- Custom color schemes

### 📱 Responsive

All stories tested across viewports:

- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Ultra-wide (1920px)

---

## 📁 Structure

```
apps/storybook/
├── .storybook/
│   ├── main.ts          # Storybook configuration
│   ├── preview.tsx      # Global decorators, parameters, themes
│   └── manager-head.html # Custom head content
├── stories/
│   ├── Welcome/         # (4 stories) Introduction & guides
│   ├── Foundation/      # (7 stories) Design system fundamentals
│   ├── Components/      # (55 stories + 5 overviews) UI components
│   ├── Advanced/        # (32 stories + 5 overviews) Advanced features
│   ├── Hooks/           # (20 stories + 5 overviews) React hooks
│   ├── Examples/        # (7 stories + 1 overview) Complete use cases
│   └── Patterns/        # (3 stories + 5 overviews) Best practices ⭐
│       ├── Chat/        # Multi-turn, branching, threading patterns
│       ├── Forms/       # Multi-step, validation patterns
│       ├── Layout/      # Responsive, mobile-first patterns
│       └── AI/          # Streaming, RAG, tool calling patterns
└── public/              # Static assets
```

**Total**: 123 stories + 22 overviews = **145 pages**

---

## 🛠️ Development

### Creating New Stories

1. Create a new file: `stories/ComponentName.stories.tsx`

2. Use the CSF3 template:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from '@clarity-chat/react'

const meta = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Component description',
      },
    },
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    prop: 'value',
  },
}
```

3. See the [Storybook Documentation](https://storybook.js.org/docs) for detailed instructions.

### Writing Interaction Tests

```typescript
import { within, userEvent, expect } from '@storybook/testing-library'

export const WithTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await expect(button).toHaveFocus()
  },
}
```

### Running Tests

```bash
# Run all interaction tests
npm run test-storybook

# Run specific story
npm run test-storybook -- --stories="Button/*"

# Run with coverage
npm run test-storybook -- --coverage
```

---

## 📊 Coverage

Current Storybook documentation coverage:

| Section     | Pages   | Coverage | Status           |
| ----------- | ------- | -------- | ---------------- |
| Welcome     | 4       | 100%     | ✅ Complete      |
| Foundation  | 7       | 100%     | ✅ Complete      |
| Components  | 60      | 95%      | ✅ Excellent     |
| Advanced    | 37      | 90%      | ✅ Excellent     |
| Hooks       | 25      | 85%      | ✅ Good          |
| Examples    | 8       | 100%     | ✅ Complete      |
| Patterns    | 8       | 100%     | ✅ Complete      |
| **Overall** | **145** | **95%**  | **✅ Excellent** |

All major components, hooks, and patterns are documented with working examples.

---

## ♿ Accessibility

All components meet WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Color contrast (4.5:1+)
- ✅ Focus management
- ✅ Semantic HTML

The `@storybook/addon-a11y` automatically checks for violations. View results in the "Accessibility"
panel.

### Testing with Screen Readers

- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (Cmd+F5)
- **Mobile**: VoiceOver (iOS), TalkBack (Android)

---

## 🎨 Theming

The Storybook includes **11 professional theme presets**, all WCAG AA compliant:

**Light Themes:**

- Professional Light (default)
- Healthcare Light
- Finance Light

**Dark Themes:**

- Professional Dark
- Healthcare Dark
- Finance Dark
- Midnight
- Cyberpunk
- Forest

**Neutral:**

- System (auto light/dark)
- Minimal Light

Use the theme switcher in the toolbar to explore all themes. All themes include:

- ✅ WCAG AA color contrast (4.5:1+)
- ✅ Accessible focus indicators
- ✅ Consistent spacing and typography
- ✅ Full component support

Themes are provided by `@clarity-chat/react/theme`.

---

## 🧪 Testing

### Interaction Tests

Automated tests verify:

- User interactions (click, type, keyboard)
- Component state changes
- Accessibility features
- Error handling

View test results in the "Interactions" panel.

### Visual Testing

For visual regression testing, consider integrating:

- [Chromatic](https://www.chromatic.com/)
- [Percy](https://percy.io/)
- [Applitools](https://applitools.com/)

---

## 📖 Documentation

### Navigation Guide

The Storybook is organized for easy navigation - **find any component in ≤3 clicks**:

1. **Start** → Main sections visible in sidebar
2. **Browse** → Section overview pages provide roadmap
3. **Explore** → Individual component/pattern documentation

**Quick Links by Use Case:**

- 🚀 **Getting Started** → Welcome → Getting Started
- 🎨 **Browse Components** → Components → Overview
- 📚 **Learn Patterns** → Patterns → Overview ⭐
- 🎯 **See Examples** → Examples → Overview
- 🔧 **Find Hooks** → Hooks → Overview
- 💡 **Advanced Features** → Advanced → Overview

### In-Storybook Guides

Navigate to overview pages for comprehensive guides:

- **Welcome/Getting-Started** - Quick start guide
- **Foundation/Design-Principles** - Design system fundamentals
- **Components/Overview** - All components catalog
- **Patterns/Overview** - Best practices library ⭐
- **Examples/Overview** - Real-world use cases

### External Resources

- [Storybook Documentation](https://storybook.js.org/docs) - Official Storybook docs
- [Clarity Chat Docs](../../apps/docs) - Full documentation site
- [Accessibility Guide](../../apps/docs/app/guides/accessibility) - A11y guidelines

---

## 🚢 Deployment

### Static Build

```bash
npm run build-storybook
```

Output is in `storybook-static/` directory.

### Deploy Options

- **Vercel**: `vercel deploy storybook-static`
- **Netlify**: Drag & drop `storybook-static` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Chromatic**: `npx chromatic --project-token=<token>`

---

## 🔧 Configuration

### Main Configuration (`main.ts`)

```typescript
export default {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
}
```

### Preview Configuration (`preview.tsx`)

Global decorators, parameters, and theme setup.

---

## 💡 Tips

### For Component Development

1. **Develop in Storybook**: Build components in isolation
2. **Test as You Go**: Add interaction tests while developing
3. **Think Accessibility**: Use semantic HTML and ARIA from the start
4. **Show All States**: Create stories for loading, error, disabled, etc.
5. **Real Data**: Use realistic mock data for better examples

### For Documentation

1. **Be Clear**: Write concise, helpful descriptions
2. **Show Examples**: Code examples are worth 1000 words
3. **List Features**: Bullet points make features scannable
4. **Explain When**: Describe when to use the component
5. **Link Resources**: Reference related docs and components

### For Testing

1. **User Perspective**: Test from the user's point of view
2. **Semantic Queries**: Use `getByRole`, not `getByTestId`
3. **Descriptive Steps**: Make test steps self-documenting
4. **Wait for Async**: Use `waitFor` for async operations
5. **Test Accessibility**: Verify ARIA and keyboard navigation

---

## 🐛 Troubleshooting

### Storybook won't start

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run storybook
```

### Stories not showing

- Check file naming: `*.stories.tsx`
- Verify `export default meta`
- Check console for errors

### Controls not working

- Add `tags: ['autodocs']`
- Verify TypeScript types are correct
- Add argTypes manually if needed

### Tests failing

- Increase timeout: `waitFor(() => {}, { timeout: 5000 })`
- Use `findBy` queries for async elements
- Check element exists before interacting

---

## 📚 Resources

### Internal

- [Project Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Storybook Documentation](https://storybook.js.org/docs)

### External

- [Storybook Documentation](https://storybook.js.org/docs)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 🤝 Contributing

1. Read the [Storybook Documentation](https://storybook.js.org/docs)
2. Create a new branch
3. Add your stories following CSF3 format
4. Add interaction tests
5. Verify accessibility
6. Submit a pull request

---

## 📊 Statistics

- **Total Pages**: 145 (123 stories + 22 overviews)
- **Sections**: 7 main sections
- **Documented Patterns**: 20 with best practices
- **Theme Presets**: 11 professional themes (WCAG AA)
- **Component Coverage**: 95%
- **Hook Coverage**: 85%
- **Pattern Coverage**: 100%
- **Accessibility**: WCAG 2.1 AA ✅
- **TypeScript**: 100%
- **Build Status**: Zero critical errors ✅

---

## 🏆 Quality

- ✅ **Well Organized**: 7-section hierarchy, find anything in ≤3 clicks
- ✅ **Pattern Library**: 20 documented patterns with best practices
- ✅ **CSF3 Format**: Modern component story format
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Accessible**: WCAG 2.1 Level AA compliant
- ✅ **Professional Themes**: 11 theme presets (WCAG AA)
- ✅ **Comprehensive**: 145 pages of documentation
- ✅ **Clean Build**: Zero critical errors
- ✅ **Maintained**: Regular updates and improvements

---

## 📜 License

See [LICENSE](../../LICENSE) for details.

---

## 🎉 Acknowledgments

Built with:

- [Storybook](https://storybook.js.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Testing Library](https://testing-library.com/)

---

**Happy Storybook Development!** 🎨

For questions or issues, please open an issue on
[GitHub](https://github.com/christireid/Clarity-ai-chat-components/issues).
