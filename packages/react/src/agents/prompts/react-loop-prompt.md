# ReAct Loop Pattern - Prompt-Guided Workflow

This document defines the ReAct (Reasoning + Acting) pattern for agentic AI as a **prompt-guided workflow** rather than hardcoded control flow.

## Overview

The ReAct pattern helps AI agents solve problems through iterative cycles of:
1. **THOUGHT**: Reason about the problem
2. **ACTION**: Execute tools to gather information
3. **OBSERVATION**: Process tool results
4. **Repeat**: Continue until you can answer

Based on: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)

## Core Principle

**The AI decides the next step based on context, not hardcoded control flow.**

```
❌ BAD (Hardcoded):
if (lastStep === 'thought') then execute_action()
if (lastStep === 'action') then observe()

✅ GOOD (Prompt-Guided):
"Based on your previous steps, what should you do next?"
Agent reasons: "I just got a tool result, so I should observe it and think"
```

## ReAct Loop Phases

### Phase 1: THOUGHT (Reasoning)

**When to use**:
- At the start of a task
- After observing tool results
- When you need to plan your next move

**What to do**:
1. Analyze the current situation
2. Review what you know so far
3. Identify information gaps
4. Decide what action to take next (or if you can answer)

**Example**:
```
User: "What's the bundle size of Clarity Chat with RAG?"

THOUGHT: To answer this, I need to:
1. Understand what features are included (RAG specifically)
2. Look up or calculate the bundle size with RAG enabled
3. Consider lazy loading optimizations

I should use the calculate_bundle_impact tool to analyze this.
```

### Phase 2: ACTION (Tool Execution)

**When to use**:
- After thinking and identifying a needed tool
- When you need specific information you don't have

**What to do**:
1. Select the appropriate tool
2. Determine the required arguments
3. Execute the tool
4. Wait for the result

**Example**:
```
ACTION: Use calculate_bundle_impact
Arguments: {
  user_requirements: "streaming chat with RAG integration",
  context: "performance-sensitive application"
}
```

**Important**:
- Only one tool call per ACTION phase
- Wait for the result before proceeding
- If tool requires approval, respect the approval decision

### Phase 3: OBSERVATION (Result Processing)

**When to use**:
- Immediately after receiving a tool result
- After an action completes or fails

**What to do**:
1. Examine the tool result
2. Note what worked or failed
3. Update your understanding
4. Prepare for next thought phase

**Example**:
```
OBSERVATION: The calculate_bundle_impact tool returned:
- Recommended entry point: @clarity-chat/react/core-minimal
- Base size: ~30KB
- RAG: lazy-loadable (~15KB on-demand)
- Total if loaded: ~45KB

This gives me the information I need to answer.
```

### Phase 4: DECISION (Continue or Answer)

**After each observation, decide**:

```
Do I have enough information to answer the user's question?

YES → Provide ANSWER
NO  → Return to THOUGHT phase with new information
```

## Decision Criteria

### When to Continue (More Thoughts)

Continue if:
- You're missing critical information
- Tool results were unclear or incomplete
- You need to verify information from multiple sources
- The task requires multiple steps

### When to Answer

Answer when:
- You have all information needed
- Further tool calls won't add value
- You can provide a complete, accurate response
- You've reached the task goal

## Complete ReAct Loop Example

```
User: "What's the recommended setup for a mobile chat app?"

─────────────────────────────────────────────────
THOUGHT #1:
To recommend a setup, I need to understand:
1. Mobile-specific bundle size constraints
2. Which features are essential vs optional
3. Optimization strategies for mobile

I should use calculate_bundle_impact with mobile context.

─────────────────────────────────────────────────
ACTION #1: calculate_bundle_impact
{
  user_requirements: "basic chat for mobile app",
  context: "mobile-first, performance-sensitive, <50KB target"
}

─────────────────────────────────────────────────
OBSERVATION #1:
Got recommendation:
- Entry point: @clarity-chat/react/core-minimal (~30KB)
- Includes: chat, messages, input, streaming
- Within 50KB target ✓
- Suggested lazy loading for theming

─────────────────────────────────────────────────
THOUGHT #2:
I have the base recommendation (core-minimal). The user might also
benefit from knowing about optional enhancements like theming.
But I have enough to answer their core question.

Can I answer? YES - I can recommend core-minimal with details.

─────────────────────────────────────────────────
ANSWER:
For a mobile chat app, I recommend:

**Entry Point**: @clarity-chat/react/core-minimal (30KB)

This includes:
- Chat primitives
- Message rendering
- Input handling
- Streaming support

Well within mobile performance budgets. If you need theming
(light/dark mode), you can lazy load it (+12KB on-demand).
```

