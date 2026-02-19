# Component Coupling and Dependency Analysis Report

**Generated**: January 28, 2026
**Branch**: `clean-up`
**Analyzed Packages**: 11 workspace packages + applications

---

## Executive Summary

| Metric | Status | Details |
|--------|--------|---------|
| Circular Dependencies | **10 detected** | Moderate risk - primarily in utility packages |
| Inter-Package Coupling | **Medium** | 7 internal workspace dependencies in @clarity-chat/react |
| External Dependencies | **High** | 201 framer-motion imports, 40 lucide-react imports |
| Orphaned Modules | **28+ files** | Test files and benchmarks (expected) |

---

## 1. Package Dependency Graph

### Internal Workspace Dependencies

```
@clarity-chat/react (main package)
├── @clarity-chat/license          (workspace:*)
├── @clarity-chat/error-handling   (workspace:*)
├── @clarity-chat/memory           (workspace:*)
├── @clarity-chat/primitives       (workspace:*)
├── @clarity-chat/token-optimization (workspace:*)
├── @clarity-chat/types            (workspace:*)
└── @clarity-chat/utils            (workspace:*)

@clarity-chat/token-optimization
├── @clarity-chat/primitives       (workspace:*)
└── @clarity-chat/utils            (workspace:*)

@clarity-chat/memory
├── @clarity-chat/token-optimization (workspace:*)
└── @clarity-chat/utils            (workspace:*)

@clarity-chat/error-handling
└── @clarity-chat/primitives       (workspace:*)

@clarity-chat/ai-infrastructure
└── (no internal dependencies - external SDKs only)
```

**Analysis**: The dependency hierarchy is well-layered with `@clarity-chat/types` and `@clarity-chat/utils` at the bottom as foundational packages. `@clarity-chat/react` correctly sits at the top of the dependency tree.

---

## 2. Circular Dependencies (10 Detected)

### Critical Circular Dependencies

| Cycle | Files Involved | Severity | Impact |
|-------|----------------|----------|--------|
| 1 | `dev-tools/dist` > `dev-tools/dist/react/hooks` > `use-time-travel.d.ts` | Medium | Build artifacts, not source |
| 2-5 | `playground/src/types.ts` > `iframe-protocol.ts` > `PlaygroundContext.tsx` | High | Playground app coupling |
| 6 | `token-optimization/toon-optimizer/core.ts` > `strategies.ts` | Medium | Internal module coupling |
| 7 | `token-optimization/simple-index.ts` > `simple-unified.ts` | Low | Index file pattern |
| 8 | `token-optimization/security/enhanced-security.ts` > `redis-security-store.ts` | Medium | Security module coupling |
| 9 | `token-optimization/formats/toon-optimizer.ts` | Low | Self-referential |
| 10 | `utils/validation/index.ts` > `enhanced.ts` | Low | Index re-export pattern |

### Recommendations

1. **High Priority**: Refactor `playground/src/types` - extract shared types to break the cycle
2. **Medium Priority**: Restructure `token-optimization` modules to use dependency injection
3. **Low Priority**: `utils/validation` cycle is benign (common index pattern)

---

## 3. External Package Dependencies

### Core Runtime Dependencies (Required)

| Package | Import Count | Bundle Impact | Notes |
|---------|--------------|---------------|-------|
| `framer-motion` | 201 | ~45KB gzipped | Animation foundation |
| `lucide-react` | 40 | ~5KB (tree-shakeable) | Icon library |
| `@radix-ui/*` | 18 | ~30KB total | UI primitives |
| `zod` | 14 | ~12KB gzipped | Schema validation |
| `@tanstack/react-virtual` | 2 | ~8KB gzipped | Virtualization |
| `react-markdown` | 1 | ~15KB gzipped | Markdown rendering |

### Peer Dependencies Analysis

```json
{
  "required": ["react", "framer-motion", "lucide-react", "zod"],
  "optional": [
    "react-dom", "flowtoken", "mermaid", "pdfjs-dist",
    "mammoth", "cohere-ai", "shiki", "jszip", "prismjs",
    "react-markdown", "remark-gfm", "rehype-highlight"
  ]
}
```

**Risk Assessment**:
- `framer-motion` is deeply integrated (201 uses) - difficult to replace
- `lucide-react` is moderately coupled (40 uses) - could be abstracted
- Optional dependencies are properly externalized

---

## 4. Component Coupling Analysis

### High-Coupling Components (>5 internal imports)

| Component | Internal Dependencies | Risk Level |
|-----------|----------------------|------------|
| `EnhancedMarkdownRenderer.tsx` | 7 | Medium |
| `ChatWindow.tsx` | 6 | Medium |
| `ChatInput.tsx` | 6 | Medium |
| `animations/index.ts` | 7 | Low (barrel file) |
| `app-api/index.ts` | 10 | Low (barrel file) |

### Component Import Distribution

```
@clarity-chat/primitives    - 50+ component imports
@clarity-chat/types         - 30+ type imports
@clarity-chat/utils         - 20+ utility imports
@clarity-chat/memory        - 5+ memory imports
```

### Coupling Metrics by Domain

