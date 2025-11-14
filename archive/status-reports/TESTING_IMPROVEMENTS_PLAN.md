# Testing Improvements Plan - Priority 1

## Current State Analysis

### Test Coverage Status
- **Primitives Package**: 0 test files (no tests)
- **React Package**: 10 test files exist, but tests are skipped due to memory limits
- **Integration Tests**: Exist in `tests/integration/`
- **Total Test Files**: 54 files across all packages

### Memory Issues
- React tests are skipped with echo statements
- Vitest config uses single fork to reduce memory
- Only limited tests are included in config
- Many component tests are excluded

---

## Implementation Plan

### Phase 1: Fix Memory Issues & Enable Tests

#### 1.1 Optimize Vitest Configuration
- [ ] Increase Node.js memory limit
- [ ] Optimize test isolation
- [ ] Use better test environment (jsdom vs happy-dom)
- [ ] Split large test suites
- [ ] Configure proper cleanup

#### 1.2 Add Primitives Tests
- [ ] Button component tests
- [ ] Input component tests
- [ ] Textarea component tests
- [ ] Card component tests
- [ ] Badge component tests
- [ ] Dialog component tests
- [ ] Tooltip component tests
- [ ] Popover component tests
- [ ] DropdownMenu component tests
- [ ] Avatar component tests
- [ ] Drawer component tests
- [ ] ErrorMessage component tests
- [ ] Checkbox component tests
- [ ] ScrollArea component tests

#### 1.3 Enable React Component Tests Gradually
- [ ] Start with simple components
- [ ] Add memory-efficient test patterns
- [ ] Use proper cleanup and teardown
- [ ] Mock heavy dependencies

### Phase 2: Increase Test Coverage

#### 2.1 Component Tests
- [ ] Unit tests for all primitives (target: 80%+ coverage)
- [ ] Unit tests for React components (target: 80%+ coverage)
- [ ] Integration tests for workflows
- [ ] Edge case testing

#### 2.2 Accessibility Tests
- [ ] Add jest-axe for a11y testing
- [ ] Test keyboard navigation
- [ ] Test ARIA attributes
- [ ] Test screen reader compatibility

### Phase 3: CI/CD Integration

#### 3.1 Test Automation
- [ ] Configure GitHub Actions for tests
- [ ] Add test coverage reporting
- [ ] Add test failure notifications
- [ ] Add performance benchmarks

---

## Immediate Actions

1. **Fix Vitest Config** - Optimize memory usage
2. **Add Primitives Tests** - Start with Button, Input, Card
3. **Enable React Tests** - Gradually enable with optimizations
4. **Add A11y Tests** - Use jest-axe
5. **Set Up CI/CD** - GitHub Actions workflow
