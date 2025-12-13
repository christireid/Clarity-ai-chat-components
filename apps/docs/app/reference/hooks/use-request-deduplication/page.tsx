'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const hookProps: Prop[] = [
  {
    name: 'debounceMs',
    type: 'number',
    default: '0',
    description: 'Optional debounce window in ms.',
  },
  {
    name: 'onDedupe',
    type: '(key: string) => void',
    description: 'Callback when a duplicate request is blocked.',
  },
]

const returnProps: Prop[] = [
  {
    name: 'execute',
    type: '<T>(key: string, fn: () => Promise<T>) => Promise<T>',
    description: 'Execute a unique request. Reuses pending promise if key matches.',
  },
  {
    name: 'executeDebounced',
    type: '<T>(key: string, fn: () => Promise<T>) => Promise<T>',
    description: 'Execute with debouncing (waits for silence).',
  },
  {
    name: 'isPending',
    type: '(key: string) => boolean',
    description: 'Check if a request with key is in progress.',
  },
  {
    name: 'stats',
    type: 'DeduplicationStats',
    description: 'Usage statistics.',
  },
]

export const dynamic = 'force-dynamic'

export default function UseRequestDeduplicationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useRequestDeduplication</h1>

      <p className="lead">
        Prevents duplicate API requests from double-clicks, React StrictMode re-renders,
        or rapid user interactions. Identical concurrent requests share the same promise.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { useRequestDeduplication } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <EnhancedCodeBlock
        code={`const { execute, isPending } = useRequestDeduplication()

const handleSubmit = async (id: string) => {
  // Even if clicked 10 times quickly, 'submit-form' executes once
  // while the first request is pending. Subsequent clicks return
  // the result of the first request.
  const result = await execute('submit-form', () => api.submit(id))
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
