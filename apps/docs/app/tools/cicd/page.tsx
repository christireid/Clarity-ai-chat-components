import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CI/CD Automation - Developer Tools',
  description:
    'Reference pipeline, workflows, and scripts for shipping Clarity Chat safely.',
}

export default function CicdToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Automation</span>
        <h1>CI/CD Reference Pipeline</h1>
        <p className="docs-lead">
          The repository includes a production-ready CI/CD recipe tested during the
          “CI/CD Final Status” audit. Use it as-is or tailor it to your platform.
        </p>
      </div>

      <section className="docs-section">
        <h2>Workflow Overview</h2>
        <ul>
          <li>🔁 Trigger on PRs to <code>main</code> and on every push</li>
          <li>🏗️ Jobs: lint, unit tests, Playwright, typecheck, bundle analysis</li>
          <li>📦 Caches: Turbo repo + npm for repeatable builds</li>
          <li>📜 Artifacts: bundle-report, benchmark-report, Playwright traces</li>
          <li>🚀 Deployment: Vercel preview builds + manual promotion to production</li>
        </ul>
        <Callout type="info">
          Review the{' '}
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/blob/main/CI_CD_FINAL_STATUS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            CI_CD_FINAL_STATUS.md
          </a>{' '}
          on GitHub for the original audit notes, pass/fail logs, and recommendations.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>GitHub Actions Workflow</h2>
        <CodeBlock
          language="yaml"
          code={`name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run test:e2e
      - run: npm run analyze
      - run: npm run benchmark
      - name: Upload bundle report
        uses: actions/upload-artifact@v4
        with:
          name: bundle-report
          path: bundle-reports/**
      - name: Upload benchmark report
        uses: actions/upload-artifact@v4
        with:
          name: benchmark-report
          path: benchmark-results/**
`}
        />
      </section>

      <section className="docs-section">
        <h2>Pre-Commit Hooks</h2>
        <p>
          Husky + lint-staged ensure code quality before it hits CI. This keeps your
          pipeline fast and reduces noise.
        </p>
        <CodeBlock
          language="json"
          code={`{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,json}": [
      "prettier --write"
    ]
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Deployment</h2>
        <ul>
          <li>
            <strong>Docs Site</strong>: <code>npm run docs:build</code> &gt; deploy via Vercel (`vercel deploy --prod apps/docs`)
          </li>
          <li>
            <strong>Marketing Site</strong>: same pipeline, different workspace
          </li>
          <li>
            <strong>Packages</strong>: use Changesets <code>npm run release</code> to version + publish
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Secrets &amp; Config</h2>
        <p>
          Store provider keys in platform secrets (Vercel, GitHub Actions, HashiCorp
          Vault). The <code>clarity-chat doctor</code> command validates required
          environment variables before deploy.
        </p>
      </section>

      <section className="docs-section">
        <h2>Rollbacks &amp; Incident Response</h2>
        <ul>
          <li>
            <code>clarity-chat upgrade --rollback</code> to revert dependency upgrades
          </li>
          <li>
            Use <code>getTracer()</code> logs to identify failing models/providers
          </li>
          <li>
            Replay audit and quota logs to confirm impact scope
          </li>
        </ul>
      </section>
    </div>
  )
}

