# NPM Package Leverage Audit

> Generated 2026-02-07. Branch: `claude/continue-work-uGkck` Companion documents:
> [monorepo-inventory.md](./monorepo-inventory.md), [consolidation-plan.md](./consolidation-plan.md)

---

## Executive Summary

15 packages with ~60+ unique external dependencies. Overall dependency hygiene is **good** — peer
dependencies are well-classified (optional vs required), security overrides are comprehensive, and
the workspace protocol is used consistently. Key opportunities:

1. **Version inconsistencies** across 7 packages (vitest, @types/node, sonner, boxen)
2. **Outdated devDependencies** in codemods, license, token-optimization
3. **CLI package** has `react` as production dependency (unnecessary)
4. **Build tools duplicated** across 12+ packages (hoistable to root)

---

## 1. Version Inconsistencies

| Package          | Versions Found                   | Packages                          | Severity |
| ---------------- | -------------------------------- | --------------------------------- | -------- |
| `vitest`         | ^4.0.15, ^4.0.16, ^3.0.0, ^1.0.0 | root/react vs license vs codemods | **HIGH** |
| `@types/node`    | ^24.10.2, ^22.10.5, ^20.0.0      | react vs root vs codemods         | MEDIUM   |
| `sonner`         | ^1.7.1, ^2.0.7                   | react vs playground               | MEDIUM   |
| `boxen`          | ^7.1.1, ^8.0.1                   | cli vs dev-tools                  | LOW      |
| `tailwind-merge` | ^3.3.1, ^3.4.0                   | playground vs primitives          | LOW      |
| `jsdom`          | ^26.0.0, ^27.2.0, ^27.3.0        | token-opt vs react vs root        | MEDIUM   |
| `zod`            | ^3.22.4, ^3.24.0                 | cli vs react (peer)               | LOW      |

---

## 2. Outdated DevDependencies

| Package               | Current | Latest Range | Affected           |
| --------------------- | ------- | ------------ | ------------------ |
| `vitest`              | ^1.0.0  | ^4.0.16      | codemods           |
| `vitest`              | ^3.0.0  | ^4.0.16      | license            |
| `@vitest/coverage-v8` | ^3.0.0  | ^4.0.16      | license            |
| `jsdom`               | ^26.0.0 | ^27.3.0      | token-optimization |
| `@types/node`         | ^20.0.0 | ^22.10.5+    | codemods           |

---

## 3. Dependency Classification Issues

### 3a. React in CLI production dependencies

`@clarity-chat/cli` lists `react@^19.2.0` as a production dependency. The CLI is a Node.js tool
(commander-based) that does not render React components. React should be moved to devDependencies or
removed entirely.

### 3b. Duplicate CLI utilities

Both `@clarity-chat/cli` and `@clarity-chat/dev-tools` depend on `commander`, `boxen`, and `chalk`.
These could share a common CLI utilities module.

### 3c. Build tools in individual packages

`typescript`, `tsup`, and `vitest` appear in 12-13 individual package devDependencies. pnpm
workspaces resolve these from root — individual listings are redundant but harmless (they ensure
version pinning per-package).

---

## 4. Peer Dependencies Assessment

**Overall: Well-structured.** Optional/required distinction is clear.

| Package                            | Required Peers                                                  | Optional Peers                  |
| ---------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `@clarity-chat/react`              | react, framer-motion, lucide-react, zod                         | react-dom + 12 optional         |
| `@clarity-chat/primitives`         | react                                                           | react-dom                       |
| `@clarity-chat/error-handling`     | react, react-dom                                                | —                               |
| `@clarity-chat/token-optimization` | —                                                               | react, react-dom, framer-motion |
| `@clarity-chat/memory`             | —                                                               | react                           |
| `@clarity-chat/license`            | —                                                               | react                           |
| `@clarity-chat/dev-tools`          | react                                                           | react-dom                       |
| `@clarity-chat/testing-utils`      | react, react-dom, @clarity-chat/primitives, @clarity-chat/react | —                               |

---

## 5. Heavy Dependencies

| Dependency           | Size (approx) | Package               | Status                      |
| -------------------- | ------------- | --------------------- | --------------------------- |
| mermaid              | ~900KB        | react (optional peer) | Acceptable — optional       |
| pdfjs-dist           | ~10MB         | react (optional peer) | Acceptable — optional       |
| recharts             | ~250KB        | react (optional peer) | Acceptable — optional       |
| framer-motion        | ~50KB         | react (required peer) | Justified — core animations |
| @radix-ui/\* (13)    | ~150KB        | primitives            | Justified — accessibility   |
| gpt-tokenizer        | ~50KB         | token-optimization    | Justified — core feature    |
| @monaco-editor/react | ~5MB          | playground (private)  | Acceptable — dev-only       |

All heavy dependencies are either **optional peers** or in **private/dev-only** packages. No action
needed.

---

## 6. Security Overrides

The root `pnpm.overrides` section addresses 15 known vulnerabilities. This is comprehensive and
well-maintained. Quarterly review recommended.

---

## 7. Actionable Recommendations

### P0: Fix version inconsistencies (implement now)

| #   | Action                                                                                       | Files                                    |
| --- | -------------------------------------------------------------------------------------------- | ---------------------------------------- |
| N1  | Update `codemods/package.json`: vitest ^1.0.0 → ^4.0.16                                      | packages/codemods/package.json           |
| N2  | Update `license/package.json`: vitest ^3.0.0 → ^4.0.16, @vitest/coverage-v8 ^3.0.0 → ^4.0.16 | packages/license/package.json            |
| N3  | Update `token-optimization/package.json`: jsdom ^26.0.0 → ^27.3.0                            | packages/token-optimization/package.json |
| N4  | Update `codemods/package.json`: @types/node ^20.0.0 → ^22.10.5                               | packages/codemods/package.json           |

### P1: Structural improvements

| #   | Action                                                                  | Impact                                 |
| --- | ----------------------------------------------------------------------- | -------------------------------------- |
| N5  | Move `react` from dependencies to devDependencies in `cli/package.json` | Reduces install size for CLI consumers |
| N6  | Align `boxen` to ^8.0.1 across cli and dev-tools                        | Version consistency                    |

### P2: Future improvements

| #   | Action                                                                            | Impact                     |
| --- | --------------------------------------------------------------------------------- | -------------------------- |
| N7  | Consider hoisting build tools (typescript, tsup, vitest) to root only             | Cleaner package.json files |
| N8  | Extract shared CLI utilities (chalk, commander, boxen) to @clarity-chat/utils/cli | Reduces duplication        |
| N9  | Create `pnpm audit:duplicates` script for quarterly checks                        | Ongoing hygiene            |
