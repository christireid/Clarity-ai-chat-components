import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Mobile Guide - Clarity Chat',
  description:
    'Deliver frictionless chat experiences on iOS and Android: handle keyboards, gestures, safe areas, and haptics with Clarity Chat utilities.',
}

export default function MobileGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Mobile Experience</h1>
        <p className="docs-lead">
          Ship chat UIs that feel native on phones and tablets. The toolkit
          handles keyboard behaviour, gestures, safe areas, and touch targets so
          you do not have to maintain two code paths.
        </p>
      </div>

      <section className="docs-section">
        <h2>Mobile-First Principles</h2>
        <ul>
          <li>📱 Chat input never hides behind the keyboard</li>
          <li>👆 Touch targets meet WCAG AAA (≥ 44 × 44&nbsp;px)</li>
          <li>🎯 Gestures feel intentional—no jittery swipes</li>
          <li>🔔 Haptic feedback reinforces key interactions</li>
          <li>🧻 Safe areas keep content away from notches and home bars</li>
        </ul>
        <Callout type="info">
          All components ship responsive styles by default. This guide focuses
          on the extra hooks/utilities that help polish the mobile experience.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Keyboard-Aware Chat Input</h2>
        <p>
          Use <code>useMobileKeyboard</code> to detect the virtual keyboard, add
          padding, and optionally auto-scroll the focused input into view.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  ChatWindow,
  useChat,
  useMobileKeyboard,
} from '@clarity-chat/react'

export function MobileChat() {
  const chat = useChat({ api: '/api/chat/mobile' })
  const keyboard = useMobileKeyboard({
    onKeyboardShow: (height) => logger.debug('Keyboard height', height),
    onKeyboardHide: () => logger.debug('Keyboard hidden'),
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
}`}
        />
        <Callout type="tip">
          When <code>keyboard.autoScroll</code> is true the hook scrolls the
          focused input into view using <code>visualViewport</code> (iOS) or a
          debounced resize listener (Android).
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Gestures &amp; Haptics</h2>
        <p>
          Combine <code>useSwipe</code>, <code>usePullToRefresh</code>, and{' '}
          <code>useLongPress</code> to create mobile-specific gestures. Add
          tactile feedback with <code>hapticFeedback</code>.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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
}`}
        />
        <p>
          Gesture utilities are pointer-agnostic. They fall back gracefully on
          desktop browsers, so you can reuse the same components everywhere.
        </p>
      </section>

      <section className="docs-section">
        <h2>Safe Areas &amp; Touch Targets</h2>
        <p>
          Respect device notches/home indicators and ensure tap targets meet
          accessibility rules.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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

logger.debug('Touch target minimum', TOUCH_TARGET.minimum) // 44
`}
        />
        <Callout type="warning">
          Avoid relying solely on icons. Pair them with accessible names (e.g.
          <code>aria-label="Attach file"</code>) so screen reader users on
          mobile can understand the action.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Testing Matrix</h2>
        <p>Before shipping a release, run through this checklist:</p>
        <ul>
          <li>
            ✅ iOS Safari + Chrome: open/close keyboard, copy/paste, scroll
          </li>
          <li>
            ✅ Android Chrome: swipe gestures, pull-to-refresh, share sheet
          </li>
          <li>
            ✅ Landscape orientation: ensure footer and call-to-action buttons
            stay visible
          </li>
          <li>✅ High contrast + reduced motion modes on both platforms</li>
          <li>
            ✅ VoiceOver / TalkBack announces new messages and typing status
          </li>
          <li>
            ✅ Check 320&nbsp;px width for marketing checklists (App Store
            review!)
          </li>
        </ul>
        <Callout type="success">
          The marketing site and docs contain device preview iframes powered by
          the same components. Use them for quick smoke tests during QA.
        </Callout>
      </section>
    </div>
  )
}
