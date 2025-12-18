import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ModelSelector, type ModelSelectorProps } from '../ai/model-selector'
import type { ModelInfo } from '../../adapters/types'

const buildModels = (): ModelInfo[] => [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    speed: 'fast',
    cost: '0.002',
    quality: 'excellent',
    description: 'Balanced quality for day-to-day tasks.',
    contextWindow: 128000,
    vision: true,
    toolCalling: true,
  },
  {
    id: 'claude-35',
    name: 'Claude 3.5',
    provider: 'anthropic',
    speed: 'medium',
    cost: '0.003',
    quality: 'best',
    description: 'Highest quality reasoning and creativity.',
    contextWindow: 200000,
    vision: false,
    toolCalling: true,
  },
]

beforeAll(() => {
  Object.defineProperty(window.HTMLElement.prototype, 'hasPointerCapture', {
    value: () => false,
    configurable: true,
  })
  Object.defineProperty(window.HTMLElement.prototype, 'releasePointerCapture', {
    value: () => {},
    configurable: true,
  })
})

const renderSelector = (overrides: Partial<ModelSelectorProps> = {}) => {
  const props: ModelSelectorProps = {
    models: buildModels(),
    value: 'gpt-4o-mini',
    onChange: vi.fn(),
    ...overrides,
  }

  render(<ModelSelector {...props} />)
  return props
}

describe('ModelSelector', () => {
  it('renders the selected model and metrics', () => {
    renderSelector()

    expect(screen.getAllByText('GPT-4o Mini')[0]).toBeInTheDocument()
    expect(screen.getAllByText('$0.002')[0]).toBeInTheDocument()
    expect(screen.getAllByText('fast')[0]).toBeInTheDocument()
  })

  it('calls onChange when a new model is selected', async () => {
    const user = userEvent.setup()
    const props = renderSelector()

    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    const option = (await screen.findAllByText('Claude 3.5'))[0]
    await user.click(option)

    expect(props.onChange).toHaveBeenCalledWith(
      'claude-35',
      expect.objectContaining({
        provider: 'anthropic',
        model: 'claude-35',
      })
    )
  })
})
