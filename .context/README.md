# AI Context Documents

This directory contains AI-optimized context documents designed to help AI agents (Claude, GPT, Gemini, etc.) understand the Clarity Chat codebase quickly and accurately.

## Purpose

These context files are specifically formatted for LLM consumption, providing:
- Concise, structured information
- Code patterns and conventions
- Architecture decisions and rationale
- Common tasks and workflows
- Troubleshooting guidance

## Documents

### Core Documents
- `project-overview.md` - High-level project structure and goals
- `architecture.md` - System architecture and design patterns
- `api-reference.md` - Complete API reference for all packages
- `code-conventions.md` - Coding standards and best practices

### Feature-Specific
- `streaming-chat.md` - Streaming implementation patterns
- `rag-implementation.md` - RAG pipeline architecture
- `analytics-tracking.md` - Analytics and cost tracking system
- `model-comparison.md` - Multi-model comparison implementation

### Development
- `common-tasks.md` - Frequent development tasks and commands
- `troubleshooting.md` - Common issues and solutions
- `testing-guide.md` - Testing patterns and practices
- `deployment.md` - Deployment workflows and configurations

## Usage for AI Agents

When working with Clarity Chat, AI agents should:

1. **Start with** `project-overview.md` for context
2. **Reference** `architecture.md` for design decisions
3. **Check** `common-tasks.md` for workflow guidance
4. **Consult** feature-specific docs for implementation details
5. **Review** `troubleshooting.md` when encountering issues

## Format Guidelines

All documents follow these conventions:
- **Concise**: No unnecessary prose
- **Structured**: Clear headings and sections
- **Code-Heavy**: Practical examples over theory
- **Decision-Focused**: Explain WHY, not just WHAT
- **Pattern-Oriented**: Reusable patterns and templates

## Maintaining Context Docs

When updating the codebase:
1. Update relevant context documents
2. Add new patterns to appropriate files
3. Document breaking changes prominently
4. Keep examples up-to-date with actual code

## AI Agent Instructions

**For Code Understanding:**
```
Read: project-overview.md → architecture.md → relevant feature doc
```

**For Implementation:**
```
Read: common-tasks.md → code-conventions.md → feature-specific doc
Reference: api-reference.md for exact APIs
```

**For Debugging:**
```
Read: troubleshooting.md → relevant feature doc
Check: recent changes in git history
```

**For Architecture Decisions:**
```
Read: architecture.md → design-decisions.md
Understand: Trade-offs and constraints
```

## Document Structure Template

Each context document follows this structure:

```markdown
# [Document Title]

## Overview
Brief description (2-3 sentences)

## Key Concepts
- Concept 1: Explanation
- Concept 2: Explanation

## Architecture/Implementation
Detailed explanation with code examples

## Common Patterns
Reusable code patterns

## Best Practices
Do's and don'ts

## Examples
Real-world usage examples

## Related
Links to other context docs
```

## Version

Context documents are versioned with the codebase. When major architectural changes occur, update all affected context documents.

**Last Updated**: 2025-10-27
**Covers**: Clarity Chat v1.0 (Phase 2 Complete)
