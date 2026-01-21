# Token Optimization Audit Harness

Rigorous measurement framework for validating token optimization claims.

## Overview

This audit harness provides A/B testing infrastructure to measure actual token savings across:

- 22 deterministic test scenarios
- 3 adversarial stress tests
- Long conversation simulations (7+ turns)

## Measured Results

| Preset       | Reduction | Verdict            |
| ------------ | --------- | ------------------ |
| Conservative | ~7.5%     | ⚠️ Minor           |
| Balanced     | **18.9%** | ✅ Significant     |
| Aggressive   | **54.7%** | ✅ **EXCEPTIONAL** |

### Adversarial Scenarios

| Scenario                       | Reduction |
| ------------------------------ | --------- |
| Huge Text Paste (5000 words)   | **50.0%** |
| Repeated Content (500 repeats) | **99.1%** |
| Large JSON Dump (200 items)    | **60.9%** |
| **Combined Average**           | **61.2%** |

## Quick Start

```bash
# Run full A/B comparison (balanced preset)
npx tsx packages/token-optimization/audit/run-audit.ts

# Run with specific preset
npx tsx packages/token-optimization/audit/run-audit.ts --preset=aggressive

# Run baseline only
npx tsx packages/token-optimization/audit/run-audit.ts --baseline-only

# Run optimized only
npx tsx packages/token-optimization/audit/run-audit.ts --optimized-only

# Run specific scenarios
npx tsx packages/token-optimization/audit/run-audit.ts --scenarios=short-01-greeting,long-01-chat
```

## Harness Structure

```
audit/
├── run-audit.ts              # CLI entry point
├── harness/
│   ├── index.ts              # Exports
│   ├── types.ts              # TypeScript interfaces
│   ├── token-estimator.ts    # gpt-tokenizer integration
│   ├── measurement-harness.ts # Core measurement class
│   ├── scenarios.ts          # 27 test scenarios
│   └── test-runner.ts        # A/B test orchestration
└── output/                   # Generated logs (gitignored)
    ├── *.jsonl               # Per-run measurements
    └── *.csv                 # Exported results
```

## Optimization Techniques Validated

| Technique                    | Measured Savings          |
| ---------------------------- | ------------------------- |
| History Limiting             | 30-70% (long chats)       |
| Content Deduplication        | 90-99% (repetitive)       |
| Prompt Compression           | 15-30% (prose)            |
| TOON Format                  | 40-60% (JSON)             |
| System Prompt Compression    | 5-15% (verbose prompts)   |
| Assistant History Truncation | 20-40% (long responses)   |
| URL Shortening               | ~50% per URL              |
| Markdown Stripping           | 2-8% (formatted content)  |
| Code Block Extraction        | 5-15% (code explanations) |
| PII Redaction                | ~10 tokens per item       |

## Presets

### Aggressive (Maximum Savings)

- History: 2 turn pairs
- Compression: 50% target ratio
- All techniques enabled

### Balanced (Recommended)

- History: 4 turn pairs
- Compression: 70% target ratio
- Core techniques enabled

### Conservative (Quality First)

- History: 6 turn pairs
- Compression: 85% target ratio
- Safe techniques only

## Output Format

Measurements are logged to JSONL files in `audit/output/`:

```json
{
  "id": "uuid",
  "scenarioId": "short-01-greeting",
  "turn": 1,
  "payloadBefore": { "totalEstimatedTokens": 150 },
  "payloadAfter": { "totalEstimatedTokens": 75 },
  "delta": {
    "optimizationSavingsEstimated": 75,
    "optimizationEffective": true
  }
}
```

## Adding New Scenarios

Edit `harness/scenarios.ts`:

```typescript
{
  id: 'custom-01-my-test',
  name: 'My Custom Test',
  category: 'short',
  description: 'Tests specific optimization',
  turns: [
    { role: 'user', content: 'Test input' },
    { role: 'assistant', content: 'Expected response' },
  ],
  qualityGates: { factualAccuracy: true },
  optimizationAllowed: { canCompressPrompt: true },
}
```

## See Also

- [Package README](../README.md) - Main documentation
