# NetworkStatus Component Architecture

## Component Hierarchy

```
NetworkStatusDemo
│
├── Recovery Overlay (conditional)
│   └── Recovery Content
│       ├── Recovery Icon (animated)
│       ├── Title
│       └── Message
│
├── Status Display (grid)
│   ├── Status Card (glassmorphism)
│   │   ├── Status Icon (large, animated)
│   │   ├── Status Title
│   │   └── Status Details
│   │       ├── Stat Item (Latency)
│   │       ├── Stat Item (Speed)
│   │       └── Stat Item (Type)
│   │
│   └── Sync Badge (glassmorphism)
│       ├── Sync Icon (animated if syncing)
│       └── Sync Info
│           ├── Sync Label
│           └── Sync Time
│
├── Badges Grid
│   ├── Connection Badges Section
│   │   ├── Online Badge
│   │   ├── Offline Badge
│   │   ├── Reconnecting Badge
│   │   └── Slow Badge
│   │
│   └── Sync Indicators Section
│       ├── Synced Badge
│       ├── Syncing Badge
│       ├── Pending Badge
│       └── Failed Badge
│
├── Pending Queue (conditional, glassmorphism)
│   ├── Queue Header
│   │   ├── Title
│   │   └── Count Badge
│   │
│   └── Queue Items
│       ├── Queue Item 1
│       ├── Queue Item 2
│       └── Queue Item N
│
├── Simulation Controls
│   ├── Control Button (Offline)
│   ├── Control Button (Reconnect)
│   ├── Control Button (Slow)
│   └── Control Button (Add Message)
│
├── Network Statistics (glassmorphism)
│   ├── Stat Card (Latency)
│   ├── Stat Card (Download)
│   ├── Stat Card (RTT)
│   └── Stat Card (Type)
│
├── Real Browser Status (glassmorphism)
│   ├── Status Indicator
│   ├── Status Text
│   └── Info Note
│
└── Code Examples
    ├── Code Tab (Basic Usage)
    └── Code Tab (Custom Handlers)
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  connectionStatus ──┬─→ 'online'                        │
│                     ├─→ 'offline'                       │
│                     ├─→ 'reconnecting'                  │
│                     └─→ 'slow'                          │
│                                                          │
│  syncStatus ────────┬─→ 'synced'                        │
│                     ├─→ 'syncing'                       │
│                     ├─→ 'pending'                       │
│                     └─→ 'failed'                        │
│                                                          │
│  networkStats ──────┬─→ latency: number                 │
│                     ├─→ downlink: number                │
│                     ├─→ rtt: number                     │
│                     └─→ effectiveType: string           │
│                                                          │
│  pendingMessages ───→ number (count)                    │
│  lastSyncTime ──────→ Date                              │
│  showRecoveryAnimation ─→ boolean                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Event Flow

```
Browser Events
│
├─ window.addEventListener('online')
│  │
│  └─→ handleOnline()
│      │
│      ├─→ setConnectionStatus('reconnecting')
│      ├─→ setShowRecoveryAnimation(true)
│      │
│      └─→ setTimeout(() => {
│          ├─→ setConnectionStatus('online')
│          ├─→ syncPendingMessages()
│          └─→ setShowRecoveryAnimation(false)
│          }, 1500ms)
│
├─ window.addEventListener('offline')
│  │
│  └─→ handleOffline()
│      │
│      ├─→ setConnectionStatus('offline')
│      └─→ setSyncStatus('pending')
│
└─ navigator.connection.addEventListener('change')
   │
   └─→ updateNetworkInfo()
       │
       ├─→ setNetworkStats({...})
       └─→ detectSlowConnection()
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     USER ACTIONS                          │
└──────────┬───────────────────────────────────────────────┘
           │
           ├─→ Simulate Offline
           │   └─→ simulateOffline()
           │       ├─→ setConnectionStatus('offline')
           │       ├─→ setSyncStatus('pending')
           │       └─→ setPendingMessages(+3)
           │
           ├─→ Simulate Reconnect
           │   └─→ simulateReconnect()
           │       ├─→ setConnectionStatus('reconnecting')
           │       ├─→ setShowRecoveryAnimation(true)
           │       └─→ setTimeout(() => {
           │           ├─→ setConnectionStatus('online')
           │           ├─→ syncPendingMessages()
           │           └─→ setShowRecoveryAnimation(false)
           │           }, 1500ms)
           │
           ├─→ Simulate Slow
           │   └─→ simulateSlowConnection()
           │       ├─→ setConnectionStatus('slow')
           │       ├─→ setSyncStatus('syncing')
           │       └─→ setTimeout(() => {
           │           ├─→ setConnectionStatus('online')
           │           └─→ setSyncStatus('synced')
           │           }, 3000ms)
           │
           └─→ Add Pending Message
               └─→ addPendingMessage()
                   ├─→ setPendingMessages(+1)
                   └─→ if (offline) setSyncStatus('pending')
