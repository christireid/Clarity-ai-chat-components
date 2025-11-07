import { GitBranch, Play, Eye, FileCode } from 'lucide-react'

export default function CodemodsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Codemods</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-2xl">
          Upgrade Clarity Chat projects in minutes. AST-powered codemods migrate breaking changes,
          rename APIs, and modernise configuration automatically.
        </p>
      </header>

      <section className="bg-bg-secondary rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">🚀 Quick Start</h2>
        <pre className="bg-bg rounded-lg p-4 overflow-x-auto">
          <code>{`npm install -D @clarity-chat/codemods

# Preview available transforms
clarity-codemod list

# Dry run v1 -> v2 migration
clarity-codemod run v1-to-v2 ./src --dry

# Apply changes
clarity-codemod run v1-to-v2 ./src`}</code>
        </pre>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Play className="w-6 h-6" />}
          title="Automated Migrations"
          description="Transforms handle breaking changes, prop renames, and configuration updates across versions."
        />
        <FeatureCard
          icon={<Eye className="w-6 h-6" />}
          title="Dry Run &amp; Verbose"
          description="Preview diffs, print transformed output, and enable verbose logs for confident upgrades."
        />
        <FeatureCard
          icon={<FileCode className="w-6 h-6" />}
          title="AST Precision"
          description="Built with jscodeshift, preserving formatting, comments, and unrelated code."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Available Transforms</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>
            <strong>v1-to-v2:</strong> renames <code>ChatWindow → ChatInterface</code>, updates props, and
            modernises API key handling.
          </li>
          <li>
            <strong>Migrations:</strong> chain multiple transforms with <code>clarity-codemod migrate 1 3</code>
            to hop versions safely.
          </li>
          <li>
            <strong>Custom scenarios:</strong> extend with your own transforms using the exported
            TypeScript helpers.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Best Practices</h2>
        <ol className="list-decimal list-inside text-text-secondary space-y-1">
          <li>Commit your branch before running codemods.</li>
          <li>Run with <code>--dry --print</code> to inspect changes.</li>
          <li>Apply changes, review git diff, then run tests + lint.</li>
          <li>Use <code>--parser</code> when working with non-TSX files.</li>
        </ol>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  )
}
