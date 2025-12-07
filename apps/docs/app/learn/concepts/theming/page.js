import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Theming Basics - Learn Clarity Chat',
    description: 'Customize the visual system: theme provider, CSS variables, presets, and per-component overrides.',
};
export default function ThemingConceptPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Concept" }), _jsx("h1", { children: "Theming System" }), _jsx("p", { className: "docs-lead", children: "Clarity Chat exposes an opinionated but flexible theme layer based on CSS variables. Change colour palettes, typography, spacing, and even animation presets without editing component source." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Theme Provider" }), _jsxs("p", { children: ["Wrap your app with ", _jsx("code", { children: "ThemeProvider" }), " and pass either built-in presets or your own token map."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ThemeProvider,
  ThemeSwitcher,
  createTheme,
  defaultTheme,
} from '@clarity-chat/react'

const brandTheme = createTheme({
  name: 'brand',
  colors: {
    primary: '#2563EB',
    primaryForeground: '#ffffff',
    secondary: '#9333EA',
    secondaryForeground: '#ffffff',
    surface: '#0B1120',
    surfaceForeground: '#E2E8F0',
  },
  radii: {
    md: '12px',
    lg: '20px',
  },
  fonts: {
    heading: 'Switzer, Inter, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
})

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themes={[defaultTheme, brandTheme]} defaultTheme="brand">
      <ThemeSwitcher className="fixed bottom-4 right-4" />
      {children}
    </ThemeProvider>
  )
}
` }), _jsx(Callout, { type: "tip", children: "Themes are serialisable JSON objects. Store them in your CMS or database to deliver enterprise-specific branding on the fly." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Token Reference" }), _jsxs("p", { children: ["All components reference CSS variables such as", ' ', _jsx("code", { children: "--chat-background" }), ", ", _jsx("code", { children: "--chat-border" }), ",", ' ', _jsx("code", { children: "--chat-font-body" }), ". Inspect them via browser devtools or the Theme Panel inside the docs site."] }), _jsx(CodeBlock, { language: "css", code: `:root {
  --chat-background: hsl(210 30% 98%);
  --chat-surface: hsl(215 25% 96%);
  --chat-border: hsl(215 18% 90%);
  --chat-primary: hsl(221 83% 53%);
  --chat-primary-foreground: hsl(0 0% 100%);
  --chat-radius-md: 12px;
  --chat-font-body: 'Inter', sans-serif;
}` }), _jsx(Callout, { type: "info", children: "Prefer Tailwind? The docs and Storybook use TailwindCSS with CSS variables mapped to utility classes. You can follow the same pattern." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Per-Component Overrides" }), _jsxs("p", { children: ["Override tokens per component using the ", _jsx("code", { children: "className" }), " /", _jsx("code", { children: "style" }), " props or by targeting CSS variables directly."] }), _jsx(CodeBlock, { language: "tsx", code: `<ChatWindow
  className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
  components={{
    Message: (props) => (
      <Message
        {...props}
        style={
          props.message.role === 'assistant'
            ? {
                ['--chat-surface' as any]: 'rgba(37, 99, 235, 0.08)',
                ['--chat-surface-foreground' as any]: '#0f172a',
              }
            : undefined
        }
      />
    ),
  }}
/>` }), _jsx(Callout, { type: "warning", children: "Remember accessibility: maintain the 7:1 contrast ratio from the default theme when introducing custom colours." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dark Mode & System Preference" }), _jsxs("p", { children: [_jsx("code", { children: "ThemeProvider" }), " watches ", _jsx("code", { children: "prefers-color-scheme" }), " and stores user overrides in localStorage. Expose a toggle via", ' ', _jsx("code", { children: "ThemeSwitcher" }), " or roll your own using the", ' ', _jsx("code", { children: "useTheme" }), " hook."] }), _jsx(CodeBlock, { language: "tsx", code: `import { useTheme } from '@clarity-chat/react'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full border border-border px-3 py-1 text-xs"
    >
      {resolvedTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Animations & Motion" }), _jsx("p", { children: "The theming system also controls motion through animation presets. See the Animations concept page for full details, but you can override duration/easing from the theme:" }), _jsx(CodeBlock, { language: "tsx", code: `const fastMotionTheme = createTheme({
  name: 'fast-motion',
  motion: {
    duration: {
      normal: 180,
      slow: 260,
    },
    easing: {
      default: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
  },
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Key Takeaways" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("code", { children: "ThemeProvider" }), " with presets or custom tokens."] }), _jsx("li", { children: "Override specific components using CSS variables for consistent results." }), _jsx("li", { children: "Provide light/dark or tenant-specific themes via the built-in switcher." }), _jsx("li", { children: "Keep accessibility in mind\u2014test contrast and motion preferences." })] })] })] }));
}
//# sourceMappingURL=page.js.map