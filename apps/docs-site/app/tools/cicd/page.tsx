import { Workflow, GitBranch, ShieldCheck } from 'lucide-react'

export default function CICDToolsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Workflow className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">CI/CD Automation</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-2xl">
          Five GitHub Actions workflows manage quality gates, releases, dependency updates, and preview
          deployments. Everything runs in parallel with caching for sub-minute feedback.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <WorkflowCard
          icon={<ShieldCheck className="w-6 h-6" />}
          title="quality.yml"
          description="Runs lint, typecheck, unit tests, e2e tests, and accessibility audits on every PR."
          steps={[
            'Turbo remote cache for installs + builds',
            'Vitest coverage report upload',
            'Playwright traces + screenshots on failure',
            'Bundle size regression check',
          ]}
        />
        <WorkflowCard
          icon={<GitBranch className="w-6 h-6" />}
          title="release.yml"
          description="Changesets-driven release pipeline with npm publish, GitHub release notes, and docs deploy."
          steps={[
            'Version packages via changesets',
            'Publish to npm with provenance',
            'Trigger docs-site static export',
            'Notify Slack webhook on success',
          ]}
        />
        <WorkflowCard
          icon={<Workflow className="w-6 h-6" />}
          title="preview.yml"
          description="Deploys preview docs to Vercel and marketing site to Netlify for stakeholder review."
          steps={[
            'PR comment with preview URLs',
            'Smoke tests against preview environments',
            'Auto-expire previews on merge',
          ]}
        />
        <WorkflowCard
          icon={<Workflow className="w-6 h-6" />}
          title="renovate.json"
          description="Automated dependency updates with grouping rules, test runs, and release notes."
          steps={[
            'Weekly dependency batches',
            'Automatic compatibility tests',
            'Labels and assignees preconfigured',
          ]}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Secrets &amp; Caching</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>GitHub OIDC auth for npm publish (no long-lived tokens).</li>
          <li>Turbo + Playwright caches persisted between jobs for fast reruns.</li>
          <li>Artifact uploads for Storybook, Playwright traces, and bundle reports.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Status Dashboards</h2>
        <p className="text-text-secondary">
          Each workflow posts a summary comment with coverage metrics, bundle size diff, failing suites,
          and preview URLs—mirroring the React.dev editorial workflow.
        </p>
      </section>
    </div>
  )
}

function WorkflowCard({
  icon,
  title,
  description,
  steps,
}: {
  icon: React.ReactNode
  title: string
  description: string
  steps: string[]
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
      <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
        {steps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
