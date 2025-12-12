# React & NextJS Code Review Framework

> **Purpose**: Comprehensive code review prompt for React/NextJS applications with TypeScript and Tailwind CSS. Covers security, performance, styling, type safety, architecture, and testing.

---

## Context Variables

Before using, fill in:

- `[CODE_PATH]`: File path or component being reviewed
- `[FOCUS_AREA]`: security | performance | tailwind | typescript | architecture | all

---

## The Prompt

> **Note**: Copy the content below. The prompt is presented in a collapsible section to preserve code block formatting.

<details>
<summary>Click to expand full prompt template</summary>

# Mission: React/NextJS Production Code Review

You are a Senior React Architect with 8+ years building production NextJS apps with TypeScript and Tailwind CSS. Your goal is to identify issues and improvements that push the code toward production excellence.

## Tech Stack Context

- **Framework**: NextJS 14+ (App Router)
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS 3+ (utility-first)
- **Runtime**: React 18+ (Server & Client Components)
- **Deployment**: Vercel/Edge

## Code Under Review

- **File/Component**: [CODE_PATH]
- **Focus Area**: [FOCUS_AREA]

---

## Review Domains

### 1. NextJS Security (Critical)

- [ ] Server vs Client component boundaries correct?
- [ ] Server Actions have proper validation (Zod/Valibot)?
- [ ] Environment secrets not exposed to client?
- [ ] CSP headers configured via next/headers?
- [ ] CSRF protection on Server Actions?
- [ ] Input sanitization before DB operations?
- [ ] No dangerouslySetInnerHTML without sanitization?

### 2. React Performance

- [ ] Components using React.memo appropriately?
- [ ] useMemo/useCallback preventing unnecessary re-renders?
- [ ] Proper code splitting with dynamic imports?
- [ ] Image optimization with next/image?
- [ ] Font optimization with next/font?
- [ ] Bundle size analyzed (check for large deps)?

### 3. Tailwind CSS Quality

- [ ] No arbitrary values (avoid `w-[123px]`)?
- [ ] Consistent spacing scale (`p-4`, not `p-[15px]`)?
- [ ] Responsive design mobile-first (`sm:`, `md:`, `lg:`)?
- [ ] Dark mode classes implemented properly?
- [ ] No style conflicts or duplicate utilities?
- [ ] Custom theme values in `tailwind.config.ts`?

### 4. TypeScript Strict Compliance

- [ ] All props properly typed with interfaces?
- [ ] No implicit any types?
- [ ] Return types explicitly defined?
- [ ] Generic constraints used appropriately?
- [ ] Proper error handling with typed catches?
- [ ] Strict null checks passing?

### 5. Architecture & Patterns

- [ ] Custom hooks following naming convention (`use*`)?
- [ ] Components under 200 lines (SRP)?
- [ ] Proper file structure (`components/`, `hooks/`, `utils/`)?
- [ ] Server components for data fetching?
- [ ] Client components marked with `"use client"`?
- [ ] Proper `loading.tsx` and `error.tsx` boundaries?

### 6. Testing & Edge Cases

- [ ] All user inputs validated?
- [ ] Loading states handled?
- [ ] Error boundaries implemented?
- [ ] Edge cases for empty/null data?
- [ ] Performance with large datasets considered?

---

## Output Format

### CRITICAL (Must fix before merge)

```
- Line X: [Issue] | [Fix] | [Security/Performance impact]
```

### IMPROVEMENTS (Consider implementing)

```
- Line Y: [Suggestion] | [Benefit] | [Implementation]
```

### EXCELLENT (Keep doing this)

```
- Line Z: [What's good] | [Why it matters]
```

**Include in each finding**:
- Exact line numbers
- Before/after code snippets
- TypeScript type fixes
- Tailwind utility recommendations
- Performance metrics when relevant

</details>

---

## Specialized Review Personas

### React Hooks Performance Review

```
Persona: React Performance Specialist | React Core Contributor
Scope: Hooks optimization, memoization, re-render prevention
Focus: useMemo, useCallback, useRef patterns, dependency arrays
Output: Specific line recommendations with React DevTools metrics
```

