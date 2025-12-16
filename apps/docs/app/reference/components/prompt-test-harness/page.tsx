import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'PromptTestHarness - Clarity Chat Components',
  description:
    'Prompt regression testing harness for comparing prompt variants across test datasets.',
}

const props: Prop[] = [
  {
    name: 'datasetName',
    type: 'string',
    description: 'Current dataset name',
  },
  {
    name: 'datasets',
    type: 'Array<{ id: string; name: string }>',
    description: 'Available datasets',
  },
  {
    name: 'variants',
    type: 'PromptVariantItem[]',
    required: true,
    description: 'Prompt variants to test',
  },
  {
    name: 'tests',
    type: 'PromptTestCase[]',
    required: true,
    description: 'Test cases to run',
  },
  {
    name: 'onRunAll',
    type: '() => void',
    description: 'Callback when run all clicked',
  },
  {
    name: 'onRunVariant',
    type: '(variantId: string) => void',
    description: 'Callback when variant selected',
  },
  {
    name: 'onSelectDataset',
    type: '(datasetId: string) => void',
    description: 'Callback when dataset selected',
  },
  {
    name: 'isRunning',
    type: 'boolean',
    description: 'Whether tests are running',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function PromptTestHarnessPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PromptTestHarness</h1>
        <p className="docs-lead">
          Prompt regression testing harness for comparing prompt variants across
          curated test datasets before shipping changes.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Test prompt variants',
          'Compare variants across datasets',
          'Track test results',
          'Monitor latency and cost',
          'Identify regressions',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Set up prompt testing harness:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react'

function PromptTesting() {
  const variants = [
    { id: 'v1', label: 'Version 1' },
    { id: 'v2', label: 'Version 2 (New)' },
  ]

  const tests = [
    {
      id: 'test-1',
      input: 'What is the capital of France?',
      status: 'pending' as const,
      expected: 'Paris',
    },
    {
      id: 'test-2',
      input: 'Explain quantum computing',
      status: 'pass' as const,
      output: 'Quantum computing uses...',
      latencyMs: 1200,
      costUsd: 0.0012,
    },
  ]

  return (
    <PromptTestHarness
      variants={variants}
      tests={tests}
      onRunAll={() => {
        logger.debug('Running all tests')
      }}
      onRunVariant={(variantId) => {
        logger.debug('Running variant:', variantId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Datasets</h2>
        <p>Test across multiple datasets:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react'

function WithDatasets() {
  const datasets = [
    { id: 'ds1', name: 'General Knowledge' },
    { id: 'ds2', name: 'Code Generation' },
    { id: 'ds3', name: 'Customer Support' },
  ]

  return (
    <PromptTestHarness
      datasets={datasets}
      datasetName="General Knowledge"
      variants={variants}
      tests={tests}
      onSelectDataset={(datasetId) => {
        logger.debug('Selected dataset:', datasetId)
        loadTestsForDataset(datasetId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Test Status Tracking</h2>
        <p>Track test execution status:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react'

function StatusTracking() {
  const [tests, setTests] = React.useState(testCases)
  const [isRunning, setIsRunning] = React.useState(false)

  const handleRunAll = async () => {
    setIsRunning(true)
    // Update test statuses
    setTests(tests.map(t => ({ ...t, status: 'running' as const })))
    
    // Run tests
    const results = await runAllTests(tests)
    
    setTests(results)
    setIsRunning(false)
  }

  return (
    <PromptTestHarness
      variants={variants}
      tests={tests}
      isRunning={isRunning}
      onRunAll={handleRunAll}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Test Status</h2>
        <ul>
          <li>
            <strong>pending</strong>: Test not yet run
          </li>
          <li>
            <strong>running</strong>: Test currently executing
          </li>
          <li>
            <strong>pass</strong>: Test passed
          </li>
          <li>
            <strong>fail</strong>: Test failed
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Create comprehensive test datasets</li>
          <li>Test all prompt variants before deployment</li>
          <li>Monitor latency and cost per test</li>
          <li>Compare outputs against expected results</li>
          <li>Track regressions and improvements</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/evaluation-dashboard">
              EvaluationDashboard
            </a>{' '}
            - Evaluation metrics
          </li>
          <li>
            <a href="/reference/components/safety-review-console">
              SafetyReviewConsole
            </a>{' '}
            - Safety review
          </li>
        </ul>
      </section>
    </div>
  )
}
