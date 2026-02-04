# Phase 2 Externalization Integration Tests

Comprehensive test suite for validating Phase 2 peer dependency externalization.

## Overview

This test suite ensures that Phase 2 externalized packages work correctly in all scenarios:

1. **All peers installed** - Full functionality
2. **No optional peers** - Graceful degradation with helpful errors
3. **Partial peers** - Markdown without syntax highlighting
4. **Error messages** - Guide users correctly
5. **Performance** - Not degraded by fallbacks

## Test Files

### `phase2-externalization.test.tsx`

Main integration test suite covering:

- ✅ All dependencies installed scenario
- ✅ No optional peers scenario
- ✅ Partial peers (markdown without syntax highlighting)
- ✅ Error message quality and guidance
- ✅ Performance baselines
- ✅ Dependency detection and loading
- ✅ Fallback UI quality
- ✅ Edge cases and error boundaries

**Run:**

```bash
pnpm test phase2-externalization.test.tsx
```

### `phase2-performance.bench.ts`

Performance benchmarks to ensure externalization doesn't degrade performance:

- Markdown rendering (short, medium, large)
- Code block rendering (various sizes)
- Dependency loading times
- Component mount times
- Memory efficiency
- Update performance
- Realistic usage patterns

**Run:**

```bash
pnpm bench phase2-performance.bench.ts
```

### `peer-dependency-matrix.test.tsx`

Matrix tests for all peer dependency combinations:

- Tests 6 different dependency scenarios
- Validates behavior for each combination
- Ensures consistency across scenarios
- Checks documentation and error messages
- Verifies progressive enhancement
- Tests real-world usage patterns

**Run:**

```bash
pnpm test peer-dependency-matrix.test.tsx
```

### `phase2-visual-regression.test.tsx`

Visual regression tests for UI consistency:

- Fallback UI design consistency
- Error message visual design
- Loading state visuals
- Accessibility indicators
- Color contrast and readability
- Responsive design
- Dark mode support
- Animation and transitions

**Run:**

```bash
pnpm test phase2-visual-regression.test.tsx
```

## Running Tests

### Run All Integration Tests

```bash
cd packages/react
pnpm test src/__tests__/integration
```

### Run Specific Test Suite

```bash
pnpm test phase2-externalization
```

### Run with Coverage

```bash
pnpm test:coverage src/__tests__/integration
```

### Run Benchmarks

```bash
pnpm bench
```

### Run in Watch Mode

```bash
pnpm test:watch phase2-externalization
```

## Test Scenarios

### Scenario 1: All Peers Installed

**Dependencies:**

- ✅ react-markdown
- ✅ remark-gfm
- ✅ rehype-highlight
- ✅ shiki
- ✅ mermaid

**Expected Behavior:**

- Full markdown rendering with GFM support
- Syntax highlighting with Shiki
- Mermaid diagrams render
- Tables with proper styling
- No warnings or errors

### Scenario 2: No Optional Peers

**Dependencies:**

- ❌ react-markdown
- ❌ remark-gfm
- ❌ rehype-highlight
- ❌ shiki
- ❌ mermaid

**Expected Behavior:**

- Markdown falls back to plain text with basic formatting
- Code blocks render without syntax highlighting
- Clear error messages with installation instructions
- Documentation links provided
- All content still accessible

### Scenario 3: Partial Peers

**Dependencies:**

- ✅ react-markdown
- ✅ remark-gfm
- ❌ rehype-highlight
- ❌ shiki
- ❌ mermaid

**Expected Behavior:**

- Markdown renders correctly
- GFM tables work
- Code blocks show without highlighting
- No Mermaid diagram rendering
- Graceful degradation

### Scenario 4: Error Message Quality

**Tests:**

- Clear description of what's missing
- Installation command (npm/pnpm/yarn)
- Documentation link
- Bundle size explanation
- Alternative solutions

### Scenario 5: Performance Not Degraded

**Benchmarks:**

- Markdown rendering < 200ms for 100 sections
- Code blocks < 50ms for 50 lines
- Dependency loading cached < 5ms
- Multiple components share dependencies
- Error boundary overhead < 10ms

## Coverage Goals

| Area              | Target     | Current |
| ----------------- | ---------- | ------- |
| Integration Tests | 95%        | ✅      |
| Peer Dependencies | 100%       | ✅      |
| Error Handling    | 100%       | ✅      |
| Fallback UI       | 95%        | ✅      |
| Performance       | Benchmarks | ✅      |

## Key Assertions

### Functionality

