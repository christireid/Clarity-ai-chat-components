# Performance Review Criteria

> Canonical React performance criteria

## Re-render Prevention

### Critical Checks
- [ ] `React.memo` on components receiving object/array props from parent
- [ ] `useCallback` for callbacks passed to memoized children
- [ ] `useMemo` for expensive computations (sorting, filtering, transformations)
- [ ] Stable references for context values
- [ ] No state updates in render path

### Memoization Patterns

```tsx
// CORRECT: Memoized component with stable callback
const Parent = () => {
  const [items, setItems] = useState<Item[]>([])

  // Stable callback reference
  const handleSelect = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, selected: true } : item
    ))
  }, [])

  // Memoized derived data
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )

  return <ItemList items={sortedItems} onSelect={handleSelect} />
}

// Memoized child component
const ItemList = memo(function ItemList({
  items,
  onSelect
}: ItemListProps) {
  return items.map(item => (
    <Item key={item.id} item={item} onSelect={onSelect} />
  ))
})
```

## Dependency Arrays

### Critical Checks
- [ ] All dependencies listed (ESLint `exhaustive-deps` rule passing)
- [ ] No unnecessary dependencies causing extra re-runs
- [ ] Object/array dependencies are stable references
- [ ] Functions in dependencies are memoized with `useCallback`

### Common Mistakes

```tsx
// INCORRECT: Object created every render
useEffect(() => {
  fetchData(options)
}, [options]) // options = { page: 1 } created each render = infinite loop!

// CORRECT: Stable reference or primitive deps
const page = options.page
useEffect(() => {
  fetchData({ page })
}, [page])

// Or memoize the options
const stableOptions = useMemo(() => ({ page }), [page])
```

## Code Splitting

### Critical Checks
- [ ] Large components use `dynamic()` imports
- [ ] Route-based code splitting (automatic with App Router)
- [ ] Heavy libraries loaded on demand
- [ ] Modal/dialog content lazy loaded

### Dynamic Import Pattern

```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy component
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Skip SSR if client-only
})

// Lazy load based on interaction
const [showModal, setShowModal] = useState(false)
const Modal = dynamic(() => import('./Modal'))

return (
  <>
    <button onClick={() => setShowModal(true)}>Open</button>
    {showModal && <Modal onClose={() => setShowModal(false)} />}
  </>
)
```

## Bundle Optimization

### Critical Checks
- [ ] No duplicate dependencies (check with `pnpm why <package>`)
- [ ] Tree-shaking friendly imports (named imports, not namespace)
- [ ] `next/image` for all images
- [ ] `next/font` for font loading
- [ ] No moment.js (use date-fns or dayjs)

### Import Patterns

```tsx
// CORRECT: Tree-shakeable import
import { format, parseISO } from 'date-fns'

// INCORRECT: Imports entire library
import * as dateFns from 'date-fns'

// CORRECT: Next.js image optimization
import Image from 'next/image'
<Image src={url} alt={alt} width={400} height={300} />

// INCORRECT: Native img (no optimization)
<img src={url} alt={alt} />
```

## State Management

### Critical Checks
- [ ] State lifted only as high as needed
- [ ] No derived state (compute from existing state instead)
- [ ] Form state localized to form components
- [ ] Global state only for truly global concerns

### Derived State Anti-pattern

```tsx
// INCORRECT: Derived state (syncing issues)
const [items, setItems] = useState<Item[]>([])
const [filteredItems, setFilteredItems] = useState<Item[]>([])

useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// CORRECT: Compute during render
const [items, setItems] = useState<Item[]>([])
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

## Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| State update in render | Critical | Infinite loop |
| Missing deps in useEffect | High | Stale closures, bugs |
| Object in dep array (unstable) | High | Unnecessary re-renders |
| Large component not code-split | Medium | Bundle size |
| Missing React.memo | Low | Minor re-renders |
