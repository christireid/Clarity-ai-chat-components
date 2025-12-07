import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import Link from 'next/link';
export const metadata = {
    title: 'CI/CD Automation - Developer Tools',
    description: 'Reference pipeline, workflows, and scripts for shipping Clarity Chat safely.',
};
export default function CicdToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Automation" }), _jsx("h1", { children: "CI/CD Reference Pipeline" }), _jsx("p", { className: "docs-lead", children: "The repository includes a production-ready CI/CD recipe tested during the \u201CCI/CD Final Status\u201D audit. Use it as-is or tailor it to your platform." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Workflow Overview" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDD01 Trigger on PRs to ", _jsx("code", { children: "main" }), " and on every push"] }), _jsx("li", { children: "\uD83C\uDFD7\uFE0F Jobs: lint, unit tests, Playwright, typecheck, bundle analysis" }), _jsx("li", { children: "\uD83D\uDCE6 Caches: Turbo repo + npm for repeatable builds" }), _jsx("li", { children: "\uD83D\uDCDC Artifacts: bundle-report, benchmark-report, Playwright traces" }), _jsx("li", { children: "\uD83D\uDE80 Deployment: Vercel preview builds + manual promotion to production" })] }), _jsxs(Callout, { type: "info", children: ["Review ", _jsx(Link, { href: "/CI_CD_FINAL_STATUS", children: "CI_CD_FINAL_STATUS.md" }), " for the original audit notes, pass/fail logs, and recommendations."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "GitHub Actions Workflow" }), _jsx(CodeBlock, { language: "yaml", code: `name: CI

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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Pre-Commit Hooks" }), _jsx("p", { children: "Husky + lint-staged ensure code quality before it hits CI. This keeps your pipeline fast and reduces noise." }), _jsx(CodeBlock, { language: "json", code: `{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,json}": [
      "prettier --write"
    ]
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Deployment" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Docs Site" }), ": ", _jsx("code", { children: "npm run docs:build" }), " > deploy via Vercel (`vercel deploy --prod apps/docs`)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Marketing Site" }), ": same pipeline, different workspace"] }), _jsxs("li", { children: [_jsx("strong", { children: "Packages" }), ": use Changesets ", _jsx("code", { children: "npm run release" }), " to version + publish"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Secrets & Config" }), _jsxs("p", { children: ["Store provider keys in platform secrets (Vercel, GitHub Actions, HashiCorp Vault). The ", _jsx("code", { children: "clarity-chat doctor" }), " command validates required environment variables before deploy."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Rollbacks & Incident Response" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "clarity-chat upgrade --rollback" }), " to revert dependency upgrades"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "getTracer()" }), " logs to identify failing models/providers"] }), _jsx("li", { children: "Replay audit and quota logs to confirm impact scope" })] })] })] }));
}
//# sourceMappingURL=page.js.map