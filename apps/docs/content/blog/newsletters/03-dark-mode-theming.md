# Newsletter: Dark Mode Done Right

**Subject:** Dark mode is broken in most AI chats (here's why)

---

"Just invert the colors" is the most common dark mode implementation. It's also the worst.

AI chat has unique theming challenges: code blocks, syntax highlighting, status indicators, and
contrast ratios that standard dark mode toggles don't handle well.

## The Key Insight

Theme tokens should be **semantic**, not **visual**.

Instead of `--color-gray-800`, use `--color-surface-primary`. Instead of `--color-blue-500`, use
`--color-action-primary`.

```tsx
const themeTokens = {
  light: {
    surface: { primary: '#ffffff', secondary: '#f8fafc' },
    text: { primary: '#1e293b', muted: '#64748b' },
    code: { background: '#1e293b', text: '#e2e8f0' },
  },
  dark: {
    surface: { primary: '#0f172a', secondary: '#1e293b' },
    text: { primary: '#f1f5f9', muted: '#94a3b8' },
    code: { background: '#020617', text: '#e2e8f0' },
  },
}
```

The magic: **code blocks look the same in both modes.** Users spend most of their time reading code
in AI chat—consistency matters.

**Bonus:** Add a `system` option that follows OS preference. It's what users expect in 2025.

---

[Read the full article →](/blog/dark-mode-theming)

_Themes that just work, in light and dark. That's what Clarity Chat handles for you._
