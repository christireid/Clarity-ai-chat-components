# TypeScript Review Criteria

> Canonical TypeScript strict mode compliance criteria

## No Implicit Any

### Critical Checks
- [ ] All function parameters have explicit types
- [ ] All variables have explicit or inferable types
- [ ] No `any` types (use `unknown` with type guards instead)
- [ ] Event handlers properly typed
- [ ] Callback parameters typed

### Type Patterns

```tsx
// INCORRECT: Implicit any
const handleClick = (e) => { ... }
const process = (data) => data.name

// CORRECT: Explicit types
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }

interface User { name: string }
const process = (data: User): string => data.name

// CORRECT: Unknown with type guard
function processApiResponse(data: unknown): User {
  if (isUser(data)) {
    return data // typed as User
  }
  throw new Error('Invalid user data')
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as User).name === 'string'
  )
}
```

## Strict Null Checks

### Critical Checks
- [ ] Optional properties accessed with `?.` or null check
- [ ] Null/undefined checked before use
- [ ] Array methods handle potentially empty arrays
- [ ] API responses typed with possible null/undefined

### Null Safety Patterns

```tsx
// INCORRECT: Assumes property exists
const name = user.profile.name // Error if profile is undefined

// CORRECT: Optional chaining
const name = user.profile?.name

// CORRECT: Nullish coalescing
const name = user.profile?.name ?? 'Anonymous'

// CORRECT: Type narrowing
if (user.profile) {
  const name = user.profile.name // Safe
}

// Array safety
const first = items[0] // Type: Item | undefined in strict mode
const firstSafe = items.at(0) ?? defaultItem
```

## Return Types

### Critical Checks
- [ ] Exported functions have explicit return types
- [ ] Async functions return `Promise<T>`
- [ ] Void functions explicitly return `void`
- [ ] Type inference not relied upon for public APIs

### Return Type Patterns

```tsx
// CORRECT: Explicit return types on exports
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

export async function fetchUser(id: string): Promise<User | null> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// Component return types
export function UserCard({ user }: UserCardProps): React.ReactElement {
  return <div>{user.name}</div>
}

// Hook return types
export function useToggle(initial: boolean): [boolean, () => void] {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]
}
```

## Generics

### Critical Checks
- [ ] Generic constraints defined (`T extends Base`)
- [ ] Generic defaults provided where sensible
- [ ] No unnecessary generics (don't over-abstract)
- [ ] Generic inference works correctly

### Generic Patterns

```tsx
// CORRECT: Constrained generic
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key]
}

// CORRECT: Generic with default
interface ApiResponse<T = unknown> {
  data: T
  status: number
  error?: string
}

// CORRECT: Generic React component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## Advanced Type Patterns

### Discriminated Unions

```tsx
// CORRECT: Discriminated union for state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle': return <Idle />
    case 'loading': return <Loading />
    case 'success': return <Success data={state.data} />
    case 'error': return <Error error={state.error} />
  }
}
```

### Type Predicates

```tsx
// Type predicate for narrowing
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

// Usage
const items: (Item | null)[] = [...]
const validItems = items.filter(isNonNullable) // Type: Item[]
```

### Const Assertions

```tsx
// CORRECT: Const assertion for literal types
const ROUTES = {
  home: '/',
  about: '/about',
  users: '/users',
} as const

type Route = typeof ROUTES[keyof typeof ROUTES] // '/' | '/about' | '/users'
```

## Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| `any` type | High | Type safety lost |
| Missing null check | High | Runtime errors |
| Implicit any parameter | Medium | Reduced type safety |
| Missing return type on export | Medium | API contract unclear |
| Unnecessary generic | Low | Over-complexity |