| Domain | Files | Avg. Dependencies | Coupling Score |
|--------|-------|-------------------|----------------|
| `components/ai` | 45+ | 4.2 | Medium |
| `components/chat` | 15+ | 3.8 | Medium |
| `components/message` | 20+ | 3.5 | Low-Medium |
| `components/token` | 10+ | 2.8 | Low |
| `components/search` | 15+ | 4.5 | Medium |
| `hooks` | 40+ | 2.1 | Low |

---

## 5. Bundle Impact Analysis

### Estimated Bundle Sizes (gzipped)

| Entry Point | Estimated Size | Contains |
|-------------|----------------|----------|
| `@clarity-chat/react` | ~85KB | Core components, hooks |
| `@clarity-chat/react/extended` | +50KB | Full component library |
| `@clarity-chat/react/advanced` | +25KB | Power user features |
| `@clarity-chat/primitives` | ~60KB | Base UI components |
| `@clarity-chat/token-optimization` | ~35KB | Token management |
| `@clarity-chat/utils` | ~15KB | Utilities |

### Tree-Shaking Effectiveness

| Package | Side Effects | Tree-Shakeable |
|---------|--------------|----------------|
| `@clarity-chat/react` | `*.css` only | Yes |
| `@clarity-chat/primitives` | `*.css` only | Yes |
| `@clarity-chat/token-optimization` | None | Yes |
| `@clarity-chat/utils` | None | Yes |
| `@clarity-chat/types` | None | Yes |
| `@clarity-chat/memory` | None | Yes |

---

## 6. New Components Analysis

### Apps Directory New Components

| Path | Dependencies | Risk |
|------|--------------|------|
| `apps/streamlined-docs/components/AI/*` | framer-motion, lucide-react | Low |
| `apps/streamlined-docs/components/Demos/*` | React only | Low |
| `apps/streamlined-docs/components/HeroChat/*` | @clarity-chat/react | Medium |
| `apps/test-nextjs/*` | Next.js, React | Low |
| `apps/test-vite/*` | Vite, React | Low |
| `apps/test-webpack/*` | Webpack, React | Low |

### Untracked Files Analysis

New additions requiring review:
- `apps/test-nextjs/` - Test application for Next.js integration
- `apps/test-vite/` - Test application for Vite integration
- `apps/test-webpack/` - Test application for Webpack integration
- `packages/react/apps/` - Potential duplicate apps structure

---

## 7. Dependency Health Score

### Overall Health: **B+ (Good)**

| Category | Score | Weight | Contribution |
|----------|-------|--------|--------------|
| Circular Dependencies | 7/10 | 25% | 1.75 |
| External Coupling | 8/10 | 20% | 1.60 |
| Internal Coupling | 8/10 | 20% | 1.60 |
| Tree-Shaking | 9/10 | 15% | 1.35 |
| Bundle Size | 7/10 | 20% | 1.40 |
| **Total** | | 100% | **7.7/10** |

---

## 8. Recommendations

### Immediate Actions (High Priority)

1. **Fix Circular Dependencies in Playground**
   - Extract `IframeProtocol` types to separate file
   - Use dependency injection for context dependencies

2. **Audit framer-motion Usage**
   - Consider extracting animation logic to reduce coupling
   - Document required animations vs. optional

3. **Clean Up Orphaned Test Files**
   - Move benchmark files to dedicated test directory
   - Ensure all tests are properly configured

### Medium-Term Improvements

1. **Abstract Icon Dependencies**
   - Create icon adapter layer for `lucide-react`
   - Allow swapping icon libraries

2. **Reduce `EnhancedMarkdownRenderer` Coupling**
   - Extract code block rendering
   - Create plugin architecture for markdown extensions

3. **Optimize Token Optimization Package**
   - Resolve internal circular dependencies
   - Split security module cleanly

### Long-Term Architecture

1. **Consider Micro-Frontend Architecture**
   - Heavy components (dashboards, analytics) could be lazy-loaded
   - Document loaders could be separate entry points

2. **Implement Dependency Monitoring**
   - Add CI check for circular dependencies
   - Track bundle size changes over time

---

## 9. Dependency Matrix

### Package Cross-References

|  | react | primitives | utils | types | memory | token-opt | error | license |
|--|-------|------------|-------|-------|--------|-----------|-------|---------|
| **react** | - | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **primitives** | - | - | - | - | - | - | - | - |
| **utils** | - | - | - | - | - | - | - | - |
| **types** | - | - | - | - | - | - | - | - |
| **memory** | - | - | Yes | - | - | Yes | - | - |
| **token-opt** | - | Yes | Yes | - | - | - | - | - |
| **error** | - | Yes | - | - | - | - | - | - |
| **license** | - | - | - | - | - | - | - | - |

---

## 10. CI Integration Recommendations

Add to `.github/workflows/quality-checks.yml`:

```yaml
dependency-analysis:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Check Circular Dependencies
      run: npx madge --circular --extensions ts,tsx packages/react/src
    - name: Fail on New Cycles
      run: |
        CYCLES=$(npx madge --circular --extensions ts,tsx packages/react/src 2>/dev/null | wc -l)
        if [ "$CYCLES" -gt "10" ]; then
          echo "New circular dependencies detected!"
          exit 1
        fi
```

---

**Report Generated By**: Architectural Analysis Agent
**Review Date**: January 28, 2026
