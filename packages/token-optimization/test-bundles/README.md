# Bundle Size Test Results

This directory contains the verification tests for the tokenizer split import architecture.

## Quick Summary

**Savings: 961.5 KB (97.2% reduction)**

- Without tokenizers: **27.4 KB**
- With tokenizers: **988.9 KB**

## Import Patterns

### Lightweight (Recommended)

```typescript
import { estimateTokens } from '@clarity-chat/token-optimization'
```

Bundle: 27.4 KB | Accuracy: ~90%

### Accurate (Opt-in)

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'
```

Bundle: 988.9 KB | Accuracy: 99%+

## Files in This Directory

- `BUNDLE_SIZE_TEST_REPORT.md` - Full detailed analysis
- `USAGE_GUIDE.md` - Developer usage guide with examples
- `bundle-comparison.txt` - Visual ASCII comparison chart
- `test-without-tokenizers.ts` - Test case for estimation
- `test-with-tokenizers.ts` - Test case for accurate counting
- `without-tokenizers.bundle.js` - Compiled bundle (27.4 KB)
- `with-tokenizers.bundle.js` - Compiled bundle (988.9 KB)
- `without-meta.json` - esbuild analysis metadata
- `with-meta.json` - esbuild analysis metadata

## Running the Tests

```bash
# Build both bundles
npx esbuild test-without-tokenizers.ts --bundle --minify --format=esm --outfile=without-tokenizers.bundle.js
npx esbuild test-with-tokenizers.ts --bundle --minify --format=esm --outfile=with-tokenizers.bundle.js

# Compare sizes
ls -lh *.bundle.js

# Analyze bundles
npx esbuild --analyze without-meta.json
npx esbuild --analyze with-meta.json
```

## Recommendation

✅ Use estimation by default for UI/UX (97% smaller) ⚡ Use accurate counting for billing/limits
(when accuracy matters) 🚀 Use dynamic imports for progressive enhancement

The architecture successfully achieves optimal bundle sizes while maintaining flexibility.
