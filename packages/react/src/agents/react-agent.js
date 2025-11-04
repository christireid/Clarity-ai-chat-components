/**
 * ReAct Agent Implementation
 *
 * Implements the ReAct (Reasoning + Acting) pattern for agentic AI.
 * The agent thinks, acts (uses tools), observes results, and repeats until
 * it has enough information to answer.
 *
 * Based on: https://arxiv.org/abs/2210.03629
 */
export class ReactAgent {
    constructor(config, callbacks) {
        this.name = config.name;
        this.description = config.description;
        this.tools = config.tools || [];
        this.config = config;
        this.callbacks = callbacks;
    }
    async execute(query, context) {
        const execution = {
            id: `exec-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            agent: this.name,
            query,
            steps: [],
            status: 'running',
            startTime: Date.now(),
        };
        try {
            const maxIterations = this.config.maxIterations || 10;
            let iteration = 0;
            // Build context with system prompt and tools
            const messages = [
                {
                    role: 'system',
                    content: this.buildSystemPrompt(),
                },
                ...(context || []),
                {
                    role: 'user',
                    content: this.formatQuery(query),
                },
            ];
            while (iteration < maxIterations && execution.status === 'running') {
                const step = await this.step(execution);
                execution.steps.push(step);
                // Check if we have an answer
                if (step.type === 'answer') {
                    execution.answer = step.content;
                    execution.status = 'completed';
                    if (this.callbacks?.onAnswer) {
                        this.callbacks.onAnswer(step.content);
                    }
                    break;
                }
                // Add step to conversation
                if (step.type === 'action' && step.tool) {
                    messages.push({
                        role: 'assistant',
                        content: `I will use the ${step.tool} tool.`,
                        functionCall: {
                            name: step.tool,
                            arguments: JSON.stringify(step.args),
                        },
                    });
                    messages.push({
                        role: 'function',
                        content: JSON.stringify(step.result),
                        functionResult: step.result,
                    });
                }
                iteration++;
            }
            if (iteration >= maxIterations && execution.status === 'running') {
                execution.status = 'failed';
                execution.error = 'Max iterations reached';
            }
        }
        catch (error) {
            execution.status = 'failed';
            execution.error = error.message;
            if (this.callbacks?.onError) {
                this.callbacks.onError(error);
            }
        }
        finally {
            execution.endTime = Date.now();
        }
        return execution;
    }
    async step(execution) {
        const stepNumber = execution.steps.length + 1;
        // Determine next action based on previous steps
        const lastStep = execution.steps[execution.steps.length - 1];
        if (!lastStep) {
            // First step: Think about the problem
            return this.think(stepNumber, execution.query);
        }
        if (lastStep.type === 'thought') {
            // After thought: Take action
            return this.act(stepNumber, lastStep.content);
        }
        if (lastStep.type === 'action') {
            // After action: Observe result
            return this.observe(stepNumber, lastStep);
        }
        if (lastStep.type === 'observation') {
            // After observation: Think or answer
            const canAnswer = this.canAnswer(execution.steps);
            if (canAnswer) {
                return this.answer(stepNumber, execution.steps);
            }
            else {
                return this.think(stepNumber, execution.query, execution.steps);
            }
        }
        // Fallback
        return {
            step: stepNumber,
            type: 'answer',
            content: 'I was unable to complete the task.',
            timestamp: Date.now(),
        };
    }
    async think(stepNumber, query, previousSteps) {
        // Simulate LLM thinking
        // In reality, this would call the actual LLM
        const thought = previousSteps
            ? this.generateContinuedThought(query, previousSteps)
            : this.generateInitialThought(query);
        if (this.callbacks?.onThought) {
            this.callbacks.onThought(thought);
        }
        return {
            step: stepNumber,
            type: 'thought',
            content: thought,
            timestamp: Date.now(),
        };
    }
    async act(stepNumber, thought) {
        // Parse thought to determine which tool to use
        // In reality, this would use LLM to determine the tool and arguments
        const { tool, args } = this.parseThought(thought);
        if (this.callbacks?.onAction) {
            this.callbacks.onAction(tool, args);
        }
        // Execute tool (with approval if needed)
        const toolDef = this.getTool(tool);
        if (!toolDef) {
            return {
                step: stepNumber,
                type: 'action',
                content: `Tool ${tool} not found`,
                tool,
                error: `Tool ${tool} not found`,
                timestamp: Date.now(),
            };
        }
        if (toolDef.requiresApproval && this.callbacks?.onToolApproval) {
            const approved = await this.callbacks.onToolApproval(toolDef, args);
            if (!approved) {
                return {
                    step: stepNumber,
                    type: 'action',
                    content: 'Tool execution rejected by user',
                    tool,
                    error: 'Rejected',
                    timestamp: Date.now(),
                };
            }
        }
        try {
            const result = await toolDef.execute(args);
            return {
                step: stepNumber,
                type: 'action',
                content: `Executed ${tool}`,
                tool,
                args,
                result,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            return {
                step: stepNumber,
                type: 'action',
                content: `Tool execution failed: ${error.message}`,
                tool,
                args,
                error: error.message,
                timestamp: Date.now(),
            };
        }
    }
    async observe(stepNumber, actionStep) {
        const observation = actionStep.error
            ? `The tool failed: ${actionStep.error}`
            : `The tool returned: ${JSON.stringify(actionStep.result)}`;
        if (this.callbacks?.onObservation) {
            this.callbacks.onObservation(actionStep.result);
        }
        return {
            step: stepNumber,
            type: 'observation',
            content: observation,
            result: actionStep.result,
            error: actionStep.error,
            timestamp: Date.now(),
        };
    }
    async answer(stepNumber, steps) {
        // Generate final answer based on all steps
        const finalAnswer = this.generateAnswer(steps);
        return {
            step: stepNumber,
            type: 'answer',
            content: finalAnswer,
            timestamp: Date.now(),
        };
    }
    buildSystemPrompt() {
        const toolDescriptions = this.tools.map(t => `${t.name}: ${t.description}\nParameters: ${JSON.stringify(t.parameters)}`).join('\n\n');
        return `${this.config.systemPrompt || 'You are a helpful AI assistant.'}

You have access to the following tools:

${toolDescriptions}

Use the ReAct pattern:
1. THOUGHT: Think about what you need to do
2. ACTION: Use a tool if needed
3. OBSERVATION: Observe the result
4. Repeat until you can answer

When you have enough information, provide a final ANSWER.`;
    }
    formatQuery(query) {
        return `Question: ${query}\n\nLet's approach this step by step.`;
    }
    generateInitialThought(query) {
        // Simplified - in reality use LLM
        return `To answer "${query}", I need to gather information using the available tools.`;
    }
    generateContinuedThought(_query, steps) {
        // Simplified - in reality use LLM
        const _lastObservation = steps.filter(s => s.type === 'observation').pop();
        return `Based on the previous results, I need to continue investigating.`;
    }
    parseThought(_thought) {
        // Simplified parser - in reality use LLM to determine tool and args
        // For now, just return first tool
        const tool = this.tools[0];
        return {
            tool: tool.name,
            args: {},
        };
    }
    canAnswer(steps) {
        // Determine if we have enough information
        // Simplified - in reality use LLM
        const observations = steps.filter(s => s.type === 'observation');
        return observations.length >= 2; // Arbitrary threshold
    }
    generateAnswer(steps) {
        // Generate final answer from all steps
        // Simplified - in reality use LLM
        const _observations = steps.filter(s => s.type === 'observation');
        return `Based on my analysis, here is the answer.`;
    }
    addTool(tool) {
        this.tools.push(tool);
    }
    removeTool(toolName) {
        const index = this.tools.findIndex(t => t.name === toolName);
        if (index >= 0) {
            this.tools.splice(index, 1);
        }
    }
    getTool(name) {
        return this.tools.find(t => t.name === name);
    }
}
//# sourceMappingURL=react-agent.js.map