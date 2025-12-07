import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Mobile Guide - Clarity Chat',
    description: 'Deliver frictionless chat experiences on iOS and Android: handle keyboards, gestures, safe areas, and haptics with Clarity Chat utilities.',
};
export default function MobileGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Mobile Experience" }), _jsx("p", { className: "docs-lead", children: "Ship chat UIs that feel native on phones and tablets. The toolkit handles keyboard behaviour, gestures, safe areas, and touch targets so you do not have to maintain two code paths." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Mobile-First Principles" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDCF1 Chat input never hides behind the keyboard" }), _jsx("li", { children: "\uD83D\uDC46 Touch targets meet WCAG AAA (\u2265 44 \u00D7 44\u00A0px)" }), _jsx("li", { children: "\uD83C\uDFAF Gestures feel intentional\u2014no jittery swipes" }), _jsx("li", { children: "\uD83D\uDD14 Haptic feedback reinforces key interactions" }), _jsx("li", { children: "\uD83E\uDDFB Safe areas keep content away from notches and home bars" })] }), _jsx(Callout, { type: "info", children: "All components ship responsive styles by default. This guide focuses on the extra hooks/utilities that help polish the mobile experience." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Keyboard-Aware Chat Input" }), _jsxs("p", { children: ["Use ", _jsx("code", { children: "useMobileKeyboard" }), " to detect the virtual keyboard, add padding, and optionally auto-scroll the focused input into view."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ChatWindow,
  useChat,
  useMobileKeyboard,
} from '@clarity-chat/react'

export function MobileChat() {
  const chat = useChat({ api: '/api/chat/mobile' })
  const keyboard = useMobileKeyboard({
    onKeyboardShow: (height) => console.log('Keyboard height', height),
    onKeyboardHide: () => console.log('Keyboard hidden'),
    autoScroll: true,
    scrollOffset: 24,
  })

  return (
    <div
      className="flex flex-col h-screen"
      style={{ paddingBottom: keyboard.keyboardHeight }}
    >
      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
        typingUsers={chat.typingUsers}
      />
      {keyboard.isMobile && (
        <div className="p-3 text-xs text-muted-foreground text-center">
          {keyboard.isKeyboardVisible ? 'Replying…' : 'Tap to start chatting'}
        </div>
      )}
    </div>
  )
}` }), _jsxs(Callout, { type: "tip", children: ["When ", _jsx("code", { children: "keyboard.autoScroll" }), " is true the hook scrolls the focused input into view using ", _jsx("code", { children: "visualViewport" }), " (iOS) or a debounced resize listener (Android)."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Gestures & Haptics" }), _jsxs("p", { children: ["Combine ", _jsx("code", { children: "useSwipe" }), ", ", _jsx("code", { children: "usePullToRefresh" }), ", and", ' ', _jsx("code", { children: "useLongPress" }), " to create mobile-specific gestures. Add tactile feedback with ", _jsx("code", { children: "hapticFeedback" }), "."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useSwipe,
  usePullToRefresh,
  useLongPress,
  hapticFeedback,
} from '@clarity-chat/react'

export function MobileThread({ children }: { children: React.ReactNode }) {
  const swipeHandlers = useSwipe((event) => {
    if (event.direction === 'right') {
      hapticFeedback('light')
      openCommandPalette()
    }
  }, 40)

  const refresh = usePullToRefresh(async () => {
    hapticFeedback('medium')
    await refetchMessages()
  })

  const longPress = useLongPress(() => {
    hapticFeedback('heavy')
    openAttachmentMenu()
  }, 450)

  return (
    <div
      {...swipeHandlers}
      {...refresh.handlers}
      {...longPress.handlers}
      className="relative"
    >
      {refresh.isPulling && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center text-xs text-muted-foreground"
          style={{ opacity: refresh.progress }}
        >
          Pull to refresh…
        </div>
      )}
      {children}
    </div>
  )
}` }), _jsx("p", { children: "Gesture utilities are pointer-agnostic. They fall back gracefully on desktop browsers, so you can reuse the same components everywhere." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Safe Areas & Touch Targets" }), _jsx("p", { children: "Respect device notches/home indicators and ensure tap targets meet accessibility rules." }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useSafeAreaInsets,
  getTouchTargetClass,
  TOUCH_TARGET,
} from '@clarity-chat/react'

function MobileActions() {
  const insets = useSafeAreaInsets()

  return (
    <div
      className="flex items-center justify-around bg-card border-t border-border"
      style={{ paddingBottom: insets.bottom || 12 }}
    >
      <button className={getTouchTargetClass('comfortable')}>🙂</button>
      <button className={getTouchTargetClass('comfortable')}>📎</button>
      <button className={getTouchTargetClass('large')}>🎙️</button>
    </div>
  )
}

console.log('Touch target minimum', TOUCH_TARGET.minimum) // 44
` }), _jsxs(Callout, { type: "warning", children: ["Avoid relying solely on icons. Pair them with accessible names (e.g.", _jsx("code", { children: "aria-label=\"Attach file\"" }), ") so screen reader users on mobile can understand the action."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Testing Matrix" }), _jsx("p", { children: "Before shipping a release, run through this checklist:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 iOS Safari + Chrome: open/close keyboard, copy/paste, scroll" }), _jsx("li", { children: "\u2705 Android Chrome: swipe gestures, pull-to-refresh, share sheet" }), _jsx("li", { children: "\u2705 Landscape orientation: ensure footer and call-to-action buttons stay visible" }), _jsx("li", { children: "\u2705 High contrast + reduced motion modes on both platforms" }), _jsx("li", { children: "\u2705 VoiceOver / TalkBack announces new messages and typing status" }), _jsx("li", { children: "\u2705 Check 320\u00A0px width for marketing checklists (App Store review!)" })] }), _jsx(Callout, { type: "success", children: "The marketing site and docs contain device preview iframes powered by the same components. Use them for quick smoke tests during QA." })] })] }));
}
//# sourceMappingURL=page.js.map