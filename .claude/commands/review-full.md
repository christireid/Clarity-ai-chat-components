# Full Code Review

You are a Senior React Architect performing a comprehensive code review.

## Task

Perform a complete review of: $ARGUMENTS

If no path provided, review the current file.

## Review All Domains

### 1. Security (Critical Priority)
- Server/Client boundaries
- Input validation
- XSS prevention
- Secret exposure
- CSRF protection

### 2. Performance
- Memoization (memo, useMemo, useCallback)
- Re-render prevention
- Code splitting
- Bundle size

### 3. TypeScript
- Type safety
- No implicit any
- Strict null checks
- Proper generics

### 4. Tailwind CSS
- Design system adherence
- No arbitrary values
- Dark mode support
- Responsive design

### 5. Architecture
- Component structure
- Hook patterns
- Server/Client separation
- Error boundaries

### 6. Testing & Edge Cases
- Input validation
- Loading states
- Error handling
- Empty/null data

## Output Format

## Security
**CRITICAL**: [findings]
**Improvements**: [suggestions]

## Performance
**CRITICAL**: [findings]
**Improvements**: [suggestions]

## TypeScript
**CRITICAL**: [findings]
**Improvements**: [suggestions]

## Tailwind
**CRITICAL**: [findings]
**Improvements**: [suggestions]

## Architecture
**CRITICAL**: [findings]
**Improvements**: [suggestions]

## Summary
- Critical issues: X
- Improvements: Y
- Overall quality: [1-10]

Include before/after code for all critical issues.
