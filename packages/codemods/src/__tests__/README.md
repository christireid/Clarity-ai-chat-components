# Codemods Test Suite

Comprehensive test coverage for Clarity Chat codemods, ensuring automated migrations work correctly across all scenarios.

## Test Structure

### Unit Tests

Individual transform tests validate specific transformations:

- `transforms/v1-to-v2.test.ts` - v1 to v2 API migrations
- `transforms/toast-migration.test.ts` - Toast system migrations
- `transforms/use-chat-migration.test.ts` - useChat to useClarityChat migrations
- `transforms/markdown-renderer-migration.test.ts` - Markdown renderer migrations
- `transforms/reduced-motion-migration.test.ts` - Hook import path migrations

### Integration Tests

- `integration.test.ts` - Tests multiple transforms working together
- Real-world migration scenarios
- Partial migration handling
- TypeScript support validation

### Runner Tests

- `runner.test.ts` - Transform execution engine tests
- File system operations
- Directory traversal
- Error handling

## Running Tests

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Run with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test v1-to-v2.test.ts

# Run integration tests only
pnpm test integration.test.ts
```

## Test Utilities

### `test-utils.ts`

Helper functions for testing transforms:

- `createTestAPI()` - Creates jscodeshift API for testing
- `createFileInfo()` - Creates file info objects
- `runTransform()` - Executes a transform and returns result
- `normalizeCode()` - Normalizes code for comparison
- `expectTransform()` - Asserts transform produces expected output
- `expectNoChange()` - Asserts transform makes no changes
- `testTransformScenarios()` - Tests multiple scenarios

### Example Usage

```typescript
import { runTransform, expectTransform } from './test-utils'
import transform from '../transforms/v1-to-v2'

it('should rename ChatWindow to ChatInterface', () => {
  const input = `
    import { ChatWindow } from '@clarity-chat/react'
  `

  const expected = `
    import { ChatInterface } from '@clarity-chat/react'
  `

  expectTransform(transform, input, expected)
})
```

## Test Fixtures

### `fixtures/`

Contains example code for testing:

- `v1-app.tsx` - Example v1 application
- `v2-app.tsx` - Expected v2 output after migrations

## Coverage Goals

- Lines: 80%+
- Functions: 80%+
- Branches: 75%+
- Statements: 80%+

## Test Categories

### Import Transformations
- Named imports
- Aliased imports
- Namespace imports
- Multiple imports
- Import removal

### JSX Transformations
- Component renames
- Self-closing tags
- Components with children
- Nested components
- JSX fragments

### Props Transformations
- Prop renames
- Prop value changes
- Prop removal
- Prop additions
- Config object restructuring

### Edge Cases
- Empty files
- Files with comments
- TypeScript annotations
- Template literals
- Spread operators
- Dynamic values
- Nested structures

### Error Handling
- Syntax errors
- Missing imports
- Invalid transformations
- File system errors

### No-op Scenarios
- Already migrated code
- Unrelated code
- Similar but different APIs
- Other libraries

## Best Practices

1. **Test both positive and negative cases** - Ensure transforms work correctly and don't break valid code
2. **Use descriptive test names** - Clearly state what is being tested
3. **Test edge cases** - Handle comments, whitespace, TypeScript, etc.
4. **Verify no-ops** - Ensure transforms don't modify already-migrated code
5. **Test integration** - Validate multiple transforms work together
6. **Check for regressions** - Add tests for any bugs discovered

## Adding New Tests

When adding a new transform:

1. Create a test file in `transforms/` matching the transform name
2. Follow the existing test structure
3. Test all transformation scenarios
4. Add edge cases and error handling tests
5. Add integration tests if the transform interacts with others
6. Update this README with the new test file

## Debugging Tests

```bash
# Run specific test with verbose output
pnpm test -- --reporter=verbose v1-to-v2.test.ts

# Debug failing test
pnpm test -- --reporter=verbose --bail

# Check actual vs expected output
# Tests will log the actual output when assertions fail
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Release builds

Coverage reports are generated and uploaded to the coverage service.
