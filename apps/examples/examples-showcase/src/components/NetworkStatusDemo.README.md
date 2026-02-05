# NetworkStatus Component Demo

A comprehensive demonstration of real-time network connection monitoring with beautiful glassmorphism styling.

## Features Demonstrated

### 1. Real-Time Connection Status
- **Online Detection**: Monitors browser's online/offline state
- **Status Icons**: Visual indicators for connection states
- **Auto-Recovery**: Automatic reconnection when connection is restored
- **Network Stats**: Live latency, bandwidth, and connection type monitoring

### 2. Offline Mode Simulation
- **Manual Offline Mode**: Test offline behavior without disconnecting
- **Pending Queue**: Shows messages waiting to sync
- **State Persistence**: Maintains pending changes during offline periods
- **Recovery Animation**: Beautiful animation when connection is restored

### 3. Sync Status Indicators
- **Synced**: All changes saved to server
- **Syncing**: Active synchronization in progress
- **Pending**: Changes waiting to sync (offline)
- **Failed**: Sync errors with retry capability

### 4. Glassmorphism Styled Badges
- **Frosted Glass Effect**: backdrop-filter blur with transparency
- **Color-Coded States**: Visual distinction for each connection state
- **Smooth Animations**: CSS transitions for state changes
- **Hover Effects**: Interactive feedback on badge elements

### 5. Connection Recovery Animations
- **Overlay Animation**: Full-screen confirmation on reconnection
- **Checkmark Draw**: Animated success indicator
- **Scale-In Effect**: Spring-based animation entry
- **Auto-Dismiss**: Timed removal after recovery confirmation

## Connection States

### Online
- **Color**: Green gradient
- **Icon**: Checkmark (✓)
- **Behavior**: All features enabled, real-time sync active
- **Stats Shown**: Latency, download speed, RTT, connection type

### Offline
- **Color**: Red gradient
- **Icon**: X mark (✕)
- **Behavior**: Queue messages, disable network features
- **Message**: "No internet connection. Changes will sync when you're back online."

### Reconnecting
- **Color**: Yellow gradient
- **Icon**: Spinning refresh (↻)
- **Behavior**: Attempting to restore connection
- **Animation**: Continuous rotation

### Slow Connection
- **Color**: Orange gradient
- **Icon**: Warning (⚠)
- **Behavior**: Limited functionality, warnings shown
- **Message**: "Your connection is slow. Some features may be delayed."

## Sync States

### Synced (☁)
- All changes saved to server
- Shows time since last sync
- Green background gradient

### Syncing (↻)
- Active synchronization
- Spinning icon animation
- Blue background gradient

### Pending (⏸)
- Offline changes queued
- Shows pending count
- Yellow background gradient

### Failed (✕)
- Sync error occurred
- Manual retry available
- Red background gradient

## Network Statistics

Real-time monitoring of:
- **Latency**: Request round-trip time (ms)
- **Download Speed**: Connection bandwidth (Mbps)
- **RTT**: Round-trip time from Network Information API
- **Connection Type**: 4G, 3G, WiFi, etc.

## Simulation Controls

### Simulate Offline
Manually switch to offline mode to test:
- Message queueing
- UI state changes
- Pending indicators

### Simulate Reconnect
Test recovery flow:
- Reconnection animation
- Pending message sync
- Status restoration

### Simulate Slow Connection
Experience slow network behavior:
- Delayed responses
- Warning messages
- Limited features

### Add Pending Message
Manually add items to sync queue:
- Test queue display
- Sync behavior
- Counter updates

## Visual Design

### Glassmorphism Elements
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
```

### Gradient Background
- Purple to violet gradient (667eea to 764ba2)
- Creates depth and visual interest
- Enhances glassmorphism effect

### Status-Specific Gradients
- **Online**: Green (10b981 to 059669)
- **Offline**: Red (ef4444 to dc2626)
- **Reconnecting**: Yellow (fbbf24 to f59e0b)
- **Slow**: Orange (fb923c to f97316)

## Animations

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}
```