## Anti-Patterns to Avoid

### ❌ Hardcoded Loop Control

```typescript
// BAD: Hardcoded decision tree
if (lastStep.type === 'thought') {
  return act()
}
if (lastStep.type === 'action') {
  return observe()
}
```

### ❌ Premature Answers

```
THOUGHT: User wants bundle info
ACTION: [skipped]
ANSWER: "It's about 120KB" ← No tool used, might be wrong!
```

### ❌ Infinite Loops

```
THOUGHT → ACTION → OBSERVATION → THOUGHT → ACTION → ... (never answers)
```

**Prevention**: Set max iterations (typically 5-10) and always evaluate "can I answer?" after observations.

### ❌ Skipping Observations

```
ACTION: calculate_bundle_impact
THOUGHT: [immediate next thought without observing result]
```

**Always observe action results before next thought.**

## Multi-Step Tasks

For complex tasks requiring multiple tool calls:

```
THOUGHT #1: Need data from source A
ACTION #1: Get data A
OBSERVATION #1: Got data A

THOUGHT #2: Now need data from source B to complete
ACTION #2: Get data B
OBSERVATION #2: Got data B

THOUGHT #3: I have both A and B, can synthesize answer
ANSWER: [complete answer using both sources]
```

## Error Handling in ReAct Loop

### Tool Failures

```
ACTION: some_tool(args)
OBSERVATION: Tool failed with error "X"

THOUGHT: The tool failed because [reason].
Options:
1. Try a different tool
2. Retry with different arguments
3. Answer with what I know, noting the limitation

I'll [chosen option]...
```

### Max Iterations Reached

If you hit max iterations without answering:
```
THOUGHT: I've reached the iteration limit. Based on what
I gathered from [list observations], here's my best answer...

ANSWER: [best-effort answer with caveats]
```

## Prompt Template for ReAct Agents

```
You are an AI assistant using the ReAct pattern to solve problems.

For each user query, follow this approach:

1. THOUGHT: Think about what information you need
2. ACTION: Use tools to gather information (if needed)
3. OBSERVATION: Process the results
4. Repeat steps 1-3 until you can answer
5. ANSWER: Provide your complete response

Available Tools:
[list of tools with descriptions]

Remember:
- Think before acting
- Observe all tool results
- Only answer when you have sufficient information
- Max iterations: 10

Let's begin.
```

## Integration with Agent Systems

### Prompt-Guided Agent

```typescript
// ✅ GOOD: Prompt guides the loop
class PromptGuidedAgent {
  async execute(query: string) {
    const messages = [
      { role: 'system', content: REACT_PROMPT },
      { role: 'user', content: query }
    ]

    while (notComplete && iterations < maxIterations) {
      const response = await llm.complete(messages)

      if (response.includes('ANSWER:')) {
        return extractAnswer(response)
      }

      if (response.includes('ACTION:')) {
        const result = await executeTool(parseAction(response))
        messages.push({ role: 'observation', content: result })
      }

      iterations++
    }
  }
}
```

### Tool-as-Primitive

Each phase (thought, action, observation) can be exposed as tools:
- `think_about(query, context)` - Reasoning tool
- `execute_action(tool, args)` - Action tool
- `observe_result(result)` - Observation tool

But the AI decides when to call each, not hardcoded control flow.

## Measuring ReAct Effectiveness

Track these metrics:
- **Iterations to Answer**: Fewer is better (but not at cost of accuracy)
- **Tool Call Accuracy**: Did tools provide useful info?
- **Answer Quality**: Complete, accurate answers
- **Reasoning Clarity**: Clear thought process

Good performance:
- 2-4 iterations average
- >90% tool call success
- >95% answer accuracy
- Clear, logical reasoning steps

## Version History

- **v1.0**: Initial prompt-guided ReAct pattern documentation
- Based on original ReAct paper (2022)
- Adapted for Clarity Chat agent-native architecture

---

**Last Updated**: January 26, 2026
**Pattern Type**: Prompt-Guided Workflow
**Recommended For**: All agentic tasks requiring reasoning + tool use
