# Why Your AI Chatbot Feels "Off"

*Newsletter version of: Psychology of Response Timing*

---

Your AI responds in 847 milliseconds. Your users hate it.

Sounds backwards, right? We optimize everything for speed. But when AI answers *too quickly*, users don't trust it.

I tested two identical chatbots with real users. Same model, same prompts, same responses. The only difference: one showed answers instantly, the other added a 1.5-second "thinking" delay.

**Results:**
- Instant bot: 3.1/5 satisfaction
- Delayed bot: 4.3/5 satisfaction

Same AI. 39% satisfaction difference from timing alone.

## Why This Happens

When someone asks you a complex question, you don't answer in 0.8 seconds. If you did, they'd assume you didn't really think about it.

The same psychology applies to AI. Instant answers feel pre-recorded and dismissive.

## The Fix

Show thinking is happening. Match delay to query complexity:

- Greetings: 300-500ms
- Simple facts: 800-1,500ms
- Analysis: 1,500-3,000ms
- Complex reasoning: 2,000-5,000ms

Here's a simple React hook to implement this:

```tsx
function useRealisticTyping(stages: {duration: number, label: string}[]) {
  const [currentStage, setCurrentStage] = useState(null)

  const startTyping = async (complexity: number) => {
    for (const stage of stages) {
      setCurrentStage(stage)
      await new Promise(r => setTimeout(r, stage.duration * complexity))
    }
    setCurrentStage(null)
  }

  return { currentStage, startTyping }
}
```

Use multi-stage indicators: "Reading..." → "Thinking..." → "Writing..."

Each stage change resets user patience.

## Key Takeaway

Your AI's intelligence matters. But how it's *presented* matters just as much. Users perceive slower (within reason) as more thoughtful.

---

**Read the full post** for complete implementation code, animation examples, and timing recommendations by query type.

[Read full post →]

---

*You're receiving this because you subscribed to the Clarity Chat newsletter. Unsubscribe anytime.*
