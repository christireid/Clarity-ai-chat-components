# NetworkStatus Component - Quick Reference

## Import
```tsx
import NetworkStatusDemo from './components/NetworkStatusDemo'
```

## Connection States

| State | Icon | Color | Meaning |
|-------|------|-------|---------|
| Online | ✓ | Green | Connected and operational |
| Offline | ✕ | Red | No internet connection |
| Reconnecting | ↻ | Yellow | Attempting to reconnect |
| Slow | ⚠ | Orange | Poor connection quality |

## Sync States

| State | Icon | Color | Meaning |
|-------|------|-------|---------|
| Synced | ☁ | Green | All changes saved |
| Syncing | ↻ | Blue | Sync in progress |
| Pending | ⏸ | Yellow | Waiting to sync (offline) |
| Failed | ✕ | Red | Sync error occurred |

## Interactive Controls

```tsx
// Simulate different network conditions
<button onClick={simulateOffline}>Simulate Offline</button>
<button onClick={simulateReconnect}>Simulate Reconnect</button>
<button onClick={simulateSlowConnection}>Simulate Slow</button>
<button onClick={addPendingMessage}>Add Pending</button>
```

## Network Statistics

```typescript
interface NetworkStats {
  latency: number      // Request round-trip (ms)
  downlink: number     // Bandwidth (Mbps)
  rtt: number          // Round-trip time (ms)
  effectiveType: string // Connection type (4g, 3g, etc)
}
```

## Browser APIs Used

```typescript
// Online/Offline detection
navigator.onLine
window.addEventListener('online', handleOnline)
window.addEventListener('offline', handleOffline)

// Network Information
navigator.connection.effectiveType
navigator.connection.downlink
navigator.connection.rtt
```

## Glassmorphism Style Template

```css
.your-component {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 20px;
}
```

## Animations

```css
/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Color System

```typescript
const colors = {
  online: {
    primary: '#10b981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  offline: {
    primary: '#ef4444',
    secondary: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
  },
  reconnecting: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
  },
  slow: {
    primary: '#fb923c',
    secondary: '#f97316',
    gradient: 'linear-gradient(135deg, #fb923c, #f97316)'
  }
}
```

## Event Handlers

```typescript
// Connection status change
const handleStatusChange = (status: ConnectionStatus) => {
  console.log('Status changed:', status)
}

// Connection recovered
const handleReconnect = () => {
  console.log('Connection restored')
  syncPendingMessages()
}

// Sync complete
const handleSyncComplete = () => {
  console.log('All changes synced')
}

// Sync failed
const handleSyncFailed = (error: Error) => {
  console.error('Sync failed:', error)
}
```

## Component Props (Proposed API)

```typescript
interface NetworkStatusProps {
  // Display options
  showStats?: boolean
  showPendingQueue?: boolean
  showRecoveryAnimation?: boolean

  // Behavior options
  autoReconnect?: boolean
  reconnectDelay?: number
  syncOnReconnect?: boolean

  // Event handlers
  onStatusChange?: (status: ConnectionStatus) => void
  onReconnect?: () => void
  onSyncComplete?: () => void
  onSyncFailed?: (error: Error) => void

  // Styling
  className?: string
  theme?: 'glassmorphism' | 'minimal' | 'solid'
}
```

## Usage Examples

### Basic
```tsx
<NetworkStatus />
```

### With Stats
```tsx
<NetworkStatus showStats />
```

### Full Featured
```tsx
<NetworkStatus
  showStats
  showPendingQueue
  showRecoveryAnimation
  autoReconnect
  reconnectDelay={1500}
  syncOnReconnect
  onStatusChange={(status) => console.log(status)}
  onReconnect={() => console.log('Reconnected!')}
  onSyncComplete={() => console.log('Synced!')}
  theme="glassmorphism"
/>
```

## Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 769px) {
  .status-display {
    grid-template-columns: 2fr 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .status-display {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

```tsx
// ARIA labels
<div role="status" aria-live="polite">
  Connection Status: {status}
</div>

// Keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
/>

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## Testing Checklist

- [ ] Test online → offline transition
- [ ] Test offline → online transition
- [ ] Verify pending queue functionality
- [ ] Test sync on reconnect
- [ ] Verify recovery animation
- [ ] Test slow connection mode
- [ ] Check mobile responsiveness
- [ ] Verify keyboard navigation
- [ ] Test with screen readers
- [ ] Check color contrast ratios
- [ ] Test with reduced motion
- [ ] Verify browser compatibility

## Performance Tips

1. **Debounce status checks** (1000ms)
2. **Use CSS transforms** (GPU accelerated)
3. **Lazy load icons** (code splitting)
4. **Memoize stats** (React.memo)
5. **Cleanup listeners** (useEffect cleanup)
6. **Optimize re-renders** (useCallback)

## Common Issues

### Issue: Network API not available
```typescript
if (!navigator.connection) {
  console.warn('Network Information API not supported')
  // Fallback to basic online/offline only
}
```

### Issue: Animation jank
```css
.animated-element {
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
}
```

### Issue: Recovery animation not showing
```typescript
// Ensure cleanup in useEffect
useEffect(() => {
  return () => {
    setShowRecoveryAnimation(false)
  }
}, [])
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| navigator.onLine | ✅ | ✅ | ✅ | ✅ |
| Online/Offline events | ✅ | ✅ | ✅ | ✅ |
| Network Information API | ✅ | ❌ | ❌ | ✅ |
| backdrop-filter | ✅ | ✅ | ✅ | ✅ |

## File Structure

```
components/
├── NetworkStatusDemo.tsx           # Main component
├── NetworkStatusDemo.css           # Styles
├── NetworkStatusDemo.README.md     # Full documentation
├── NetworkStatusVisualGuide.md     # Visual design guide
└── NetworkStatusQuickRef.md        # This file
```

## Key Files

- **Component**: `src/components/NetworkStatusDemo.tsx` (650 lines)
- **Styles**: `src/components/NetworkStatusDemo.css` (1000 lines)
- **Docs**: `src/components/NetworkStatusDemo.README.md` (500 lines)

## Demo URL

Access the demo at: `http://localhost:5173` → Click "Network Status" in navigation

## Related Components

- `ConnectionBanner` - Minimal status banner
- `SyncIndicator` - Standalone sync badge
- `OfflineQueue` - Pending actions manager
- `NetworkDiagnostics` - Advanced debugging
