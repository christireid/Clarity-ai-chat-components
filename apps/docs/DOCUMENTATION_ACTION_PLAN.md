# Documentation Improvement Action Plan

**Created**: 2026-01-10
**Priority Focus**: Critical contributor documentation gaps
**Timeline**: 2 weeks (Priority 0-1 items)

---

## Priority 0: Critical Gaps (Week 1)

### 1. Create Main CLAUDE.md File
**File**: `/apps/docs/CLAUDE.md`
**Effort**: 4 hours
**Impact**: High - Enables fast contributor onboarding

**Content Outline:**
- Overview of docs site architecture
- Quick start for contributors
- Directory structure explanation
- Common tasks (adding guides, demos, API routes)
- Testing strategy
- Deployment process
- Troubleshooting

**Acceptance Criteria:**
- [ ] New contributor can set up environment in < 30 minutes
- [ ] Clear instructions for adding new content
- [ ] Architecture diagram included
- [ ] Links to all other documentation

---

### 2. Document API Routes
**File**: `/apps/docs/API_ROUTES.md`
**Effort**: 3 hours
**Impact**: High - Critical for understanding backend

**Content Outline:**
```markdown
# API Routes Documentation

## Overview
11 API endpoints serving AI assistance, analytics, and demos

## Endpoints

### AI Assistant Endpoints

#### POST /api/docs-assistant
**Purpose**: AI-powered documentation Q&A
**Request**: { messages: Message[] }
**Response**: SSE stream with text chunks
**Rate Limit**: 100 req/min
**Authentication**: None (demo mode available)

#### GET /api/provider-status
**Purpose**: Check which AI providers are configured
**Request**: None
**Response**: { openai: boolean, anthropic: boolean, google: boolean }
**Rate Limit**: None
**Authentication**: None

[... continue for all 11 endpoints ...]

## Security
- API keys never exposed to client
- Rate limiting on high-traffic endpoints
- CORS configured for docs domain only

## Testing
- Unit tests: /lib/ai/__tests__/
- Integration tests: /tests/api/
- Smoke tests: playwright.smoke.config.ts

## Adding New Endpoints
1. Create route handler in /app/api/your-endpoint/route.ts
2. Add TypeScript types
3. Add tests
4. Document here
5. Update OpenAPI spec (if we add it)
```

**Acceptance Criteria:**
- [ ] All 11 endpoints documented
- [ ] Request/response examples for each
- [ ] Rate limiting documented
- [ ] Authentication/security documented
- [ ] Testing approach documented

---

### 3. Add JSDoc to Top 10 Components
**Files**: Various component files
**Effort**: 4 hours
**Impact**: Medium-High - Improves IDE experience

**Target Components:**
1. `/components/Navigation/Navigation.tsx`
2. `/components/Layout/DocsLayout.tsx`
3. `/components/Demo/ComponentPreview.tsx`
4. `/components/Demo/PlaygroundControls.tsx`
5. `/components/MDX/mdx-components.tsx`
6. `/components/UI/PageTransition.tsx`
7. `/components/UI/Toast.tsx`
8. `/components/Diagrams/DiagramComponents.tsx`
9. `/components/Demo/DemoLayoutWrapper.tsx`
10. `/components/CopyButton/CopyButton.tsx`

**JSDoc Template:**
```typescript
/**
 * Component Name - Brief Description
 *
 * Detailed description of what this component does, its key features,
 * and when to use it.
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={handler}
 * />
 * ```
 *
 * @remarks
 * - Important note about usage
 * - Performance considerations
 * - Accessibility features
 *
 * @see {@link RelatedComponent} for related functionality
 */
export function ComponentName(props: ComponentNameProps) {
  // ...
}

/**
 * Props for ComponentName
 *
 * @property prop1 - Description of prop1
 * @property prop2 - Description of prop2
 */
export interface ComponentNameProps {
  /** Brief description */
  prop1: string
  /** Brief description with details */
  prop2: (value: string) => void
}
```

**Acceptance Criteria:**
- [ ] All 10 components have JSDoc comments
- [ ] Props interfaces documented
- [ ] Examples included
- [ ] Links to related components

---

### 4. Create MCP Server CLAUDE.md
**File**: `/apps/docs/mcp-server/CLAUDE.md`
**Effort**: 2 hours
**Impact**: High - Critical for AI integration understanding

**Content Outline:**
```markdown
# MCP Server - AI Documentation Assistant

## Overview
Model Context Protocol (MCP) server providing AI tools for documentation queries.

## Architecture
- Protocol: MCP (Model Context Protocol)
- Transport: Server-Sent Events (SSE)
- Models: OpenAI, Anthropic, Google Gemini
- Fallback: Demo mode with pre-defined responses

