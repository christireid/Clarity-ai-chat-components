# Architecture Review Criteria

> Canonical component architecture and patterns criteria

## Component Structure

### Critical Checks
- [ ] Components under 200 lines (Single Responsibility)
- [ ] One component per file (except tightly coupled pairs)
- [ ] Clear separation of concerns (logic vs presentation)
- [ ] Props interface defined and exported
- [ ] Default exports for page components, named exports for others

### File Structure Pattern

```
components/
├── UserCard/
│   ├── UserCard.tsx        # Main component
│   ├── UserCard.test.tsx   # Tests
│   ├── UserCard.stories.tsx # Storybook
│   ├── useUserCard.ts      # Component-specific hook (if needed)
│   └── index.ts            # Re-export
```

### Component Template

```tsx
// UserCard.tsx
import { memo } from 'react'
import { cn } from '@/lib/utils'

export interface UserCardProps {
  /** User data to display */
  user: User
  /** Optional click handler */
  onClick?: (user: User) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * UserCard displays user information in a card format.
 *
 * @example
 * ```tsx
 * <UserCard user={user} onClick={handleSelect} />
 * ```
 */
export const UserCard = memo(function UserCard({
  user,
  onClick,
  className,
}: UserCardProps) {
  return (
    <div
      className={cn('p-4 rounded-lg bg-white shadow', className)}
      onClick={() => onClick?.(user)}
    >
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
})
```

## Server/Client Separation

### Critical Checks
- [ ] Server Components used for data fetching (default in App Router)
- [ ] Client Components marked with `"use client"` directive
- [ ] No `useState`, `useEffect`, event handlers in Server Components
- [ ] Client boundary pushed as low as possible in component tree
- [ ] Data passed down from Server to Client via props

### Server/Client Boundaries

```tsx
// app/users/page.tsx - Server Component (no directive needed)
import { db } from '@/lib/db'
import { UserList } from '@/components/UserList'

export default async function UsersPage() {
  // Direct database access - only possible in Server Components
  const users = await db.user.findMany()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {/* Pass data to Client Component */}
      <UserList users={users} />
    </main>
  )
}

// components/UserList.tsx - Client Component
'use client'

import { useState } from 'react'

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onClick={() => setSelected(user.id)}
          className={selected === user.id ? 'bg-blue-100' : ''}
        >
          {user.name}
        </li>
      ))}
    </ul>
  )
}
```

## Custom Hooks

### Critical Checks
- [ ] Hook names start with `use` prefix
- [ ] Hooks are pure functions (no side effects outside useEffect)
- [ ] Return type explicitly defined
- [ ] Options object for multiple parameters
- [ ] Dependencies documented

### Hook Pattern

```tsx
import { useState, useCallback, useMemo } from 'react'

export interface UseSearchOptions<T> {
  /** Items to search through */
  items: T[]
  /** Key to search on */
  searchKey: keyof T
  /** Debounce delay in ms */
  debounceMs?: number
}

export interface UseSearchReturn<T> {
  /** Current search query */
  query: string
  /** Update search query */
  setQuery: (query: string) => void
  /** Filtered results */
  results: T[]
  /** Whether search is in progress */
  isSearching: boolean
}

/**
 * useSearch - Search and filter items with debouncing
 *
 * @example
 * ```tsx
 * const { query, setQuery, results } = useSearch({
 *   items: users,
 *   searchKey: 'name',
 *   debounceMs: 300,
 * })
 * ```
 */
export function useSearch<T>({
  items,
  searchKey,
  debounceMs = 300,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query) return items
    const lower = query.toLowerCase()
    return items.filter(item =>
      String(item[searchKey]).toLowerCase().includes(lower)
    )
  }, [items, searchKey, query])

  return { query, setQuery, results, isSearching: false }
}
```

## Error Boundaries

### Critical Checks
- [ ] `error.tsx` exists for each route segment that can fail
- [ ] `loading.tsx` exists for async data fetching routes
- [ ] `not-found.tsx` handles 404 cases
- [ ] Error boundaries don't expose sensitive information
- [ ] Recovery actions provided (retry, go home)

### Error Boundary Pattern

```tsx
// app/users/error.tsx
'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
      <p className="text-gray-600 mt-2">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  )
}
```

## File Organization

### Recommended Structure

```
src/
├── app/                    # NextJS App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Shared components
│   ├── ui/               # Primitive UI components
│   └── features/         # Feature-specific components
├── hooks/                 # Shared hooks
├── lib/                   # Utilities, configs
├── types/                 # TypeScript types
└── styles/               # Global styles
```

## Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| Client code in Server Component | Critical | Build fails |
| Missing error boundary | High | Poor error UX |
| Component > 300 lines | Medium | Maintainability |
| Hook not prefixed with `use` | Medium | Convention violation |
| Missing loading state | Medium | Poor perceived perf |
