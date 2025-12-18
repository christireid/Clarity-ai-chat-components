import { logger } from '@clarity-chat/utils/logger';
'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'

const hookProps: Prop[] = [
  {
    name: 'failureThreshold',
    type: 'number',
    default: '5',
    description: 'Number of failures before opening the circuit.',
  },
  {
    name: 'resetTimeout',
    type: 'number',
    default: '30000',
    description:
      'Time in ms to wait before attempting to close the circuit (half-open).',
  },
  {
    name: 'fallback',
    type: 'T | (() => T)',
    description: 'Value to return when circuit is open.',
  },
  {
    name: 'onOpen',
    type: '() => void',
    description: 'Callback when circuit opens.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when circuit closes.',
  },
]

const returnProps: Prop[] = [
  {
    name: 'execute',
    type: '<T>(fn: () => Promise<T>) => Promise<T>',
    description: 'Wrapper function to execute calls through the breaker.',
  },
  {
    name: 'state',
    type: "'CLOSED' | 'OPEN' | 'HALF_OPEN'",
    description: 'Current state of the circuit breaker.',
  },
  {
    name: 'stats',
    type: 'CircuitBreakerStats',
    description: 'Statistics about failures and successes.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Manually reset the breaker to CLOSED state.',
  },
]

export default function UseCircuitBreakerPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useCircuitBreaker</h1>

      <p className="lead">
        A robust implementation of the Circuit Breaker pattern for React. It
        prevents cascading failures by stopping requests to a failing service
        after a threshold is reached.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { useCircuitBreaker } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <EnhancedCodeBlock
        code={`const { execute, state } = useCircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 10000, // 10 seconds
  onOpen: () => toast.error('Service unavailable, trying alternatives...'),
})

const handleFetch = async () => {
  try {
    // Wrap your async call
    const data = await execute(() => fetch('/api/unstable-service'))
    return data
  } catch (error) {
    if (state === 'OPEN') {
      // Handle open circuit (fast failure)
      return getCachedData()
    }
    // Handle standard error
    logger.error(error)
  }
}`}
        language="tsx"
      />

      <Callout type="info">
        <p>
          <strong>Circuit States:</strong>
        </p>
        <ul>
          <li>
            <strong>CLOSED:</strong> Normal operation. Requests go through.
          </li>
          <li>
            <strong>OPEN:</strong> Failing. Requests are blocked immediately.
          </li>
          <li>
            <strong>HALF_OPEN:</strong> Testing. Allows one request to check if
            service recovered.
          </li>
        </ul>
      </Callout>

      <h2 id="api">API</h2>

      <h3>Options</h3>
      <PropsTable props={hookProps} />

      <h3>Return Value</h3>
      <PropsTable props={returnProps} />
    </>
  )
}
