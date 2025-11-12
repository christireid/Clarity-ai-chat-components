# Advanced Theming

Clarity Chat supports layered theming for both design tokens and component variants.

## Theme Providers

Wrap your app with `ClarityThemeProvider` to toggle between light, dark, or custom palettes at runtime.

```tsx
import { ClarityThemeProvider } from '@clarity-chat/react'

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ClarityThemeProvider
      value={{
        mode: 'dark',
        accentColor: '#4b7cf5',
        radius: '0.75rem',
      }}
    >
      {children}
    </ClarityThemeProvider>
  )
}
```

## Token Overrides

Fine-tune tokens per component using CSS variables scoped to container elements.

```css
.chat-shell {
  --clarity-message-user-bg: #0f172a;
  --clarity-message-assistant-bg: #1e293b;
  --clarity-border-strong: #334155;
}
```

## Variant Packs

Create custom component variants by extending base primitives.

```tsx
import { Message } from '@clarity-chat/react'

export const OutlineMessage = props => (
  <Message
    {...props}
    className="rounded-lg border border-slate-500/60 bg-transparent"
    avatarVariant="mono"
  />
)
```

Next, review the [Performance](/guide/performance) guide to ensure themed components stay responsive.
