# Prompt Changelog

All notable changes to the AI prompt system are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-12-09

### Added

- Token counting utilities (`tokenUtils.ts`)
  - `estimateTokens()` for character-based token estimation
  - `validateTokenEstimate()` for accuracy checking
  - `analyzePromptTokens()` for detailed breakdown
  - `suggestTokenEstimate()` for auto-generating estimates
- Comprehensive prompt validation (`promptValidation.ts`)
  - 7+ built-in validation rules
  - XML structure validation (balance + nesting)
  - Best practices checks (identity, examples, positive framing)
  - Anti-pattern detection (jailbreak vulnerabilities)
  - Dev-mode logging and build-time assertions
- XML nesting validation (`validateXmlNesting()`)
  - Stack-based algorithm catches improper nesting
  - Reports exact positions of errors
  - Returns structure visualization
- Prompt engineering documentation (`PROMPT_DESIGN.md`)
  - Design decisions explained
  - Best practices codified
  - New prompt checklist

### Changed

- `tokenEstimate` is now **required** in `PromptTemplate` interface
  - Previously optional (`tokenEstimate?: number`)
  - All templates already had values, so no breaking changes
- Updated `PROMPT_VERSION` to `2.1.0`
- Improved "positive instruction" test
  - Now measures ratio of positive to negative patterns
  - More robust than checking for absence of specific headers

### Fixed

- Removed unnecessary non-null assertions in tests
- Test descriptions updated to reflect required tokenEstimate

## [2.0.0] - 2025-12-09

### Added

- XML tag structure for all prompt sections
  - `<assistant_identity>` - Who the assistant is
  - `<core_responsibilities>` - Main duties
  - `<technical_context>` - Package info, types, commands
  - `<response_patterns>` - How to respond to different queries
  - `<example_response>` - Few-shot example
  - `<continuation_behaviors>` - Follow-up handling
  - `<proactive_assistance>` - When to be proactive
  - `<response_guidelines>` - Required behaviors
  - `<closing>` - Final reminder
- KV-cache optimized ordering (static content first)
- Version metadata with changelog in file header
- Token estimate comments
- Tests for XML structure validation

### Changed

- Converted negative instructions to positive framing
  - "Never Do" → "Required behaviors"
  - "Don't start with explanations" → "Lead with the answer"
- Restructured prompt for better cache alignment
- Updated to follow Anthropic best practices

### Removed

- Explicit "Never Do" section (replaced with positive framing)

## [1.0.0] - 2025-10-01

### Added

- Initial documentation assistant system prompt
- 6 personality mode templates:
  - `default` - Balanced responses
  - `beginner` - Patient, step-by-step
  - `expert` - Concise, technical
  - `quick` - Minimal explanation
  - `tutorial` - Teaching-focused
  - `code` - Maximum code examples
- Context-aware prompts based on page location
- Personality modes (technical, friendly, concise)
- Utility functions for formatting doc links

---

## Impact Assessment Template

When making prompt changes, document the expected impact:

```markdown
### Impact Assessment for [version]

**Templates Affected**: [list template IDs] **Expected Behavior Changes**:

- [Change 1]
- [Change 2]

**Risk Level**: [Low/Medium/High] **Rollback Plan**: [How to revert if issues] **Metrics to Watch**:

- User satisfaction
- Response quality
- Task completion rate
```

## Migration Notes

### From 1.0 to 2.0

The prompt structure changed significantly:

1. Added XML tags - no action needed, backwards compatible with models
2. Reordered sections - no action needed
3. Positive framing - responses may be slightly different in tone

### From 2.0 to 2.1

1. `tokenEstimate` is now required - all existing templates already had values
2. New validation module available - opt-in usage
3. Token utilities available for budget planning

---

**Maintained by**: Code & Clarity Engineering **Last Updated**: December 2025
