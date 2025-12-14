# Newsletter: Why We Built Clarity Chat

**Subject:** The component library we wished existed

---

Every AI chat we built, we rebuilt the same things:
- Streaming message display
- Token counting
- Error handling with retry
- Loading states
- Accessibility

Copy-paste from project to project. Slight variations. Bugs reintroduced.

## The Manifesto

**1. Production-ready, not demo-ready**

Most AI chat examples work for demos. They break under load, lack error handling, and ignore edge cases.

We wanted components that work in production from day one.

**2. Flexible, not opinionated**

You should control the styling. The AI provider. The message format.

We provide the logic—streaming, state management, accessibility. You provide the design.

**3. TypeScript-first**

Every prop typed. Every return value typed. IntelliSense that actually helps.

No `any`. No guessing.

**4. Performance by default**

Memoization where it matters. Virtual scrolling for long conversations. Efficient re-renders.

You shouldn't need to optimize chat performance—it should just work.

**5. Accessibility included**

ARIA labels. Keyboard navigation. Screen reader announcements. Reduced motion support.

Not an afterthought. Built in from the start.

---

[Read the full article →](/blog/component-library-manifesto)

*This is what Clarity Chat is. The component library we wished existed.*