```

## React Hooks Usage

```typescript
// State Management
const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online')
const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced')
const [isOnline, setIsOnline] = useState(navigator.onLine)
const [networkStats, setNetworkStats] = useState<NetworkStats>({...})
const [pendingMessages, setPendingMessages] = useState(0)
const [lastSyncTime, setLastSyncTime] = useState(new Date())
const [showRecoveryAnimation, setShowRecoveryAnimation] = useState(false)

// Effect: Monitor Browser Online/Offline
useEffect(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [pendingMessages])

// Effect: Monitor Network Quality
useEffect(() => {
  const connection = navigator.connection
  if (connection) {
    connection.addEventListener('change', updateNetworkInfo)
    return () => {
      connection.removeEventListener('change', updateNetworkInfo)
    }
  }
}, [connectionStatus])

// Effect: Periodic Sync Check
useEffect(() => {
  const interval = setInterval(() => {
    if (connectionStatus === 'online' && syncStatus === 'synced') {
      performSync()
    }
  }, 10000)

  return () => clearInterval(interval)
}, [connectionStatus, syncStatus])
```

## CSS Architecture

```
NetworkStatusDemo.css
│
├── Variables & Base
│   ├── Glassmorphism mixin
│   └── Color system
│
├── Layout
│   ├── .network-status-demo
│   ├── .demo-header
│   ├── .status-display (grid)
│   └── .badges-grid (grid)
│
├── Components
│   ├── Status Card
│   │   ├── .status-card
│   │   ├── .status-icon-large
│   │   ├── .status-details
│   │   └── .stat-item
│   │
│   ├── Sync Badge
│   │   ├── .sync-badge
│   │   ├── .sync-icon
│   │   └── .sync-info
│   │
│   ├── Badges
│   │   ├── .badge
│   │   ├── .badge-dot
│   │   └── .sync-indicator
│   │
│   ├── Queue
│   │   ├── .pending-queue
│   │   ├── .queue-header
│   │   └── .queue-item
│   │
│   ├── Controls
│   │   └── .control-button
│   │
│   └── Stats
│       ├── .network-stats
│       └── .stat-card
│
├── Animations
│   ├── @keyframes fadeIn
│   ├── @keyframes scaleIn
│   ├── @keyframes slideInUp
│   ├── @keyframes pulse
│   ├── @keyframes spin
│   └── @keyframes checkmarkDraw
│
├── States
│   ├── .status-online
│   ├── .status-offline
│   ├── .status-reconnecting
│   ├── .status-slow
│   ├── .sync-synced
│   ├── .sync-syncing
│   ├── .sync-pending
│   └── .sync-failed
│
└── Responsive
    ├── @media (max-width: 768px)
    └── @media (prefers-reduced-motion)
```

## Browser API Integration

```
┌─────────────────────────────────────────────────────────┐
│               BROWSER APIS USED                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  navigator.onLine                                       │
│  ├─→ boolean (read-only)                               │
│  └─→ Current online status                             │
│                                                          │
│  window events                                          │
│  ├─→ 'online'  (fires when connection restored)       │
│  └─→ 'offline' (fires when connection lost)           │
│                                                          │
│  navigator.connection (Network Information API)         │
│  ├─→ effectiveType ('slow-2g', '2g', '3g', '4g')     │
│  ├─→ downlink (Mbps estimate)                         │
│  ├─→ rtt (Round-trip time in ms)                      │
│  └─→ 'change' event (fires on network changes)        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Rendering Pipeline

