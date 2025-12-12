# Code Review Training Examples

This directory contains intentionally flawed code examples paired with "gold standard" reviews demonstrating what the review prompts should catch.

## Purpose

1. **Prompt Validation**: If prompts stop catching issues in these examples, they've degraded
2. **Developer Training**: Learn review standards by studying examples
3. **Onboarding**: New team members can understand expectations

## Examples

| File | Review Type | Issues Demonstrated |
|------|-------------|---------------------|
| `bad-security.tsx` | Security | XSS, unvalidated inputs, secret exposure |
| `bad-performance.tsx` | Performance | Missing memoization, unstable deps, no code splitting |
| `bad-typescript.tsx` | TypeScript | Implicit any, missing types, unsafe casts |
| `bad-tailwind.tsx` | Tailwind | Arbitrary values, no dark mode, desktop-first |
| `bad-clarity-chat.tsx` | Clarity Chat | Missing providers, no error handling, wrong hook usage |

## How to Use

### Validate Prompts
```bash
# Run a review prompt against an example
claude -p "$(cat .github/prompts/security-review.prompt.md)" --file docs/prompts/examples/bad-security.tsx

# Compare output to the .review.md file
```

### Training Exercise
1. Review `bad-*.tsx` files yourself
2. List all issues you find
3. Compare your findings to the `.review.md` files
4. Note any issues you missed

## Adding New Examples

When adding examples:
1. Include realistic, project-relevant code
2. Add 3-5 issues per review category
3. Make some issues obvious, some subtle
4. Write the expected review output
5. Update this README