**Key Checks**:
- Dependency arrays accurate and minimal
- Expensive computations memoized
- Stable references for callbacks passed to children
- No state updates in render path
- useRef for values that shouldn't trigger re-renders

### Tailwind CSS Quality Audit

```
Persona: Tailwind CSS Core Team Member
Scope: Utility class optimization, consistency, bundle size
Focus: Arbitrary values, responsive design, dark mode, custom theme
Output: Class replacement suggestions with bundle impact analysis
```

**Key Checks**:
- Prefer design system values over arbitrary (`w-64` vs `w-[256px]`)
- Mobile-first responsive design
- Consistent spacing and color usage
- Dark mode with `dark:` variants
- Extract repeated patterns to components

### TypeScript Strict Mode Review

```
Persona: TypeScript Compiler Team Engineer
Scope: Strict mode compliance, type safety, generic constraints
Focus: No implicit any, strict null checks, proper generics
Output: Type fixes with explanations of compiler behavior
```

**Key Checks**:
- No `any` types (use `unknown` with type guards)
- Explicit return types on exported functions
- Proper generic constraints (`T extends Base`)
- Discriminated unions for complex state
- Type predicates for type narrowing

### NextJS Security Deep Dive

```
Persona: NextJS Security Team Lead | OWASP Contributor
Scope: Server Actions, middleware, headers, CSRF, XSS prevention
Focus: Server vs client boundaries, input validation, CSP headers
Output: Security headers code + validation schemas + test cases
```

**Key Checks**:
- Server Actions validate all inputs
- No secrets in client bundles
- CSP headers prevent XSS
- CSRF tokens on mutations
- SQL/NoSQL injection prevention

---

## Quick Reference Patterns

### Server Component (Data Fetching)

```tsx
// app/users/page.tsx - Server Component (default)
import { db } from '@/lib/db'

interface User {
  id: string
  name: string
  email: string
}

export default async function UsersPage() {
  // Direct database access - only possible in Server Components
  const users: User[] = await db.user.findMany()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UserList users={users} />
    </main>
  )
}
```

### Client Component (Interactivity)

```tsx
'use client'

import { useState, useCallback, memo } from 'react'

interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

// Memoize to prevent unnecessary re-renders
export const UserCard = memo(function UserCard({
  user,
  onSelect
}: UserCardProps) {
  const handleClick = useCallback(() => {
    onSelect(user.id)
  }, [user.id, onSelect])

  return (
    <button
      onClick={handleClick}
      className="p-4 rounded-lg bg-white dark:bg-gray-800
                 shadow hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {user.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {user.email}
      </p>
    </button>
  )
})
```

### Server Action with Validation

```tsx
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  // Always validate inputs
  const parsed = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Safe to use validated data
  await db.user.create({ data: parsed.data })

  revalidatePath('/users')
  return { success: true }
}
```

### Custom Hook Pattern

```tsx
import { useState, useCallback, useMemo } from 'react'

interface UseSearchOptions<T> {
  items: T[]
  searchKey: keyof T
  debounceMs?: number
}

interface UseSearchReturn<T> {
  query: string
  setQuery: (query: string) => void
  results: T[]
  isSearching: boolean
}

export function useSearch<T>({
  items,
  searchKey,
  debounceMs = 300,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Memoize filtered results
  const results = useMemo(() => {
    if (!debouncedQuery) return items

    const lowerQuery = debouncedQuery.toLowerCase()
    return items.filter((item) => {
      const value = item[searchKey]
      return String(value).toLowerCase().includes(lowerQuery)
    })
  }, [items, searchKey, debouncedQuery])

  const isSearching = query !== debouncedQuery

  return { query, setQuery, results, isSearching }
}
```

### Tailwind Responsive Pattern

```tsx
// Mobile-first responsive design
<div className="
  flex flex-col gap-4
  sm:flex-row sm:gap-6
  md:gap-8
  lg:gap-12
">
  {/* Sidebar - full width on mobile, fixed width on larger */}
  <aside className="
    w-full
    sm:w-48
    md:w-64
    lg:w-72
    shrink-0
  ">
    <Navigation />
  </aside>

  {/* Main content - responsive padding and text */}
  <main className="
    flex-1
    p-4 sm:p-6 md:p-8
    text-sm sm:text-base
  ">
    {children}
  </main>
</div>
```

