# Performance Review: bad-performance.tsx

## PERFORMANCE ISSUES

### 1. Missing React.memo on UserList (Line 22)
```
Impact: Re-renders on every parent state change
```

**Current Code:**
```tsx
export function UserList({ users, onSelect }: UserListProps) {
```

**Fix:**
```tsx
export const UserList = memo(function UserList({ users, onSelect }: UserListProps) {
```

### 2. Sorting Without Memoization (Line 24)
```
Impact: O(n log n) sort operation on every render
```

**Current Code:**
```tsx
const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name))
```

**Fix:**
```tsx
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
)
```

Note: Also creates new array to avoid mutating prop.

### 3. Inline Callback Without useCallback (Line 27-30)
```
Impact: New function reference breaks child memoization
```

**Current Code:**
```tsx
const handleClick = (user: User) => {
  console.log('Selected:', user.name)
  onSelect(user)
}
```

**Fix:**
```tsx
const handleClick = useCallback((user: User) => {
  console.log('Selected:', user.name)
  onSelect(user)
}, [onSelect])
```

### 4. Arrow Function in JSX (Line 34)
```
Impact: New function on every render, prevents React.memo optimization
```

**Current Code:**
```tsx
<UserCard key={user.id} user={user} onClick={() => handleClick(user)} />
```

**Fix:**
```tsx
// Pass user.id and handle lookup in UserCard, or:
<UserCard key={user.id} user={user} onSelect={handleClick} />

// In UserCard:
onClick={() => onSelect(user)}
```

### 5. Missing React.memo on UserCard (Line 39)
```
Impact: Every card re-renders when any card changes
```

**Fix:**
```tsx
const UserCard = memo(function UserCard({ user, onClick }) {
```

### 6. Native img Instead of next/image (Line 43)
```
Impact: No lazy loading, no optimization, larger bundle
```

**Fix:**
```tsx
import Image from 'next/image'

<Image
  src={`/avatars/${user.id}.png`}
  alt={user.name}
  width={64}
  height={64}
/>
```

### 7. Heavy Library Not Code-Split (Line 52)
```
Impact: Entire chart library in initial bundle (~200KB+)
```

**Fix:**
```tsx
import dynamic from 'next/dynamic'

const HeavyChartLibrary = dynamic(
  () => import('heavy-chart-library').then(mod => mod.HeavyChartLibrary),
  { loading: () => <ChartSkeleton />, ssr: false }
)
```

### 8. Unstable Object in useEffect Dependency (Line 58-62)
```
Impact: Infinite fetch loop - object created fresh each render
```

**Fix:**
```tsx
const options = useMemo(() => ({ limit: 10, sort: 'desc' }), [])

// Or extract primitives:
useEffect(() => {
  fetchData({ limit: 10, sort: 'desc' }).then(setData)
}, []) // Empty deps if values are static
```

### 9. Derived State Anti-pattern (Line 65-68)
```
Impact: Extra state, extra render cycle, sync issues
```

**Fix:**
```tsx
// Remove useState and useEffect, compute during render:
const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
)
```

### 10. Not Using next/font (Line 74-78)
```
Impact: Flash of unstyled text, layout shift, external request
```

**Fix:**
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

<header className={inter.className}>
```

## SUMMARY

| Issue | Impact | Effort |
|-------|--------|--------|
| Missing memo (UserList) | High | Low |
| Sort without useMemo | Medium | Low |
| Inline callback | Medium | Low |
| Arrow in JSX | Medium | Low |
| Missing memo (UserCard) | High | Low |
| Native img | Medium | Low |
| No code splitting | High | Medium |
| Unstable deps | Critical | Low |
| Derived state | Medium | Low |
| No next/font | Low | Low |

**Quick Wins**: Issues 1-6, 8-10 can be fixed in under 30 minutes total.
**Estimated Re-renders Saved**: 60-80% reduction with proper memoization.
