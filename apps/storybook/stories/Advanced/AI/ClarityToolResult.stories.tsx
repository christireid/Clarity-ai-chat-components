import type { Meta, StoryObj } from '@storybook/react'
import { ClarityToolResult, createToolUIRegistry, type CoreMessage } from '@clarity-chat/react'
import { Card, CardHeader, CardContent, Badge, Button } from '@clarity-chat/primitives'

/**
 * **ClarityToolResult Component (Tool UI Registry)**
 * 
 * Automatic rendering of tool results with custom components.
 * 
 * **Key Features:**
 * - Type-safe component mapping
 * - Automatic tool result rendering
 * - Fallback rendering for unregistered tools
 * - Message context integration
 * - Customizable props and styling
 * 
 * **Use Cases:**
 * - Weather displays
 * - Search results
 * - Data visualizations
 * - Custom tool outputs
 * - Generative UI patterns
 */
const meta = {
  title: 'Advanced/AI/ClarityToolResult',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`ClarityToolResult\` component automatically renders tool results using
registered UI components, enabling generative UI patterns.

## Features

- ✅ Type-safe component mapping
- ✅ Automatic tool result rendering
- ✅ Fallback rendering for unregistered tools
- ✅ Message context integration
- ✅ Customizable props and styling

## Example

\`\`\`tsx
// Define tool UI components
const WeatherResult = ({ data }) => (
  <Card>
    <CardHeader>Weather in {data.location}</CardHeader>
    <CardContent>{data.temperature}°C</CardContent>
  </Card>
)

// Create registry
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Render tool results
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Weather Tool Component
function WeatherResult({ data }: { data: { location: string; temperature: number; condition: string; humidity: number } }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Weather in {data.location}</h3>
          <Badge variant="secondary">{data.condition}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">{data.temperature}°C</div>
          <div className="text-sm text-gray-600">Humidity: {data.humidity}%</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Search Tool Component
function SearchResult({ data }: { data: { query: string; results: Array<{ title: string; url: string; snippet: string }> } }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Search Results for "{data.query}"</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.results.map((result, index) => (
            <div key={index} className="border-b pb-3 last:border-0">
              <a href={result.url} className="text-blue-600 hover:underline font-medium">
                {result.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Calculator Tool Component
function CalculatorResult({ data }: { data: { expression: string; result: number } }) {
  return (
    <Card className="bg-green-50">
      <CardHeader>
        <h3 className="font-semibold">Calculation Result</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Expression: {data.expression}</div>
          <div className="text-2xl font-bold text-green-700">= {data.result}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create tool registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResult,
  calculator: CalculatorResult,
})

const mockMessages: CoreMessage[] = [
  { role: 'user', content: 'What is the weather in San Francisco?' },
  { role: 'assistant', content: 'Let me check the weather for you.' },
]

export const WeatherTool: Story = {
  render: () => (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={{
        name: 'get_weather',
        args: { location: 'San Francisco' },
        id: 'weather-1',
      }}
      result={{
        location: 'San Francisco',
        temperature: 18,
        condition: 'Partly Cloudy',
        humidity: 65,
      }}
      messages={mockMessages}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rendering weather tool results with a custom WeatherResult component.',
      },
    },
  },
}

export const SearchTool: Story = {
  render: () => (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={{
        name: 'search',
        args: { query: 'React hooks' },
        id: 'search-1',
      }}
      result={{
        query: 'React hooks',
        results: [
          {
            title: 'Advanced/AI/ClarityToolResult',
            url: 'https://react.dev/reference/react',
            snippet: 'Hooks let you use state and other React features without writing a class.',
          },
          {
            title: 'Advanced/AI/ClarityToolResult',
            url: 'https://react.dev/reference/react/useState',
            snippet: 'useState is a React Hook that lets you add a state variable to your component.',
          },
        ],
      }}
      messages={mockMessages}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rendering search tool results with a custom SearchResult component.',
      },
    },
  },
}

export const CalculatorTool: Story = {
  render: () => (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={{
        name: 'calculator',
        args: { expression: '15 * 23' },
        id: 'calc-1',
      }}
      result={{
        expression: '15 * 23',
        result: 345,
      }}
      messages={mockMessages}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rendering calculator tool results with a custom CalculatorResult component.',
      },
    },
  },
}

export const UnregisteredTool: Story = {
  render: () => (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={{
        name: 'unknown_tool',
        args: { data: 'some data' },
        id: 'unknown-1',
      }}
      result={{ data: 'some result data' }}
      messages={mockMessages}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fallback rendering for unregistered tools using the default component.',
      },
    },
  },
}

export const CustomFallback: Story = {
  render: () => {
    const CustomFallback = ({ toolCall, result }: { toolCall: any; result: any }) => (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <p className="text-yellow-800">
            Custom fallback for tool: <strong>{toolCall.name}</strong>
          </p>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )

    return (
      <ClarityToolResult
        registry={toolRegistry}
        toolCall={{
          name: 'custom_tool',
          args: { custom: 'data' },
          id: 'custom-1',
        }}
        result={{ custom: 'result data' }}
        messages={mockMessages}
        fallback={CustomFallback}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Using a custom fallback component for unregistered tools.',
      },
    },
  },
}

export const WithHeader: Story = {
  render: () => (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={{
        name: 'get_weather',
        args: { location: 'New York' },
        id: 'weather-2',
      }}
      result={{
        location: 'New York',
        temperature: 22,
        condition: 'Sunny',
        humidity: 55,
      }}
      messages={mockMessages}
      showHeader={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rendering tool result with a header showing tool name and call ID.',
      },
    },
  },
}

export const MultipleTools: Story = {
  render: () => (
    <div className="space-y-4">
      <ClarityToolResult
        registry={toolRegistry}
        toolCall={{
          name: 'get_weather',
          args: { location: 'London' },
          id: 'weather-3',
        }}
        result={{
          location: 'London',
          temperature: 12,
          condition: 'Rainy',
          humidity: 80,
        }}
        messages={mockMessages}
      />
      <ClarityToolResult
        registry={toolRegistry}
        toolCall={{
          name: 'calculator',
          args: { expression: '100 / 4' },
          id: 'calc-2',
        }}
        result={{
          expression: '100 / 4',
          result: 25,
        }}
        messages={mockMessages}
      />
      <ClarityToolResult
        registry={toolRegistry}
        toolCall={{
          name: 'search',
          args: { query: 'TypeScript' },
          id: 'search-2',
        }}
        result={{
          query: 'TypeScript',
          results: [
            {
              title: 'Advanced/AI/ClarityToolResult',
              url: 'https://www.typescriptlang.org/docs/',
              snippet: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
            },
          ],
        }}
        messages={mockMessages}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rendering multiple tool results in sequence.',
      },
    },
  },
}
