import { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'


export const metadata: Metadata = {
  title: 'Customization Guide - Clarity Chat',
  description: 'Learn how to customize Clarity Chat components to match your brand and design system.',
}

export default function CustomizationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Customization</h1>
        <p className="docs-lead">
          Learn how to customize Clarity Chat components to match your brand,
          design system, and specific requirements.
        </p>
      </div>

      <Callout type="tip" className="my-6">
        For advanced customization strategies including component composition and
        extending functionality, see the{' '}
        <Link href="/guides/customization-strategies" className="font-medium underline">
          Customization Strategies
        </Link>{' '}
        guide.
      </Callout>

      <section className="docs-section">
        <h2>Theme Customization</h2>
        <p>
          Clarity Chat uses CSS variables for theming, making it easy to customize
          colors, typography, and spacing to match your brand.
        </p>

        <CodePlayground
          code={`// In your global CSS or Tailwind config
:root {
  --clarity-brand-50: #f0f9ff;
  --clarity-brand-500: #0ea5e9;
  --clarity-brand-600: #0284c7;

  --clarity-radius-sm: 0.25rem;
  --clarity-radius-md: 0.375rem;
  --clarity-radius-lg: 0.5rem;
}

.dark {
  --clarity-brand-50: #0c1929;
  --clarity-brand-500: #38bdf8;
  --clarity-brand-600: #0ea5e9;
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Props</h2>
        <p>
          All Clarity Chat components accept standard styling props for quick customization:
        </p>

        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function MyChat() {
  return (
    <ClarityChat
      api="/api/chat"
      className="max-w-2xl mx-auto rounded-xl shadow-lg"
      theme="system"
      appearance={{
        avatarStyle: 'rounded',
        messageStyle: 'bubble',
        inputStyle: 'minimal',
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Tailwind CSS Integration</h2>
        <p>
          Clarity Chat works seamlessly with Tailwind CSS. Use Tailwind classes
          directly on components or configure the design tokens in your Tailwind config:
        </p>

        <CodePlayground
          code={`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--clarity-brand-50)',
          500: 'var(--clarity-brand-500)',
          600: 'var(--clarity-brand-600)',
        },
      },
      borderRadius: {
        chat: 'var(--clarity-radius-lg)',
      },
    },
  },
}`}
        />
      </section>

      <section className="docs-section">
        <h2>CSS-in-JS Support</h2>
        <p>
          For CSS-in-JS libraries like styled-components or Emotion, access design
          tokens via the <code>useDesignTokens</code> hook:
        </p>

        <CodePlayground
          code={`import { useDesignTokens } from '@clarity-chat/react'
import styled from 'styled-components'

function CustomMessage({ content }) {
  const tokens = useDesignTokens()

  return (
    <StyledMessage $tokens={tokens}>
      {content}
    </StyledMessage>
  )
}

const StyledMessage = styled.div\`
  border-radius: \${props => props.$tokens.radius.lg};
  box-shadow: \${props => props.$tokens.shadows.md};
  padding: 1rem;
\``}
        />
      </section>

      <section className="docs-section">
        <h2>Related Guides</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/guides/customization-strategies"
            className="docs-card"
          >
            <h3>Customization Strategies</h3>
            <p>Advanced patterns for customizing components.</p>
          </Link>
          <Link
            href="/guides/theming"
            className="docs-card"
          >
            <h3>Theming Guide</h3>
            <p>Complete theming system documentation.</p>
          </Link>
          <Link
            href="/reference/hooks/use-design-tokens"
            className="docs-card"
          >
            <h3>useDesignTokens Hook</h3>
            <p>Programmatic access to design tokens.</p>
          </Link>
          <Link
            href="/cookbook/custom-theming"
            className="docs-card"
          >
            <h3>Custom Theming Recipe</h3>
            <p>Step-by-step theming implementation.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
