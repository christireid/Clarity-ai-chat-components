## Summary

<!-- Provide a clear, concise description of what this PR does -->

## Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] ⚡ Performance improvement
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ✅ Test update
- [ ] 🔧 CI/CD update
- [ ] 🎨 Style/UI update

## Related Issues

<!-- Link any related issues here using "Fixes #123" or "Relates to #123" -->

Fixes #
Relates to #

## Changes Made

<!-- Provide a detailed list of changes -->

### Core Changes
-
-
-

### Additional Changes
-
-

## Test Plan

<!-- Describe how you tested these changes -->

### Unit Tests
- [ ] Unit tests added/updated
- [ ] All unit tests pass (`pnpm test`)
- [ ] Coverage maintained or improved

### Integration Tests
- [ ] Integration tests added/updated (if applicable)
- [ ] All integration tests pass

### E2E Tests
- [ ] E2E tests added/updated (if applicable)
- [ ] All E2E tests pass (`pnpm test:e2e`)

### Manual Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile (if UI change)
- [ ] Tested with screen reader (if UI change)
- [ ] Tested with keyboard navigation (if UI change)

### Test Scenarios Covered
<!-- List specific scenarios you tested -->
1.
2.
3.

## Performance Impact

<!-- If this PR affects performance, describe the impact -->

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance impact analyzed and acceptable

**Benchmarks** (if applicable):
```
Before: X ms
After:  Y ms
Change: +/- Z%
```

## Breaking Changes

<!-- If this PR introduces breaking changes, describe them and the migration path -->

- [ ] No breaking changes
- [ ] Breaking changes documented below

### Breaking Changes Details
<!-- Describe what breaks and how to migrate -->

**What breaks:**


**Migration path:**


## Accessibility

<!-- Verify accessibility compliance -->

- [ ] No UI changes (skip accessibility checks)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA attributes added/updated
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Tested with screen reader
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No accessibility violations (tested with axe DevTools)

## Security

<!-- Verify security considerations -->

- [ ] No security implications
- [ ] No secrets or API keys in code
- [ ] Input validation added
- [ ] XSS vulnerabilities checked
- [ ] CSRF protection added (for API routes)
- [ ] Dependencies security checked (`pnpm audit`)

## Screenshots/Recordings

<!-- If applicable, add screenshots or recordings to help explain your changes -->

### Before


### After


## Code Quality Checklist

<!-- Verify code quality standards -->

### TypeScript
- [ ] No `any` types (or justified in comments)
- [ ] Proper type definitions
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] No TypeScript errors or warnings

### Code Style
- [ ] Code follows ESLint rules (`pnpm lint`)
- [ ] Code properly formatted (`pnpm format`)
- [ ] No console.log statements (except intentional logging)
- [ ] No commented-out code
- [ ] Code is self-documenting with clear variable names

### React Best Practices
- [ ] Components properly typed
- [ ] Hooks used correctly (dependencies, cleanup)
- [ ] Components memoized where appropriate
- [ ] No unnecessary re-renders
- [ ] Props properly destructured with defaults

### Testing
- [ ] Tests added for new functionality
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)

## Documentation Checklist

<!-- Check all that apply if you added/modified documentation -->

- [ ] No documentation changes needed
- [ ] README updated
- [ ] API documentation updated
- [ ] Inline code comments added for complex logic
- [ ] Examples provided for new features
- [ ] Migration guide added (for breaking changes)
- [ ] Changelog entry prepared (changeset added)

### Documentation Policy Compliance
- [ ] I have reviewed the [Documentation Policy](../.github/DOCUMENTATION_POLICY.md)
- [ ] No development artifacts (status reports, phase summaries, etc.) are included
- [ ] Documentation files follow essential documentation patterns
- [ ] Changes to READMEs reflect actual API/functionality changes
- [ ] Temporary notes have been removed or archived to `.archive/`
- [ ] No duplicate documentation was created
- [ ] Links and references have been tested

## Changeset

<!-- For version-tracked changes -->

- [ ] Not applicable (docs, tests, or internal changes only)
- [ ] Changeset added (`pnpm changeset`)

## Reviewer Guidance

<!-- Help reviewers understand what to focus on -->

**What to focus on:**
-
-

**Known limitations:**
-
-

**Areas needing extra attention:**
-
-

## Additional Context

<!-- Any other information that reviewers should know -->

## Pre-Merge Checklist

<!-- Final checks before merge -->

- [ ] All CI checks passing
- [ ] All review comments addressed
- [ ] PR approved by at least one maintainer
- [ ] Branch up to date with base branch
- [ ] No merge conflicts
- [ ] Squash commits if needed (keep history clean)

---

## For Reviewers

### Code Review Checklist

#### Functionality
- [ ] Changes work as described
- [ ] Edge cases handled
- [ ] Error handling is appropriate
- [ ] No regressions introduced

#### Code Quality
- [ ] Code is readable and maintainable
- [ ] Follows project patterns and conventions
- [ ] No code smells or anti-patterns
- [ ] Appropriate abstractions and separation of concerns

#### Testing
- [ ] Test coverage is adequate
- [ ] Tests are well-written and meaningful
- [ ] Tests cover happy path and edge cases
- [ ] No flaky or brittle tests

#### Performance
- [ ] No unnecessary computations
- [ ] Appropriate memoization
- [ ] No memory leaks
- [ ] Efficient algorithms

#### Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Secrets properly handled
- [ ] Dependencies are safe

#### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic explained
- [ ] Public APIs documented
- [ ] Examples provided where helpful

### Review Comments Legend

Use these labels in review comments:

- **[BLOCKING]** - Must be fixed before merge
- **[SUGGESTION]** - Nice to have, but not required
- **[QUESTION]** - Needs clarification
- **[NITPICK]** - Minor style/convention issue
- **[PRAISE]** - Good work worth highlighting

---

**Note**: This template is comprehensive. Not all sections apply to every PR. Fill out what's relevant and mark others as N/A.