```typescript
// ✅ Content always renders
expect(screen.getByText(/content/)).toBeInTheDocument()

// ✅ Errors are helpful
expect(screen.getByText(/npm install shiki/i)).toBeInTheDocument()

// ✅ Documentation linked
expect(screen.getByRole('link')).toHaveAttribute(
  'href',
  'https://clarity-chat.dev/docs/peer-dependencies'
)
```

### Performance

```typescript
// ✅ Render time acceptable
expect(renderTime).toBeLessThan(200)

// ✅ Loading cached
expect(loadTime).toBeLessThan(5)

// ✅ Multiple components efficient
// All components share loaded dependencies
```

### Accessibility

```typescript
// ✅ ARIA attributes present
expect(region).toHaveAttribute('aria-label')
expect(region).toHaveAttribute('tabIndex', '0')

// ✅ Keyboard navigation works
// Focus indicators visible
```

## Performance Benchmarks

### Baseline Results (Target)

| Operation                     | Target  | Notes                |
| ----------------------------- | ------- | -------------------- |
| Short markdown (< 100 chars)  | < 10ms  | Basic content        |
| Medium markdown (20 sections) | < 50ms  | Typical chat message |
| Large markdown (100 sections) | < 200ms | Long documentation   |
| Short code block (1 line)     | < 5ms   | Inline code          |
| Medium code block (50 lines)  | < 50ms  | Function definitions |
| Large code block (500 lines)  | < 200ms | Full file            |
| Dependency load (first)       | < 100ms | Initial import       |
| Dependency load (cached)      | < 5ms   | Subsequent calls     |

### Performance Comparison

| Scenario        | With Dependencies | Without Dependencies | Degradation   |
| --------------- | ----------------- | -------------------- | ------------- |
| Markdown render | Baseline          | < 110% baseline      | ✅ Acceptable |
| Code render     | Baseline          | < 105% baseline      | ✅ Minimal    |
| Mount time      | Baseline          | < 102% baseline      | ✅ Negligible |

## Error Message Examples

### Missing Shiki

```
⚠️ This component requires 'shiki' for syntax highlighting.

Install it with:
  npm install shiki

Learn more: https://clarity-chat.dev/docs/peer-dependencies
```

### Missing React Markdown

```
ℹ️ Note: Enhanced markdown rendering is unavailable.
Install react-markdown for full markdown support.

npm install react-markdown remark-gfm rehype-highlight

Using plain text fallback with basic formatting.
```

## Debugging

### Test Failures

1. **Check dependency availability:**

```bash
npm ls react-markdown remark-gfm rehype-highlight shiki
```

2. **Clear module cache:**

```bash
rm -rf node_modules/.vite
pnpm test --no-cache
```

3. **Check mock configuration:**

```typescript
// Verify mocks are properly set up
vi.resetModules()
vi.doUnmock('react-markdown')
```

### Performance Issues

1. **Run specific benchmarks:**

```bash
pnpm bench phase2-performance
```

2. **Profile component:**

```bash
pnpm test:ui phase2-externalization
```

3. **Check memory usage:**

```bash
NODE_OPTIONS='--max-old-space-size=2048' pnpm test
```

## Continuous Integration

### GitHub Actions

```yaml
- name: Run Integration Tests
  run: pnpm test src/__tests__/integration

- name: Run Performance Benchmarks
  run: pnpm bench

- name: Check Coverage
  run: pnpm test:coverage
```

### Performance Monitoring

Benchmarks run on each PR to detect performance regressions:

- Baseline established on main branch
- PR benchmarks compared to baseline
- Fail if performance degrades > 10%

## Contributing

When adding new Phase 2 externalizations:

1. Add test scenario to `phase2-externalization.test.tsx`
2. Add performance benchmark to `phase2-performance.bench.ts`
3. Add matrix test case to `peer-dependency-matrix.test.tsx`
4. Add visual regression test to `phase2-visual-regression.test.tsx`
5. Update this README with new scenarios

## Related Documentation

- [Phase 2 Externalization Plan](../../../../../../docs/PHASE-2-EXTERNALIZATION.md)
- [Peer Dependencies Guide](../../../../../../docs/PEER-DEPENDENCIES.md)
- [Migration Guide](../../../../../../docs/MIGRATION-2.0.md)
- [Performance Guidelines](../../../../../../docs/PERFORMANCE.md)

## Test Results Archive

Test results are stored in:

- `coverage/` - Coverage reports
- `benchmark-results.json` - Performance benchmarks
- `.test-results/` - Test artifacts

## Questions?

For questions about these tests, see:

- [Testing Strategy](../../../../../../docs/TESTING.md)
- [Contributing Guide](../../../../../../CONTRIBUTING.md)
- [Issue Tracker](https://github.com/christireid/Clarity-ai-chat-components/issues)
