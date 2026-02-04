'use client'

import React, { useState } from 'react'
import {
  Check,
  Copy,
  Sparkles,
  Brain,
  Zap,
  Server,
  Cloud,
  Shield,
} from 'lucide-react'

type Provider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'ollama'
  | 'custom'

const providerInfo: Record<
  Provider,
  { name: string; icon: React.ReactNode; color: string }
> = {
  openai: {
    name: 'OpenAI',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-green-500',
  },
  anthropic: {
    name: 'Anthropic',
    icon: <Brain className="h-5 w-5" />,
    color: 'text-orange-500',
  },
  google: {
    name: 'Google AI',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-500',
  },
  azure: {
    name: 'Azure OpenAI',
    icon: <Cloud className="h-5 w-5" />,
    color: 'text-sky-500',
  },
  ollama: {
    name: 'Ollama',
    icon: <Server className="h-5 w-5" />,
    color: 'text-purple-500',
  },
  custom: {
    name: 'Custom',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-gray-500',
  },
}

function CodeBlock({
  code,
  language = 'typescript',
}: {
  code: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}

export default function ProvidersGuidePage() {
  const [activeProvider, setActiveProvider] = useState<Provider>('openai')

  const providerConfigs: Record<
    Provider,
    {
      setup: string
      env: string
      models: { name: string; context: string; notes: string }[]
    }
  > = {
    openai: {
      env: `# .env.local
OPENAI_API_KEY=sk-...`,
      setup: `import { ClarityChat, OpenAIAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={OpenAIAdapter({
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o', // or 'gpt-4o-mini' for faster/cheaper
      })}
    />
  );
}`,
      models: [
        {
          name: 'gpt-4o',
          context: '128k',
          notes: 'Recommended - Best overall performance',
        },
        { name: 'gpt-4o-mini', context: '128k', notes: 'Faster and cheaper' },
        { name: 'gpt-4-turbo', context: '128k', notes: 'Previous generation' },
        { name: 'o1-preview', context: '128k', notes: 'Advanced reasoning' },
      ],
    },
    anthropic: {
      env: `# .env.local
ANTHROPIC_API_KEY=sk-ant-...`,
      setup: `import { ClarityChat, AnthropicAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={AnthropicAdapter({
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-5-sonnet-20241022',
      })}
    />
  );
}`,
      models: [
        {
          name: 'claude-3-5-sonnet-20241022',
          context: '200k',
          notes: 'Recommended - Best balance',
        },
        {
          name: 'claude-3-opus-20240229',
          context: '200k',
          notes: 'Most capable',
        },
        {
          name: 'claude-3-haiku-20240307',
          context: '200k',
          notes: 'Fastest and cheapest',
        },
      ],
    },
    google: {
      env: `# .env.local
GOOGLE_AI_API_KEY=...`,
      setup: `import { ClarityChat, GoogleAIAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={GoogleAIAdapter({
        apiKey: process.env.GOOGLE_AI_API_KEY,
        model: 'gemini-2.0-flash-exp',
      })}
    />
  );
}`,
      models: [
        {
          name: 'gemini-2.0-flash-exp',
          context: '1M',
          notes: 'Recommended - Best performance',
        },
        {
          name: 'gemini-1.5-pro',
          context: '2M',
          notes: 'Largest context window',
        },
        { name: 'gemini-1.5-flash', context: '1M', notes: 'Faster responses' },
      ],
    },
    azure: {
      env: `# .env.local
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o`,
      setup: `import { ClarityChat, AzureOpenAIAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={AzureOpenAIAdapter({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
        apiVersion: '2024-02-15-preview',
      })}
    />
  );
}`,
      models: [
        { name: 'gpt-4o', context: '128k', notes: 'Deploy in Azure Portal' },
        { name: 'gpt-4-turbo', context: '128k', notes: 'Previous generation' },
        {
          name: 'gpt-35-turbo',
          context: '16k',
          notes: 'Cost-effective option',
        },
      ],
    },
    ollama: {
      env: `# .env.local
OLLAMA_BASE_URL=http://localhost:11434`,
      setup: `import { ClarityChat, OllamaAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={OllamaAdapter({
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        model: 'llama3.2', // or any model you have pulled
      })}
    />
  );
}

// First, pull the model in your terminal:
// ollama pull llama3.2`,
      models: [
        {
          name: 'llama3.2',
          context: '128k',
          notes: 'Recommended - Latest Llama',
        },
        { name: 'mistral', context: '32k', notes: 'Fast and capable' },
        { name: 'codellama', context: '16k', notes: 'Optimized for code' },
        { name: 'phi3', context: '128k', notes: 'Small but capable' },
      ],
    },
    custom: {
      env: `# .env.local
CUSTOM_API_KEY=...
CUSTOM_API_URL=https://api.your-provider.com/v1`,
      setup: `import { ClarityChat, CustomAdapter } from '@clarity/react';

export default function Chat() {
  return (
    <ClarityChat
      adapter={CustomAdapter({
        apiKey: process.env.CUSTOM_API_KEY,
        baseUrl: process.env.CUSTOM_API_URL,
        model: 'your-model-name',
        // Optional: Transform requests/responses if needed
        transformRequest: (messages) => {
          // Modify request format for your API
          return messages;
        },
        transformResponse: (response) => {
          // Parse response from your API
          return response.content;
        },
      })}
    />
  );
}`,
      models: [
        {
          name: 'your-model',
          context: 'varies',
          notes: 'OpenAI-compatible APIs supported',
        },
      ],
    },
  }

  const config = providerConfigs[activeProvider]

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Guides</span>
          <span>/</span>
          <span className="text-foreground">AI Providers</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Provider Setup</h1>
        <p className="text-xl text-muted-foreground">
          Configure Clarity Chat to work with OpenAI, Anthropic, Google, Azure,
          Ollama, or any OpenAI-compatible API.
        </p>
      </div>

      {/* Provider Tabs */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
          {(Object.keys(providerInfo) as Provider[]).map((provider) => {
            const info = providerInfo[provider]
            return (
              <button
                key={provider}
                onClick={() => setActiveProvider(provider)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
                  ${
                    activeProvider === provider
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-background/50'
                  }
                `}
              >
                <span className={info.color}>{info.icon}</span>
                <span>{info.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Provider Content */}
      <section className="space-y-8">
        {/* Prerequisites */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Node.js 18+ installed</li>
            <li>
              Clarity Chat installed:{' '}
              <code className="px-1 py-0.5 bg-muted rounded">
                npm install @clarity/react
              </code>
            </li>
            {activeProvider === 'ollama' && (
              <li>
                Ollama installed locally:{' '}
                <a
                  href="https://ollama.ai"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Ollama
                </a>
              </li>
            )}
            {activeProvider !== 'ollama' && activeProvider !== 'custom' && (
              <li>API key from {providerInfo[activeProvider].name}</li>
            )}
          </ul>
        </div>

        {/* Environment Variables */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            1. Environment Variables
          </h2>
          <p className="text-muted-foreground mb-4">
            Create or update your{' '}
            <code className="px-1 py-0.5 bg-muted rounded">.env.local</code>{' '}
            file:
          </p>
          <CodeBlock code={config.env} language="bash" />
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-400">
              <strong>Security:</strong> Never commit API keys to version
              control. Add <code>.env.local</code> to your{' '}
              <code>.gitignore</code>.
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Set up the adapter in your chat component:
          </p>
          <CodeBlock code={config.setup} />
        </div>

        {/* Supported Models */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">3. Supported Models</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Model</th>
                  <th className="text-left py-3 px-4 font-semibold">Context</th>
                  <th className="text-left py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {config.models.map((model) => (
                  <tr key={model.name} className="border-b">
                    <td className="py-3 px-4">
                      <code>{model.name}</code>
                    </td>
                    <td className="py-3 px-4">{model.context}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {model.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Streaming Configuration */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            4. Streaming Configuration
          </h2>
          <p className="text-muted-foreground mb-4">
            Clarity Chat uses streaming by default for real-time responses. You
            can configure streaming behavior:
          </p>
          <CodeBlock
            code={`<ClarityChat
  adapter={...}
  streaming={{
    enabled: true,           // Enable/disable streaming
    throttleMs: 50,          // Throttle UI updates (default: 50ms)
    onToken: (token) => {    // Optional: handle each token
      console.log('Token:', token);
    },
  }}
/>`}
          />
        </div>

        {/* Error Handling */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Error Handling</h2>
          <CodeBlock
            code={`<ClarityChat
  adapter={...}
  onError={(error) => {
    // Handle different error types
    switch (error.code) {
      case 'RATE_LIMIT':
        // Wait and retry
        break;
      case 'INVALID_API_KEY':
        // Prompt for new key
        break;
      case 'CONTEXT_LENGTH_EXCEEDED':
        // Truncate conversation
        break;
      default:
        console.error('Chat error:', error);
    }
  }}
  retry={{
    maxRetries: 3,
    retryDelay: 1000,
    retryOnErrors: ['RATE_LIMIT', 'TIMEOUT'],
  }}
/>`}
          />
        </div>
      </section>

      {/* Multi-Provider Setup */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-4">
          Advanced: Multi-Provider Setup
        </h2>
        <p className="text-muted-foreground mb-4">
          Allow users to switch between providers dynamically:
        </p>
        <CodeBlock
          code={`import {
  ClarityChat,
  OpenAIAdapter,
  AnthropicAdapter,
  GoogleAIAdapter,
  ModelSelector
} from '@clarity/react';

const adapters = {
  openai: OpenAIAdapter({ apiKey: process.env.OPENAI_API_KEY }),
  anthropic: AnthropicAdapter({ apiKey: process.env.ANTHROPIC_API_KEY }),
  google: GoogleAIAdapter({ apiKey: process.env.GOOGLE_AI_API_KEY }),
};

export default function MultiProviderChat() {
  const [provider, setProvider] = useState('openai');

  return (
    <ClarityChat
      adapter={adapters[provider]}
      header={
        <ModelSelector
          value={provider}
          onChange={setProvider}
          options={[
            { value: 'openai', label: 'GPT-4o' },
            { value: 'anthropic', label: 'Claude 3.5' },
            { value: 'google', label: 'Gemini 2.0' },
          ]}
        />
      }
    />
  );
}`}
        />
      </section>

      {/* Related */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-4">Related</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/guides/streaming"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Streaming Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn about SSE vs WebSocket streaming patterns.
            </p>
          </a>
          <a
            href="/guides/token-optimization"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Token Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Reduce costs with context management and caching.
            </p>
          </a>
          <a
            href="/reference/components/model-selector"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">ModelSelector</h3>
            <p className="text-sm text-muted-foreground">
              Dropdown component for selecting AI models.
            </p>
          </a>
          <a
            href="/guides/enterprise"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Enterprise Guide</h3>
            <p className="text-sm text-muted-foreground">
              RBAC, SSO, and compliance features.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
