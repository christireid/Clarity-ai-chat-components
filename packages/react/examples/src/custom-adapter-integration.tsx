'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Clarity,
  ClarityProvider,
  useClarityChat,
  type ChatMessage,
} from '@anthropic-ai/clarity-react';

/**
 * Custom Adapter Integration Example
 *
 * This example demonstrates how to create and use a custom adapter
 * with the Clarity React library. Custom adapters allow you to:
 * - Implement custom message handling
 * - Integrate with custom backends
 * - Add preprocessing/postprocessing
 * - Implement custom error handling
 * - Add custom middleware
 *
 * This is useful when you need more control than the built-in adapters provide.
 */

// Define adapter types
interface AdapterConfig {
  name: string;
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface AdapterRequest {
  messages: ChatMessage[];
  config: Record<string, any>;
}

interface AdapterResponse {
  message: ChatMessage;
  metadata?: Record<string, any>;
}

/**
 * Custom Adapter Implementation
 * This is the core of the custom adapter pattern
 */
class CustomChatAdapter {
  private config: AdapterConfig;
  private requestCache: Map<string, AdapterResponse>;
  private requestLog: Array<{ timestamp: Date; request: AdapterRequest; response: AdapterResponse }>;

  constructor(config: AdapterConfig) {
    this.config = config;
    this.requestCache = new Map();
    this.requestLog = [];
  }

  /**
   * Process a chat message through the custom adapter
   */
  async processMessage(
    messages: ChatMessage[],
    config: Record<string, any>,
    onProgress?: (text: string) => void
  ): Promise<AdapterResponse> {
    const request: AdapterRequest = { messages, config };

    // Check cache
    const cacheKey = this.getCacheKey(request);
    if (this.requestCache.has(cacheKey)) {
      console.log('Cache hit for request');
      return this.requestCache.get(cacheKey)!;
    }

    try {
      // Preprocess messages
      const processedMessages = this.preprocessMessages(messages);

      // Call backend API
      const response = await this.callBackend(processedMessages, config, onProgress);

      // Postprocess response
      const processedResponse = this.postprocessResponse(response);

      // Cache the response
      this.requestCache.set(cacheKey, processedResponse);

      // Log the request
      this.requestLog.push({
        timestamp: new Date(),
        request,
        response: processedResponse,
      });

      return processedResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Adapter error: ${errorMessage}`);
    }
  }

  /**
   * Preprocess messages before sending to backend
   */
  private preprocessMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages.map((msg) => ({
      ...msg,
      content: msg.content.trim(), // Clean up whitespace
    }));
  }

  /**
   * Call the backend API
   */
  private async callBackend(
    messages: ChatMessage[],
    config: Record<string, any>,
    onProgress?: (text: string) => void
  ): Promise<ChatMessage> {
    // Simulate API call with streaming
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const response: ChatMessage = {
          id: `response-${Date.now()}`,
          role: 'assistant',
          content: `I've processed ${messages.length} messages with config: ${JSON.stringify(config)}. This is a custom adapter response.`,
        };

        onProgress?.(response.content);
        resolve(response);
      }, 1000);
    });
  }

  /**
   * Postprocess the response from backend
   */
  private postprocessResponse(message: ChatMessage): AdapterResponse {
    return {
      message,
      metadata: {
        processedAt: new Date(),
        adapterName: this.config.name,
      },
    };
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(request: AdapterRequest): string {
    const messageContent = request.messages.map((m) => m.content).join('|');
    const configStr = JSON.stringify(request.config);
    return `${messageContent}:${configStr}`;
  }

  /**
   * Get request log
   */
  getRequestLog() {
    return this.requestLog;
  }

  /**
   * Clear cache and logs
   */
  clear() {
    this.requestCache.clear();
    this.requestLog = [];
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.requestCache.size,
      logSize: this.requestLog.length,
    };
  }
}

/**
 * Main component demonstrating custom adapter usage
 */
