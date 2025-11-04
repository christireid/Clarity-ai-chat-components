# Accessibility

Clarity Chat is built to meet WCAG 2.1 AA guidelines and ships with sensible defaults for keyboard and screen-reader support.

## Keyboard Navigation

- All interactive elements expose focus states and logical tab ordering.
- Use `MessageList` with `enableFocusManagement` to allow arrow-key traversal of transcripts.
- Composer shortcuts (`Enter`, `Shift+Enter`, `Esc`) are configurable.

## Screen Readers

- Messages announce role and timestamp for context.
- Live streaming uses polite ARIA regions to avoid interrupting current speech.
- Status updates (typing, errors) emit `aria-live="polite"` notifications.

## Color Contrast

Ensure themed color palettes maintain 4.5:1 contrast ratios. Use the provided CSS variables and audit with tools such as Axe or Lighthouse.

## Testing Checklist

1. Navigate the entire chat via keyboard.
2. Validate headings, landmarks, and lists in screen-reader workflows.
3. Confirm focus returns to the composer after sending or retrying a message.
4. Run automated audits with `@axe-core/playwright` as part of CI.

Continue with the [Cookbook](/cookbook) for task-oriented recipes.
