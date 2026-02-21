'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useChat } from 'ai/react';
import {
  Clarity,
  ClarityProvider,
  useClarityChat,
  type ChatMessage,
  type Clarity as ClarityType,
} from '@anthropic-ai/clarity-react';

/**
 * Vercel AI SDK Integration Example
 *
 * This example demonstrates how to integrate Claude with the Vercel AI SDK
 * using the useChat hook. The integration provides:
 * - Automatic message management
 * - Streaming support
 * - Error handling
 * - Stop sequence support
 * - Token usage tracking
 *
 * The Vercel AI SDK handles HTTP communication with your backend API
 * which should implement the Claude API calls.
 */

// Define types for API configuration
interface APIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

const DEFAULT_CONFIG: APIConfig = {
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 1024,
  temperature: 0.7,
  systemPrompt: 'You are a helpful AI assistant. Respond thoughtfully and accurately.',
};

/**
 * Main component demonstrating Vercel AI SDK integration
 */
export function VercelAIIntegrationExample(): React.ReactElement {
  const [config, setConfig] = useState<APIConfig>(DEFAULT_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Use the Vercel AI SDK's useChat hook
  // This manages messages, loading state, and streaming automatically
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    data: streamData,
    error: chatError,
  } = useChat({
    api: '/api/chat',
    body: {
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      systemPrompt: config.systemPrompt,
    },
    onFinish: (message) => {
      console.log('Message completed:', message);
    },
    onError: (error) => {
      setError(`Chat error: ${error.message}`);
      console.error('Chat error:', error);
    },
  });

  const handleConfigChange = useCallback(
    (key: keyof APIConfig, value: string | number) => {
      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
      setError(null);
    },
    []
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (!input.trim()) {
        setError('Please enter a message');
        return;
      }

      try {
        await handleSubmit(e);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to send message: ${errorMessage}`);
      }
    },
    [handleSubmit, input]
  );

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vercel AI SDK Integration</h1>
          <p className="text-sm text-slate-600">Using the useChat hook with Claude</p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 mb-3"
        >
          <span>{isConfiguring ? '▼' : '▶'} Configuration</span>
        </button>

        {isConfiguring && (
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model
              </label>
              <select
                value={config.model}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus-20250219">Claude 3 Opus</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Temperature: {config.temperature.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Tokens: {config.maxTokens}
              </label>
              <input
                type="range"
                min="100"
                max="4096"
                step="100"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* System Prompt */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                System Prompt
              </label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(error || chatError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800 mt-1">{error || (chatError && String(chatError))}</p>
        </div>
      )}

      {/* Message History */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 border border-slate-200 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-slate-400 transition-colors"
        >
          Send
        </button>
        {isLoading && (
          <button
            type="button"
            onClick={() => stop()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        )}
      </form>

      {/* Debug Info */}
      {streamData && (
        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
          <p>Messages: {messages.length} | Loading: {isLoading ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Backend API Route Handler (Next.js API route)
 *
 * This would be implemented in your Next.js app at pages/api/chat.ts
 *
 * Example implementation:
 *
 * import { Anthropic } from '@anthropic-ai/sdk';
 *
 * const client = new Anthropic({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 * });
 *
 * export default async function handler(req, res) {
 *   if (req.method !== 'POST') {
 *     return res.status(405).json({ error: 'Method not allowed' });
 *   }
 *
 *   const {
 *     messages,
 *     model = 'claude-3-5-sonnet-20241022',
 *     maxTokens = 1024,
 *     temperature = 0.7,
 *     systemPrompt = 'You are a helpful assistant.',
 *   } = req.body;
 *
 *   try {
 *     const stream = await client.messages.stream({
 *       model,
 *       max_tokens: maxTokens,
 *       temperature,
 *       system: systemPrompt,
 *       messages: messages.map(msg => ({
 *         role: msg.role,
 *         content: msg.content,
 *       })),
 *     });
 *
 *     res.setHeader('Content-Type', 'text/event-stream');
 *     res.setHeader('Cache-Control', 'no-cache');
 *     res.setHeader('Connection', 'keep-alive');
 *
 *     for await (const chunk of stream) {
 *       if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
 *         res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
 *       }
 *     }
 *
 *     res.write('data: [DONE]\n\n');
 *     res.end();
 *   } catch (error) {
 *     console.error('Chat error:', error);
 *     res.status(500).json({ error: 'Failed to process chat message' });
 *   }
 * }
 */

export default VercelAIIntegrationExample;
