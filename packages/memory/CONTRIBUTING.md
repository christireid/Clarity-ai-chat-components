# Contributing to Clarity Memory

Thank you for your interest in contributing to Clarity Memory! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/clarity-chat-components.git
   cd clarity-chat-components/packages/memory
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional for basic development)
   ```
5. **Build the package**
   ```bash
   npm run build
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write code following the existing style
- Add tests for new features
- Update documentation as needed

### 3. Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### 4. Check Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

### 5. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add in-memory store implementation"
git commit -m "fix: resolve token counting issue"
git commit -m "docs: update API reference"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## 🎯 Implementation Priorities

See [IMPLEMENTATION_ROADMAP.md](../../docs/clarity-memory/IMPLEMENTATION_ROADMAP.md) for current priorities.

Current focus areas:
1. ✅ Core type system
2. 🚧 In-memory store
3. ⏳ Basic add/recall methods
4. ⏳ Embedding providers
5. ⏳ Scoring system

## 📝 Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for public APIs
- Use meaningful names
- Add JSDoc comments for public APIs

### Formatting

- Use Prettier (configured in `.prettierrc`)
- Run `npm run format` before committing

### Linting

- Follow ESLint rules (configured in `.eslintrc.json`)
- Run `npm run lint` before committing

## 🧪 Testing

### Writing Tests

- Place test files next to source files: `memory.test.ts`
- Use Vitest for testing
- Aim for high test coverage (>80%)

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  })

  it('should do something', () => {
    // Test
  })
})
```

## 📚 Documentation

### Code Comments

- Add JSDoc comments for public APIs
- Explain "why" not just "what"
- Include examples for complex functions

### Documentation Files

- Update relevant docs in `docs/clarity-memory/`
- Keep examples up to date
- Update API reference when adding new APIs

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: How to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Node version, OS, package version
6. **Code Example**: Minimal code example if applicable

## 💡 Feature Requests

When requesting features:

1. **Use Case**: Describe the use case
2. **Proposed Solution**: How you envision it working
3. **Alternatives**: Other solutions you've considered
4. **Examples**: Code examples if helpful

## 🔍 Code Review Process

1. All PRs require review
2. Address review comments promptly
3. Keep PRs focused and small when possible
4. Update documentation and tests

## 📦 Release Process

Releases are handled by maintainers. When your PR is merged:

1. Changeset will be created (if needed)
2. Version will be bumped
3. Package will be published

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

- Check the [documentation](../../docs/clarity-memory/)
- Review [examples](../../docs/clarity-memory/examples/)
- Open an issue for questions

---

**Thank you for contributing!** 🎉
