# Prompt Engineering Design Document

This document explains the design decisions, patterns, and best practices used in the Clarity Chat
documentation assistant prompts.

## Overview

The prompt system is designed with these goals:

1. **Reliability**: Consistent, high-quality responses
2. **Maintainability**: Easy to update and version
3. **Performance**: Optimized for token efficiency and caching
4. **Testability**: Validation at multiple levels

## Key Design Decisions

### 1. XML Tag Structure

**What**: All prompts use XML-style tags (e.g., `<assistant_identity>...</assistant_identity>`)

**Why**:

- Anthropic's Claude models parse XML tags reliably
- Clear section boundaries reduce ambiguity
- Easier to test for structure programmatically
- Better model attention to section content

**Reference**:
[Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/use-xml-tags)

```typescript
// Good - XML structure
export const PROMPT = `<assistant_identity>
You are a documentation assistant...
</assistant_identity>

<response_guidelines>
Required behaviors:
- Lead with the answer
- Include code examples
</response_guidelines>`

// Avoid - Markdown headers only
export const PROMPT = `## Identity
You are a documentation assistant...

## Guidelines
- Lead with the answer`
```

### 2. KV-Cache Alignment

**What**: Static content (identity, context, examples) is placed first; dynamic content (guidelines,
instructions) comes last.

**Why**:

- Server-side KV-cache can reuse prefixes across requests
- Reduces latency for repeated prompts
- Lowers inference costs
- ~1,500 tokens of our prompt are cacheable

**Structure Order**:

1. `<assistant_identity>` - Who the assistant is (static)
2. `<core_responsibilities>` - Main duties (static)
3. `<technical_context>` - Package info, types (static)
4. `<response_patterns>` - How to respond (semi-static)
5. `<example_response>` - Few-shot examples (static)
6. `<response_guidelines>` - Specific behaviors (may vary)
7. `<closing>` - Final reminders (static)

### 3. Positive Instruction Framing

**What**: Use "Do X" instead of "Don't do Y"

**Why**:

- Positive instructions are clearer
- Models follow positive patterns more reliably
- Reduces confusion about what IS expected
- Based on prompt engineering research

```typescript
// Good - Positive framing
"Required behaviors:
- Lead with the answer, then provide explanation
- Include runnable code examples with imports"

// Avoid - Negative framing
"Never Do:
- Don't start with long explanations
- Don't forget imports in code"
```

### 4. Lost-in-the-Middle Mitigation

**What**: Critical information is placed at the beginning AND end of prompts

**Why**:

- Research shows models attend better to start and end
- Middle content can be "lost"
- We repeat key behaviors in `<closing>` section

**Reference**:
[Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)

### 5. Few-Shot Examples

**What**: Include concrete example responses in `<example_response>` tags

**Why**:

- Shows desired format explicitly
- Reduces formatting variance
- Improves first-response quality
- More reliable than describing format

### 6. Token Estimation

**What**: Every prompt template includes a `tokenEstimate` field

**Why**:

- Budget planning for API costs
- KV-cache optimization decisions
- Prevents accidental prompt bloat
- Enables automated validation

**Validation**:

```typescript
// Tests verify estimates are within 40% of calculated
it('tokenEstimate is accurate', () => {
  const calculated = estimateTokens(template.prompt)
  const declared = template.tokenEstimate
  expect(Math.abs(calculated - declared) / declared).toBeLessThan(0.4)
})
```

## File Structure

```
lib/ai/
├── prompts.ts           # Main prompt exports, version tracking
├── promptTemplates.ts   # Personality mode templates
├── tokenUtils.ts        # Token counting utilities
├── promptValidation.ts  # Validation rules and runtime checks
├── PROMPT_DESIGN.md     # This document
└── PROMPT_CHANGELOG.md  # Version history

components/AI/
└── systemPrompt.ts      # Core system prompt + utilities
```

## Validation Layers

### 1. Type Safety

- `tokenEstimate: number` (required)
- TypeScript interfaces enforce structure

### 2. Test-Time Validation

- XML balance tests
- XML nesting tests
- Token estimate accuracy tests
- Positive framing ratio tests

### 3. Runtime Validation (Dev Mode)

```typescript
import { validatePromptDevMode } from './promptValidation'

// In development, logs warnings to console
validatePromptDevMode(SYSTEM_PROMPT, 'DOCS_ASSISTANT')
```

### 4. Build-Time Assertion

```typescript
import { assertPromptValid } from './promptValidation'

// Throws if prompt is invalid - stops build
assertPromptValid(SYSTEM_PROMPT, 'DOCS_ASSISTANT')
```

## Adding New Prompts

### Checklist

- [ ] Use XML tags for sections
- [ ] Place static content first (for caching)
- [ ] Include example responses
- [ ] Use positive instruction framing
- [ ] Add `tokenEstimate` field
- [ ] Write tests for new prompt
- [ ] Update PROMPT_CHANGELOG.md
- [ ] Run validation tests

### Template

```typescript
export const NEW_PROMPT = `<assistant_identity>
You are [role] for [product].
</assistant_identity>

<core_responsibilities>
1. [Primary task]
2. [Secondary task]
</core_responsibilities>

<response_guidelines>
Required behaviors:
- [Positive instruction 1]
- [Positive instruction 2]
</response_guidelines>

<example_response>
User: "[Example question]"
Response: [Example answer with code]
</example_response>

<closing>
[Final reminder of key behavior]
</closing>`
```

## Resources

- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/intro-to-prompting)
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Lost in the Middle Paper](https://arxiv.org/abs/2307.03172)
- [KV-Cache Optimization](https://docs.anthropic.com/claude/docs/prompt-caching)

---

**Version**: 1.0.0 **Last Updated**: December 2025 **Author**: Claude (AI Code Review)
