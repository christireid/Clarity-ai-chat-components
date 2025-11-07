# Dependencies Update for v2.1

**New dependencies required for blueprint features**

---

## 📦 Package Updates

### For packages/react/package.json

Add these to your `dependencies` section:

```json
{
  "dependencies": {
    // Existing dependencies...
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.263.1",
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "remark-gfm": "^4.0.0",
    "tailwind-merge": "^2.2.0",
    
    // NEW for v2.1 - Virtual Scrolling
    "react-window": "^1.8.10",
    "react-virtualized-auto-sizer": "^1.0.24",
    
    // NEW for v2.1 - LaTeX/Math Rendering
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "katex": "^0.16.9",
    
    // NEW for v2.1 - Advanced Export (batch export)
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    // Add type definitions
    "@types/react-window": "^1.8.8"
  }
}
```

---

## 📝 Installation Commands

### Install All at Once

```bash
cd /workspace/packages/react
npm install --save \
  react-window@^1.8.10 \
  react-virtualized-auto-sizer@^1.0.24 \
  remark-math@^6.0.0 \
  rehype-katex@^7.0.0 \
  katex@^0.16.9 \
  jszip@^3.10.1

npm install --save-dev @types/react-window@^1.8.8
```

### Or Install Per Feature

**Virtual Scrolling Only:**
```bash
npm install react-window react-virtualized-auto-sizer
npm install --save-dev @types/react-window
```

**LaTeX Rendering Only:**
```bash
npm install remark-math rehype-katex katex
```

**Advanced Export Only:**
```bash
npm install jszip
```

---

## 📊 Bundle Size Impact

### Before v2.1

```
@clarity-chat/react: ~120 KB (gzipped)
```

### After v2.1 (all features)

```
@clarity-chat/react: ~135 KB (gzipped)

Breakdown:
- react-window: +8 KB
- katex: +5 KB
- jszip: +2 KB
Total increase: +15 KB (12.5%)
```

### Tree-Shaking (if only importing specific features)

```typescript
// Import only what you need - tree-shaking will optimize
import { MessageList } from '@clarity-chat/react'
// Only adds ~8 KB for virtual scrolling

import { MarkdownRendererEnhanced } from '@clarity-chat/react'
// Only adds ~5 KB for LaTeX

// Bundle stays small if you don't import unused features
```

---

## 🔧 Peer Dependencies

These should already be installed (required by v2.0):

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

No changes to peer dependencies in v2.1.

---

## 🎯 Optional Dependencies

### For Development/Testing

```bash
# Performance testing
npm install --save-dev \
  @vitest/coverage-v8 \
  @vitest/ui

# Visual regression testing
npm install --save-dev \
  @chromatic-com/storybook \
  chromatic

# Accessibility testing
npm install --save-dev \
  @axe-core/playwright \
  lighthouse
```

### For Examples

If you're building the example apps:

```bash
# For Next.js examples
cd examples/complete-features-demo
npm install next@15 react@18 react-dom@18
```

---

## ⚠️ Version Compatibility

### Node.js

```
Minimum: Node 18+
Recommended: Node 20+
```

### React

```
Minimum: React 18.0.0
Recommended: React 18.2.0+
```

### TypeScript

```
Minimum: TypeScript 5.0
Recommended: TypeScript 5.3+
```

---

## 🧪 Verify Installation

After installing, verify everything works:

```bash
# Build the package
npm run build

# Run tests
npm test

# Check bundle size
npm run size

# Type check
npm run typecheck
```

---

## 📝 Update Your package.json

### Complete Example

Here's a complete `packages/react/package.json` with all dependencies:

```json
{
  "name": "@clarity-chat/react",
  "version": "2.1.0",
  "description": "React components for Clarity Chat - 100% Blueprint Coverage",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "size": "size-limit"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.263.1",
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "remark-gfm": "^4.0.0",
    "tailwind-merge": "^2.2.0",
    "react-window": "^1.8.10",
    "react-virtualized-auto-sizer": "^1.0.24",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "katex": "^0.16.9",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/react-window": "^1.8.8",
    "@vitejs/plugin-react": "^5.0.4",
    "@vitest/coverage-v8": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "happy-dom": "^20.0.7",
    "jsdom": "^27.0.1",
    "size-limit": "^11.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.3",
    "vitest": "^3.2.4"
  },
  "size-limit": [
    {
      "name": "Full Bundle (ESM)",
      "path": "dist/index.mjs",
      "limit": "150 KB",
      "gzip": true
    },
    {
      "name": "Virtual Scrolling Only",
      "path": "dist/index.mjs",
      "import": "{ MessageList }",
      "limit": "40 KB",
      "gzip": true
    },
    {
      "name": "LaTeX Renderer Only",
      "path": "dist/index.mjs",
      "import": "{ MarkdownRendererEnhanced }",
      "limit": "35 KB",
      "gzip": true
    }
  ]
}
```

---

## 🚀 Post-Installation

After installing dependencies:

1. **Update Exports**
   ```bash
   # Add new components to src/index.ts
   code packages/react/src/index.ts
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Test**
   ```bash
   npm test
   ```

4. **Verify Bundle Size**
   ```bash
   npm run size
   ```

---

## 💡 Pro Tips

### Tip 1: Lazy Load Heavy Dependencies

If bundle size is a concern, lazy load features:

```typescript
// Lazy load virtual scrolling
const VirtualizedMessageList = lazy(() => 
  import('./components/virtualized-message-list').then(m => ({ 
    default: m.VirtualizedMessageList 
  }))
)

// Lazy load LaTeX
const MarkdownRendererEnhanced = lazy(() =>
  import('./components/markdown-renderer-enhanced').then(m => ({
    default: m.MarkdownRendererEnhanced
  }))
)
```

### Tip 2: CDN for KaTeX

Reduce bundle size by loading KaTeX from CDN:

```html
<!-- In your HTML head -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
  integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
  crossorigin="anonymous"
>
```

Then remove from package.json and imports.

### Tip 3: Conditional Dependencies

Install dependencies only when needed:

```json
{
  "optionalDependencies": {
    "katex": "^0.16.9",
    "jszip": "^3.10.1"
  }
}
```

---

## 📞 Troubleshooting

### Issue: npm install fails

**Solution:** Clear cache and retry:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Type errors after install

**Solution:** Restart TypeScript server:
```bash
# VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"
# Or delete and regenerate types
rm -rf dist
npm run build
```

### Issue: Bundle size too large

**Solution:** Check what's included:
```bash
npm run size:why
# Or use bundle analyzer
npx vite-bundle-visualizer
```

---

## ✅ Verification Checklist

- [ ] All dependencies installed
- [ ] No npm warnings or errors
- [ ] Build completes successfully
- [ ] Tests pass
- [ ] Bundle size within limits (< 150 KB)
- [ ] TypeScript types available
- [ ] Examples can import new features

---

**All set! Your dependencies are ready for v2.1 features.** 🚀
