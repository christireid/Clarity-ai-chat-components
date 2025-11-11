/**
 * Storybook story for DevToolsDashboard component
 * Comprehensive demo of all dev tools
 */

import type { Meta, StoryObj } from '@storybook/react'
import { DevToolsDashboard } from '../src/react/components/dev-tools-dashboard'
import { useAPIInspector } from '../src/react/hooks/use-api-inspector'
import { useProfiler } from '../src/react/hooks/use-profiler'
import { useTimeTravel } from '../src/react/hooks/use-time-travel'
import { useEffect } from 'react'

const meta: Meta<typeof DevToolsDashboard> = {
  title: 'Dev Tools/Dashboard',
  component: DevToolsDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive developer tools dashboard combining all React 19 enhanced tools.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DevToolsDashboard>

/**
 * Default Dashboard
 */
export const Default: Story = {
  render: () => {
    const { startCall, completeCall, setEnabled } = useAPIInspector()
    const { profile, setEnabled: setProfilerEnabled } = useProfiler()
    const { record } = useTimeTravel()

    useEffect(() => {
      // Enable all tools
      setEnabled(true)
      setProfilerEnabled(true)

      // Simulate API calls
      const call1 = startCall({
        provider: 'openai',
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {},
        body: {},
      })

      setTimeout(() => {
        completeCall(call1, {
          status: 200,
          statusText: 'OK',
          headers: {},
          body: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
        })
      }, 500)

      // Simulate profiling
      profile('database-query', async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return { rows: 100 }
      })

      // Simulate time-travel
      record(
        [{ role: 'user', content: 'Hello' }],
        { model: 'gpt-4-turbo' },
        {},
        'Initial State'
      )
    }, [])

    return <DevToolsDashboard defaultTab="inspector" />
  },
}

/**
 * Inspector Only
 */
export const InspectorOnly: Story = {
  render: () => <DevToolsDashboard showProfiler={false} showValidation={false} showTimeTravel={false} />,
}

/**
 * Profiler Only
 */
export const ProfilerOnly: Story = {
  render: () => <DevToolsDashboard showInspector={false} showValidation={false} showTimeTravel={false} defaultTab="profiler" />,
}

/**
 * All Tools
 */
export const AllTools: Story = {
  render: () => <DevToolsDashboard />,
}