## Available Tools

### list_components
Returns curated list of 28 components for AI context.

**Input**: None
**Output**: Array<{ name, description, props, examples }>

### get_component
Fetches detailed documentation for a component.

**Input**: { name: string }
**Output**: Component documentation with examples

### list_hooks
Returns curated list of 23+ hooks for AI context.

### get_hook
Fetches detailed documentation for a hook.

### search_docs
Full-text search across all documentation.

**Input**: { query: string, limit?: number }
**Output**: SearchResult[]

### health_check
Returns server health status.

## Setup

1. **Install Dependencies**
   ```bash
   cd apps/docs
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Add at least one API key:
   ANTHROPIC_API_KEY=your_key
   # or
   OPENAI_API_KEY=your_key
   # or
   GEMINI_API_KEY=your_key
   ```

3. **Start Server**
   ```bash
   pnpm dev
   # MCP server runs alongside Next.js
   ```

## Adding New Tools

1. **Define Tool Schema**
   ```typescript
   // In /mcp-server/tools.ts
   export const myNewTool: ToolSchema = {
     name: 'my_new_tool',
     description: 'What this tool does',
     inputSchema: {
       type: 'object',
       properties: {
         param1: { type: 'string', description: 'Parameter description' }
       },
       required: ['param1']
     }
   }
   ```

2. **Implement Tool Handler**
   ```typescript
   export async function executeMyNewTool(input: MyToolInput): Promise<ToolResult> {
     // Implementation
     return { success: true, data: result }
   }
   ```

3. **Register Tool**
   ```typescript
   // In /mcp-server/index.ts
   tools.set('my_new_tool', myNewTool)
   handlers.set('my_new_tool', executeMyNewTool)
   ```

4. **Test Tool**
   ```bash
   pnpm test:mcp
   ```

## Testing

### Unit Tests
```bash
pnpm test lib/ai/__tests__/
```

### Integration Tests
```bash
# Start dev server
pnpm dev

# In another terminal, test endpoints
curl -X POST http://localhost:3000/api/docs-assistant \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"How do I use streaming?"}]}'
```

### Demo Mode Testing
Remove API keys to test demo mode fallback:
```bash
unset ANTHROPIC_API_KEY
unset OPENAI_API_KEY
unset GEMINI_API_KEY
pnpm dev
```

## Debugging

### Enable Debug Logging
```typescript
// In /lib/logger.ts
export const logger = {
  debug: process.env.DEBUG === 'true' ? console.log : () => {},
  // ...
}
```

```bash
DEBUG=true pnpm dev
```

### Common Issues

**Issue: "No API key configured"**
- Solution: Add at least one API key to .env.local

**Issue: "Tool not found"**
- Solution: Check tool is registered in handlers map

**Issue: "Rate limit exceeded"**
- Solution: Check /lib/ai/streaming.ts rate limiting logic

## Performance

- Tool calls: < 100ms (local data)
- Search queries: < 200ms (indexed search)
- AI responses: 2-5 seconds (streaming)

## Security

- API keys stored server-side only
- Never exposed to client
- Rate limiting: 100 req/min per IP
- CORS: Docs domain only

## Monitoring

Check server health:
```bash
curl http://localhost:3000/api/ai/health
```

View provider status:
```bash
curl http://localhost:3000/api/provider-status
```

## Production Deployment

See [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) for full process.

Key considerations:
- Ensure API keys in production environment
- Monitor rate limits and adjust as needed
- Enable error tracking (Sentry, etc.)
- Set up uptime monitoring
```

**Acceptance Criteria:**
- [ ] All 6 tools documented
- [ ] Setup instructions tested
- [ ] Adding new tools guide clear
- [ ] Testing approach documented
- [ ] Debugging section complete

---

### 5. Create CONTRIBUTING.md
**File**: `/apps/docs/CONTRIBUTING.md`
**Effort**: 2 hours
**Impact**: High - Establishes contribution standards

**Content Outline:**
```markdown
# Contributing to Clarity Chat Documentation

Thank you for contributing! This guide will help you get started.

## Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/Clarity-ai-chat-components.git
   cd Clarity-ai-chat-components
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development**
   ```bash
   pnpm --filter @clarity-chat/docs dev
   ```

4. **Make Changes** and test locally

5. **Submit PR** with clear description

## Development Workflow

### Adding a New Guide

1. Create file: `/apps/docs/app/guides/your-guide/page.tsx`
2. Add navigation entry in `/apps/docs/lib/navigation.ts`
3. Test locally: `pnpm dev`
4. Verify responsive design (375px, 768px, 1920px)
5. Run smoke tests: `pnpm test:smoke`

