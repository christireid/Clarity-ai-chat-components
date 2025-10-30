import type { Meta, StoryObj } from '@storybook/react'
import { StreamingMessage } from '@clarity-chat/react'
import { useState, useEffect } from 'react'
import type { ToolCall, Citation } from '@clarity-chat/types'

const meta: Meta<typeof StreamingMessage> = {
  title: 'Components/StreamingMessage',
  component: StreamingMessage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Streaming Message Component** - Real-time AI response rendering with advanced features:

- 🌊 Token-by-token streaming visualization
- 🧠 Chain-of-thought thinking steps
- 🔧 Tool/function call display with approval workflow
- 📚 RAG citation cards with confidence scores
- 🎨 Partial JSON parsing and formatting
- ⚡ Smooth animations and transitions
- 🌙 Full dark mode support
- ♿ WCAG AAA accessible

Perfect for displaying AI responses from ChatGPT, Claude, Gemini, or custom models with streaming support.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'The message content to display',
    },
    isStreaming: {
      control: 'boolean',
      description: 'Whether content is actively streaming',
    },
    showThinking: {
      control: 'boolean',
      description: 'Show thinking/reasoning steps',
    },
    showCitations: {
      control: 'boolean',
      description: 'Show citation cards',
    },
    showTools: {
      control: 'boolean',
      description: 'Show tool invocation cards',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data
const mockToolCalls: ToolCall[] = [
  {
    id: 'tool_1',
    type: 'function',
    function: {
      name: 'search_documentation',
      arguments: JSON.stringify({
        query: 'React hooks useState',
        limit: 5,
      }),
    },
  },
  {
    id: 'tool_2',
    type: 'function',
    function: {
      name: 'fetch_code_example',
      arguments: JSON.stringify({
        language: 'typescript',
        topic: 'custom hooks',
      }),
    },
  },
]

const mockCitations: Citation[] = [
  {
    id: 'cite_1',
    source: 'React Official Documentation - Hooks API',
    url: 'https://react.dev/reference/react/useState',
    chunkText: 'useState is a React Hook that lets you add a state variable to your component.',
    confidence: 0.95,
  },
  {
    id: 'cite_2',
    source: 'MDN Web Docs - JavaScript Reference',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    chunkText: 'JavaScript is a programming language that allows you to implement complex features on web pages.',
    confidence: 0.87,
  },
  {
    id: 'cite_3',
    source: 'TypeScript Handbook - Generics',
    url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    chunkText: 'Generics provide a way to make components work with any data type and not restrict to one data type.',
    confidence: 0.92,
  },
]

// Basic Stories
export const Default: Story = {
  args: {
    content: 'This is a basic streaming message response.',
    isStreaming: false,
  },
}

export const Streaming: Story = {
  args: {
    content: 'This message is being streamed in real-time...',
    isStreaming: true,
  },
}

export const WithCodeBlock: Story = {
  args: {
    content: `Here's a React component example:

\`\`\`typescript
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

This demonstrates the useState hook in action!`,
    isStreaming: false,
  },
}

export const WithThinking: Story = {
  args: {
    content: 'Based on my analysis, the best approach would be...',
    isStreaming: false,
    showThinking: true,
    thinkingSteps: [
      'Analyzing the user\'s question',
      'Searching documentation for useState',
      'Considering best practices',
      'Formulating response',
    ],
  },
}

export const ActiveThinking: Story = {
  args: {
    content: '',
    isStreaming: true,
    showThinking: true,
    thinkingSteps: [
      'Analyzing the user\'s question',
      'Searching documentation for useState',
    ],
    currentThinkingStep: 'Considering best practices and edge cases...',
  },
}

export const WithToolCalls: Story = {
  args: {
    content: 'I need to search the documentation and fetch code examples.',
    isStreaming: false,
    showTools: true,
    toolCalls: mockToolCalls,
    onToolApprove: (tool) => console.log('Approved:', tool),
    onToolReject: (tool) => console.log('Rejected:', tool),
  },
}

export const WithCitations: Story = {
  args: {
    content: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components. The most commonly used hook is useState, which allows you to add state to functional components.`,
    isStreaming: false,
    showCitations: true,
    citations: mockCitations,
  },
}

export const CompleteExample: Story = {
  args: {
    content: `Based on my analysis of the React documentation, here's what you need to know about useState:

\`\`\`typescript
// Basic usage
const [state, setState] = useState(initialValue)

// With TypeScript
const [count, setCount] = useState<number>(0)
\`\`\`

Key points:
- Returns array with current state and setter function
- Can use any data type
- Triggers re-render when state changes`,
    isStreaming: false,
    showThinking: true,
    showTools: true,
    showCitations: true,
    thinkingSteps: [
      'Analyzed user question',
      'Searched React documentation',
      'Found relevant examples',
    ],
    toolCalls: [mockToolCalls[0]],
    citations: [mockCitations[0]],
  },
}

export const ErrorState: Story = {
  args: {
    content: '',
    isStreaming: false,
    error: 'Failed to generate response. The API rate limit has been exceeded. Please try again in a few minutes.',
  },
}

export const PartialJSON: Story = {
  args: {
    content: '{"name": "React Hook", "type": "useState", "description": "State management in functional components"}',
    isStreaming: true,
  },
}

// Interactive Stories
const StreamingSimulation = () => {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState('')

  const fullText = `React Hooks are a powerful feature that allows you to use state and other React features in functional components. 

Here's a comprehensive guide:

\`\`\`typescript
import { useState, useEffect } from 'react'

function ExampleComponent() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
\`\`\`

Key benefits:
• Cleaner, more readable code
• Better code reuse with custom hooks
• Easier to test and maintain`

  const startStreaming = () => {
    setContent('')
    setIsStreaming(true)
    setThinkingSteps([])
    setCurrentStep('Analyzing your question...')

    // Simulate thinking
    setTimeout(() => {
      setThinkingSteps(['Analyzed user question'])
      setCurrentStep('Searching documentation...')
    }, 1000)

    setTimeout(() => {
      setThinkingSteps(['Analyzed user question', 'Searched React docs'])
      setCurrentStep('Generating response...')
    }, 2000)

    setTimeout(() => {
      setThinkingSteps(['Analyzed user question', 'Searched React docs', 'Generated response'])
      setCurrentStep('')
      
      // Stream content
      let index = 0
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setContent(fullText.slice(0, index + 1))
          index++
        } else {
          setIsStreaming(false)
          clearInterval(interval)
        }
      }, 20)
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={startStreaming}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>
      
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
        showThinking
        thinkingSteps={thinkingSteps}
        currentThinkingStep={currentStep}
      />
    </div>
  )
}

