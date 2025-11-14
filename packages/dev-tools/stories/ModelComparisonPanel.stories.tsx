/**
 * Storybook stories for ModelComparisonPanel component
 * Demonstrates React 19 optimistic updates for model comparisons
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ModelComparisonPanel } from '../src/react/components/model-comparison-panel'
import { useModelComparison } from '../src/react/hooks/use-model-comparison'
import { useEffect } from 'react'
import type { ModelResponse } from '../src/compare/model-comparison'

const meta: Meta<typeof ModelComparisonPanel> = {
  title: 'Dev Tools/Model Comparison',
  component: ModelComparisonPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Model Comparison Panel using React 19 useOptimistic for real-time comparison updates.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ModelComparisonPanel>

/**
 * Default Comparison
 */
export const Default: Story = {
  render: () => {
    const { addResponse, compare } = useModelComparison()

    useEffect(() => {
      // Simulate adding responses
      const response1: ModelResponse = {
        model: 'gpt-4-turbo',
        provider: 'openai',
        content: 'This is a response from GPT-4 Turbo. It provides detailed and comprehensive answers.',
        metadata: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
          latency: 500,
          cost: 0.0003,
        },
        timestamp: new Date(),
      }

      const response2: ModelResponse = {
        model: 'claude-3-opus',
        provider: 'anthropic',
        content: 'This is a response from Claude 3 Opus. It offers nuanced and thoughtful responses.',
        metadata: {
          promptTokens: 10,
          completionTokens: 25,
          totalTokens: 35,
          latency: 600,
          cost: 0.0004,
        },
        timestamp: new Date(),
      }

      const response3: ModelResponse = {
        model: 'gemini-pro',
        provider: 'google',
        content: 'This is a response from Gemini Pro. It provides fast and efficient responses.',
        metadata: {
          promptTokens: 10,
          completionTokens: 18,
          totalTokens: 28,
          latency: 400,
          cost: 0.0002,
        },
        timestamp: new Date(),
      }

      addResponse('prompt-1', response1)
      addResponse('prompt-1', response2)
      addResponse('prompt-1', response3)

      setTimeout(() => {
        compare('prompt-1', 'Compare these AI models')
      }, 100)
    }, [])

    return <ModelComparisonPanel promptId="prompt-1" />
  },
}

/**
 * Empty State
 */
export const Empty: Story = {
  render: () => <ModelComparisonPanel />,
}

/**
 * With Many Responses
 */
export const ManyResponses: Story = {
  render: () => {
    const { addResponse, compare } = useModelComparison()

    useEffect(() => {
      const models = [
        { provider: 'openai', model: 'gpt-4-turbo', latency: 500, cost: 0.0003 },
        { provider: 'openai', model: 'gpt-3.5-turbo', latency: 300, cost: 0.0001 },
        { provider: 'anthropic', model: 'claude-3-opus', latency: 600, cost: 0.0004 },
        { provider: 'anthropic', model: 'claude-3-sonnet', latency: 400, cost: 0.0002 },
        { provider: 'google', model: 'gemini-pro', latency: 350, cost: 0.00015 },
      ]

      models.forEach((m, i) => {
        const response: ModelResponse = {
          model: m.model,
          provider: m.provider,
          content: `Response from ${m.provider}/${m.model}. This is response number ${i + 1}.`,
          metadata: {
            promptTokens: 10,
            completionTokens: 20 + i * 5,
            totalTokens: 30 + i * 5,
            latency: m.latency,
            cost: m.cost,
          },
          timestamp: new Date(Date.now() + i * 1000),
        }
        addResponse('prompt-many', response)
      })

      setTimeout(() => {
        compare('prompt-many', 'Compare multiple AI models')
      }, 200)
    }, [])

    return <ModelComparisonPanel promptId="prompt-many" />
  },
}
