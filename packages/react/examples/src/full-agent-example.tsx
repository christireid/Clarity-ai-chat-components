'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Clarity,
  ClarityProvider,
  useClarityChat,
  type ChatMessage,
} from '@anthropic-ai/clarity-react';

/**
 * Full Agent Example with Plans, Tools, and Approvals
 *
 * This example demonstrates a complete agent implementation that includes:
 * - Multi-step planning
 * - Tool definition and execution
 * - User approval workflows
 * - Error handling and recovery
 * - Progress tracking
 * - Tool result caching
 *
 * This is useful for building autonomous agents that require human oversight.
 */

// Define types for the agent system
interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description: string;
  }>;
  execute: (params: Record<string, any>) => Promise<string>;
}

interface PlanStep {
  id: string;
  description: string;
  tool: string;
  parameters: Record<string, any>;
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'rejected';
  result?: string;
  error?: string;
}

interface Plan {
  id: string;
  description: string;
  steps: PlanStep[];
  status: 'created' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
}

interface ToolExecutionResult {
  toolId: string;
  params: Record<string, any>;
  result: string;
  timestamp: Date;
}

/**
 * Define available tools for the agent
 */
const AVAILABLE_TOOLS: Tool[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'The search query',
      },
    ],
    execute: async (params: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return `Search results for "${params.query}": Found 10 results with relevant information about ${params.query}.`;
    },
  },
  {
    id: 'code-execution',
    name: 'Execute Code',
    description: 'Execute Python or JavaScript code',
    parameters: [
      {
        name: 'language',
        type: 'string',
        required: true,
        description: 'Programming language (python or javascript)',
      },
      {
        name: 'code',
        type: 'string',
        required: true,
        description: 'The code to execute',
      },
    ],
    execute: async (params: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return `Executed ${params.language} code successfully. Output: 42 (mock result)`;
    },
  },
  {
    id: 'data-analysis',
    name: 'Analyze Data',
    description: 'Analyze data and generate insights',
    parameters: [
      {
        name: 'dataset',
        type: 'string',
        required: true,
        description: 'The dataset to analyze',
      },
      {
        name: 'analysis_type',
        type: 'string',
        required: true,
        description: 'Type of analysis (summary, correlation, trend)',
      },
    ],
    execute: async (params: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `Analyzed ${params.dataset} with ${params.analysis_type} analysis. Key insight: Strong correlation detected.`;
    },
  },
  {
    id: 'file-operations',
    name: 'File Operations',
    description: 'Create, read, or modify files',
    parameters: [
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'Operation type (read, write, create)',
      },
      {
        name: 'filepath',
        type: 'string',
        required: true,
        description: 'Path to the file',
      },
    ],
    execute: async (params: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return `File operation (${params.operation}) completed on ${params.filepath}`;
    },
  },
];

/**
 * Main Agent Component
 */