---

## Integration with Clarity Chat

When reviewing Clarity Chat components, combine this framework with the [AI Chat Review Checklist](./AI_CHAT_REVIEW_CHECKLIST.md) for comprehensive coverage:

1. **General React/NextJS patterns** - Use this prompt
2. **AI-specific features** - Use the AI Chat Review Checklist
3. **Streaming components** - Check both React performance AND streaming patterns
4. **Tool UI components** - Check TypeScript types AND tool schema validation

### Clarity Chat-Specific Patterns

```tsx
// Example: Client component using Clarity Chat hooks
'use client'

import { useClarityChat, useTokenBudget } from '@clarity-chat/react'
import { memo, useCallback } from 'react'

interface ChatInterfaceProps {
  systemPrompt: string
  maxTokens?: number
}

export const ChatInterface = memo(function ChatInterface({
  systemPrompt,
  maxTokens = 4000,
}: ChatInterfaceProps) {
  const { messages, sendMessage, isStreaming } = useClarityChat({
    systemPrompt,
  })

  const { budget, remaining } = useTokenBudget({ maxTokens })

  const handleSend = useCallback(async (content: string) => {
    if (remaining < 100) {
      // Warn user about token limit
      return
    }
    await sendMessage(content)
  }, [remaining, sendMessage])

  return (
    <div className="flex flex-col h-full">
      <TokenBudgetBar budget={budget} remaining={remaining} />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  )
})
```

---

## Example Review Output

### Input

```tsx
// components/UserProfile.tsx
export default function UserProfile({ user }) {
  const [editing, setEditing] = useState(false)

  return (
    <div style={{ padding: '15px', backgroundColor: '#f5f5f5' }}>
      <img src={user.avatar} />
      <h2>{user.name}</h2>
      <div dangerouslySetInnerHTML={{ __html: user.bio }} />
    </div>
  )
}
```

### Output

**CRITICAL (Must fix before merge)**

- Line 1: Missing TypeScript props interface | Add `interface UserProfileProps { user: User }` | Enables type safety and IDE support
- Line 7: `dangerouslySetInnerHTML` without sanitization | Use DOMPurify: `DOMPurify.sanitize(user.bio)` | **XSS vulnerability** - attackers could inject scripts

**IMPROVEMENTS (Consider implementing)**

- Line 5: Inline styles instead of Tailwind | Replace with `className="p-4 bg-gray-100"` | Consistent styling, smaller bundle
- Line 6: `img` without next/image | Use `<Image src={user.avatar} alt={user.name} />` | Automatic optimization, lazy loading
- Line 1: Missing "use client" for useState | Add `'use client'` directive | Server/client boundary clarity

**After (Fixed)**

```tsx
'use client'

import Image from 'next/image'
import DOMPurify from 'dompurify'
import { useState } from 'react'

interface User {
  id: string
  name: string
  avatar: string
  bio: string
}

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Image
        src={user.avatar}
        alt={user.name}
        width={64}
        height={64}
        className="rounded-full"
      />
      <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
      <div
        className="prose dark:prose-invert mt-2"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(user.bio)
        }}
      />
    </div>
  )
}
```

---

## Notes

This framework complements the Clarity Chat AI-specific prompts:

1. **General React patterns** - Covered by this prompt
2. **Performance optimization** - useMemo, useCallback, React.memo patterns
3. **Type safety** - TypeScript strict mode compliance
4. **Styling consistency** - Tailwind CSS best practices
5. **Security hardening** - NextJS security patterns

Use alongside [ADVANCED_AI_CHAT_REVIEW_PROMPT.md](./ADVANCED_AI_CHAT_REVIEW_PROMPT.md) for comprehensive Clarity Chat code reviews.

---

*Template Version: 1.0.0 | Last Updated: December 2025*
*For React 18+, NextJS 14+, TypeScript 5+, Tailwind CSS 3+*
