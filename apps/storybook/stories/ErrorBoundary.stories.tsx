import type { Meta, StoryObj } from '@storybook/react'
import { ErrorBoundary } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Error boundary component that catches React errors and displays a fallback UI. Essential for production applications to prevent complete crashes.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ErrorBoundary>

// Component that throws an error
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Something went wrong!')
  }
  return <div className="p-4 bg-green-100 rounded-lg">Component working fine!</div>
}

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <BuggyComponent shouldThrow={false} />
    </ErrorBoundary>
  ),
}

export const WithError: Story = {
  render: () => (
    <ErrorBoundary>
      <BuggyComponent shouldThrow={true} />
    </ErrorBoundary>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [shouldThrow, setShouldThrow] = useState(false)
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShouldThrow(!shouldThrow)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {shouldThrow ? 'Fix Component' : 'Break Component'}
        </button>
        <ErrorBoundary>
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>
    )
  },
}

export const CustomFallback: Story = {
  render: () => {
    const CustomFallback = ({ error }: { error: Error }) => (
      <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Custom Error Display</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    )
    
    return (
      <ErrorBoundary fallback={CustomFallback}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    )
  },
}

export const MultipleBoundaries: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorBoundary>
        <div className="p-4 bg-blue-100 rounded-lg">Safe component 1</div>
      </ErrorBoundary>
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
      <ErrorBoundary>
        <div className="p-4 bg-green-100 rounded-lg">Safe component 2</div>
      </ErrorBoundary>
    </div>
  ),
}
