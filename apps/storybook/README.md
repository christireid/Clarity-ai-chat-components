# Clarity Chat Storybook

Interactive component documentation and development environment for Clarity Chat.

[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA-green?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build static Storybook site
npm run build-storybook

# Run interaction tests
npm run test-storybook
```

Visit [http://localhost:6006](http://localhost:6006) to view Storybook.

---

## 📚 What's Included

### **100+ Stories** across categories:

- **Components** (95% coverage)
  - Chat components (Message, ChatInput, ChatWindow)
  - Token optimization (Panel, Badge, Dashboard)
  - Enterprise (SSO, Seat Management)
  - UI primitives (Button, Dialog, Input, etc.)

- **Hooks** (85% coverage)
  - Chat hooks (useChat, useStreaming)
  - Streaming (useStreamingSSE, useErrorRecovery)
  - UI hooks (useToggle, useClipboard)
  - Performance (useDebounce, useThrottle)

- **Utilities** (100% documented)
  - Token estimation
  - ID generation
  - Async helpers
  - Format utilities

- **Documentation**
  - Getting Started guide
  - SDK & Adapter documentation
  - Accessibility guidelines
  - Component examples

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
│   ├── preview.tsx      # Global decorators, parameters
│   └── manager-head.html # Custom head content
├── stories/
│   ├── Components/      # Component stories
│   ├── Hooks/          # Hook stories
│   ├── Primitives/     # Primitive component stories
│   ├── *.interactions.stories.tsx  # Interaction tests
│   └── *.mdx           # Documentation pages
└── public/             # Static assets
```

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

3. See [STORYBOOK_DEVELOPER_GUIDE.md](../../STORYBOOK_DEVELOPER_GUIDE.md) for detailed instructions.

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

Current Storybook coverage:

| Category | Files | Coverage | Status |
|----------|-------|----------|--------|
| Components | 70+ | 95% | ✅ Excellent |
| Hooks | 40+ | 85% | ✅ Good |
| Utilities | 20+ | 100% | ✅ Complete |
| **Overall** | **130+** | **93%** | **✅ Excellent** |

Run coverage check:

```bash
node scripts/storybook-coverage-check.js
node scripts/storybook-coverage-check.js --verbose
```

---

## ♿ Accessibility

All components meet WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Color contrast (4.5:1+)
- ✅ Focus management
- ✅ Semantic HTML

The `@storybook/addon-a11y` automatically checks for violations. View results in the "Accessibility" panel.

### Testing with Screen Readers

- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (Cmd+F5)
- **Mobile**: VoiceOver (iOS), TalkBack (Android)

---

## 🎨 Theming

Use the theme toolbar to switch between:

- **Mode**: System / Light / Dark
- **Preset**: Multiple color schemes

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

### Guides

- [Developer Guide](../../STORYBOOK_DEVELOPER_GUIDE.md) - Complete guide for contributors
- [Quick Reference](../../STORYBOOK_QUICK_REFERENCE.md) - Cheat sheet for common patterns
- [Enhancement Summary](../../STORYBOOK_ENHANCEMENT_COMPLETE.md) - Project overview
- [Interaction Tests](../../STORYBOOK_INTERACTION_TESTS_SUMMARY.md) - Testing guide
- [Accessibility Audit](../../STORYBOOK_ACCESSIBILITY_AUDIT.md) - A11y compliance report

### In-Storybook Docs

Navigate to the "Docs" tab in Storybook to read:
- Getting Started
- Component Gallery
- SDK & Adapters
- Utilities Overview
- Design Principles
- Accessibility Guide

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
- [Developer Guide](../../STORYBOOK_DEVELOPER_GUIDE.md)
- [Quick Reference](../../STORYBOOK_QUICK_REFERENCE.md)

### External

- [Storybook Documentation](https://storybook.js.org/docs)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 🤝 Contributing

1. Read the [Developer Guide](../../STORYBOOK_DEVELOPER_GUIDE.md)
2. Create a new branch
3. Add your stories following CSF3 format
4. Add interaction tests
5. Verify accessibility
6. Submit a pull request

---

## 📊 Statistics

- **Total Stories**: 100+
- **Test Stories**: 23
- **Test Steps**: ~90
- **Components**: 70+ (95% coverage)
- **Hooks**: 40+ (85% coverage)
- **Utilities**: 20+ (100% documented)
- **Accessibility**: WCAG 2.1 AA ✅
- **TypeScript**: 100%

---

## 🏆 Quality

- ✅ **CSF3 Format**: Modern component story format
- ✅ **TypeScript**: Full type safety
- ✅ **Tested**: Automated interaction tests
- ✅ **Accessible**: WCAG 2.1 Level AA compliant
- ✅ **Documented**: Comprehensive documentation
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

For questions or issues, please open an issue on [GitHub](https://github.com/christireid/Clarity-ai-chat-components/issues).
