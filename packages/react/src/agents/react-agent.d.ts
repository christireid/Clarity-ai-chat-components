/**
 * ReAct Agent Implementation
 *
 * Implements the ReAct (Reasoning + Acting) pattern for agentic AI.
 * The agent thinks, acts (uses tools), observes results, and repeats until
 * it has enough information to answer.
 *
 * Based on: https://arxiv.org/abs/2210.03629
 */
import type { Agent, AgentConfig, AgentMessage, AgentExecution, AgentStep, Tool, AgentCallbacks } from './types';
export declare class ReactAgent implements Agent {
    readonly name: string;
    readonly description: string;
    readonly tools: Tool[];
    private config;
    private callbacks?;
    private _modelAdapter;
    constructor(config: AgentConfig, callbacks?: AgentCallbacks);
    execute(query: string, context?: AgentMessage[]): Promise<AgentExecution>;
    step(execution: AgentExecution): Promise<AgentStep>;
    private think;
    private act;
    private observe;
    private answer;
    private buildSystemPrompt;
    private formatQuery;
    private generateInitialThought;
    private generateContinuedThought;
    private parseThought;
    private canAnswer;
    private generateAnswer;
    addTool(tool: Tool): void;
    removeTool(toolName: string): void;
    getTool(name: string): Tool | undefined;
}
//# sourceMappingURL=react-agent.d.ts.map