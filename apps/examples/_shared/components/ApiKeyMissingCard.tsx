import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import React from 'react'
import { SecureLogger } from '@/lib/security/secureLogger';

export interface ApiKeyMissingCardProps {
  provider: string
  envVarName?: string
  getKeyUrl?: string
}

const providerConfig: Record<
  string,
  { envVar: string; url: string; placeholder: string }
> = {
  OpenAI: {
    envVar: 'OPENAI_API_KEY',
    url: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...',
  },
  Anthropic: {
    envVar: 'ANTHROPIC_API_KEY',
    url: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...',
  },
  Google: {
    envVar: 'GOOGLE_API_KEY',
    url: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIza...',
  },
}

export function ApiKeyMissingCard({
  provider,
  envVarName,
  getKeyUrl,
}: ApiKeyMissingCardProps) {
  const config = providerConfig[provider] || {
    envVar: envVarName || `${provider.toUpperCase()}_API_KEY`,
    url: getKeyUrl || '#',
    placeholder: 'your-api-key-here',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          API Key Required
        </h1>
        <p className="text-slate-600 mb-6">
          This demo requires a <strong>{provider}</strong> API key to function.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-mono mb-2">
            1. Create a{' '}
            <code className="bg-slate-200 px-1.5 py-0.5 rounded">
              .env.local
            </code>{' '}
            file
          </p>
          <p className="text-sm font-mono">
            2. Add:{' '}
            <code className="bg-slate-200 px-1.5 py-0.5 rounded">
              {config.envVar}={config.placeholder}
            </code>
          </p>
        </div>
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors"
        >
          Get {provider} API Key →
        </a>
      </div>
    </div>
  )
}

export default ApiKeyMissingCard
