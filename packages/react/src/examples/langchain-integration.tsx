'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Clarity,
  ClarityProvider,
  useClarityChat,
  type ChatMessage,
} from '@anthropic-ai/clarity-react';

/**
 * LangChain.js Integration Example
 *
 * This example demonstrates how to integrate Claude with LangChain.js
 * using the Clarity React library. The integration provides:
 * - Message chain management
 * - Tool/agent execution
 * - Memory management
 * - Document processing
 * - Custom prompts and chains
 *
 * LangChain abstracts Claude interactions through chains and agents,
 * providing a unified interface for complex workflows.
 */

// Define types for LangChain configuration
interface LangChainConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  chainType: 'conversation' | 'qa' | 'agent';
  includeMemory: boolean;
  memorySize: number;
}

const DEFAULT_CONFIG: LangChainConfig = {
  modelName: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  maxTokens: 2048,
  chainType: 'conversation',
  includeMemory: true,
  memorySize: 10,
};

/**
 * Tool definition for the agent
 */
interface Tool {
  name: string;
  description: string;
  execute: (input: string) => Promise<string>;
}

/**
 * Mock tools that would be used with LangChain agents
 */
const AVAILABLE_TOOLS: Tool[] = [
  {
    name: 'calculator',
    description: 'A simple calculator tool for basic math operations',
    execute: async (input: string) => {
      try {
        // Simple eval for demo purposes - use safer expression parser in production
        const result = Function(`return ${input}`)();
        return `Result: ${result}`;
      } catch (error) {
        return `Error: Invalid expression`;
      }
    },
  },
  {
    name: 'search',
    description: 'Search for information (mock implementation)',
    execute: async (query: string) => {
      return `Search results for "${query}": 10 results found (mock data)`;
    },
  },
  {
    name: 'weather',
    description: 'Get weather information for a location',
    execute: async (location: string) => {
      return `Weather in ${location}: 72°F, Partly cloudy (mock data)`;
    },
  },
];

/**
 * Main component demonstrating LangChain.js integration
 */
