import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Prompt Testing Guide - Clarity Chat Components',
  description:
    'Learn how to test prompts systematically with datasets, evaluation metrics, and continuous testing workflows.',
}

export default function PromptTestingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Prompt Testing</h1>
        <p className="docs-lead">
          Learn how to test prompts systematically with datasets, evaluation
          metrics, A/B testing, and continuous testing workflows.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create test datasets',
          'Run prompt tests',
          'Evaluate results',
          'Compare prompt versions',
          'Set up continuous testing',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Prompt testing helps ensure your prompts produce consistent,
          high-quality results across different inputs and scenarios.
        </p>
      </section>

      <section className="docs-section">
        <h2>Test Dataset Creation</h2>
        <p>Create test datasets:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react/internal'

const testDataset = [
  {
    id: '1',
    input: 'What is the capital of France?',
    expectedOutput: 'Paris',
    category: 'geography',
  },
  {
    id: '2',
    input: 'Explain quantum computing',
    expectedOutput: 'Quantum computing uses...',
    category: 'science',
  },
  // ... more test cases
]

function TestSetup() {
  return (
    <PromptTestHarness
      dataset={testDataset}
      prompt="You are a helpful assistant."
      onTestComplete={(results) => {
        logger.debug('Test results:', results)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Running Tests</h2>
        <p>Run prompt tests:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react/internal'

function RunTests() {
  const [results, setResults] = useState([])

  return (
    <PromptTestHarness
      dataset={testDataset}
      prompt={prompt}
      onTestComplete={(testResults) => {
        setResults(testResults)
      }}
      metrics={{
        accuracy: true,
        latency: true,
        tokenUsage: true,
        cost: true,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Evaluating Results</h2>
        <p>Evaluate test results:</p>
        <CodePlayground
          initialCode={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function EvaluateResults({ results }: { results: TestResult[] }) {
  const metrics = {
    accuracy: calculateAccuracy(results),
    averageLatency: calculateAverageLatency(results),
    totalTokens: calculateTotalTokens(results),
    totalCost: calculateTotalCost(results),
  }

  return (
    <EvaluationDashboard
      results={results}
      metrics={metrics}
      onQualityCheck={(result) => {
        // Check quality
        return result.score > 0.8
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>A/B Testing Prompts</h2>
        <p>Compare prompt versions:</p>
        <CodePlayground
          initialCode={`import { PromptTestHarness } from '@clarity-chat/react/internal'

function ABTestPrompts() {
  const promptA = "You are a helpful assistant."
  const promptB = "You are a concise, helpful assistant."

  return (
    <div>
      <PromptTestHarness
        dataset={testDataset}
        prompt={promptA}
        variant="A"
        onTestComplete={(resultsA) => {
          logger.debug('Variant A results:', resultsA)
        }}
      />
      <PromptTestHarness
        dataset={testDataset}
        prompt={promptB}
        variant="B"
        onTestComplete={(resultsB) => {
          logger.debug('Variant B results:', resultsB)
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Continuous Testing</h2>
        <p>Set up continuous testing:</p>
        <CodePlayground
          initialCode={`// CI/CD integration
import { runPromptTests } from '@clarity-chat/react/testing'

async function runTestsInCI() {
  const results = await runPromptTests({
    dataset: testDataset,
    prompt: process.env.PROMPT,
    threshold: {
      accuracy: 0.9,
      latency: 2000, // ms
    },
  })

  if (results.accuracy < 0.9) {
    throw new Error('Accuracy below threshold')
  }

  return results
}

// GitHub Actions
// .github/workflows/prompt-tests.yml
name: Prompt Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test -- prompt-tests`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Create comprehensive test datasets</li>
          <li>Test edge cases and error scenarios</li>
          <li>Set quality thresholds</li>
          <li>Compare prompt versions</li>
          <li>Run tests in CI/CD</li>
          <li>Monitor test results over time</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/prompt-test-harness">
              PromptTestHarness
            </a>{' '}
            - Prompt testing component
          </li>
          <li>
            <a href="/reference/components/evaluation-dashboard">
              EvaluationDashboard
            </a>{' '}
            - Evaluation dashboard
          </li>
        </ul>
      </section>
    </div>
  )
}
