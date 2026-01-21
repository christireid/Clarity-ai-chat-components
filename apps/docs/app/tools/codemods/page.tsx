import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: '@clarity-chat/codemods - Developer Tools',
  description:
    'Automated jscodeshift transforms for upgrading Clarity Chat projects safely.',
}

export default function CodemodsToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Package</span>
        <h1>@clarity-chat/codemods</h1>
        <p className="docs-lead">
          Upgrade across major versions without manually touching hundreds of
          files. These codemods are the same ones we run internally during
          releases.
        </p>
      </div>

      <section className="docs-section">
        <h2>Installation</h2>
        <CodeBlock
          language="bash"
          code={`npm install -D @clarity-chat/codemods
# or run without installing
npx @clarity-chat/codemods`}
        />
      </section>

      <section className="docs-section">
        <h2>Common Commands</h2>
        <CodeBlock
          language="bash"
          code={`# List available codemods
clarity-codemod list

# Preview v1 -> v2 migration (no changes written)
clarity-codemod run v1-to-v2 ./src --dry --print

# Apply migration
clarity-codemod run v1-to-v2 ./src

# Chain multiple migrations (v1 -> v3)
clarity-codemod migrate 1 3 ./src --dry
clarity-codemod migrate 1 3 ./src`}
        />
        <Callout type="warning">
          Always commit before running codemods and start with{' '}
          <code>--dry</code> +<code>--print</code>. The tool preserves
          formatting/comments, but version control is your safety net.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Transforms Included</h2>
        <ul>
          <li>
            <strong>v1-to-v2</strong> — renames props, updates component names,
            adjusts config schema
          </li>
          <li>
            <strong>v2-to-v3</strong> — (example) reorganises streaming APIs,
            updates token helpers
          </li>
          <li>
            <strong>Custom</strong> — add your own by registering transforms in{' '}
            <code>src/transforms</code>
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Before &amp; After Preview</h2>
        <CodeBlock
          language="tsx"
          code={`// Before (v1)
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  onMessage={(msg) => console.log(msg)}
  config={{ apiKey: process.env.CLARITY_KEY }}
/>

// After (v2)
import { ChatInterface } from '@clarity-chat/react'

<ChatInterface
  onSend={(msg) => console.log(msg)}
  config={{ credentials: { apiKey: process.env.CLARITY_KEY } }}
/>
`}
        />
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <ul>
          <li>Run lint and tests after applying transforms</li>
          <li>
            Use <code>--parser</code> to switch between <code>babel</code>,{' '}
            <code>ts</code>, and <code>tsx</code> as needed
          </li>
          <li>
            Add <code>--verbose</code> for detailed logs when debugging
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Extending</h2>
        <p>
          Codemods are powered by jscodeshift. Create a new transform file,
          export a<code>Transform</code>, and register it in{' '}
          <code>src/transforms/index.ts</code>. Use the provided tests as a
          template for coverage.
        </p>
      </section>
    </div>
  )
}
