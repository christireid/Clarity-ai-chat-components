/**
 * ModelSelector Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ModelSelector } from './model-selector'
import { allModels } from '../adapters'

const meta: Meta<typeof ModelSelector> = {
  title: 'Components/ModelSelector',
  component: ModelSelector,
  parameters: {
    docs: {
      description: {
        component: `
Dropdown to switch between AI models with visual metrics.

## Features
- Model cards with speed/cost/quality badges
- Context window size display
- Capability indicators (vision, tools)
- Keyboard navigation support
- Dark mode compatible

## Usage

\`\`\`tsx
import { ModelSelector } from '@clarity-chat/react'
import { allModels } from '@clarity-chat/react/adapters'

function App() {
  const [model, setModel] = useState('gpt-4-turbo')
  
  return (
    <ModelSelector
      models={allModels}
      value={model}
      onChange={(id, config) => {
        setModel(id)
        console.log('Config:', config)
      }}
    />
  )
}
\`\`\`
        `
      }
    },
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    models: {
      control: false,
      description: 'Array of available models'
    },
    value: {
      control: 'text',
      description: 'Currently selected model ID'
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when model is selected'
    },
    showMetrics: {
      control: 'boolean',
      description: 'Show speed/cost/quality badges'
    },
    showDescription: {
      control: 'boolean',
      description: 'Show model descriptions'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the selector'
    }
  }
}

export default meta
type Story = StoryObj<typeof ModelSelector>

export const Default: Story = {
  args: {
    models: allModels,
    value: 'gpt-4-turbo',
    showMetrics: true,
    showDescription: true,
    disabled: false
  }
}

export const WithoutMetrics: Story = {
  args: {
    ...Default.args,
    showMetrics: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Hide speed/cost/quality badges for a cleaner look'
      }
    }
  }
}

export const WithoutDescriptions: Story = {
  args: {
    ...Default.args,
    showDescription: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode without model descriptions'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state prevents interaction'
      }
    }
  }
}

export const OpenAIOnly: Story = {
  args: {
    ...Default.args,
    models: allModels.filter(m => m.provider === 'openai'),
    value: 'gpt-3.5-turbo'
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter to show only OpenAI models'
      }
    }
  }
}

export const AnthropicOnly: Story = {
  args: {
    ...Default.args,
    models: allModels.filter(m => m.provider === 'anthropic'),
    value: 'claude-3-sonnet-20240229'
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter to show only Anthropic Claude models'
      }
    }
  }
}

export const GoogleOnly: Story = {
  args: {
    ...Default.args,
    models: allModels.filter(m => m.provider === 'google'),
    value: 'gemini-1.5-flash'
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter to show only Google Gemini models'
      }
    }
  }
}

export const CustomWidth: Story = {
  args: {
    ...Default.args,
    className: 'w-96'
  },
  parameters: {
    docs: {
      description: {
        story: 'Use className prop to control width'
      }
    }
  }
}
