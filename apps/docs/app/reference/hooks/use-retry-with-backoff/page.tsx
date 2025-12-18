import { logger } from '@clarity-chat/utils/logger';
'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const hookProps: Prop[] = [
  {
    name: 'maxRetries',
    type: 'number',
    default: '3',
    description: 'Maximum number of retry attempts.',
  },
  {
    name: 'baseDelay',
    type: 'number',
    default: '1000',
    description: 'Initial delay in ms before first retry.',
  },
  {
    name: 'maxDelay',
    type: 'number',
    default: '30000',
    description: 'Maximum delay cap for exponential backoff.',
  },
  {
    name: 'factor',
    type: 'number',
    default: '2',
    description: 'Exponential factor (2 means double delay each time).',
  },
  {
    name: 'jitter',
    type: 'boolean',
    default: 'true',
    description: 'Add random jitter to prevent thundering herd problem.',
  },
]

const returnProps: Prop[] = [
  {
    name: 'execute',
    type: '<T>(fn: () => Promise<T>) => Promise<T>',
    description: 'Execute function with retry logic.',
  },
  {
    name: 'isRetrying',
    type: 'boolean',
    description: 'Whether a retry sequence is currently in progress.',
  },
  {
    name: 'attempt',
    type: 'number',
    description: 'Current attempt number.',
  },
  {
    name: 'lastError',
    type: 'Error | null',
    description: 'The most recent error encountered.',
  },
  {
    name: 'cancel',
    type: '() => void',
    description: 'Cancel the current retry sequence.',
  },
]

export default function UseRetryWithBackoffPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useRetryWithBackoff</h1>

      <p className="lead">
        Automatically retries failed async operations with exponential backoff
        and jitter. Essential for handling transient network errors in chat
        applications.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { useRetryWithBackoff } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <EnhancedCodeBlock
        code={`const { execute, isRetrying, attempt } = useRetryWithBackoff({
  maxRetries: 5,
  baseDelay: 500, // Start fast
  onRetry: (attempt, delay) => {
    logger.debug(\`Retrying... attempt \${attempt} in \${delay}ms\`)
  }
})

const sendMessage = async (text: string) => {
  try {
    await execute(() => api.post('/messages', { text }))
  } catch (error) {
    // Failed after all 5 retries
    toast.error('Could not send message. Please check your connection.')
  }
}`}
        language="tsx"
      />

      <h2 id="api">API</h2>

      <h3>Options</h3>
      <PropsTable props={hookProps} />

      <h3>Return Value</h3>
      <PropsTable props={returnProps} />
    </>
  )
}
