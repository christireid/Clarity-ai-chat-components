# Integration Tests

Comprehensive integration testing suite for Clarity Chat Components packages.

## Overview

These tests verify that all packages work together correctly, ensuring:
- **Package Interoperability** - Components from different packages integrate seamlessly
- **Cross-Package Features** - Features that span multiple packages function correctly
- **API Contracts** - Public APIs remain stable and work as documented
- **End-to-End Workflows** - Complete user workflows work from start to finish

## Test Categories

### 1. **Component Integration** (`components/`)
Tests for components that use primitives, types, and utilities together.

### 2. **Package Interaction** (`packages/`)
Tests verifying different packages work together correctly.

### 3. **End-to-End** (`e2e/`)
Complete user workflows from initialization to completion.

### 4. **API Contracts** (`contracts/`)
Tests ensuring public APIs remain stable and work as documented.

## Running Tests

```bash
# Run all integration tests
npm test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

## Writing Integration Tests

### Best Practices

1. **Test Real Scenarios**
   - Test actual use cases, not implementation details
   - Focus on user-facing behavior
   - Include error cases and edge conditions

2. **Use Real Packages**
   - Import from package names, not file paths
   - Test published API surface
   - Verify type exports work correctly

3. **Keep Tests Focused**
   - One test per integration point
   - Clear test names describing what's being verified
   - Arrange-Act-Assert pattern

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@clarity-chat/primitives'
import { ChatInput } from '@clarity-chat/react'

describe('ChatInput with Button', () => {
  it('integrates button with chat input', () => {
    render(
      <ChatInput 
        value="" 
        onChange={() => {}}
        onSubmit={() => {}}
        renderSendButton={(props) => <Button {...props}>Send</Button>}
      />
    )
    
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })
})
```

## Test Structure

```
tests/integration/
├── components/        # Component integration tests
├── packages/         # Package interaction tests
├── e2e/             # End-to-end workflow tests
├── contracts/       # API contract tests
├── setup.ts         # Test setup
├── vitest.config.ts # Vitest configuration
└── README.md        # This file
```

## Coverage Goals

- **Critical Paths**: 100% coverage
- **Component Integration**: 90%+ coverage
- **Package Boundaries**: 95%+ coverage
- **Public APIs**: 100% coverage

## Continuous Integration

Integration tests run automatically on:
- Pull requests
- Commits to main
- Pre-release checks

## Debugging Tests

```bash
# Run specific test file
npm test components/chat-integration.test.ts

# Run with debugging
DEBUG=* npm test

# Open UI for debugging
npm run test:ui
```

## Common Issues

### Import Errors
If you see import errors, ensure:
- All packages are built (`npm run build` from root)
- Dependencies are installed
- Alias paths in vitest.config.ts are correct

### Type Errors
- Ensure @clarity-chat/types is built
- Check that all packages export types correctly
- Verify TypeScript version compatibility

### Test Failures
- Check package versions match
- Ensure no breaking changes between packages
- Verify mocks are properly set up

## Contributing

When adding new features:
1. Add integration tests for cross-package functionality
2. Update existing tests if APIs change
3. Document any new test patterns
4. Ensure tests pass in CI

---

**Quality through Integration Testing** 🧪
