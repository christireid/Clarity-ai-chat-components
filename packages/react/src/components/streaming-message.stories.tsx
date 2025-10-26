/**
 * StreamingMessage Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StreamingMessage } from './streaming-message'
import { useState, useEffect } from 'react'

const meta: Meta<typeof StreamingMessage> = {
  title: 'Components/StreamingMessage',
  component: StreamingMessage,
  parameters: {
    docs: {
      description: {
        component: `
Displays AI responses with real-time streaming support.

## Features
- Token-by-token streaming with cursor
- Partial JSON parsing and rendering
- Tool call visualization with approval
- Thinking steps (chain-of-thought)
- Citation/source display
- Error states
- Animated transitions

## Usage

\`\`\`tsx
import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)
  
  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      showThinking
      showCitations
      showTools
    />
  )
}
\`\`\`
        `
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof StreamingMessage>

export const Default: Story = {
  args: {
    content: 'This is a streaming message with some content...',
    isStreaming: false,
    showThinking: true,
    showCitations: true,
    showTools: true
  }
}

export const Streaming: Story = {
  args: {
    content: 'The quick brown fox jumps',
    isStreaming: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows animated cursor while streaming'
      }
    }
  }
}

export const WithThinking: Story = {
  args: {
    content: 'Based on the analysis...',
    isStreaming: false,
    thinkingSteps: [
      'Analyzing the question',
      'Searching knowledge base',
      'Generating response'
    ],
    showThinking: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays completed thinking steps'
      }
    }
  }
}

export const ThinkingInProgress: Story = {
  args: {
    content: '',
    isStreaming: true,
    thinkingSteps: [
      'Analyzing the question',
      'Searching knowledge base'
    ],
    currentThinkingStep: 'Generating response...',
    showThinking: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows current thinking step with spinner'
      }
    }
  }
}

export const WithToolCalls: Story = {
  args: {
    content: 'I need to search for that information.',
    isStreaming: false,
    toolCalls: [
      {
        id: 'call_1',
        type: 'function',
        function: {
          name: 'web_search',
          arguments: '{"query": "latest news about AI", "limit": 5}'
        }
      },
      {
        id: 'call_2',
        type: 'function',
        function: {
          name: 'read_file',
          arguments: '{"path": "/docs/summary.md"}'
        }
      }
    ],
    showTools: true,
    onToolApprove: (tool) => console.log('Approved:', tool),
    onToolReject: (tool) => console.log('Rejected:', tool)
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool calls with approval buttons'
      }
    }
  }
}

export const WithCitations: Story = {
  args: {
    content: 'According to the research papers, artificial intelligence has made significant progress in recent years.',
    isStreaming: false,
    citations: [
      {
        id: 'cite_1',
        source: 'Nature: AI Research 2024',
        chunkText: 'Artificial intelligence systems have achieved human-level performance on various benchmark tasks including image recognition, natural language processing, and game playing.',
        confidence: 0.92,
        url: 'https://nature.com/articles/ai-2024'
      },
      {
        id: 'cite_2',
        source: 'MIT Technology Review',
        chunkText: 'Machine learning models trained on large datasets demonstrate emergent capabilities that were not explicitly programmed.',
        confidence: 0.87,
        url: 'https://technologyreview.com/ml-emergent'
      },
      {
        id: 'cite_3',
        source: 'Stanford AI Report',
        chunkText: 'The field has seen exponential growth in compute resources, model parameters, and dataset sizes over the past decade.',
        confidence: 0.95,
        url: 'https://stanford.edu/ai-report'
      }
    ],
    showCitations: true
  },
  parameters: {
    docs: {
      description: {
        story: 'RAG sources with confidence scores'
      }
    }
  }
}

export const PartialJSON: Story = {
  args: {
    content: '{"name": "John", "age": 30, "city": "New',
    isStreaming: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles partial JSON gracefully during streaming'
      }
    }
  }
}

export const CompleteJSON: Story = {
  args: {
    content: '{"name": "John Doe", "age": 30, "city": "New York", "skills": ["JavaScript", "TypeScript", "React"]}',
    isStreaming: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders complete JSON with syntax highlighting'
      }
    }
  }
}

export const Error: Story = {
  args: {
    content: 'I was trying to help but...',
    isStreaming: false,
    error: 'Rate limit exceeded. Please try again in a few moments.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state with helpful message'
      }
    }
  }
}

export const Everything: Story = {
  args: {
    content: 'After analyzing your request, here are the results:',
    isStreaming: false,
    thinkingSteps: [
      'Understanding the query',
      'Retrieving relevant documents',
      'Executing tools'
    ],
    toolCalls: [
      {
        id: 'call_1',
        type: 'function',
        function: {
          name: 'search_database',
          arguments: '{"query": "user preferences", "limit": 10}'
        }
      }
    ],
    citations: [
      {
        id: 'cite_1',
        source: 'User Documentation',
        chunkText: 'Users can customize their experience through the settings panel...',
        confidence: 0.88
      }
    ],
    showThinking: true,
    showTools: true,
    showCitations: true
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: thinking, tools, citations'
      }
    }
  }
}

// Interactive streaming demo
export const InteractiveStreaming: Story = {
  render: () => {
    const [content, setContent] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    
    const fullText = 'This is an example of a streaming message. Watch as the text appears character by character, simulating a real AI response. The cursor blinks at the end to show active streaming.'
    
    const startStreaming = () => {
      setContent('')
      setIsStreaming(true)
      let index = 0
      
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setContent(fullText.slice(0, index + 1))
          index++
        } else {
          setIsStreaming(false)
          clearInterval(interval)
        }
      }, 50)
      
      return () => clearInterval(interval)
    }
    
    return (
      <div className="space-y-4">
        <button
          onClick={startStreaming}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Streaming Demo
        </button>
        <StreamingMessage
          content={content}
          isStreaming={isStreaming}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - click to see streaming in action'
      }
    }
  }
}
