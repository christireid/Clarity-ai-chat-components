# Quick Start Guide - Post Modernization
## Getting Started with React 19+ / Next.js 15-16 / Storybook 8.x

This guide helps you get started after the modernization is complete.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

This will install all updated dependencies including:
- React 19.0.0
- Next.js 15.1.6
- Storybook 8.4.7
- TypeScript 5.6.3

### 2. Verify Installation
```bash
# Check versions
pnpm list react react-dom next storybook typescript

# Should show:
# react@19.0.0
# react-dom@19.0.0
# next@15.1.6
# storybook@8.4.7
# typescript@5.6.3
```

### 3. Build Everything
```bash
pnpm build
```

### 4. Run Tests
```bash
pnpm test
```

### 5. Start Development
```bash
# Start all dev servers
pnpm dev

# Or start individually:
pnpm storybook          # Storybook on :6006
cd apps/docs-site && pnpm dev    # Docs site on :3000
cd apps/marketing-site && pnpm dev  # Marketing site on :3001
```

---

## 🎯 What's New

### React 19 Features Available

1. **Ref as Prop**
   ```tsx
   // Old way (still works)
   const MyComponent = forwardRef((props, ref) => ...)
   
   // New way (React 19)
   function MyComponent({ ref, ...props }) {
     return <div ref={ref}>...</div>
   }
   ```

2. **Server Components** (Next.js)
   ```tsx
   // app/page.tsx - Server Component by default
   export default async function Page() {
     const data = await fetchData()
     return <div>{data}</div>
   }
   ```

3. **Server Actions** (Next.js)
   ```tsx
   // Server Action
   async function updateUser(formData: FormData) {
     'use server'
     // Server-side logic
   }
   
   // Client Component
   export function UserForm() {
     return <form action={updateUser}>...</form>
   }
   ```

4. **use() Hook**
   ```tsx
   import { use } from 'react'
   
   function Component({ promise }: { promise: Promise<Data> }) {
     const data = use(promise) // Suspends until resolved
     return <div>{data}</div>
   }
   ```

### Next.js 15 Features Available

1. **App Router** (stable)
2. **Server Actions** (stable)
3. **Improved Caching**
4. **Turbopack** (dev mode)

### Storybook 8 Features Available

1. **CSF3 Format** (already in use)
2. **Interaction Tests** (play functions)
3. **Better Performance**
4. **Improved TypeScript Support**

---

## 📝 Common Tasks

### Adding a New Component

1. Create component file:
   ```tsx
   // packages/react/src/components/my-component.tsx
   export interface MyComponentProps extends React.ComponentPropsWithoutRef<'div'> {
     // props
     ref?: React.Ref<HTMLDivElement>
   }
   
   export function MyComponent({ ref, ...props }: MyComponentProps) {
     return <div ref={ref} {...props}>...</div>
   }
   ```

2. Export from index:
   ```tsx
   // packages/react/src/index.ts
   export * from './components/my-component'
   ```

3. Create Storybook story:
   ```tsx
   // apps/storybook/stories/MyComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { MyComponent } from '@clarity-chat/react'
   
   const meta = {
     title: 'Components/MyComponent',
     component: MyComponent,
     tags: ['autodocs'],
   } satisfies Meta<typeof MyComponent>
   
   export default meta
   type Story = StoryObj<typeof meta>
   
   export const Default: Story = {
     args: {
       // props
     },
   }
   ```

### Adding Interaction Tests

```tsx
import { expect, within, userEvent } from '@storybook/test'

export const Default: Story = {
  args: { /* ... */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    await expect(button).toBeVisible()
    await userEvent.click(button)
    // Test interactions...
  },
}
```

### Using Server Components (Next.js)

```tsx
// app/my-page/page.tsx - Server Component (default)
export default async function MyPage() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  
  return <div>{json.content}</div>
}
```

### Using Server Actions (Next.js)

```tsx
// app/actions.ts - Server Actions
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // Server-side logic
  return { success: true }
}

// app/components/PostForm.tsx - Client Component
'use client'

import { createPost } from '../actions'

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## 🐛 Troubleshooting

### Issue: TypeScript errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm typecheck
```

### Issue: Build fails
```bash
# Clean build artifacts
pnpm clean
pnpm build
```

### Issue: Storybook won't start
```bash
# Clear Storybook cache
rm -rf apps/storybook/.storybook/.cache
pnpm storybook
```

### Issue: Next.js errors
```bash
# Clear Next.js cache
rm -rf apps/docs-site/.next
rm -rf apps/marketing-site/.next
pnpm dev
```

---

## 📚 Resources

- **Migration Guide:** `REACT_19_MIGRATION_GUIDE.md`
- **Progress Tracking:** `MODERNIZATION_PROGRESS.md`
- **Component Status:** `MODERNIZATION_STATUS.md`
- **Final Report:** `FINAL_MODERNIZATION_REPORT.md`
- **Validation Checklist:** `VALIDATION_CHECKLIST.md`

### External Resources
- [React 19 Docs](https://react.dev/blog/2024/04/25/react-19)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Storybook 8 Docs](https://storybook.js.org/docs)
- [TypeScript 5.6 Docs](https://www.typescriptlang.org/docs/)

---

## ✅ Next Steps

1. ✅ Install dependencies
2. ✅ Verify builds
3. ✅ Run tests
4. ✅ Start development
5. ✅ Review migration guide
6. ✅ Add more interaction tests
7. ✅ Implement Server Actions
8. ✅ Deploy to production

---

**Happy Coding! 🎉**
