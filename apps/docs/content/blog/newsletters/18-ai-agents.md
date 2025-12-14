# AI Agents: From Chatbot to Action

_Newsletter version of: AI Agents with Function Calling_

---

ChatGPT can tell you how to book a flight.

An AI agent can actually book it.

The difference between a chatbot and an agent is _action_. Agents use tools—APIs, databases, file
systems—to accomplish real tasks.

## The Agent Loop

Every agent follows this pattern:

1. **User message** → LLM
2. **LLM decides**: respond OR call a tool
3. If tool call → **execute tool** → return result to LLM
4. **Repeat** until LLM has final response

```typescript
while (true) {
  const response = await llm.chat(messages)

  if (!response.toolCalls) {
    return response.content // Done!
  }

  for (const call of response.toolCalls) {
    const result = await executeTool(call)
    messages.push({ role: 'tool', content: result })
  }
}
```

## The Danger Zone

Agents that can take action can take _wrong_ action:

- Order 1000 items instead of 1
- Delete production data
- Send emails to wrong recipients

## Safe Execution Patterns

**1. Confirmation for risky actions**

```typescript
if (action.riskLevel === 'high') {
  const confirmed = await showConfirmDialog(action)
  if (!confirmed) return { cancelled: true }
}
```

**2. Permission scoping** Define exactly what each tool can do. No "admin" access.

**3. Rate limiting** Prevent runaway loops from draining budgets or spamming APIs.

**4. Audit logging** Log every tool call, every result, every decision.

## Key Takeaway

Function calling turns chatbots into agents. With power comes responsibility—build safety rails
before you build features.

---

**Read the full post** for complete tool definitions, Zod schema validation, and confirmation UI
patterns.

[Read full post →]
