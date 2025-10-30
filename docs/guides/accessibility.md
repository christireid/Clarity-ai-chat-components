# ♿ Accessibility Guide

> **Build inclusive chat experiences that work for everyone**

---

## 📚 Overview

Clarity Chat is built with **WCAG 2.1 AAA compliance** to ensure your chat applications are accessible to all users, including those with disabilities:

- ⌨️ **Full Keyboard Navigation** - No mouse required
- 🔊 **Screen Reader Support** - ARIA labels and live regions
- 🎨 **High Contrast** - AAA contrast ratios
- 🔍 **Zoom Support** - Works at 200%+ zoom
- 👁️ **Focus Management** - Clear focus indicators
- 📱 **Touch Accessibility** - Large touch targets
- 🌐 **Internationalization** - RTL and multiple languages

---

## 🚀 Built-in Accessibility Features

### 1. Keyboard Navigation

All components are fully keyboard accessible:

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` | Activate buttons, send messages |
| `Space` | Toggle buttons, checkboxes |
| `Escape` | Close modals, cancel actions |
| `Arrow Keys` | Navigate lists, menus |
| `/` | Focus search input |
| `?` | Show keyboard shortcuts |

### 2. Screen Reader Support

All components include proper ARIA attributes:

```tsx
// Automatically included
<ChatWindow
  aria-label="Chat conversation"
  role="region"
  aria-live="polite"
  aria-atomic="false"
/>
```

### 3. Focus Management

Clear focus indicators and logical tab order:

```css
/* Built-in focus styles */
.clarity-button:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### 4. Color Contrast

All themes meet WCAG AAA standards:
- Normal text: **7:1** contrast ratio
- Large text: **4.5:1** contrast ratio
- UI components: **3:1** contrast ratio

---

## 📖 Using Accessible Components

### ChatWindow with Full Accessibility

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'

function AccessibleChat() {
  return (
    <ThemeProvider theme={themes.default}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        
        // Accessibility props
        aria-label="AI Assistant Chat"
        ariaLive="polite"
        announceMessages={true}
        announceErrors={true}
        
        // Keyboard shortcuts
        enableKeyboardShortcuts={true}
        shortcuts={{
          send: 'Ctrl+Enter',
          focus: '/',
          clear: 'Ctrl+K',
        }}
      />
    </ThemeProvider>
  )
}
```

### Custom ARIA Labels

```tsx
<ChatInput
  placeholder="Type your message..."
  aria-label="Message input"
  aria-describedby="input-hint"
  aria-invalid={hasError}
  aria-errormessage="error-message"
/>

<span id="input-hint" className="sr-only">
  Type your message and press Enter to send
</span>

{hasError && (
  <span id="error-message" role="alert" className="error">
    Please enter a valid message
  </span>
)}
```

---

## 🔊 Screen Reader Announcements

### Live Regions

Announce dynamic content to screen readers:

```tsx
import { useState } from 'react'

function ChatWindow() {
  const [announcement, setAnnouncement] = useState('')

  const handleMessageSent = (content: string) => {
    setAnnouncement('Message sent')
    setTimeout(() => setAnnouncement(''), 1000)
  }

  const handleMessageReceived = (content: string) => {
    setAnnouncement(`New message from assistant: ${content.substring(0, 100)}`)
  }

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Chat UI */}
      <ChatInput onSend={handleMessageSent} />
      <MessageList onMessageReceived={handleMessageReceived} />
    </>
  )
}
```

### Assertive Announcements

For critical information (errors, warnings):

```tsx
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  className="sr-only"
>
  {error && `Error: ${error.message}`}
</div>
```

---

## ⌨️ Keyboard Shortcuts

### Built-in Shortcuts

Clarity Chat includes common keyboard shortcuts:

```tsx
import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWindow() {
  useKeyboardShortcuts({
    'Ctrl+Enter': () => sendMessage(),
    'Escape': () => clearInput(),
    '/': () => focusSearch(),
    '?': () => showHelp(),
    'Ctrl+K': () => clearChat(),
  })

  return <ChatInput onSend={sendMessage} />
}
```

### Custom Shortcuts

Add your own keyboard shortcuts:

```tsx
import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWindow() {
  useKeyboardShortcuts({
    'Alt+V': () => startVoiceInput(),
    'Alt+F': () => openFileUpload(),
    'Alt+T': () => toggleTheme(),
    'Ctrl+/': () => toggleSidebar(),
  })

  return <ChatWindow {...props} />
}
```

### Shortcut Help Modal

Display available shortcuts to users:

```tsx
import { KeyboardShortcutsHelp } from '@clarity-chat/react'

function ChatWindow() {
  const [showHelp, setShowHelp] = useState(false)

  useKeyboardShortcuts({
    '?': () => setShowHelp(true),
  })

  return (
    <>
      <ChatWindow {...props} />
      
      {showHelp && (
        <KeyboardShortcutsHelp
          onClose={() => setShowHelp(false)}
          shortcuts={[
            { keys: ['Ctrl', 'Enter'], description: 'Send message' },
            { keys: ['Esc'], description: 'Clear input' },
            { keys: ['/'], description: 'Focus search' },
            { keys: ['?'], description: 'Show this help' },
          ]}
        />
      )}
    </>
  )
}
```

---

## 🎨 High Contrast Mode

Support Windows High Contrast mode:

```css
/* Automatically applied */
@media (prefers-contrast: high) {
  .clarity-button {
    border: 2px solid currentColor;
  }

  .clarity-message {
    border: 1px solid currentColor;
  }
}
```

### Custom High Contrast Theme

```tsx
import { createTheme } from '@clarity-chat/react'

