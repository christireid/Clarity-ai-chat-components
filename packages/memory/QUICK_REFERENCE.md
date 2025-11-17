# Quick Reference - Clarity Memory

A quick reference card for common tasks and commands.

## 🚀 Quick Start

```bash
npm install && npm run build && npm test
```

## 📦 Package Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run setup` | Install + build |
| `npm run build` | Build package |
| `npm run dev` | Watch mode |
| `npm test` | Run tests |
| `npm run test:watch` | Test watch mode |
| `npm run test:coverage` | Test with coverage |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting |
| `npm run typecheck` | Type check |
| `npm run format` | Format code |
| `npm run clean` | Clean artifacts |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `.prettierrc` | Code formatting |
| `.eslintrc.json` | Linting rules |
| `vitest.config.ts` | Test configuration |
| `tsconfig.json` | TypeScript config |
| `tsup.config.ts` | Build configuration |

## 📁 Project Structure

```
src/
├── core/          # Core memory logic
├── types/          # Type definitions
├── stores/         # Storage adapters (to be created)
├── embeddings/     # Embedding providers (to be created)
└── index.ts        # Main entry point
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | For embeddings | OpenAI API key |
| `ANTHROPIC_API_KEY` | Optional | Anthropic API key |
| `MEMORY_STORE_TYPE` | No | Storage type (default: in-memory) |
| `MEMORY_STORE_PATH` | No | File storage path |
| `MAX_CONTEXT_TOKENS` | No | Max tokens (default: 4000) |

## 📝 Common Tasks

### Add a New Feature

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write code in `src/`
3. Add tests in `src/**/*.test.ts`
4. Run tests: `npm test`
5. Check types: `npm run typecheck`
6. Format: `npm run format`
7. Commit: `git commit -m "feat: add my feature"`

### Debug Tests

```bash
# Run specific test file
npm test -- src/core/memory.test.ts

# Run with UI
npm run test:ui

# Run in watch mode
npm run test:watch
```

### Check Code Quality

```bash
# All checks
npm run typecheck && npm run lint && npm run format:check && npm test

# Or use Makefile
make check
```

## 🐛 Troubleshooting

### Build fails
```bash
npm run clean && npm install && npm run build
```

### Tests fail
```bash
npm run clean && npm install && npm test
```

### Type errors
```bash
npm run typecheck
# Restart TypeScript server in IDE
```

### Missing dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guide
- [API Reference](../../docs/clarity-memory/API_REFERENCE.md) - Full API docs
- [Architecture](../../docs/clarity-memory/ARCHITECTURE.md) - System design

## 💡 Tips

- Use `npm run dev` for development (auto-rebuild)
- Use `npm run test:watch` for TDD
- Run `npm run format` before committing
- Check `npm run typecheck` before pushing

---

**Need more help?** See [SETUP.md](./SETUP.md) or [docs](../../docs/clarity-memory/)
