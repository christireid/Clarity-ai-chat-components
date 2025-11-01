import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Copy Button | Clarity Chat',
  description: 'One-click copy to clipboard button with success feedback.'
}

export default function CopyButtonPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Copy Button</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Accessible copy-to-clipboard button with visual success feedback using the useClipboard hook.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>One-click copy to clipboard</li>
          <li>Visual success feedback (icon change)</li>
          <li>Customizable timeout (default 2s)</li>
          <li>Icon-only or text mode</li>
          <li>Custom copy/copied labels</li>
          <li>Success callback on copy</li>
          <li>Built on accessible Button component</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { CopyButton } from '@clarity-chat/react'

<CopyButton 
  text="Hello, world!" 
  onCopy={() => console.log('Copied!')}
/>

// Icon only
<CopyButton 
  text={codeSnippet} 
  iconOnly 
/>

// Custom labels
<CopyButton
  text={data}
  copyText="Copy Code"
  copiedText="Code Copied!"
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Prop</th>
                <th className="p-2">Type</th>
                <th className="p-2">Default</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">text</td>
                <td className="p-2">string</td>
                <td className="p-2">-</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onCopy</td>
                <td className="p-2">() =&gt; void</td>
                <td className="p-2">-</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">iconOnly</td>
                <td className="p-2">boolean</td>
                <td className="p-2">false</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">copyText</td>
                <td className="p-2">string</td>
                <td className="p-2">"Copy"</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">copiedText</td>
                <td className="p-2">string</td>
                <td className="p-2">"Copied!"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/hooks/use-clipboard" className="text-primary hover:underline">useClipboard Hook</a></li>
        </ul>
      </section>
    </div>
  )
}
