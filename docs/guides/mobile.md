# 📱 Mobile Optimization Guide

> **Build chat experiences that work beautifully on mobile devices**

---

## 📚 Overview

Clarity Chat is optimized for mobile devices with:

- 📱 **Responsive Design** - Adapts to all screen sizes
- ⌨️ **Virtual Keyboard Handling** - iOS and Android support
- 👆 **Touch Gestures** - Swipe, long-press, and more
- 🚀 **Performance** - Optimized for mobile networks
- 🔋 **Battery Efficient** - Minimized resource usage
- 💾 **Offline Support** - Works without connection
- 🎨 **Mobile-First Themes** - Touch-optimized UI

---

## 🚀 Quick Start

### Basic Mobile Setup

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme={themes.default}>
      <div className="mobile-container">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          
          // Mobile optimizations
          mobileOptimized={true}
          virtualKeyboardMode="resize"
          touchGestures={true}
        />
      </div>
    </ThemeProvider>
  )
}
```

```css
.mobile-container {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  overflow: hidden;
}
```

---

## ⌨️ Virtual Keyboard Handling

### iOS Keyboard Management

Handle iOS keyboard appearing and disappearing:

```tsx
import { useVirtualKeyboard } from '@clarity-chat/react'

function ChatWindow() {
  const { keyboardHeight, isKeyboardVisible } = useVirtualKeyboard({
    mode: 'resize', // or 'overlay'
  })

  return (
    <div
      style={{
        height: `calc(100vh - ${keyboardHeight}px)`,
        transition: 'height 0.3s ease',
      }}
    >
      <MessageList />
      <ChatInput />
    </div>
  )
}
```

### Android Keyboard Support

```tsx
import { useEffect, useState } from 'react'

function ChatWindow() {
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    // Detect keyboard on Android
    const handleResize = () => {
      const isKeyboard = window.innerHeight < window.screen.height * 0.75
      setKeyboardVisible(isKeyboard)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={keyboardVisible ? 'keyboard-active' : ''}>
      <ChatWindow {...props} />
    </div>
  )
}
```

### Visual Viewport API

Use the Visual Viewport API for better keyboard handling:

```tsx
import { useEffect, useState } from 'react'

function ChatWindow() {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  useEffect(() => {
    if ('visualViewport' in window) {
      const handleViewportChange = () => {
        setViewportHeight(window.visualViewport!.height)
      }

      window.visualViewport!.addEventListener('resize', handleViewportChange)
      return () => {
        window.visualViewport!.removeEventListener('resize', handleViewportChange)
      }
    }
  }, [])

  return (
    <div style={{ height: `${viewportHeight}px` }}>
      <ChatWindow {...props} />
    </div>
  )
}
```

---

## 👆 Touch Gestures

### Swipe Gestures

```tsx
import { useTouchGestures } from '@clarity-chat/react'

function MessageList() {
  const { bind } = useTouchGestures({
    onSwipeLeft: (messageId) => {
      showMessageActions(messageId)
    },
    onSwipeRight: (messageId) => {
      hideMessageActions(messageId)
    },
  })

  return (
    <div {...bind}>
      {messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  )
}
```

### Long Press

```tsx
import { useLongPress } from '@clarity-chat/react'

function Message({ content, id }) {
  const bind = useLongPress({
    onLongPress: () => {
      showContextMenu(id)
    },
    threshold: 500, // milliseconds
  })

  return (
    <div {...bind} className="message">
      {content}
    </div>
  )
}
```

### Pull to Refresh

```tsx
import { usePullToRefresh } from '@clarity-chat/react'

function MessageList() {
  const { bind, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await loadOlderMessages()
    },
    threshold: 80, // pixels to trigger
  })

  return (
    <div {...bind} className="message-list">
      {isRefreshing && <div className="refreshing-indicator">Loading...</div>}
      {messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  )
}
```

---

## 📐 Responsive Layout

### Mobile-First CSS

```css
/* Mobile-first approach */
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; /* iOS Safari fix */
}

.message-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  padding: 1rem;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--border);
  background: var(--background);
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .chat-window {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 12px;
    border: 1px solid var(--border);
  }
}
```

### Breakpoints

```tsx
import { useMediaQuery } from '@clarity-chat/react'

