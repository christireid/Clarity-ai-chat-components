import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useMobileKeyboard - Clarity Chat Components',
  description:
    'Detect mobile keyboard visibility and height for improved mobile UX.',
}

const optionsProps: Prop[] = [
  {
    name: 'onKeyboardShow',
    type: '(height: number) => void',
    description: 'Callback when keyboard shows',
  },
  {
    name: 'onKeyboardHide',
    type: '() => void',
    description: 'Callback when keyboard hides',
  },
  {
    name: 'debounceDelay',
    type: 'number',
    description: 'Debounce delay for resize events in ms (default: 150)',
  },
  {
    name: 'autoScroll',
    type: 'boolean',
    description: 'Enable auto-scroll to focused input (default: true)',
  },
  {
    name: 'scrollOffset',
    type: 'number',
    description: 'Additional offset for auto-scroll in px (default: 20)',
  },
]

export default function UseMobileKeyboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useMobileKeyboard</h1>
        <p className="docs-lead">
          Detect mobile keyboard visibility and height for improved mobile UX
          with auto-scroll and viewport handling.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Detect mobile keyboard visibility',
          'Get keyboard height',
          'Auto-scroll to focused inputs',
          'Handle keyboard show/hide events',
          'Improve mobile chat UX',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Detect keyboard visibility and adjust UI:</p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react/internal'

function MobileChatInput() {
  const { isKeyboardVisible, keyboardHeight, isMobile } = useMobileKeyboard()

  return (
    <div style={{ paddingBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
      <input placeholder="Type a message..." />
      {isKeyboardVisible && (
        <div>Keyboard height: {keyboardHeight}px</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Auto-Scroll</h2>
        <p>Automatically scroll focused input into view:</p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react/internal'

function AutoScrollInput() {
  const { isKeyboardVisible } = useMobileKeyboard({
    autoScroll: true,      // Enable auto-scroll
    scrollOffset: 20,      // 20px offset
  })

  return (
    <div>
      <input placeholder="This will scroll into view when focused" />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Keyboard Events</h2>
        <p>Handle keyboard show/hide events:</p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react/internal'

function WithEvents() {
  const { isKeyboardVisible } = useMobileKeyboard({
    onKeyboardShow: (height) => {
      logger.debug('Keyboard shown, height:', height)
      // Adjust UI, show compact header, etc.
    },
    onKeyboardHide: () => {
      logger.debug('Keyboard hidden')
      // Restore UI, show full header, etc.
    },
  })

  return (
    <div>
      {isKeyboardVisible ? (
        <div>Compact view</div>
      ) : (
        <div>Full view</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conditional Rendering</h2>
        <p>Conditionally render based on keyboard state:</p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react/internal'

function ConditionalUI() {
  const { isKeyboardVisible, isMobile } = useMobileKeyboard()

  if (!isMobile) {
    return <DesktopView />
  }

  if (isKeyboardVisible) {
    return <CompactMobileView />
  }

  return <FullMobileView />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Chat Input Adjustment</h2>
        <p>Adjust chat input position when keyboard appears:</p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react/internal'

function ChatInput() {
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard({
    autoScroll: true,
  })

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isKeyboardVisible ? keyboardHeight : 0,
        left: 0,
        right: 0,
        transition: 'bottom 0.3s ease',
      }}
    >
      <input placeholder="Type a message..." />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>isKeyboardVisible</code>: Whether keyboard is currently
            visible
          </li>
          <li>
            <code>keyboardHeight</code>: Estimated keyboard height in pixels
          </li>
          <li>
            <code>isMobile</code>: Whether device is mobile
          </li>
          <li>
            <code>originalViewportHeight</code>: Original viewport height before
            keyboard
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Platform Support</h2>
        <ul>
          <li>
            <strong>iOS</strong>: Uses visualViewport API and focusin/focusout
            events
          </li>
          <li>
            <strong>Android</strong>: Uses window resize detection
          </li>
          <li>
            <strong>Desktop</strong>: Falls back gracefully, returns false for
            keyboard visibility
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Enable <code>autoScroll</code> to improve UX on mobile
          </li>
          <li>
            Use <code>scrollOffset</code> to add spacing above keyboard
          </li>
          <li>
            Handle <code>onKeyboardShow</code> to adjust UI layout
          </li>
          <li>
            Check <code>isMobile</code> before applying mobile-specific logic
          </li>
          <li>
            Use <code>keyboardHeight</code> to adjust fixed position elements
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/mobile-optimization">Mobile Optimization Guide</a>{' '}
            - Mobile best practices
          </li>
          <li>
            <a href="/reference/components/chat-input">ChatInput</a> - Chat
            input component
          </li>
        </ul>
      </section>
    </div>
  )
}
