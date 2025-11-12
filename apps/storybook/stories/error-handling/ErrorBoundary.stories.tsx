import type { Meta, StoryObj } from '@storybook/react'
import { ErrorBoundary } from './ErrorBoundary'
import { ConfigurationError, APIError } from '../errors'
import { useState } from 'react'

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ErrorBoundary>

// Component that throws an error
function ThrowError({ error }: { error?: Error }) {
  throw error || new Error('Something went wrong!')
}

// Component with button to trigger error
function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('User triggered error')
  }

  return (
    <div>
      <h3>Click to trigger error</h3>
      <button onClick={() => setShouldThrow(true)}>Throw Error</button>
    </div>
  )
}

export const DefaultFallback: Story = {
  args: {
    children: <ThrowError />,
  },
}

export const CustomFallback: Story = {
  args: {
    children: <ThrowError />,
    fallback: ({ error, resetError }) => (
      <div style={{ padding: '2rem', border: '2px solid red', borderRadius: '8px' }}>
        <h2>Custom Error UI</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    ),
  },
}

export const WithConfigurationError: Story = {
  args: {
    children: (
      <ThrowError
        error={
          new ConfigurationError('Missing API endpoint', {
            code: 'MISSING_API_ENDPOINT',
            solution: 'Add apiEndpoint prop to your component',
          })
        }
      />
    ),
  },
}

export const WithAPIError: Story = {
  args: {
    children: (
      <ThrowError
        error={
          new APIError('Request failed', {
            code: 'API_REQUEST_FAILED',
            statusCode: 500,
            solution: 'Check your API endpoint and try again',
          })
        }
      />
    ),
  },
}

export const InteractiveTrigger: Story = {
  args: {
    children: <ErrorTrigger />,
  },
}

export const WithErrorCallback: Story = {
  args: {
    children: <ThrowError />,
    onError: (error, errorInfo) => {
      console.log('Error caught:', error)
      console.log('Error info:', errorInfo)
    },
  },
}