function ChatWindow() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  return (
    <div className={`chat-window ${isMobile ? 'mobile' : ''}`}>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

---

## 🎨 Mobile UI Patterns

### Bottom Sheet

Common mobile pattern for actions:

```tsx
import { BottomSheet } from '@clarity-chat/react'

function MessageActions({ messageId, isOpen, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="actions-list">
        <button onClick={() => copyMessage(messageId)}>Copy</button>
        <button onClick={() => editMessage(messageId)}>Edit</button>
        <button onClick={() => deleteMessage(messageId)}>Delete</button>
        <button onClick={() => shareMessage(messageId)}>Share</button>
      </div>
    </BottomSheet>
  )
}
```

### Floating Action Button (FAB)

Quick access to common actions:

```tsx
function ChatWindow() {
  return (
    <div className="chat-window">
      <MessageList />
      <ChatInput />
      
      {/* Floating action button */}
      <button className="fab" onClick={scrollToBottom}>
        ↓
      </button>
    </div>
  )
}
```

```css
.fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
}
```

### Mobile Navigation

```tsx
function MobileLayout() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="mobile-header">
        <button onClick={() => setShowMenu(true)}>☰</button>
        <h1>Chat</h1>
        <button>⋯</button>
      </header>

      {/* Content */}
      <ChatWindow {...props} />

      {/* Slide-in menu */}
      {showMenu && (
        <div className="mobile-menu">
          <nav>
            <button onClick={() => setShowMenu(false)}>← Back</button>
            {/* Menu items */}
          </nav>
        </div>
      )}
    </>
  )
}
```

---

## 🚀 Performance Optimization

### Lazy Loading

Load messages progressively:

```tsx
import { useIntersectionObserver } from '@clarity-chat/react'

function MessageList() {
  const [messages, setMessages] = useState([])
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.5,
  })

  useEffect(() => {
    if (isVisible) {
      loadMoreMessages().then((newMessages) => {
        setMessages((prev) => [...prev, ...newMessages])
      })
    }
  }, [isVisible])

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
      <div ref={ref} className="load-more-trigger" />
    </div>
  )
}
```

### Virtual Scrolling

For large message lists:

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

function ChatWindow() {
  return (
    <VirtualizedMessageList
      messages={messages}
      itemHeight={80}
      overscan={5}
      renderItem={(message) => <Message {...message} />}
    />
  )
}
```

### Image Optimization

```tsx
function Message({ content, image }) {
  return (
    <div className="message">
      <p>{content}</p>
      {image && (
        <img
          src={image.url}
          srcSet={`
            ${image.url}?w=320 320w,
            ${image.url}?w=640 640w,
            ${image.url}?w=1024 1024w
          `}
          sizes="(max-width: 768px) 100vw, 640px"
          loading="lazy"
          alt={image.alt}
        />
      )}
    </div>
  )
}
```

---

## 💾 Offline Support

### Service Worker

```tsx
// Register service worker
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
}, [])
```

```javascript
// sw.js
const CACHE_NAME = 'clarity-chat-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/main.js',
        '/offline.html',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

### LocalStorage for Messages

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function ChatWindow() {
  const [messages, setMessages] = useLocalStorage('chat-messages', [])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSend = async (content: string) => {
    const message = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      status: isOnline ? 'sending' : 'queued',
    }

    setMessages((prev) => [...prev, message])

    if (isOnline) {
      await sendToServer(message)
    }
  }

  return (
    <>
      {!isOnline && (
        <div className="offline-banner">
          You're offline. Messages will be sent when connection is restored.
        </div>
      )}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </>
  )
}
```

---

## 🔋 Battery Optimization

### Reduce Animations

```tsx
import { useReducedMotion } from '@clarity-chat/react'

function ChatWindow() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={prefersReducedMotion ? 'no-animations' : ''}>
      <ChatWindow {...props} />
    </div>
  )
}
```

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Throttle Network Requests

```tsx
import { useThrottle } from '@clarity-chat/react'

function ChatWindow() {
  const throttledTypingIndicator = useThrottle((isTyping: boolean) => {
    sendTypingIndicator(isTyping)
  }, 2000) // Only send every 2 seconds

  return (
    <ChatInput
      onChange={(value) => {
        throttledTypingIndicator(value.length > 0)
      }}
    />
  )
}
```

---

## 🎨 Mobile-Optimized Themes

### Touch-Friendly Sizes

```css
/* Ensure minimum 44x44px touch targets */
.mobile .clarity-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

.mobile .clarity-input {
  font-size: 16px; /* Prevents zoom on iOS */
  padding: 12px;
  min-height: 44px;
}

/* Larger font sizes for readability */
.mobile .clarity-message {
  font-size: 16px;
  line-height: 1.5;
}
```

### Dark Mode for OLED

Save battery on OLED screens:

```tsx
import { createTheme } from '@clarity-chat/react'

const oledDarkTheme = createTheme({
  name: 'oled-dark',
  colors: {
    background: '#000000',  // True black for OLED
    foreground: '#FFFFFF',
    primary: '#0A84FF',     // iOS blue
    secondary: '#30D158',   // iOS green
    border: '#1C1C1E',
  },
})

<ThemeProvider theme={oledDarkTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

---

## 📱 Platform-Specific Features

### iOS Safe Area

Handle iPhone notches and home indicators:

```css
.chat-window {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Android System Bars

```tsx
// Set theme color for Android system bars
useEffect(() => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', '#4A90E2')
  }
}, [])
```

### PWA Features

```json
{
  "name": "Chat App",
  "short_name": "Chat",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#4A90E2",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🧪 Testing on Mobile

### Browser DevTools

```tsx
// Test different viewports
const viewports = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12': { width: 390, height: 844 },
  'Pixel 5': { width: 393, height: 851 },
  'iPad': { width: 768, height: 1024 },
}
```

### Real Device Testing

- Test on actual iOS and Android devices
- Test different screen sizes
- Test in portrait and landscape
- Test with slow network (3G)
- Test with keyboard open/closed

---

## 📚 Best Practices

### ✅ Do's
- Use `100dvh` for dynamic viewport height
- Implement virtual keyboard handling
- Support touch gestures
- Optimize for mobile networks
- Use large touch targets (44x44px minimum)
- Handle offline scenarios
- Test on real devices
- Optimize images and assets

### ❌ Don'ts
- Don't use hover states only
- Don't ignore virtual keyboard
- Don't use tiny touch targets
- Don't block pinch-to-zoom
- Don't forget safe area insets
- Don't auto-play videos
- Don't use modal popups excessively
- Don't ignore battery consumption

---

## 🔗 Related Documentation

- **[Accessibility](./accessibility.md)** - Mobile accessibility
- **[Performance](./streaming.md)** - Performance optimization
- **[Theming](./theming.md)** - Mobile themes
- **[API Reference](../api/components.md)** - Mobile props

---

**Build mobile-first!** Most users access chat on mobile devices. 📱