### Adding a New Demo

1. Create component: `/apps/docs/app/demos/your-demo/page.tsx`
2. Add to demos navigation
3. Add to demos index page
4. Test all interactive features
5. Add smoke test case

### Updating Components

1. Add/update JSDoc comments
2. Update related documentation pages
3. Add examples if adding new features
4. Run type check: `pnpm typecheck`
5. Run tests: `pnpm test`

## Code Standards

### TypeScript
- Use strict mode
- Add JSDoc to all exported functions/components
- Prefer interfaces over types for objects
- Use proper generics for reusable code

### React
- Use function components (not class components)
- Prefer hooks over HOCs
- Use React Server Components where possible
- Follow composition over prop drilling

### Styling
- Use Tailwind CSS classes
- Follow design system tokens
- Support both light and dark themes
- Test responsive design

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Test keyboard navigation
- Support screen readers
- Respect reduced-motion preferences

## Testing

### Before Submitting PR

```bash
# Type checking
pnpm --filter @clarity-chat/docs typecheck

# Linting
pnpm --filter @clarity-chat/docs lint

# Unit tests
pnpm --filter @clarity-chat/docs test

# Smoke tests
pnpm --filter @clarity-chat/docs test:smoke

# Build
pnpm --filter @clarity-chat/docs build
```

### Writing Tests

- Unit tests: `/apps/docs/lib/__tests__/`
- Component tests: `/apps/docs/components/**/__tests__/`
- Smoke tests: `/apps/docs/tests/smoke/`

## Pull Request Guidelines

### PR Title Format
```
type(scope): Brief description

Examples:
- feat(guides): Add RAG integration guide
- fix(components): Fix navigation mobile menu
- docs(api): Document streaming endpoints
- test(smoke): Add playground tests
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Smoke tests pass
- [ ] Manual testing complete
- [ ] Responsive design verified

## Checklist
- [ ] Code follows style guidelines
- [ ] JSDoc added/updated
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
[Add screenshots of visual changes]
```

## Review Process

1. Automated checks run (CI/CD)
2. Maintainer reviews code
3. Address feedback
4. Approval and merge
5. Deployed automatically

## Getting Help

- Check [CLAUDE.md](./CLAUDE.md) for architecture
- Check [API_ROUTES.md](./API_ROUTES.md) for API docs
- Ask in GitHub Discussions
- Tag maintainers in PR comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Follow project guidelines

