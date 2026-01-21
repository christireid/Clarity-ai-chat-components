import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Component Composition',
  description: 'Utilities for composing and enhancing Clarity Chat components.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Component Composition</h1>
        <p className="lead">
          Utilities for composing, combining, and extending Clarity Chat components
          with minimal boilerplate and maximum flexibility.
        </p>
      </div>

      <div className="docs-section">
        <h2>🎯 Component Composition</h2>
        <p>Combine multiple components into cohesive layouts.</p>

        <div className="code-block">
          <pre><code>{`import { composeComponents } from '@clarity-chat/react'

const CustomChat = composeComponents({
  Header: ({ title }) => <h1>{title}</h1>,
  Messages: MessageList,
  Input: ChatInput
})

export function App() {
  return <CustomChat title="My Chat" api="/api/chat" />
}`}</code></pre>
        </div>

        <h3>Pre-built Compositions</h3>
        <div className="code-block">
          <pre><code>{`import { Compositions } from '@clarity-chat/react'

export function SidebarChat() {
  return (
    <Compositions.SidebarChat>
      <Sidebar>
        <UserList />
      </Sidebar>
      <ChatWindow api="/api/chat" />
    </Compositions.SidebarChat>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Higher-Order Components</h2>
        <p>Enhance components with additional props or behavior.</p>

        <h3>withProps - Add default props</h3>
        <div className="code-block">
          <pre><code>{`import { withProps } from '@clarity-chat/react'

const ThemedChat = withProps(ClarityChat, () => ({
  className: 'dark-theme',
  theme: { mode: 'dark' }
}))

export function App() {
  return <ThemedChat api="/api/chat" /> // Has dark theme by default
}`}</code></pre>
        </div>

        <h3>withDefaults - Set default values</h3>
        <div className="code-block">
          <pre><code>{`import { withDefaults } from '@clarity-chat/react'

const ChatWithDefaults = withDefaults(ClarityChat, {
  showHeader: true,
  memory: { enabled: true },
  rateLimiting: { enabled: true }
})

export function App() {
  return <ChatWithDefaults api="/api/chat" /> // All features enabled
}`}</code></pre>
        </div>

        <h3>conditional - Show components conditionally</h3>
        <div className="code-block">
          <pre><code>{`import { conditional } from '@clarity-chat/react'

const MobileChat = conditional(
  (props) => props.isMobile,
  MobileChatComponent,
  DesktopChatComponent
)

export function ResponsiveApp({ isMobile }) {
  return <MobileChat isMobile={isMobile} api="/api/chat" />
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🏗️ Component Variants</h2>
        <p>Create component variants with different styles/behaviors.</p>

        <div className="code-block">
          <pre><code>{`import { withVariants } from '@clarity-chat/react'

const Button = withVariants(ChatInput, {
  primary: { className: 'btn-primary' },
  secondary: { className: 'btn-secondary' },
  danger: { className: 'btn-danger' }
})

export function App() {
  return (
    <div>
      <Button variant="primary" api="/api/chat" />
      <Button variant="secondary" api="/api/chat" />
    </div>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📐 Layout Helpers</h2>
        <p>Responsive layouts and flex utilities.</p>

        <h3>Grid Layouts</h3>
        <div className="code-block">
          <pre><code>{`import { createGridLayout } from '@clarity-chat/react'

const ThreeColumnLayout = createGridLayout({ sm: 1, md: 2, lg: 3 })

export function Dashboard() {
  return (
    <ThreeColumnLayout>
      <ChatWindow api="/api/chat1" />
      <ChatWindow api="/api/chat2" />
      <AnalyticsPanel />
    </ThreeColumnLayout>
  )
}`}</code></pre>
        </div>

        <h3>Flex Layouts</h3>
        <div className="code-block">
          <pre><code>{`import { FlexLayouts } from '@clarity-chat/react'

export function ChatLayout() {
  return (
    <FlexLayouts.VStack gap={4}>
      <FlexLayouts.HStack>
        <UserAvatar />
        <ChatWindow api="/api/chat" />
      </FlexLayouts.HStack>
      <FlexLayouts.SpaceBetween>
        <StatusIndicator />
        <SettingsButton />
      </FlexLayouts.SpaceBetween>
    </FlexLayouts.VStack>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔗 Hook Composition</h2>
        <p>Combine multiple hooks into custom logic.</p>

        <div className="code-block">
          <pre><code>{`import { composeHooks } from '@clarity-chat/react'

const useCustomChat = composeHooks([
  [useClarityChat, [{ api: '/api/chat' }]],
  [useLocalStorage, ['chat-settings', {}]],
  [useTheme, []]
])

export function CustomChatComponent() {
  const [chat, settings, theme] = useCustomChat()

  return (
    <div style={{ background: theme.background }}>
      <ChatWindow {...chat} />
      <SettingsPanel settings={settings} />
    </div>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎭 Context Providers</h2>
        <p>Create custom context providers with hooks.</p>

        <div className="code-block">
          <pre><code>{`import { createContextProvider } from '@clarity-chat/react'

const [ChatSettingsProvider, useChatSettings] = createContextProvider({
  theme: 'light',
  soundEnabled: true,
  notificationsEnabled: false
})

export function App() {
  return (
    <ChatSettingsProvider>
      <ChatWindow api="/api/chat" />
      <SettingsPanel />
    </ChatSettingsProvider>
  )
}

function SettingsPanel() {
  const settings = useChatSettings()
  // Access settings...
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🛠️ API Reference</h2>

        <h3>composeComponents</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>composeComponents(components, layout?): Component</code>
            <p>Combine multiple components into a single component.</p>
          </div>
        </div>

        <h3>withProps</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>withProps(Component, enhancer): Component</code>
            <p>Enhance a component with additional props.</p>
          </div>
        </div>

        <h3>withDefaults</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>withDefaults(Component, defaults): Component</code>
            <p>Set default props for a component.</p>
          </div>
        </div>

        <h3>conditional</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>conditional(condition, Component, fallback?): Component</code>
            <p>Render component conditionally based on props.</p>
          </div>
        </div>

        <h3>withVariants</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>withVariants(Component, variants): Component</code>
            <p>Create component variants with different configurations.</p>
          </div>
        </div>

        <h3>transformProps</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>transformProps(transformer): HOC</code>
            <p>Create HOC that transforms props.</p>
          </div>
        </div>

        <h3>createGridLayout</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createGridLayout(columns): Component</code>
            <p>Create responsive grid layout component.</p>
          </div>
        </div>

        <h3>FlexLayouts</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>FlexLayouts.VStack, HStack, Center, SpaceBetween</code>
            <p>Pre-configured flex layout components.</p>
          </div>
        </div>

        <h3>composeHooks</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>composeHooks(hooks): Hook</code>
            <p>Combine multiple hooks into a single hook.</p>
          </div>
        </div>

        <h3>createContextProvider</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createContextProvider(initialValue): [Provider, useHook]</code>
            <p>Create context provider with custom hook.</p>
          </div>
        </div>

        <h3>Compositions</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>Compositions.BasicChat, SidebarChat, ToolbarChat, ModalChat</code>
            <p>Pre-built component compositions.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Component Composition</h3>
        <ul>
          <li>Use <code>composeComponents</code> for layout combinations</li>
          <li>Use <code>withProps</code> for theme/style enhancements</li>
          <li>Use <code>conditional</code> for responsive behavior</li>
          <li>Keep compositions focused and reusable</li>
        </ul>

        <h3>Higher-Order Components</h3>
        <ul>
          <li>Use <code>withDefaults</code> for common configurations</li>
          <li>Use <code>withVariants</code> for style variations</li>
          <li>Compose HOCs for complex enhancements</li>
          <li>Document the props interface clearly</li>
        </ul>

        <h3>Hooks and Context</h3>
        <ul>
          <li>Use <code>composeHooks</code> for related state logic</li>
          <li>Use <code>createContextProvider</code> for shared state</li>
          <li>Provide clear error boundaries</li>
          <li>Test hook compositions thoroughly</li>
        </ul>

        <h3>Layout and Styling</h3>
        <ul>
          <li>Use <code>FlexLayouts</code> for simple arrangements</li>
          <li>Use <code>createGridLayout</code> for complex grids</li>
          <li>Consider responsive behavior</li>
          <li>Test layouts across screen sizes</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>Custom Chat Component</h3>
        <div className="code-block">
          <pre><code>{`import { composeComponents, withDefaults } from '@clarity-chat/react'

const CustomChat = composeComponents({
  Header: ({ title, status }) => (
    <div className="flex items-center gap-2">
      <h2>{title}</h2>
      <StatusIndicator status={status} />
    </div>
  ),
  Messages: MessageList,
  Input: withDefaults(ChatInput, { placeholder: 'Type your message...' })
})

export function EnterpriseChat({ title, status }) {
  return <CustomChat title={title} status={status} api="/api/chat" />
}`}</code></pre>
        </div>

        <h3>Responsive Layout</h3>
        <div className="code-block">
          <pre><code>{`import { createGridLayout, conditional } from '@clarity-chat/react'

const ResponsiveLayout = createGridLayout({ sm: 1, lg: 2 })

const ResponsiveChat = conditional(
  (props) => props.layout === 'split',
  () => (
    <ResponsiveLayout>
      <ChatWindow api="/api/chat" />
      <SidebarPanel />
    </ResponsiveLayout>
  ),
  ChatWindow
)

export function App({ layout }) {
  return <ResponsiveChat layout={layout} api="/api/chat" />
}`}</code></pre>
        </div>

        <h3>Theme Variants</h3>
        <div className="code-block">
          <pre><code>{`import { withVariants, ThemePresets } from '@clarity-chat/react'

const ThemedChat = withVariants(ClarityChat, {
  light: { theme: ThemePresets.Light },
  dark: { theme: ThemePresets.Dark },
  minimal: { theme: ThemePresets.Minimal }
})

export function ThemedApp({ theme }) {
  return <ThemedChat variant={theme} api="/api/chat" />
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Composition not rendering</h4>
            <p>Check that all component keys are unique and components are properly imported.</p>
          </div>
          <div className="issue">
            <h4>HOC props not working</h4>
            <p>Ensure the component accepts the props you're trying to enhance.</p>
          </div>
          <div className="issue">
            <h4>Hook composition failing</h4>
            <p>Check that hooks are called in the correct order and return compatible types.</p>
          </div>
          <div className="issue">
            <h4>Layout not responsive</h4>
            <p>Verify CSS classes are properly applied and responsive breakpoints are set.</p>
          </div>
        </div>
      </div>
    </div>
  )
}