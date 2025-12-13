# Shared Example Components

Reusable UI components for building consistent, polished examples.

## Available Components

### Layout Components

- **ExampleHeader** - Consistent header with title, icon, and navigation
- **ExampleFooter** - Footer with branding and links

### Feedback Components

- **ApiKeyMissingCard** - Displays when API key is not configured
- **ErrorBanner** - Error message with dismiss action
- **StreamingIndicator** - Shows during AI response streaming
- **HowToUseCard** - Instructions card for demo usage

### UI Primitives

- **Card** - Simple card container
- **Progress** - Progress bar component
- **TypingIndicator** - Animated typing dots

## Usage

Import from the shared components directory:

```tsx
import {
  ExampleHeader,
  ExampleFooter,
  ApiKeyMissingCard,
  HowToUseCard,
  TypingIndicator,
  Card,
  Progress,
  StreamingIndicator,
  ErrorBanner,
} from '../_shared/components'
```

## Component Examples

### ExampleHeader

```tsx
<ExampleHeader
  title="My Demo"
  subtitle="Powered by GPT-4"
  icon={<CodeIcon className="w-6 h-6 text-white" />}
  variant="dark"
/>
```

### ApiKeyMissingCard

```tsx
if (!hasApiKey) {
  return <ApiKeyMissingCard provider="OpenAI" />
}
```

### StreamingIndicator

```tsx
{
  isStreaming && <StreamingIndicator message="Generating response..." onCancel={handleCancel} />
}
```

### ErrorBanner

```tsx
{
  error && <ErrorBanner message={error} onDismiss={() => setError(null)} />
}
```

### HowToUseCard

```tsx
<HowToUseCard>
  <p>Type a message and press Enter to send.</p>
</HowToUseCard>
```

## Variants

Most components support `variant` prop:

- `light` (default) - Light theme with white backgrounds
- `dark` - Dark theme with slate backgrounds

```tsx
<ExampleHeader variant="dark" ... />
<Card variant="dark">...</Card>
<ErrorBanner variant="dark" ... />
```

## Customization

All components accept a `className` prop for additional styling:

```tsx
<Card className="p-6 max-w-lg">{/* content */}</Card>
```

## Benefits

1. **Consistency** - Uniform look across all examples
2. **Maintainability** - Update once, apply everywhere
3. **Best Practices** - Built-in accessibility and responsiveness
4. **Time Savings** - No need to recreate common patterns