export const InteractiveStreaming: Story = {
  render: () => <StreamingSimulation />,
}

const ToolApprovalDemo = () => {
  const [toolStates, setToolStates] = useState<Record<string, any>>({})

  const handleApprove = (tool: ToolCall) => {
    console.log('Approved:', tool)
    setToolStates((prev) => ({
      ...prev,
      [tool.id]: { status: 'approved', result: 'Tool executed successfully!' },
    }))
  }

  const handleReject = (tool: ToolCall) => {
    console.log('Rejected:', tool)
    setToolStates((prev) => ({
      ...prev,
      [tool.id]: { status: 'rejected' },
    }))
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 Try approving or rejecting tool calls to see the interaction workflow
        </p>
      </div>
      
      <StreamingMessage
        content="I need to perform these actions to help you:"
        isStreaming={false}
        showTools
        toolCalls={mockToolCalls}
        onToolApprove={handleApprove}
        onToolReject={handleReject}
      />
      
      {Object.keys(toolStates).length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Tool States:</h4>
          <pre className="text-sm">
            {JSON.stringify(toolStates, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export const InteractiveToolApproval: Story = {
  render: () => <ToolApprovalDemo />,
}

// Edge Cases
export const LongContent: Story = {
  args: {
    content: `# Comprehensive Guide to React Hooks

React Hooks revolutionized how we write React components. Here's everything you need to know:

## useState Hook

\`\`\`typescript
const [state, setState] = useState(initialValue)
\`\`\`

The useState Hook lets you add React state to function components. When you call useState, you get back an array with two items: the current state value and a function to update it.

## useEffect Hook

\`\`\`typescript
useEffect(() => {
  // Effect logic here
  return () => {
    // Cleanup logic here
  }
}, [dependencies])
\`\`\`

The useEffect Hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

## useContext Hook

\`\`\`typescript
const value = useContext(MyContext)
\`\`\`

useContext lets you subscribe to React context without introducing nesting.

## Custom Hooks

You can create your own Hooks to reuse stateful logic:

\`\`\`typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return size
}
\`\`\`

This is a powerful pattern for extracting component logic into reusable functions!`,
    isStreaming: false,
    showCitations: true,
    citations: mockCitations,
  },
}

export const MultipleCitations: Story = {
  args: {
    content: 'Here\'s a comprehensive answer based on multiple sources...',
    isStreaming: false,
    showCitations: true,
    citations: [
      ...mockCitations,
      {
        id: 'cite_4',
        source: 'React Beta Docs - Thinking in React',
        url: 'https://beta.reactjs.org/learn/thinking-in-react',
        chunkText: 'React can change how you think about the designs you look at and the apps you build.',
        confidence: 0.88,
      },
      {
        id: 'cite_5',
        source: 'freeCodeCamp - React Hooks Tutorial',
        url: 'https://www.freecodecamp.org/news/react-hooks-tutorial/',
        chunkText: 'Hooks are a new addition in React 16.8 that let you use state and other React features without writing a class.',
        confidence: 0.94,
      },
    ],
  },
}

export const NoContent: Story = {
  args: {
    content: '',
    isStreaming: true,
    showThinking: true,
    currentThinkingStep: 'Preparing response...',
  },
}

export const AllFeaturesDisabled: Story = {
  args: {
    content: 'Simple message with no extra features',
    isStreaming: false,
    showThinking: false,
    showCitations: false,
    showTools: false,
    toolCalls: mockToolCalls,
    citations: mockCitations,
    thinkingSteps: ['This should not appear'],
  },
}
