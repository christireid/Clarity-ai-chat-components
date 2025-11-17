# Performance Optimization Guide

This document outlines performance optimizations and best practices for Clarity Memory.

## Build Performance

### TypeScript Compilation

- **Incremental builds**: Enabled via `incremental: true` in `tsconfig.json`
- **Build info caching**: `.tsbuildinfo` file caches compilation state
- **Skip lib check**: `skipLibCheck: true` speeds up type checking

### Build Tools

- **tsup**: Fast bundler using esbuild
- **Tree shaking**: Enabled to remove unused code
- **Source maps**: Generated for debugging (can be disabled in production)

## Test Performance

### Vitest Configuration

- **Parallel execution**: Tests run in parallel by default
- **Coverage**: Only calculated when needed (`test:coverage`)
- **Watch mode**: Only re-runs affected tests

### Test Optimization Tips

1. **Use `test.only()`** for focused testing during development
2. **Mock external dependencies** to avoid slow I/O
3. **Use `beforeAll`** for expensive setup
4. **Group related tests** in describe blocks

## Runtime Performance

### Memory Management

- **Incremental loading**: Load memories in batches
- **Lazy initialization**: Initialize stores/embedders only when needed
- **Connection pooling**: Reuse database connections

### Caching Strategies

- **Embedding cache**: Cache embeddings to avoid redundant API calls
- **Search result cache**: Cache recent search results
- **TTL-based expiration**: Use TTL for cache invalidation

### Vector Search Optimization

- **Indexing**: Use vector indexes for faster similarity search
- **Batch operations**: Process multiple embeddings at once
- **Approximate search**: Use approximate nearest neighbor for large datasets

## Development Performance

### Watch Mode

- **tsup watch**: Fast incremental builds
- **Vitest watch**: Only re-runs changed tests
- **TypeScript watch**: Incremental type checking

### IDE Performance

- **TypeScript server**: Use workspace TypeScript version
- **File exclusions**: Exclude `node_modules`, `dist`, `coverage`
- **Search exclusions**: Exclude build artifacts from search

## Monitoring

### Performance Metrics

- **Build time**: Track build duration
- **Test time**: Track test execution time
- **Bundle size**: Monitor output bundle sizes
- **Memory usage**: Monitor memory consumption

### Profiling

```bash
# Profile build
npm run build -- --profile

# Profile tests
npm run test -- --profile
```

## Best Practices

1. **Use path aliases** (`@/*`) for cleaner imports
2. **Enable incremental builds** for faster compilation
3. **Cache expensive operations** (embeddings, searches)
4. **Use batch operations** when possible
5. **Lazy load** heavy dependencies
6. **Monitor bundle size** to catch bloat early

## Optimization Checklist

- [ ] Incremental builds enabled
- [ ] Tree shaking enabled
- [ ] Unused code removed
- [ ] Dependencies optimized
- [ ] Tests run in parallel
- [ ] Caching implemented
- [ ] Bundle size monitored
- [ ] Performance benchmarks added

---

For more details, see the [Architecture documentation](../../docs/clarity-memory/ARCHITECTURE.md).
