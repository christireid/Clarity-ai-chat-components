# Testing Utilities

Comprehensive testing utilities for Clarity Chat Components.

## Features

- **Component Testing Helpers** - Utilities for testing components
- **Accessibility Testing** - Built-in a11y checks
- **Visual Regression** - Setup for visual testing
- **Performance Testing** - Measure component performance
- **Mock Utilities** - Mock data generators

## Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Usage

```typescript
import { renderWithProviders, mockMessage, expectAccessible } from '@clarity-chat/testing-utils'

test('Message component is accessible', async () => {
  const { container } = renderWithProviders(
    <Message message={mockMessage()} />
  )
  
  await expectAccessible(container)
})
```

## Utilities Included

- `renderWithProviders` - Render with all necessary providers
- `mockMessage` - Generate mock message data
- `mockConversation` - Generate mock conversation
- `expectAccessible` - Check accessibility
- `measurePerformance` - Measure render performance
- `visualSnapshot` - Take visual snapshots
