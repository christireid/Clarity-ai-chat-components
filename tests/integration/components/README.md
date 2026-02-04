# Component Integration Tests

Comprehensive integration tests for new components demonstrating real-world usage patterns.

## Test Files Created

### 1. Command Palette + Keyboard Hooks Integration
**File**: `command-palette-keyboard.integration.test.tsx`

Tests the complete integration of CommandPalette with keyboard hooks, focus management, and accessibility features.

**Covers**:
- Global keyboard shortcuts (Cmd+K/Ctrl+K)
- Arrow key navigation (Up/Down/Home/End)
- Search functionality with keyboard navigation
- Focus management and restoration
- AI context display and updates
- Complete workflows (open → search → navigate → execute)
- Accessibility (ARIA attributes, screen reader announcements)
- Performance (large command lists, debounced search)

**Example Test**:
```typescript
it('completes full command execution workflow', async () => {
  // 1. Open with button
  // 2. Search for command
  // 3. Navigate with keyboard
  // 4. Execute with Enter
  // 5. Verify command executed and palette closed
})
```

### 2. AudioRecorder + Browser APIs Integration
**File**: `audio-recorder-browser-apis.integration.test.tsx`

Tests the complete integration with browser media APIs including MediaStream, MediaRecorder, Web Audio API, and Blob API.

**Covers**:
- MediaStream API (getUserMedia with constraints)
- MediaRecorder API (recording, pausing, resuming)
- Web Audio API (AudioContext, AnalyserNode, waveform visualization)
- Blob API (audio data handling, object URLs)
- State transitions and lifecycle
- Error handling (permission denied, unsupported formats)
- Real chat app integration
- Performance and resource cleanup

**Example Test**:
```typescript
it('completes full voice message workflow in chat app', async () => {
  // Start recording
  // Stop recording
  // Verify message with audio
  // Wait for AI response
  // Check stats updated
})
```

### 3. OKLCH Colors + Tailwind Integration
**File**: `oklch-tailwind.integration.test.tsx`

Tests the integration of OKLCH color system with Tailwind CSS for glassmorphic UI effects.

**Covers**:
- OKLCH color format parsing and rendering
- Glassmorphism effects (backdrop blur, saturation, gradients)
- Theme switching (light/dark mode with OKLCH)
- AI-specific colors (user, assistant, system messages)
- Gradient animations
- Color accessibility and contrast
- Tailwind utility combinations
- Responsive and hover states

**Example Test**:
```typescript
it('applies glassmorphic effects throughout app', () => {
  // Verify backdrop-blur classes
  // Verify OKLCH background colors
  // Check glassmorphic borders
  // Validate consistency across components
})
```

### 4. Real App Integration
**File**: `real-app-integration.test.tsx`

Tests all components working together in a realistic AI chat application.

**Covers**:
- Complete user workflows (voice recording → AI response)
- Command palette for app navigation
- Theme switching
- Glassmorphism UI throughout
- Keyboard navigation across components
- Focus management between components
- Accessibility compliance
- Performance under load
- Error handling and recovery

**Example Test**:
```typescript
it('completes full voice message workflow', async () => {
  // Start recording
  // Stop recording
  // Verify message appears with audio
  // Wait for AI response
  // Check conversation stats
})
```

## Running the Tests

### Prerequisites
```bash
# From monorepo root
pnpm install
```

### Run All Integration Tests
```bash
cd tests/integration
pnpm test
```

### Run Specific Test File
```bash
cd tests/integration
pnpm test command-palette-keyboard.integration.test.tsx
```

### Run in Watch Mode
```bash
cd tests/integration
pnpm test:watch
```

### Run with UI
```bash
cd tests/integration
pnpm test:ui
```

### Run with Coverage
```bash
cd tests/integration
pnpm test:coverage
```

## Test Structure

Each test file follows this structure:

```typescript
// 1. Imports
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// 2. Mock Setup (if needed)
class MockBrowserAPI { ... }
global.SomeAPI = MockBrowserAPI

// 3. Test Component (realistic app usage)
function TestApp() {
  // Real component usage with state, effects, etc.
}

// 4. Integration Tests
describe('Component Integration', () => {
  describe('Feature Area', () => {
    it('test case', async () => {
      // Test implementation
    })
  })
})
```

## Key Testing Patterns

### 1. User-Centric Testing
Tests simulate real user interactions:
```typescript
await user.click(button)
await user.type(input, 'search query')
fireEvent.keyDown(element, { key: 'Enter' })
```

### 2. Async Operations
Properly handle async behavior:
```typescript
await waitFor(() => {
  expect(element).toBeInTheDocument()
})
```

### 3. Browser API Mocking
Mock browser APIs realistically:
```typescript
class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  start() { /* realistic behavior */ }
  stop() { /* realistic behavior */ }
}
```

### 4. Accessibility Verification
Check ARIA attributes and screen reader support:
```typescript
expect(dialog).toHaveAttribute('aria-modal', 'true')
expect(liveRegion).toHaveAttribute('aria-live', 'polite')
```

### 5. Performance Monitoring
Measure render times:
```typescript
const startTime = performance.now()
render(<Component />)
const endTime = performance.now()
expect(endTime - startTime).toBeLessThan(100)
```

## Coverage Goals

- **CommandPalette + Keyboard**: 95% coverage
- **AudioRecorder + Browser APIs**: 90% coverage
- **OKLCH + Tailwind**: 85% coverage
- **Real App Integration**: 80% coverage

## Common Issues & Solutions

### Issue: Tests fail with "Cannot find module"
**Solution**: Run `pnpm install` from monorepo root to resolve workspace dependencies.

### Issue: Tests timeout
**Solution**: Increase timeout in test or use `vi.useFakeTimers()` for time-dependent tests.

### Issue: Browser API mocks not working
**Solution**: Ensure mocks are defined before component imports and properly reset in `beforeEach`.

### Issue: Focus management tests fail
**Solution**: Use `waitFor` with proper selectors and verify elements exist before checking focus.

## Best Practices

1. **Test Real Workflows**: Focus on complete user journeys, not isolated features
2. **Mock Realistically**: Browser API mocks should behave like real APIs
3. **Handle Async**: Use `waitFor` for async operations, never `setTimeout`
4. **Clean Up**: Always clean up timers, listeners, and resources in `afterEach`
5. **Accessibility First**: Include accessibility checks in every test
6. **Performance Conscious**: Monitor render times and resource usage
7. **Error Scenarios**: Test both success and failure paths
8. **Cross-Browser**: Consider browser-specific behaviors in mocks

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add memory leak detection
- [ ] Add cross-browser testing
- [ ] Add mobile/touch interaction tests
- [ ] Add network condition simulation
- [ ] Add concurrent user interaction tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