```
Component Mount
│
├─→ Initialize state
│   ├─→ connectionStatus: 'online'
│   ├─→ syncStatus: 'synced'
│   ├─→ isOnline: navigator.onLine
│   └─→ networkStats: {...}
│
├─→ Setup event listeners
│   ├─→ window.addEventListener('online')
│   ├─→ window.addEventListener('offline')
│   └─→ connection.addEventListener('change')
│
├─→ Initial render
│   ├─→ Render status display
│   ├─→ Render badges
│   ├─→ Render controls
│   └─→ Render stats
│
└─→ Start periodic checks
    └─→ setInterval(sync check, 10000ms)

State Update
│
├─→ Connection status change
│   └─→ Re-render affected components
│       ├─→ Status card (icon, color, text)
│       ├─→ Connection badges (active state)
│       └─→ Network stats (visibility)
│
├─→ Sync status change
│   └─→ Re-render affected components
│       ├─→ Sync badge (icon, text, animation)
│       └─→ Sync indicators (active state)
│
└─→ Pending messages change
    └─→ Re-render affected components
        ├─→ Queue component (visibility, items)
        └─→ Sync badge (count display)

Component Unmount
│
└─→ Cleanup
    ├─→ window.removeEventListener('online')
    ├─→ window.removeEventListener('offline')
    ├─→ connection.removeEventListener('change')
    └─→ clearInterval(sync check)
```

## Performance Optimizations

```
1. Event Debouncing
   ├─→ Network checks: 1000ms
   ├─→ Status updates: 500ms
   └─→ Stat polling: 5000ms

2. CSS GPU Acceleration
   ├─→ transform: translateZ(0)
   ├─→ will-change: transform
   └─→ Use transform over position

3. Conditional Rendering
   ├─→ Recovery overlay (only when active)
   ├─→ Pending queue (only when items exist)
   └─→ Network stats (only when online)

4. Memoization (potential)
   ├─→ React.memo() for badges
   ├─→ useMemo() for stat calculations
   └─→ useCallback() for event handlers

5. Code Splitting
   ├─→ Lazy load icons
   ├─→ Dynamic imports
   └─→ On-demand animations
```

## Testing Strategy

```
Unit Tests
├─→ State updates
│   ├─→ Connection status transitions
│   ├─→ Sync status changes
│   └─→ Pending message queue
│
├─→ Event handlers
│   ├─→ Online/offline events
│   ├─→ Network change events
│   └─→ Button clicks
│
└─→ Helper functions
    ├─→ getStatusIcon()
    ├─→ getStatusText()
    └─→ formatTimeSince()

Integration Tests
├─→ Browser API integration
│   ├─→ navigator.onLine
│   └─→ Network Information API
│
├─→ Animation sequences
│   └─→ Recovery overlay
│
└─→ Queue operations
    ├─→ Add pending messages
    └─→ Sync on reconnect

E2E Tests
├─→ User interactions
│   ├─→ Click simulation buttons
│   └─→ Navigate between views
│
├─→ State persistence
│   └─→ Maintain queue during offline
│
└─→ Network simulation
    ├─→ Throttle connection
    └─→ Disconnect/reconnect
```

## File Organization

```
src/components/
│
├── NetworkStatusDemo.tsx
│   ├─→ Main component logic
│   ├─→ State management
│   ├─→ Event handlers
│   └─→ JSX structure
│
├── NetworkStatusDemo.css
│   ├─→ Glassmorphism styles
│   ├─→ Component layouts
│   ├─→ Animations
│   └─→ Responsive design
│
├── NetworkStatusDemo.README.md
│   ├─→ Feature documentation
│   ├─→ Usage examples
│   └─→ API reference
│
├── NetworkStatusVisualGuide.md
│   ├─→ Visual layouts
│   ├─→ Color system
│   └─→ Design specs
│
└── NetworkStatusQuickRef.md
    ├─→ Quick lookup tables
    ├─→ Code snippets
    └─→ Common patterns
```