const highContrastTheme = createTheme({
  name: 'high-contrast',
  colors: {
    background: '#000000',
    foreground: '#FFFFFF',
    primary: '#FFFF00',      // Yellow for high visibility
    secondary: '#00FFFF',    // Cyan
    border: '#FFFFFF',
    // All colors meet AAA contrast
  },
})

<ThemeProvider theme={highContrastTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

---

## 🔍 Focus Management

### Focus Trapping in Modals

```tsx
import { FocusTrap } from '@clarity-chat/react'

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <FocusTrap>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </FocusTrap>
  )
}
```

### Skip Links

Allow users to skip navigation:

```tsx
function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav>
        {/* Navigation */}
      </nav>

      <main id="main-content" tabIndex={-1}>
        <ChatWindow {...props} />
      </main>
    </>
  )
}
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 📱 Touch Accessibility

### Touch Target Size

All interactive elements meet minimum 44x44px touch target:

```css
/* Built-in */
.clarity-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### Touch Gestures

```tsx
import { useTouchGestures } from '@clarity-chat/react'

function MessageList() {
  useTouchGestures({
    onSwipeLeft: () => showMessageActions(),
    onSwipeRight: () => hideMessageActions(),
    onLongPress: () => showContextMenu(),
  })

  return <MessageList {...props} />
}
```

---

## 🌐 Internationalization (i18n)

### RTL Language Support

Automatically adapts for RTL languages:

```tsx
import { ChatWindow } from '@clarity-chat/react'

function App() {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')

  return (
    <div dir={direction}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        rtl={direction === 'rtl'}
      />
    </div>
  )
}
```

```css
/* Automatically flips for RTL */
[dir='rtl'] .clarity-message-user {
  text-align: right;
  margin-left: 0;
  margin-right: auto;
}
```

### Multi-Language Support

```tsx
import { ChatWindow, LanguageProvider } from '@clarity-chat/react'

const translations = {
  en: {
    placeholder: 'Type your message...',
    send: 'Send',
    error: 'An error occurred',
  },
  es: {
    placeholder: 'Escribe tu mensaje...',
    send: 'Enviar',
    error: 'Ocurrió un error',
  },
  ar: {
    placeholder: '...اكتب رسالتك',
    send: 'إرسال',
    error: 'حدث خطأ',
  },
}

function App() {
  const [language, setLanguage] = useState('en')

  return (
    <LanguageProvider language={language} translations={translations}>
      <ChatWindow {...props} />
    </LanguageProvider>
  )
}
```

---

## 🎯 Testing Accessibility

### Automated Testing

```tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('ChatWindow has no accessibility violations', async () => {
  const { container } = render(<ChatWindow {...props} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Manual Testing Checklist

- [ ] Navigate entire UI with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast ratios
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode
- [ ] Verify ARIA labels
- [ ] Check focus indicators
- [ ] Test touch targets on mobile

---

## 🛠️ Accessibility Tools

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Built into Chrome DevTools
- **Accessibility Insights** - Microsoft's testing tool

### Screen Readers
- **NVDA** (Windows) - Free and open source
- **JAWS** (Windows) - Industry standard
- **VoiceOver** (Mac/iOS) - Built-in
- **TalkBack** (Android) - Built-in

---

## 📚 Best Practices

### ✅ Do's
- Use semantic HTML elements
- Provide text alternatives for images
- Ensure keyboard accessibility
- Use sufficient color contrast
- Provide clear focus indicators
- Test with assistive technologies
- Include ARIA labels where needed
- Support screen reader announcements

### ❌ Don'ts
- Don't rely on color alone
- Don't use tiny font sizes
- Don't disable focus outlines
- Don't use low contrast colors
- Don't forget alt text
- Don't trap keyboard focus
- Don't ignore ARIA best practices
- Don't forget to test

---

## 📊 WCAG 2.1 Compliance

### Level AAA Criteria

Clarity Chat meets all Level AAA criteria:

| Criterion | Status | Implementation |
|-----------|--------|---------------|
| **1.4.6 Contrast (Enhanced)** | ✅ Pass | 7:1 ratio for normal text |
| **1.4.8 Visual Presentation** | ✅ Pass | Line height 1.5, adjustable text |
| **2.1.3 Keyboard (No Exception)** | ✅ Pass | All functions keyboard accessible |
| **2.4.8 Location** | ✅ Pass | Clear navigation and breadcrumbs |
| **2.4.9 Link Purpose** | ✅ Pass | Descriptive link text |
| **2.4.10 Section Headings** | ✅ Pass | Proper heading hierarchy |
| **3.1.3 Unusual Words** | ✅ Pass | Clear, simple language |
| **3.1.4 Abbreviations** | ✅ Pass | Abbreviated terms explained |
| **3.1.5 Reading Level** | ✅ Pass | Simple, clear content |
| **3.1.6 Pronunciation** | ✅ Pass | Pronunciation provided where needed |

---

## 🔗 Related Documentation

- **[Mobile Optimization](./mobile.md)** - Mobile-specific accessibility
- **[Theming](./theming.md)** - High contrast themes
- **[Components API](../api/components.md)** - Accessibility props
- **[Keyboard Shortcuts](../api/hooks.md#usekeyboardshortcuts)** - Keyboard hook

---

## 📖 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

---

**Build inclusive experiences!** Everyone should be able to use your chat application. ♿
