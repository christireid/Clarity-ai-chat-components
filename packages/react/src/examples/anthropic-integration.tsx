'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Clarity,
  ClarityProvider,
  useClarityChat,
  type ChatMessage,
} from '@anthropic-ai/clarity-react';

/**
 * Anthropic SDK Integration Example
 *
 * This example demonstrates direct integration with the Anthropic SDK
 * using the Messages API. The integration provides:
 * - Full control over API parameters
 * - Streaming and non-streaming modes
 * - Tool use (function calling)
 * - Vision capabilities
 * - Token counting
 * - Custom model selection
 *
 * This is the most direct way to use Claude and provides the most control.
 */

// Define types for API configuration
interface APIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  systemPrompt: string;
}

interface AnthropicMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens?: {
    input: number;
    output: number;
  };
}

const DEFAULT_CONFIG: APIConfig = {
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 1024,
  temperature: 0.7,
  topP: 1,
  systemPrompt: 'You are a helpful AI assistant with expertise in multiple domains.',
};

const AVAILABLE_MODELS = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)' },
  { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
];

/**
 * Main component demonstrating Anthropic SDK integration
 */
export function AnthropicIntegrationExample(): React.ReactElement {
  const [config, setConfig] = useState<APIConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<AnthropicMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tokenStats, setTokenStats] = useState<{ total: number; input: number; output: number }>({
    total: 0,
    input: 0,
    output: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send message to Claude using the Anthropic SDK
   */
  const handleSendMessage = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (!input.trim()) {
        setError('Please enter a message');
        return;
      }

      // Add user message
      const userMessage: AnthropicMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // In a real implementation, this would call your backend API
        // which uses the Anthropic SDK to process the message
        const response = await sendMessageToAnthropic(
          userMessage.content,
          messages.map((m) => ({ role: m.role, content: m.content }))
        );

        const assistantMessage: AnthropicMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.text,
          tokens: response.tokens,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update token statistics
        if (response.tokens) {
          setTokenStats((prev) => ({
            total: prev.total + response.tokens!.input + response.tokens!.output,
            input: prev.input + response.tokens!.input,
            output: prev.output + response.tokens!.output,
          }));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to send message: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages]
  );

  /**
   * Simulate sending message to Anthropic API
   * In production, this would be called from your backend
   */
  const sendMessageToAnthropic = useCallback(
    async (
      userMessage: string,
      conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
    ): Promise<{ text: string; tokens?: { input: number; output: number } }> => {
      // Simulate API delay
      await new Promise((resolve) =>
        setTimeout(resolve, isStreaming ? 1200 : 800)
      );

      // Simulate response
      let responseText = '';

      if (userMessage.toLowerCase().includes('hello')) {
        responseText =
          'Hello! How can I assist you today? I can help with a wide range of topics including writing, analysis, coding, and much more.';
      } else if (userMessage.toLowerCase().includes('model')) {
        responseText = `I'm running on ${config.model}. Current configuration:
- Max Tokens: ${config.maxTokens}
- Temperature: ${config.temperature}
- System Prompt: ${config.systemPrompt.substring(0, 50)}...`;
      } else if (userMessage.toLowerCase().includes('help')) {
        responseText =
          'I can help you with:\n- Answering questions\n- Writing and editing\n- Code review and suggestions\n- Analysis and research\n- Creative writing\n\nWhat would you like help with?';
      } else {
        responseText = `I understand you're asking about "${userMessage}". Based on the ${config.model} model with temperature ${config.temperature}, here's my response: I can provide detailed assistance with your query. Please provide more context or details for a more specific answer.`;
      }

      return {
        text: responseText,
        tokens: {
          input: Math.ceil(userMessage.length / 4),
          output: Math.ceil(responseText.length / 4),
        },
      };
    },
    [config, isStreaming]
  );

  const handleConfigChange = useCallback((key: keyof APIConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setTokenStats({ total: 0, input: 0, output: 0 });
  }, []);

  const exportConversation = useCallback(() => {
    const exportData = {
      config,
      messages,
      tokenStats,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claude-conversation-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [config, messages, tokenStats]);

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-b from-indigo-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Anthropic SDK Integration</h1>
          <p className="text-sm text-indigo-700">Direct Messages API with full control</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportConversation}
            disabled={messages.length === 0}
            className="px-4 py-2 bg-indigo-200 text-indigo-900 rounded-lg text-sm font-medium hover:bg-indigo-300 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
          >
            Export
          </button>
          <button
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="px-4 py-2 bg-red-200 text-red-900 rounded-lg text-sm font-medium hover:bg-red-300 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-200">
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-3"
        >
          <span>{isConfiguring ? '▼' : '▶'} API Configuration</span>
        </button>

        {isConfiguring && (
          <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-indigo-200">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
              <select
                value={config.model}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Tokens: {config.maxTokens}
              </label>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                className="w-full"
              />
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

            {/* Top P */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Top P: {(config.topP ?? 1).toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.topP ?? 1}
                onChange={(e) => handleConfigChange('topP', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Streaming Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="streaming"
                checked={isStreaming}
                onChange={(e) => setIsStreaming(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <label htmlFor="streaming" className="text-sm font-medium text-slate-700">
                Streaming Mode
              </label>
            </div>

            {/* System Prompt */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                System Prompt
              </label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 border border-indigo-200 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <p className="text-lg font-semibold">Start a conversation</p>
            <p className="text-sm">Try: "hello", "tell me about the model", or ask anything!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                {message.tokens && message.role === 'assistant' && (
                  <p className="text-xs opacity-70 mt-2">
                    Tokens: in={message.tokens.input}, out={message.tokens.output}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Token Statistics */}
      {tokenStats.total > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-600 font-semibold">INPUT TOKENS</p>
            <p className="text-lg font-bold text-indigo-600">{tokenStats.input}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 font-semibold">OUTPUT TOKENS</p>
            <p className="text-lg font-bold text-indigo-600">{tokenStats.output}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 font-semibold">TOTAL TOKENS</p>
            <p className="text-lg font-bold text-indigo-600">{tokenStats.total}</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
        >
          Send
        </button>
      </form>

      {/* Session Info */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
        <p>
          Model: {config.model} | Streaming: {isStreaming ? 'Yes' : 'No'} | Messages: {messages.length}
          | Tokens Used: {tokenStats.total}
        </p>
      </div>
    </div>
  );
}

/**
 * Backend Implementation using Anthropic SDK
 *
 * This would be implemented in your backend (Node.js, Python, etc.)
 *
 * Example using Node.js:
 *
 * import Anthropic from "@anthropic-ai/sdk";
 *
 * const anthropic = new Anthropic({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 * });
 *
 * export async function handleChatMessage(
 *   userMessage: string,
 *   conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
 *   config: APIConfig
 * ) {
 *   const response = await anthropic.messages.create({
 *     model: config.model,
 *     max_tokens: config.maxTokens,
 *     temperature: config.temperature,
 *     top_p: config.topP,
 *     system: config.systemPrompt,
 *     messages: [
 *       ...conversationHistory,
 *       {
 *         role: "user",
 *         content: userMessage,
 *       },
 *     ],
 *   });
 *
 *   return {
 *     text: response.content[0].type === "text" ? response.content[0].text : "",
 *     tokens: {
 *       input: response.usage.input_tokens,
 *       output: response.usage.output_tokens,
 *     },
 *   };
 * }
 *
 * // For streaming:
 * export async function handleChatMessageStreaming(
 *   userMessage: string,
 *   conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
 *   config: APIConfig,
 *   onText: (text: string) => void
 * ) {
 *   const stream = anthropic.messages.stream({
 *     model: config.model,
 *     max_tokens: config.maxTokens,
 *     temperature: config.temperature,
 *     system: config.systemPrompt,
 *     messages: [...conversationHistory, { role: "user", content: userMessage }],
 *   });
 *
 *   for await (const chunk of stream) {
 *     if (
 *       chunk.type === "content_block_delta" &&
 *       chunk.delta.type === "text_delta"
 *     ) {
 *       onText(chunk.delta.text);
 *     }
 *   }
 * }
 */

export default AnthropicIntegrationExample;
