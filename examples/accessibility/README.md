# Accessibility Showcase

> WCAG 2.1 AA compliant AI chat interface with comprehensive accessibility features.

## Features

- Keyboard navigation with arrow keys
- Screen reader announcements (ARIA live regions)
- High contrast mode
- Large font mode
- Reduced motion support
- Focus management
- Skip to content link
- Semantic HTML structure

## Quick Start

```bash
# Clone the example
npx degit clarity-chat/clarity-chat/examples/accessibility my-accessible-app
cd my-accessible-app

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your OpenAI API key

# Run development server
pnpm dev
```

Open [http://localhost:3005](http://localhost:3005) to see the demo.

## Accessibility Features

### WCAG 2.1 AA Compliance

| Criterion                    | Implementation            |
| ---------------------------- | ------------------------- |
| 1.1.1 Non-text Content       | Alt text, ARIA labels     |
| 1.3.1 Info and Relationships | Semantic HTML, ARIA roles |
| 1.4.3 Contrast               | High contrast mode option |
| 1.4.4 Resize Text            | Large font mode option    |
| 2.1.1 Keyboard               | Full keyboard navigation  |
| 2.1.2 No Keyboard Trap       | Natural tab order         |
| 2.4.1 Bypass Blocks          | Skip to content link      |
| 2.4.3 Focus Order            | Logical focus management  |
| 2.4.4 Link Purpose           | Descriptive labels        |
| 2.4.7 Focus Visible          | Clear focus indicators    |
| 3.3.1 Error Identification   | ARIA alerts for errors    |
| 4.1.2 Name, Role, Value      | Proper ARIA attributes    |

### Keyboard Shortcuts

| Key             | Action                                |
| --------------- | ------------------------------------- |
| `Tab`           | Navigate between interactive elements |
| `Enter`         | Send message / Activate button        |
| `Shift + Enter` | New line in input                     |
| `Arrow Up/Down` | Navigate through messages             |
| `Home`          | Jump to first message                 |
| `End`           | Jump to last message                  |
| `Escape`        | Clear focus (in some contexts)        |

### Screen Reader Support

- Live region announcements for new messages
- Proper heading hierarchy
- Descriptive labels for all controls
- Status updates during operations
- Error announcements

### Visual Accessibility

- **High Contrast Mode**: Maximum contrast between text and background
- **Large Font Mode**: Increased text size for better readability
- **Reduced Motion**: Disables animations for users sensitive to motion
- **Focus Indicators**: Clear, visible focus states

## Customization

### Add Custom Accessibility Features

```tsx
// Extend the AccessibilitySettings interface
interface AccessibilitySettings {
  highContrast: boolean
  largeFont: boolean
  reducedMotion: boolean
  announceMessages: boolean
  // Add your custom settings
  dyslexiaFont: boolean
}
```

### Custom Screen Reader Announcements

```tsx
// Use the announcer pattern
function ScreenReaderAnnouncer({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}

// Trigger announcements
setAnnouncement('Custom message for screen readers')
```

### Focus Management

```tsx
// Programmatic focus
const messageRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (shouldFocus) {
    messageRef.current?.focus()
  }
}, [shouldFocus])
```

## Project Structure

```
accessibility/
├── app/
│   ├── api/chat/route.ts      # API route
│   ├── globals.css            # Accessibility CSS
│   ├── layout.tsx             # Skip link, lang attr
│   └── page.tsx
├── components/
│   └── accessible-chat.tsx    # Main accessible component
└── README.md
```

## Testing Accessibility

### Automated Testing

```bash
# Install axe-core
npm install -D @axe-core/react

# Run accessibility audit
npm run lint:a11y
```

### Manual Testing

1. **Keyboard Navigation**: Try using the app without a mouse
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Zoom**: Test at 200% and 400% zoom levels
4. **Color Contrast**: Use browser dev tools contrast checker
5. **Reduced Motion**: Enable "reduce motion" in OS settings

### Recommended Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA](https://www.nvaccess.org/download/) (Windows)
- [VoiceOver](https://support.apple.com/guide/voiceover/) (macOS)

## Related Examples

- [basic-chat](../basic-chat) - Simple chat implementation
- [streaming-chat](../streaming-chat) - Advanced streaming
- [custom-theming](../custom-theming) - Theme customization

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Tech Stack

- [Next.js 15](https://nextjs.org)
- [React 19](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [OpenAI API](https://platform.openai.com)

## License

MIT
