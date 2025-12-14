# Blog Post 10: Token Counting That Actually Works: A Deep Dive

## Meta Information

- **Reading Time:** 6 minutes (~1,500 words)
- **Category:** Technical Implementation
- **Primary Keyword:** LLM token counting
- **Secondary Keywords:** tiktoken, GPT tokens, cost calculation

---

## Hook / Opening (100 words)

**Opening line:** "JavaScript's string.length has nothing to do with tokens. That's why your cost
estimates are wrong."

You estimated 1,000 tokens. The API charged you for 2,300. What happened?

Token counting is deceptively complex. Different models use different tokenizers. Unicode characters
can be 1 token or 4. Code and natural language tokenize differently. Let's fix your token counting
once and for all.

---

## Section 1: Why String Length Fails (200 words)

### Content:

**The misconception:** "1 token ≈ 4 characters" is a rough average, not a rule.

**Reality examples:**

- "hello" = 1 token
- "Hello" = 1 token
- "HELLO" = 1 token
- "héllo" = 2 tokens (diacritical)
- "你好" = 2 tokens (Chinese)
- "🎉" = 1 token (emoji)
- "const" = 1 token (common in code)
- "XMLHttpRequest" = 4 tokens (camelCase split)

### Visual:

```
[VISUAL 1: Token breakdown examples]
"Hello, how are you today?"
Characters: 24
Tokens: 6 (shown as colored segments)

"XMLHttpRequestFactory.create()"
Characters: 31
Tokens: 9 (each word boundary split)

"你好世界"
Characters: 4
Tokens: 4 (one per character)
```

---

## Section 2: Model-Specific Tokenizers (250 words)

### Content:

**Different models, different tokenizers:**

- GPT-3.5/4: cl100k_base (tiktoken)
- Claude: Custom tokenizer
- Gemini: SentencePiece variant
- Llama: BPE-based

**Why it matters:** The same text can be 1,000 tokens in GPT-4 and 1,200 in Claude.

### Code Example:

```tsx
import { getEncoding, encodingForModel } from 'js-tiktoken'

// GPT-4 tokenizer
const enc = encodingForModel('gpt-4')
const tokens = enc.encode('Hello, world!')
console.log(tokens.length) // 4

// Model-specific in Clarity Chat
import { useTokenTracker } from '@clarity-chat/react'

const { tokens } = useTokenTracker({
  model: 'gpt-4o', // Auto-selects correct tokenizer
  text: userMessage,
})
```

### Visual:

```
[VISUAL 2: Tokenizer comparison table]
"Build a React component"
| Model | Tokenizer | Token Count |
|-------|-----------|-------------|
| GPT-4o | cl100k_base | 4 |
| Claude 3.5 | claude | 5 |
| Gemini | sentencepiece | 5 |
```

---

## Section 3: Counting Full Conversations (300 words)

### Content:

**It's not just the message:**

```json
{
  "model": "gpt-4",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ]
}
```

**Token composition:**

- Each message has overhead (~4 tokens for role markers)
- System prompt is included every time
- Previous messages add up cumulatively

### Code Example:

```tsx
import { useTokenTracker } from '@clarity-chat/react'

function ChatWithTokens() {
  const { tokens, breakdown, estimatedCost } = useTokenTracker({
    model: 'gpt-4o',
    messages,
    includeSystemPrompt: true,
    systemPrompt: 'You are a helpful assistant.',
  })

  // breakdown example:
  // {
  //   systemPrompt: 12,
  //   userMessages: 450,
  //   assistantMessages: 1200,
  //   overhead: 48,  // Role markers
  //   total: 1710
  // }

  return <TokenBreakdown breakdown={breakdown} showPerMessage />
}
```

### Visual:

```
[VISUAL 3: Token breakdown visualization]
Stacked bar chart:
System Prompt: ████ (12 tokens)
User Messages: ████████████ (450 tokens)
Assistant: ████████████████████████████ (1200 tokens)
Overhead: ██ (48 tokens)
───────────────────────────────
Total: 1,710 tokens • $0.03
```

---

## Section 4: Real-Time Token Display (250 words)

### Content:

**Why show tokens to users:**

- Cost awareness
- Context limit warnings
- Informed pruning decisions

### Code Example:

```tsx
import { TokenCounter, useTokenTracker } from '@clarity-chat/react'

function TokenAwareInput() {
  const [draft, setDraft] = useState('')

  const { tokens, estimatedCost } = useTokenTracker({
    model: 'gpt-4o',
    text: draft,
  })

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type your message..."
      />

      <TokenCounter
        current={tokens}
        max={4096}
        cost={estimatedCost}
        variant="inline"
        format={{
          tokens: 'compact', // "1.2k" vs "1,234"
          cost: 'cents', // "3¢" vs "$0.03"
        }}
      />
    </div>
  )
}
```

### Visual:

```
[VISUAL 4: Input with token counter]
┌─────────────────────────────────────┐
│ Tell me about the history of       │
│ quantum computing and its          │
│ applications in modern...          │
├─────────────────────────────────────┤
│ 234 tokens • ~2¢      [Send]       │
└─────────────────────────────────────┘
```

---

## Section 5: Cost Calculation (200 words)

### Content:

**Current pricing (2025):** | Model | Input | Output | |-------|-------|--------| | GPT-4o |
$2.50/1M | $10.00/1M | | GPT-4o-mini | $0.15/1M | $0.60/1M | | Claude 3.5 Sonnet | $3.00/1M |
$15.00/1M |

### Code Example:

```tsx
const { estimatedCost, breakdown } = useTokenTracker({
  model: 'gpt-4o',
  messages,
  pricing: {
    // Custom pricing if needed
    input: 2.5 / 1_000_000,
    output: 10.0 / 1_000_000,
  },
})

// breakdown.cost = {
//   input: 0.012,
//   estimatedOutput: 0.025,
//   total: 0.037
// }
```

---

## Conclusion (80 words)

### Key takeaways:

1. String length ≠ token count
2. Each model has different tokenizers
3. Count full conversation, not just last message
4. Show users their token usage

### Subtle CTA:

"Clarity Chat's useTokenTracker hook handles model-specific tokenization, conversation counting,
cost estimation, and real-time display. Stop guessing your API costs."

---

## Graphics Summary

1. **Token breakdown:** Same text, different token counts
2. **Tokenizer table:** Model comparison
3. **Breakdown visualization:** Stacked bar of token sources
4. **Input mockup:** Real-time token counter
