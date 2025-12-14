/**
 * ToolInvocationCard Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ToolInvocationCard } from './tool-invocation-card'

const meta: Meta<typeof ToolInvocationCard> = {
  title: 'Components/ToolInvocationCard',
  component: ToolInvocationCard,
  parameters: {
    docs: {
      description: {
        component: `
Displays function/tool calls with approval workflow and result visualization.

## Features
- Tool name and arguments display
- Approval/rejection buttons
- Execution status tracking
- Result visualization (expandable)
- Error handling with retry
- Status indicators (pending, executing, success, error)
- Formatted JSON arguments

## Usage

\`\`\`tsx
import { ToolInvocationCard } from '@clarity-chat/react'

<ToolInvocationCard
  toolCall={{
    id: 'call_1',
    type: 'function',
    function: {
      name: 'web_search',
      arguments: '{"query": "AI news", "limit": 5}'
    }
  }}
  status="pending"
  requiresApproval
  onApprove={(tool) => console.log('Approved:', tool)}
  onReject={(tool) => console.log('Rejected:', tool)}
/>
\`\`\`
        `
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ToolInvocationCard>

const exampleTool = {
  id: 'call_abc123',
  type: 'function' as const,
  function: {
    name: 'web_search',
    arguments: '{"query": "latest AI developments", "limit": 5, "date_range": "last_week"}'
  }
}

export const Pending: Story = {
  args: {
    toolCall: exampleTool,
    status: 'pending',
    requiresApproval: true,
    onApprove: (tool) => console.log('Approved:', tool),
    onReject: (tool) => console.log('Rejected:', tool)
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool awaiting user approval'
      }
    }
  }
}

export const Approved: Story = {
  args: {
    toolCall: exampleTool,
    status: 'approved'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool has been approved'
      }
    }
  }
}

export const Executing: Story = {
  args: {
    toolCall: exampleTool,
    status: 'executing'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool is currently executing (spinner animation)'
      }
    }
  }
}

export const Success: Story = {
  args: {
    toolCall: exampleTool,
    status: 'success',
    result: {
      results: [
        { title: 'OpenAI releases GPT-5', url: 'https://example.com/1' },
        { title: 'Google announces Gemini 2.0', url: 'https://example.com/2' },
        { title: 'Anthropic unveils Claude 4', url: 'https://example.com/3' }
      ],
      total: 3,
      query_time: '0.45s'
    },
    expandableResult: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Successful execution with result (click to expand)'
      }
    }
  }
}

export const SuccessExpanded: Story = {
  args: {
    ...Success.args,
    expandableResult: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Result always visible (not expandable)'
      }
    }
  }
}

export const Error: Story = {
  args: {
    toolCall: exampleTool,
    status: 'error',
    error: 'Network timeout: Unable to reach search API after 30 seconds',
    onRetry: (tool) => console.log('Retrying:', tool)
  },
  parameters: {
    docs: {
      description: {
        story: 'Failed execution with error and retry button'
      }
    }
  }
}

export const Rejected: Story = {
  args: {
    toolCall: exampleTool,
    status: 'rejected'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool was rejected by user'
      }
    }
  }
}

export const DatabaseQuery: Story = {
  args: {
    toolCall: {
      id: 'call_db_001',
      type: 'function',
      function: {
        name: 'query_database',
        arguments: '{"table": "users", "filter": {"active": true, "role": "admin"}, "limit": 50, "order_by": "created_at DESC"}'
      }
    },
    status: 'success',
    result: {
      rows: [
        { id: 1, name: 'Alice Johnson', role: 'admin', active: true },
        { id: 2, name: 'Bob Smith', role: 'admin', active: true }
      ],
      count: 2,
      query_time: '0.023s'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Database query tool with complex arguments'
      }
    }
  }
}

export const FileOperation: Story = {
  args: {
    toolCall: {
      id: 'call_file_001',
      type: 'function',
      function: {
        name: 'read_file',
        arguments: '{"path": "/workspace/docs/README.md", "encoding": "utf-8"}'
      }
    },
    status: 'success',
    result: '# Project Title\n\nThis is the README file content...\n\n## Getting Started\n\nInstall dependencies:\n```bash\nnpm install\n```',
    expandableResult: true
  },
  parameters: {
    docs: {
      description: {
        story: 'File read operation with text result'
      }
    }
  }
}

export const APICall: Story = {
  args: {
    toolCall: {
      id: 'call_api_001',
      type: 'function',
      function: {
        name: 'fetch_weather',
        arguments: '{"city": "San Francisco", "units": "fahrenheit", "forecast_days": 7}'
      }
    },
    status: 'success',
    result: {
      location: 'San Francisco, CA',
      current: {
        temp: 65,
        condition: 'Partly Cloudy',
        humidity: 72,
        wind_mph: 12
      },
      forecast: [
        { day: 'Mon', high: 68, low: 55, condition: 'Sunny' },
        { day: 'Tue', high: 66, low: 54, condition: 'Cloudy' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'External API call with structured data'
      }
    }
  }
}

export const WithoutFormatting: Story = {
  args: {
    toolCall: exampleTool,
    status: 'pending',
    formatArguments: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Raw arguments without JSON formatting'
      }
    }
  }
}

export const NoApprovalRequired: Story = {
  args: {
    toolCall: exampleTool,
    status: 'executing',
    requiresApproval: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-approved tools (no buttons shown)'
      }
    }
  }
}