export function CustomAdapterIntegrationExample(): React.ReactElement {
  const [adapterConfig, setAdapterConfig] = useState<AdapterConfig>({
    name: 'CustomAIAdapter',
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000,
  });

  const [apiConfig, setApiConfig] = useState({
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.7,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [adapterStats, setAdapterStats] = useState({ cacheSize: 0, logSize: 0 });
  const [requestLog, setRequestLog] = useState<string[]>([]);

  const adapterRef = useRef<CustomChatAdapter | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize adapter
  useEffect(() => {
    adapterRef.current = new CustomChatAdapter(adapterConfig);
  }, [adapterConfig]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send message through custom adapter
   */
  const handleSendMessage = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (!input.trim() || !adapterRef.current) {
        setError('Please enter a message');
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // Process through adapter
        const response = await adapterRef.current.processMessage(
          [...messages, userMessage],
          apiConfig,
          (text) => {
            console.log('Streaming:', text);
          }
        );

        setMessages((prev) => [...prev, response.message]);

        // Update adapter stats
        const stats = adapterRef.current.getCacheStats();
        setAdapterStats(stats);

        // Update request log
        const log = adapterRef.current.getRequestLog();
        setRequestLog(
          log.map((entry) => `[${entry.timestamp.toLocaleTimeString()}] Processed ${entry.request.messages.length} messages`)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to process message: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, apiConfig]
  );

  const handleConfigChange = useCallback((key: string, value: any) => {
    setApiConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleAdapterConfigChange = useCallback((key: keyof AdapterConfig, value: any) => {
    setAdapterConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearAdapter = useCallback(() => {
    if (adapterRef.current) {
      adapterRef.current.clear();
      setAdapterStats({ cacheSize: 0, logSize: 0 });
      setRequestLog([]);
      setMessages([]);
    }
  }, []);

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Custom Adapter Integration</h1>
          <p className="text-sm text-green-700">Build your own chat adapter with Clarity</p>
        </div>
        <button
          onClick={clearAdapter}
          className="px-4 py-2 bg-red-200 text-red-900 rounded-lg text-sm font-medium hover:bg-red-300 transition-colors"
        >
          Reset Adapter
        </button>
      </div>

      {/* Configuration Panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Adapter Configuration */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-green-200">
          <button
            onClick={() => setIsConfiguring(!isConfiguring)}
            className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 mb-3 w-full"
          >
            <span>{isConfiguring ? '▼' : '▶'} Adapter Configuration</span>
          </button>

          {isConfiguring && (
            <div className="space-y-3 mt-3 pt-3 border-t border-green-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Adapter Name
                </label>
                <input
                  type="text"
                  value={adapterConfig.name}
                  onChange={(e) => handleAdapterConfigChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Base URL
                </label>
                <input
                  type="text"
                  value={adapterConfig.baseUrl}
                  onChange={(e) => handleAdapterConfigChange('baseUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timeout (ms): {adapterConfig.timeout}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="5000"
                  value={adapterConfig.timeout || 30000}
                  onChange={(e) => handleAdapterConfigChange('timeout', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-green-200">
          <p className="text-sm font-semibold text-green-700 mb-3">API Configuration</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
              <select
                value={apiConfig.model}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus-20250219">Claude 3 Opus</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Temperature: {apiConfig.temperature.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={apiConfig.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-4 border border-green-200 flex-1 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Start a conversation with the custom adapter</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
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
        </div>

        {/* Adapter Statistics */}
        <div className="w-56 bg-white rounded-lg shadow-md p-4 border border-green-200 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Adapter Stats</h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <p className="text-xs text-blue-600 font-semibold">Cache Size</p>
              <p className="text-lg font-bold text-blue-700">{adapterStats.cacheSize}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-200">
              <p className="text-xs text-purple-600 font-semibold">Log Size</p>
              <p className="text-lg font-bold text-purple-700">{adapterStats.logSize}</p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-700 mb-2">Request Log</p>
            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 overflow-y-auto space-y-1 flex-1">
              {requestLog.length === 0 ? (
                <p className="text-slate-400">No requests yet</p>
              ) : (
                requestLog.map((log, idx) => (
                  <div key={idx} className="break-all">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100 disabled:text-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-400 transition-colors"
        >
          Send
        </button>
      </form>

      {/* Info Footer */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
        <p>Adapter: {adapterConfig.name} | URL: {adapterConfig.baseUrl} | Messages: {messages.length}</p>
      </div>
    </div>
  );
}

/**
 * Custom Adapter TypeScript Interface
 *
 * interface IChatAdapter {
 *   processMessage(
 *     messages: ChatMessage[],
 *     config: Record<string, any>,
 *     onProgress?: (text: string) => void
 *   ): Promise<AdapterResponse>;
 *
 *   preprocessMessages(messages: ChatMessage[]): ChatMessage[];
 *   postprocessResponse(message: ChatMessage): AdapterResponse;
 *   getRequestLog(): Array<{ timestamp: Date; request: AdapterRequest; response: AdapterResponse }>;
 *   clear(): void;
 *   getCacheStats(): { cacheSize: number; logSize: number };
 * }
 */

export default CustomAdapterIntegrationExample;
