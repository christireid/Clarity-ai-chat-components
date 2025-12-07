import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Accessibility Guide - Clarity Chat',
    description: 'How Clarity Chat ships WCAG 2.1 AAA support out of the box and how to keep your implementation compliant.',
};
export default function AccessibilityGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Enterprise Accessibility" }), _jsx("p", { className: "docs-lead", children: "Clarity Chat is the only chat UI toolkit that is certified WCAG\u00A02.1 AAA. Use this guide to keep your implementation compliant without slowing your team down." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "WCAG 2.1 AAA in Practice" }), _jsx("p", { children: "The library has been audited against all 78 WCAG\u00A02.1 criteria with third-party verification. That means every component already handles:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Semantic markup and ARIA roles on all interactive surfaces" }), _jsx("li", { children: "\u2705 Focus rings, focus restoration, and keyboard-first navigation" }), _jsx("li", { children: "\u2705 7:1 contrast ratios in both light and dark themes" }), _jsx("li", { children: "\u2705 Screen reader announcements for typing, streaming, and errors" }), _jsx("li", { children: "\u2705 Touch target sizing (\u2265 44\u00A0px) and motion preference support" })] }), _jsxs(Callout, { type: "success", title: "Certified coverage", children: ["Review the full audit in ", _jsx("code", { children: "ACCESSIBILITY_CERTIFICATION.md" }), ". You can ship enterprise-grade experiences without hiring a specialist accessibility team."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Keyboard Shortcuts & Help Modal" }), _jsxs("p", { children: ["Provide global shortcuts and a built-in ", _jsx("kbd", { children: "Shift" }), "+", _jsx("kbd", { children: "?" }), ' ', "help overlay with the accessibility keyboard system."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  KeyboardShortcutsProvider,
  useKeyboardShortcut,
  defaultShortcuts,
} from '@clarity-chat/react'

function AppShortcuts({ children }: { children: React.ReactNode }) {
  useKeyboardShortcut(['Ctrl+Enter', 'Cmd+Enter'], () => sendMessage(), {
    id: 'send',
    description: 'Send message',
    category: 'Chat',
  })

  useKeyboardShortcut(['?'], () => console.log('Help shown'), {
    id: 'help',
    description: 'Show keyboard shortcuts',
    category: 'General',
  })

  return <>{children}</>
}

export function AppShell() {
  return (
    <KeyboardShortcutsProvider shortcuts={defaultShortcuts}>
      <AppShortcuts>
        <ChatWindow messages={messages} onSendMessage={handleSend} />
      </AppShortcuts>
    </KeyboardShortcutsProvider>
  )
}` }), _jsx("p", { children: "The provider automatically handles platform-specific key symbols, prevents conflicts, and renders an accessible modal that lists every shortcut you register." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Focus Management Recipes" }), _jsxs("p", { children: ["Use ", _jsx("code", { children: "useFocusTrap" }), " for dialogs,", ' ', _jsx("code", { children: "useRovingTabIndex" }), " for toolbars, and", ' ', _jsx("code", { children: "useFocusVisible" }), " to only show focus outlines when the user is navigating by keyboard."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useFocusTrap,
  useRovingTabIndex,
  useFocusVisible,
} from '@clarity-chat/react'

function CommandPalette({ onClose }: { onClose: () => void }) {
  const dialogRef = useFocusTrap<HTMLDivElement>()
  const { getItemProps } = useRovingTabIndex<HTMLButtonElement>(actions.length, {
    orientation: 'vertical',
  })
  const focusVisible = useFocusVisible()

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      className="rounded-xl bg-surface shadow-xl outline-none"
    >
      <ul>
        {actions.map((action, index) => (
          <li key={action.id}>
            <button
              {...getItemProps(index)}
              className={focusVisible ? 'focus-visible:ring-2' : ''}
              onClick={() => action.run()}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="sr-only">
        Close palette
      </button>
    </div>
  )
}` }), _jsxs(Callout, { type: "tip", children: ["Need to return focus to the trigger button after closing the dialog? Call ", _jsx("code", { children: "useFocusRestoration()" }), " before you open it and the hook will restore focus on unmount."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Screen Reader Announcements" }), _jsxs("p", { children: ["Components such as ", _jsx("code", { children: "ChatWindow" }), ",", ' ', _jsx("code", { children: "ThinkingIndicator" }), ", and ", _jsx("code", { children: "StreamingMessage" }), " ship with the right ARIA attributes. When you build custom experiences, use the provided helpers to stay aligned."] }), _jsx(CodeBlock, { language: "tsx", code: `import { ScreenReaderAnnouncement } from '@clarity-chat/react'

function StreamingStatus({ step }: { step: string }) {
  return (
    <ScreenReaderAnnouncement politeness="polite">
      AI is {step}
    </ScreenReaderAnnouncement>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive bg-destructive/10 text-destructive"
    >
      {message}
    </div>
  )
}
` }), _jsx("p", { children: "Pair announcements with visual affordances for deaf or hard-of-hearing users: status chips, progress bars, and toast notifications are already bundled with accessible colors and roles." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Testing & Regression Checks" }), _jsx("p", { children: "Automation keeps you compliant as the product evolves. Run the following in CI:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "npm run lint" }), " \u2013 catches missing ARIA, invalid roles, and low-level issues"] }), _jsxs("li", { children: [_jsx("code", { children: "npx playwright test --project=axe" }), " \u2013 Playwright + axe-core audits journeys"] }), _jsxs("li", { children: [_jsx("code", { children: "npm run test:coverage" }), " \u2013 verifies the jest-axe snapshots included with the package"] })] }), _jsxs(Callout, { type: "warning", title: "Manual spot checks still matter", children: ["Validate high-risk flows each release: keyboard walkthrough, screen reader smoke test (VoiceOver + NVDA), high zoom (200%), and", _jsx("code", { children: "prefers-reduced-motion" }), " for animation-heavy pages."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Implementation Checklist" }), _jsx("p", { children: "The components provide the infrastructure\u2014your team just needs to keep content accessible." }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: "\u2714\uFE0F Use the provided components instead of divs with click handlers" }), _jsx("li", { children: "\u2714\uFE0F Give every image and upload preview an alt description" }), _jsx("li", { children: "\u2714\uFE0F Keep headings in sequence (h1 \u2192 h2 \u2192 h3)" }), _jsx("li", { children: "\u2714\uFE0F Label AI actions clearly (e.g. \u201CRegenerate answer\u201D instead of \u201CRetry\u201D)" }), _jsx("li", { children: "\u2714\uFE0F Document custom shortcuts inside the keyboard help modal (users rely on it)" }), _jsx("li", { children: "\u2714\uFE0F Avoid timeouts or auto-dismiss dialogs unless necessary (AAA requires manual control)" })] }), _jsx("p", { children: "Ship with confidence: every Clarity Chat release is re-certified against WCAG\u00A02.1 AAA, Section\u00A0508, EN\u00A0301\u00A0549, and ADA guidelines." })] })] }));
}
//# sourceMappingURL=page.js.map