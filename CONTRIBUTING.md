# Contributing to Clarity Chat

Thank you for your interest in contributing to Clarity Chat! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
   cd Clarity-ai-chat-components
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build the package
npm run build

# Check bundle size
npm run size
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Storybook

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Avoid `any` types when possible
- Export types for public APIs

### React Patterns

- Use functional components
- Use hooks for state management
- Follow React 19 best practices
- Avoid class components (except ErrorBoundary internal implementation)

### Error Handling

- Use appropriate error classes
- Include helpful error messages
- Provide solutions when possible
- Add context for debugging

### Testing

- Write tests for all features
- Aim for 85%+ coverage
- Test error scenarios
- Test edge cases

### Accessibility

- Follow WCAG 2.1 AA guidelines
- Use semantic HTML
- Add ARIA labels when needed
- Test with keyboard navigation

## Pull Request Process

1. **Create a descriptive branch name:**
   - `feature/add-new-hook`
   - `fix/error-boundary-reset`
   - `docs/update-readme`

2. **Make your changes:**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation

3. **Run checks:**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add useErrorRecovery hook"
   git commit -m "fix: resolve ErrorBoundary reset issue"
   git commit -m "docs: update error handling guide"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out PR template:**
   - Describe your changes
   - Link related issues
   - Add screenshots if applicable

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add useAsyncError hook
fix: resolve retry logic bug
docs: update ERROR_HANDLING.md
test: add tests for ErrorBoundary
```

## Code Review Process

All submissions require review. We will:

1. Review code quality
2. Check test coverage
3. Verify documentation
4. Test functionality
5. Provide feedback

## Release Process

Releases follow semantic versioning (semver):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Join our Discord for chat

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