Thank you for contributing! 🎉
```

**Acceptance Criteria:**
- [ ] Clear contribution workflow
- [ ] Code standards documented
- [ ] Testing requirements clear
- [ ] PR guidelines established

---

## Priority 1: High-Value Additions (Week 2)

### 6. Create ARCHITECTURE.md
**File**: `/apps/docs/ARCHITECTURE.md`
**Effort**: 3 hours
**Impact**: Medium-High - Provides system overview

**Content Outline:**
- High-level architecture diagram
- Next.js App Router structure
- Server vs Client components
- Data flow (API → UI)
- MCP server integration
- Search infrastructure
- Build and deployment pipeline

---

### 7. Create Demo Components CLAUDE.md
**File**: `/apps/docs/components/Demo/CLAUDE.md`
**Effort**: 2 hours
**Impact**: Medium - Makes adding demos easier

**Content Outline:**
- Overview of demo component system
- ComponentPreview usage
- PlaygroundControls API
- DemoLayoutWrapper patterns
- Adding new demo template
- Testing demos

---

### 8. Document Key Library Utilities
**Files**: Various `/lib/*.ts` files
**Effort**: 4 hours
**Impact**: Medium - Improves developer experience

**Target Files:**
1. `/lib/navigation.ts` - Navigation structure
2. `/lib/utils.ts` - General utilities
3. `/lib/analytics.ts` - Analytics tracking
4. `/lib/design-tokens.ts` - Design system
5. `/lib/playground-templates.ts` - Playground config

---

### 9. Create Common Patterns Documentation
**File**: `/apps/docs/COMMON_PATTERNS.md`
**Effort**: 2 hours
**Impact**: Medium - Improves consistency

**Content Outline:**
- Component composition patterns
- Error handling patterns
- Data fetching patterns
- State management patterns
- Animation patterns
- Responsive design patterns

---

### 10. Update README.md
**File**: `/apps/docs/README.md`
**Effort**: 1 hour
**Impact**: Medium - Completes main README

**Additions:**
- Architecture section
- Testing section (expanded)
- Troubleshooting section
- Link to CLAUDE.md
- Link to CONTRIBUTING.md

---

## Verification Checklist

### After Completing Priority 0 (Week 1)

- [ ] CLAUDE.md created and reviewed
- [ ] API_ROUTES.md covers all endpoints
- [ ] Top 10 components have JSDoc
- [ ] MCP server CLAUDE.md complete
- [ ] CONTRIBUTING.md established
- [ ] All files reviewed by maintainer
- [ ] New contributor can onboard in < 30 min (tested)

### After Completing Priority 1 (Week 2)

- [ ] ARCHITECTURE.md provides clear overview
- [ ] Demo components CLAUDE.md tested
- [ ] Library utilities documented
- [ ] Common patterns documented
- [ ] README.md updated
- [ ] All documentation linked properly
- [ ] Documentation build passes
- [ ] No broken links

---

## Success Metrics

### Quantitative Targets

| Metric | Before | After Week 1 | After Week 2 |
|--------|--------|--------------|--------------|
| CLAUDE.md files | 0 | 2 | 4 |
| API documentation | 0% | 100% | 100% |
| Component JSDoc | ~50% | ~60% | ~65% |
| Contributor onboarding time | Unknown | < 30 min | < 20 min |

### Qualitative Goals

**Week 1:**
- New contributors can set up and run docs site
- API endpoints are clear and testable
- Core components have examples in IDE

**Week 2:**
- System architecture is understandable
- Common patterns are documented
- Adding new content is straightforward

---

## Resource Allocation

### Estimated Time Breakdown

**Week 1 (Priority 0): 15 hours**
- CLAUDE.md: 4 hours
- API_ROUTES.md: 3 hours
- Component JSDoc: 4 hours
- MCP CLAUDE.md: 2 hours
- CONTRIBUTING.md: 2 hours

**Week 2 (Priority 1): 12 hours**
- ARCHITECTURE.md: 3 hours
- Demo CLAUDE.md: 2 hours
- Library utils: 4 hours
- Common patterns: 2 hours
- README update: 1 hour

**Total: 27 hours over 2 weeks**

### Recommended Approach

**Option A: Dedicated Sprint**
- 1 developer full-time for 2 weeks
- Complete all Priority 0 and 1 items

**Option B: Distributed Effort**
- 2-3 developers part-time
- 2-3 hours per day over 2 weeks
- Divide tasks by expertise

**Option C: Pair Programming**
- Experienced developer + new contributor
- Creates documentation while onboarding
- Validates documentation effectiveness in real-time

---

## Maintenance Plan

### Ongoing (After Initial 2 Weeks)

**Weekly:**
- Review new PRs for documentation requirements
- Check for broken links
- Verify code examples still work

**Monthly:**
- Add JSDoc to 10 more components (goal: 90% coverage)
- Review and update outdated sections
- Add new patterns to common patterns doc

**Quarterly:**
- Full documentation audit
- Update architecture diagrams
- Review and update metrics
- Gather contributor feedback

---

## Risk Mitigation

### Potential Risks

1. **Documentation becomes outdated**
   - Mitigation: Add CI checks for documentation validation
   - Mitigation: Assign documentation owners

2. **Inconsistent documentation style**
   - Mitigation: Use templates (provided above)
   - Mitigation: Document style guide in CONTRIBUTING.md

3. **Time overruns**
   - Mitigation: Start with Priority 0 only
   - Mitigation: Use templates to speed up writing

4. **Low adoption by contributors**
   - Mitigation: Link prominently from README
   - Mitigation: Mention in PR template
   - Mitigation: Use in onboarding process

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Assign owners** for each Priority 0 task
3. **Schedule kickoff** meeting
4. **Create tracking board** (GitHub Projects/Jira)
5. **Set up templates** for documentation files
6. **Begin execution** starting with CLAUDE.md

---

## Tracking Progress

### GitHub Issues Template

Create issues for each task:

```markdown
Title: [DOCS] Create CLAUDE.md for docs site

Labels: documentation, priority-0, enhancement

Description:
Create main CLAUDE.md file for contributor onboarding.

See: [DOCUMENTATION_ACTION_PLAN.md](./DOCUMENTATION_ACTION_PLAN.md#1-create-main-claudemd-file)

**Effort**: 4 hours
**Priority**: P0

**Acceptance Criteria:**
- [ ] Architecture overview included
- [ ] Quick start instructions tested
- [ ] Common tasks documented
- [ ] Links verified
- [ ] Reviewed by maintainer

**Template**: Use template from action plan
```

---

**Action Plan Created By**: Claude Code Documentation Analysis Agent
**Date**: 2026-01-10
**Status**: Ready for execution
**Next Review**: After Week 1 completion