### Spin Animation
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Recovery Animation
```css
@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Code Examples

### Basic Usage
```tsx
import { NetworkStatus } from '@clarity-chat/react'

function App() {
  return (
    <NetworkStatus
      showStats
      autoReconnect
    />
  )
}
```

### With Event Handlers
```tsx
import { NetworkStatus } from '@clarity-chat/react'

function App() {
  const handleStatusChange = (status) => {
    console.log('Network status:', status)
    // Update app state, show notifications, etc.
  }

  const handleReconnect = () => {
    console.log('Reconnected!')
    // Sync pending changes, refresh data, etc.
  }

  return (
    <NetworkStatus
      onStatusChange={handleStatusChange}
      onReconnect={handleReconnect}
      showPendingQueue
    />
  )
}
```

### Custom Configuration
```tsx
import { NetworkStatus } from '@clarity-chat/react'

function App() {
  return (
    <NetworkStatus
      // Display options
      showStats={true}
      showPendingQueue={true}
      showRecoveryAnimation={true}

      // Behavior options
      autoReconnect={true}
      reconnectDelay={1500}
      syncOnReconnect={true}

      // Event handlers
      onStatusChange={(status) => {}}
      onReconnect={() => {}}
      onSyncComplete={() => {}}
      onSyncFailed={(error) => {}}

      // Styling
      className="custom-network-status"
      theme="glassmorphism"
    />
  )
}
```

## Browser API Support

### Network Information API
```typescript
const connection = navigator.connection ||
                  navigator.mozConnection ||
                  navigator.webkitConnection

if (connection) {
  console.log('Effective type:', connection.effectiveType)
  console.log('Downlink:', connection.downlink)
  console.log('RTT:', connection.rtt)
}
```

### Online/Offline Events
```typescript
window.addEventListener('online', handleOnline)
window.addEventListener('offline', handleOffline)
```

## Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Status announcements
- **Color Contrast**: WCAG AA compliant
- **Reduced Motion**: Respects prefers-reduced-motion

## Performance

- **Lightweight**: < 5KB gzipped
- **Efficient Polling**: Smart network checks
- **Minimal Re-renders**: Optimized state updates
- **CSS Animations**: GPU-accelerated
- **Event-Driven**: Only updates on state changes

## Mobile Considerations

- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Large tap targets
- **Network-Aware**: Handles mobile connection types
- **Battery-Conscious**: Minimal background activity

## Use Cases

1. **Real-Time Applications**
   - Chat applications
   - Collaborative tools
   - Live dashboards

2. **Offline-First Apps**
   - Progressive web apps
   - Mobile applications
   - Field service tools

3. **Network-Dependent Features**
   - File uploads
   - Data synchronization
   - Streaming content

4. **User Experience**
   - Connection feedback
   - Status indicators
   - Error prevention

## Best Practices

1. **Inform Users**: Always show connection status
2. **Queue Offline Actions**: Don't lose user data
3. **Sync on Reconnect**: Automatically resume operations
4. **Show Progress**: Visual feedback during sync
5. **Handle Errors**: Graceful degradation
6. **Test Thoroughly**: Simulate various network conditions

## Testing

### Manual Testing
1. Use browser DevTools Network throttling
2. Disable WiFi/Ethernet connection
3. Test mobile network transitions
4. Simulate server errors

### Automated Testing
```typescript
describe('NetworkStatus', () => {
  it('shows online status', () => {})
  it('handles offline transition', () => {})
  it('queues pending messages', () => {})
  it('syncs on reconnect', () => {})
})
```

## Related Components

- **SyncIndicator**: Minimal sync status badge
- **ConnectionBanner**: Full-width status banner
- **OfflineQueue**: Dedicated pending actions UI
- **NetworkDiagnostics**: Advanced network debugging

## Resources

- [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- [Online and offline events](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [Glassmorphism in UI Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)
- [Offline First Design Patterns](https://offlinefirst.org/)
