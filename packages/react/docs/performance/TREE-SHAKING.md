# Tree-shaking Guide

This document explains how tree-shaking works with `@clarity-ai/react` and how to optimize your bundle sizes.

## What is Tree-shaking?

Tree-shaking is the process of eliminating unused code (dead code) from your production bundles. Modern bundlers analyze your imports and only include the code that's actually used in your application.

## Package Structure

`@clarity-ai/react` is optimized for tree-shaking with:

1. **ESM modules**: Published as ES modules for static analysis
2. **Named exports**: All exports are named, not default
3. **No side effects**: Marked with `"sideEffects": false`
4. **External peer dependencies**: React, icons, etc. are not bundled
5. **Modular architecture**: Components are independent modules

## Import Best Practices

### ✅ DO: Use Named Imports

```typescript
// Good: Only imports ChatInput and its dependencies
import { ChatInput } from '@clarity-ai/react';

// Good: Import multiple components
import { ChatInput, ClarityChat, FollowUpSuggestions } from '@clarity-ai/react';

// Good: Import utilities
import { sanitizeInput, formatTokenCount } from '@clarity-ai/react';
```

### ❌ DON'T: Use Namespace Imports

```typescript
// Bad: Imports everything, prevents tree-shaking
import * as Clarity from '@clarity-ai/react';

// Bad: Creates large bundles
const { ChatInput } = Clarity;
```

### ⚠️ AVOID: Dynamic Imports of Large Modules

```typescript
// Avoid unless code-splitting intentionally
const component = await import('@clarity-ai/react');
```

## Bundle Size Expectations

Based on tree-shaking tests with production builds (gzipped):

| Import Pattern | Expected Size | What's Included |
|----------------|---------------|-----------------|
| Single utility function | ~1-2 KB | Just the utility code |
| Single component | ~15-30 KB | Component + React + deps |
| Three components | ~20-50 KB | Components + shared deps |
| Hooks only | ~5-20 KB | Hook logic + minimal React |
| Full library | ~200-500 KB | Everything (not recommended) |

## Testing Tree-shaking

We provide comprehensive tree-shaking tests:

```bash
cd packages/react/scripts/tree-shaking-test
pnpm install
pnpm test
```

This generates:
- Bundle size comparisons
- Content analysis
- Tree-shaking effectiveness metrics
- Recommendations

## Bundler Configuration

### Rollup

```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    format: 'esm',
    dir: 'dist'
  },
  external: [
    'react',
    'react-dom',
    'lucide-react',
    'framer-motion'
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser({
      compress: {
        passes: 2,
        pure_getters: true
      }
    })
  ]
};
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lucide-react': 'LucideReact'
  },
  optimization: {
    usedExports: true,
    minimize: true,
    sideEffects: true
  }
};
```

### esbuild

```javascript
// build.js
require('esbuild').build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  treeShaking: true,
  format: 'esm',
  external: ['react', 'react-dom', 'lucide-react'],
  outfile: 'dist/bundle.js'
});
```

### Vite

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'lucide-react'],
      output: {
        manualChunks: undefined // Let Vite handle chunking
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2
      }
    }
  }
};
```

## Analyzing Your Bundle

### Using webpack-bundle-analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Using rollup-plugin-visualizer

```bash
npm install --save-dev rollup-plugin-visualizer
```

```javascript
// rollup.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
};
```

### Using source-map-explorer

```bash
npm install --save-dev source-map-explorer
```

```bash
# Generate and analyze
npm run build
source-map-explorer dist/bundle.js
```

## Common Issues

### Issue: Bundle includes unused components

**Cause**: Namespace import or barrel export issues

**Solution**:
```typescript
// Instead of:
import * as Clarity from '@clarity-ai/react';

// Use:
import { ChatInput } from '@clarity-ai/react';
```

### Issue: React is bundled instead of external

**Cause**: Not configured as external in bundler

**Solution**: Add to externals configuration:
```javascript
externals: {
  'react': 'React',
  'react-dom': 'ReactDOM'
}
```

### Issue: Large bundle despite importing one component

**Cause**: Component has heavy dependencies or circular deps

**Solutions**:
1. Check for circular dependencies
2. Ensure `sideEffects: false` in package.json
3. Verify bundler supports ESM tree-shaking
4. Use dynamic imports for code splitting

### Issue: Icons library fully bundled

**Cause**: Importing all icons

**Solution**:
```typescript
// Instead of:
import * as Icons from 'lucide-react';

// Use:
import { MessageCircle, Send } from 'lucide-react';
```

## Performance Monitoring

### Set Bundle Size Budgets

```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/bundle.js",
      "maxSize": "50 KB"
    }
  ]
}
```

### CI/CD Integration

We provide GitHub Actions workflow:

```yaml
# .github/workflows/tree-shaking.yml
name: Tree-shaking Tests
on: [pull_request]
jobs:
  tree-shaking:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test
      - run: node check-thresholds.js
```

### Continuous Monitoring

Track bundle sizes over time:

```bash
# Store baseline
npm run build
cp tree-shaking-report.json baseline.json

# After changes, compare
npm run build
node compare-reports.js baseline.json tree-shaking-report.json
```

## Optimization Checklist

- [ ] Use named imports, not namespace imports
- [ ] Configure peer dependencies as external
- [ ] Enable tree-shaking in bundler
- [ ] Use production mode builds
- [ ] Enable minification and compression
- [ ] Analyze bundle with visualizer
- [ ] Set and monitor bundle size budgets
- [ ] Use dynamic imports for large features
- [ ] Keep dependencies up to date
- [ ] Run tree-shaking tests regularly

## Code Splitting Strategies

### Route-based Splitting

```typescript
// React Router
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-based Splitting

```typescript
// Only load theme customizer when needed
const ThemeCustomizer = lazy(() =>
  import('@clarity-ai/react').then(m => ({ default: m.ThemeCustomizer }))
);

function Settings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeCustomizer />
    </Suspense>
  );
}
```

### Feature-based Splitting

```typescript
// Split heavy features
const VoiceInput = lazy(() =>
  import('@clarity-ai/react').then(m => ({ default: m.VoiceInput }))
);

const DocumentIntegration = lazy(() =>
  import('@clarity-ai/react').then(m => ({ default: m.DocumentIntegration }))
);
```

## Measuring Impact

### Before Optimization

```typescript
import * as Clarity from '@clarity-ai/react';
// Bundle: 450 KB (gzipped: 120 KB)
```

### After Optimization

```typescript
import { ChatInput, ClarityChat } from '@clarity-ai/react';
// Bundle: 95 KB (gzipped: 28 KB)
// Savings: 355 KB (76% reduction)
```

## Resources

- [Tree-shaking Test Suite](../../scripts/tree-shaking-test/README.md)
- [Bundle Size Guide](./bundle-size.md)
- [Import Patterns Guide](../guides/importing.md)
- [Webpack Tree-shaking](https://webpack.js.org/guides/tree-shaking/)
- [Rollup Tree-shaking](https://rollupjs.org/guide/en/#tree-shaking)
- [MDN: Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

## Support

If you're experiencing tree-shaking issues:

1. Run the tree-shaking test suite
2. Review this guide's troubleshooting section
3. Check bundler configuration
4. Analyze your bundle with a visualizer
5. Open an issue with test results and bundle analysis