export function FullAgentExample(): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Agent-specific state
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [planHistory, setPlanHistory] = useState<Plan[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PlanStep[]>([]);
  const [executionResults, setExecutionResults] = useState<ToolExecutionResult[]>([]);
  const [agentState, setAgentState] = useState<'idle' | 'planning' | 'executing' | 'waiting_approval'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resultCacheRef = useRef<Map<string, string>>(new Map());

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentPlan]);

  /**
   * Generate a plan based on user input
   */
  const generatePlan = useCallback(async (userInput: string): Promise<Plan> => {
    // Simulate AI planning
    await new Promise((resolve) => setTimeout(resolve, 800));

    const steps: PlanStep[] = [];

    if (userInput.toLowerCase().includes('search')) {
      steps.push({
        id: 'step-1',
        description: 'Search for information on the web',
        tool: 'web-search',
        parameters: { query: userInput },
        status: 'pending',
      });
      steps.push({
        id: 'step-2',
        description: 'Analyze the search results',
        tool: 'data-analysis',
        parameters: { dataset: 'search_results', analysis_type: 'summary' },
        status: 'pending',
      });
    } else if (userInput.toLowerCase().includes('code')) {
      steps.push({
        id: 'step-1',
        description: 'Execute the provided code',
        tool: 'code-execution',
        parameters: {
          language: 'python',
          code: 'print("Hello, World!")',
        },
        status: 'pending',
      });
    } else if (userInput.toLowerCase().includes('analyze')) {
      steps.push({
        id: 'step-1',
        description: 'Analyze data',
        tool: 'data-analysis',
        parameters: {
          dataset: 'provided_data',
          analysis_type: 'correlation',
        },
        status: 'pending',
      });
    } else {
      steps.push({
        id: 'step-1',
        description: 'Process user request',
        tool: 'web-search',
        parameters: { query: userInput },
        status: 'pending',
      });
    }

    const plan: Plan = {
      id: `plan-${Date.now()}`,
      description: `Plan to handle: ${userInput}`,
      steps,
      status: 'created',
      createdAt: new Date(),
    };

    setCurrentPlan(plan);
    return plan;
  }, []);

  /**
   * Execute a plan step with approval
   */
  const executePlanStep = useCallback(
    async (step: PlanStep) => {
      try {
        const tool = AVAILABLE_TOOLS.find((t) => t.id === step.tool);
        if (!tool) {
          throw new Error(`Tool not found: ${step.tool}`);
        }

        // Update step status
        setCurrentPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id ? { ...s, status: 'executing' } : s
            ),
          };
        });

        // Execute tool
        const result = await tool.execute(step.parameters);

        // Cache result
        const cacheKey = `${tool.id}:${JSON.stringify(step.parameters)}`;
        resultCacheRef.current.set(cacheKey, result);

        // Update step status
        setCurrentPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id ? { ...s, status: 'completed', result } : s
            ),
          };
        });

        // Record execution result
        setExecutionResults((prev) => [
          ...prev,
          {
            toolId: tool.id,
            params: step.parameters,
            result,
            timestamp: new Date(),
          },
        ]);

        // Add message
        setMessages((prev) => [
          ...prev,
          {
            id: `step-${step.id}`,
            role: 'assistant',
            content: `Executed: ${step.description}\nResult: ${result}`,
          },
        ]);

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';

        setCurrentPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id ? { ...s, status: 'failed', error: errorMsg } : s
            ),
          };
        });

        setError(`Failed to execute step: ${errorMsg}`);
      }
    },
    []
  );

  /**
   * Handle sending a message and initiating agent flow
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
      setAgentState('planning');

      try {
        // Generate plan
        const plan = await generatePlan(userMessage.content);

        // Add planning message
        setMessages((prev) => [
          ...prev,
          {
            id: `plan-${Date.now()}`,
            role: 'assistant',
            content: `I've created a plan with ${plan.steps.length} steps. Waiting for approval...`,
          },
        ]);

        // Set pending approvals
        setPendingApprovals(plan.steps);
        setAgentState('waiting_approval');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to create plan: ${errorMsg}`);
        setAgentState('idle');
      } finally {
        setIsLoading(false);
      }
    },
    [input, generatePlan]
  );

  /**
   * Approve and execute all plan steps
   */
  const approveAndExecutePlan = useCallback(async () => {
    if (!currentPlan) return;

    setAgentState('executing');
    setIsLoading(true);

    try {
      // Update plan status
      setCurrentPlan((prev) => (prev ? { ...prev, status: 'in_progress' } : prev));

      // Execute each step in sequence
      for (const step of currentPlan.steps) {
        await executePlanStep(step);

        // Small delay between steps
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Check if all steps succeeded
      const allCompleted = currentPlan.steps.every((s) => s.status === 'completed');

      setCurrentPlan((prev) => (prev ? { ...prev, status: allCompleted ? 'completed' : 'failed' } : prev));

      setPlanHistory((prev) => [...prev, currentPlan]);

      // Add completion message
      setMessages((prev) => [
        ...prev,
        {
          id: `completion-${Date.now()}`,
          role: 'assistant',
          content: allCompleted
            ? 'All plan steps completed successfully!'
            : 'Some steps failed. Please review the results.',
        },
      ]);

      setAgentState('idle');
      setPendingApprovals([]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Execution failed: ${errorMsg}`);
      setAgentState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan, executePlanStep]);

  /**
   * Reject the current plan
   */
  const rejectPlan = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `rejection-${Date.now()}`,
        role: 'assistant',
        content: 'Plan rejected. Please provide a new request.',
      },
    ]);

    setCurrentPlan(null);
    setPendingApprovals([]);
    setAgentState('idle');
  }, []);

  /**
   * Approve a single step
   */
  const approveSingleStep = useCallback((stepId: string) => {
    setCurrentPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, status: 'approved' } : s
        ),
      };
    });

    setPendingApprovals((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  const rejectSingleStep = useCallback((stepId: string) => {
    setCurrentPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, status: 'rejected' } : s
        ),
      };
    });

    setPendingApprovals((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-900">Full Agent with Plans & Tools</h1>
          <p className="text-sm text-orange-700">
            Agent State: <span className="font-semibold">{agentState.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Messages and Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-orange-200 flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Start a conversation. The agent will create and execute a plan for you.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}

            {isLoading && agentState !== 'waiting_approval' && (
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

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a task (e.g., 'search for React patterns', 'analyze data', 'execute code')..."
              disabled={isLoading || agentState === 'executing'}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || agentState === 'executing'}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-slate-400 transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Sidebar: Plan and Approvals */}
        <div className="w-96 flex flex-col gap-4 min-h-0">
          {/* Current Plan */}
          {currentPlan && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-orange-200 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Plan</h3>

              <div className="mb-3 pb-3 border-b border-slate-200">
                <p className="text-xs text-slate-600">{currentPlan.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Status: <span className="font-semibold">{currentPlan.status}</span>
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {currentPlan.steps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-2 rounded border text-xs ${
                      step.status === 'pending'
                        ? 'bg-yellow-50 border-yellow-200'
                        : step.status === 'approved'
                          ? 'bg-blue-50 border-blue-200'
                          : step.status === 'executing'
                            ? 'bg-purple-50 border-purple-200'
                            : step.status === 'completed'
                              ? 'bg-green-50 border-green-200'
                              : step.status === 'failed'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-700">{step.description}</p>
                    <p className="text-slate-600 mt-1">Tool: {step.tool}</p>
                    <p className="text-slate-500 mt-1">
                      Status:{' '}
                      <span
                        className={`font-semibold ${
                          step.status === 'completed'
                            ? 'text-green-600'
                            : step.status === 'failed'
                              ? 'text-red-600'
                              : 'text-slate-600'
                        }`}
                      >
                        {step.status}
                      </span>
                    </p>
                    {step.result && (
                      <p className="text-slate-600 mt-1 line-clamp-2">{step.result}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {agentState === 'waiting_approval' && pendingApprovals.length > 0 && (
                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={approveAndExecutePlan}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Approve & Execute
                  </button>
                  <button
                    onClick={rejectPlan}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Execution Results */}
          {executionResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-orange-200 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Execution Results ({executionResults.length})
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2">
                {executionResults.map((result, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-700">{result.toolId}</p>
                    <p className="text-slate-600 mt-1 line-clamp-2">{result.result}</p>
                    <p className="text-slate-500 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Tools */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-orange-200 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Available Tools</h3>

            <div className="flex-1 overflow-y-auto space-y-2">
              {AVAILABLE_TOOLS.map((tool) => (
                <div key={tool.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-semibold text-slate-700">{tool.name}</p>
                  <p className="text-slate-600">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
        <p>
          Messages: {messages.length} | Plan Steps: {currentPlan?.steps.length || 0} | Results:
          {executionResults.length} | Plans Completed: {planHistory.length}
        </p>
      </div>
    </div>
  );
}

export default FullAgentExample;
