# Building AI That Actually Remembers

*Newsletter version of: AI Memory Systems*

---

LLMs are stateless. Every message is meeting them for the first time.

Your users expect AI to remember:
- They prefer Python over JavaScript
- They asked about refunds yesterday
- Their name is Sarah

But LLMs have amnesia by design. The memory users expect doesn't exist.

You have to build it.

## Three Types of Memory

**Short-Term Memory**
Current conversation context. Lives in the prompt.

```typescript
const context = messages.slice(-20) // Last 20 messages
```

**Long-Term Memory**
User preferences and facts. Stored in database.

```typescript
interface MemoryEntry {
  userId: string
  type: 'preference' | 'fact'
  content: string  // "prefers Python"
  confidence: number
}
```

**Working Memory**
Current task state. What the AI is actively working on.

## Memory Extraction

Extract facts from conversations automatically:

```typescript
const extractionPrompt = `
Extract facts from this conversation:
- User preferences (language, format, style)
- Personal info shared (name, role, company)
- Stated goals or needs

Return as JSON array.
`
```

## Privacy Considerations

Memory creates responsibility:

1. **Let users see what you remember** — transparency
2. **Let users delete memories** — control
3. **Don't store sensitive data** — PII minimization
4. **Explain why you remember** — trust

```typescript
// In your response
"I remember you prefer Python (you mentioned this on Tuesday).
Want me to forget this preference?"
```

## Key Takeaway

Users expect memory. LLMs don't have it. The gap is your responsibility to fill—thoughtfully.

---

**Read the full post** for complete memory architecture and retrieval patterns.

[Read full post →]