export function LangChainIntegrationExample(): React.ReactElement {
  const [config, setConfig] = useState<LangChainConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolExecutionLog, setToolExecutionLog] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Execute a tool from the agent's request
   */
  const executeTool = useCallback(
    async (toolName: string, input: string): Promise<string> => {
      const tool = AVAILABLE_TOOLS.find((t) => t.name === toolName);
      if (!tool) {
        return `Tool "${toolName}" not found`;
      }

      try {
        const result = await tool.execute(input);
        setToolExecutionLog((prev) => [...prev, `${toolName}(${input}) -> ${result}`]);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setToolExecutionLog((prev) => [...prev, `${toolName}(${input}) -> ERROR: ${errorMsg}`]);
        return `Error executing ${toolName}: ${errorMsg}`;
      }
    },
    []
  );

  /**
   * Build the messages for the LangChain context
   */
  const buildMessagesContext = useCallback((): string => {
    const messageHistory = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful AI assistant using LangChain.
You have access to the following tools: ${AVAILABLE_TOOLS.map((t) => t.name).join(', ')}.
When you need to use a tool, respond with [TOOL_CALL: toolName(input)].`;

    return systemPrompt + '\n\n' + messageHistory;
  }, [messages]);

  /**
   * Handle sending a message (simulating LangChain chain execution)
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
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // Simulate LangChain processing
        // In reality, this would call the LangChain chain
        await simulateLangChainProcessing(userMessage.content);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to process message: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [input, executeTool]
  );

  /**
   * Simulate LangChain chain processing
   * This would be replaced with actual LangChain chain execution
   */
  const simulateLangChainProcessing = useCallback(
    async (userInput: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if user is asking for a calculation
      if (
        userInput.toLowerCase().includes('calculate') ||
        userInput.toLowerCase().includes('math')
      ) {
        const toolResult = await executeTool('calculator', '10 + 5 * 2');
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `I've calculated that for you. ${toolResult}`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (userInput.toLowerCase().includes('weather')) {
        const toolResult = await executeTool('weather', 'San Francisco');
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Let me check the weather for you. ${toolResult}`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (userInput.toLowerCase().includes('search')) {
        const toolResult = await executeTool('search', userInput);
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `I found some information for you. ${toolResult}`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // General response without tools
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `I understand you're asking about: "${userInput}". How can I help you further?`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    },
    [executeTool]
  );

  const handleConfigChange = useCallback((key: keyof LangChainConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setToolExecutionLog([]);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-b from-purple-50 to-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">LangChain.js Integration</h1>
          <p className="text-sm text-purple-700">Chain and Agent-based Claude interactions</p>
        </div>
        <button
          onClick={clearMessages}
          className="px-4 py-2 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium hover:bg-purple-300 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-purple-200">
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900 mb-3"
        >
          <span>{isConfiguring ? '▼' : '▶'} Chain Configuration</span>
        </button>

        {isConfiguring && (
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-purple-200">
            {/* Chain Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chain Type</label>
              <select
                value={config.chainType}
                onChange={(e) =>
                  handleConfigChange('chainType', e.target.value as LangChainConfig['chainType'])
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="conversation">Conversation Chain</option>
                <option value="qa">QA Chain</option>
                <option value="agent">Agent Executor</option>
              </select>
            </div>

            {/* Include Memory */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeMemory"
                checked={config.includeMemory}
                onChange={(e) => handleConfigChange('includeMemory', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <label htmlFor="includeMemory" className="text-sm font-medium text-slate-700">
                Include Memory ({config.memorySize} messages)
              </label>
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
                min="256"
                max="4096"
                step="256"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Available Tools Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm font-semibold text-blue-900 mb-2">Available Tools:</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TOOLS.map((tool) => (
            <span key={tool.name} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {tool.name}
            </span>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      )}

      {/* Messages and Tool Log Container */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Message History */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-4 border border-purple-200 flex-1 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Start a conversation with the LangChain assistant!</p>
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
                        ? 'bg-purple-500 text-white rounded-br-none'
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

        {/* Tool Execution Log */}
        <div className="w-64 bg-white rounded-lg shadow-md p-4 border border-purple-200 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Tool Execution Log</h3>
          <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            {toolExecutionLog.length === 0 ? (
              <p className="text-slate-400">No tool executions yet</p>
            ) : (
              toolExecutionLog.map((log, idx) => (
                <div key={idx} className="break-all">
                  &gt; {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: 'calculate 10 + 5', 'search for React', 'weather in NYC'..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-slate-400 transition-colors"
        >
          Send
        </button>
      </form>

      {/* Chain Info */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
        <p>
          Chain: {config.chainType} | Memory: {config.includeMemory ? 'On' : 'Off'} | Temp:
          {config.temperature.toFixed(1)} | Messages: {messages.length}
        </p>
      </div>
    </div>
  );
}

/**
 * LangChain Backend Implementation (Node.js)
 *
 * Example using LangChain.js with Claude:
 *
 * import { ChatAnthropic } from "@langchain/anthropic";
 * import { ConversationChain } from "langchain/chains";
 * import { BufferMemory } from "langchain/memory";
 *
 * const model = new ChatAnthropic({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   modelName: "claude-3-5-sonnet-20241022",
 *   temperature: 0.7,
 * });
 *
 * const memory = new BufferMemory();
 *
 * const chain = new ConversationChain({
 *   llm: model,
 *   memory: memory,
 *   verbose: true,
 * });
 *
 * const response = await chain.call({
 *   input: "What is the capital of France?",
 * });
 * console.log(response.response);
 *
 * // For agents with tools:
 * import { initializeAgentExecutorWithOptions } from "langchain/agents";
 * import { Tool } from "@langchain/core/tools";
 *
 * const tools = [
 *   new Tool({
 *     name: "calculator",
 *     description: "Useful for math",
 *     func: async (input) => String(eval(input)),
 *   }),
 * ];
 *
 * const executor = await initializeAgentExecutorWithOptions(
 *   tools,
 *   model,
 *   { agentType: "openai-functions", verbose: true }
 * );
 */

export default LangChainIntegrationExample;
