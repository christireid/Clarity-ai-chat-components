# Customization

Tailor the Clarity Chat experience to match your product's voice, brand, and workflows.

## Theming via CSS Variables

All components expose design tokens under the `--clarity-*` namespace. Override them globally or per component.

```css
:root {
  --clarity-background: #050816;
  --clarity-surface: #10122b;
  --clarity-primary: #4b7cf5;
  --clarity-success: #31c48d;
}
```

## Utility-First Styling

Pass a `className` or `slotClassNames` prop to inject Tailwind or utility classes without losing built-in accessibility attributes.

```tsx
import { ChatWindow, Composer, Message } from '@clarity-chat/react'

<ChatWindow
  className="rounded-xl border border-slate-700"
  headerClassName="bg-slate-900/80"
  composerClassName="bg-slate-950"
  messages={messages}
/>
```

## Component Slots

Override individual sub-components via render props:

```tsx
import { ChatWindow, Composer, Message } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  renderMessage={props => (
    <Message {...props} showAvatar={false} variant="compact" />
  )}
  renderComposer={props => (
    <Composer {...props} placeholder="Ask our AI anything…" />
  )}
/>
```

## Localization

Translate labels via props like `composerLabels`, `attachmentLabels`, and `errorMessages`. Use the `useChat` hook to feed locale-specific prompts.

Continue with the [Theming](/guide/theming) guide for advanced token maps and dark/light switching.
