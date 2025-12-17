# Code Reuse & Consistency Audit

## Summary
**Code Reuse Score: ~70%**

The current codebase demonstrates a robust monorepo structure with well-defined packages (`primitives`, `react`, `utils`). However, consumer applications (specifically `apps/marketing-site`) exhibit significant "leakage" where functionality provided by these packages is re-implemented locally. This increases maintenance burden and risks inconsistency.

## Inventory of Existing Assets
The following packages serve as the source of truth:

1.  **@clarity-chat/primitives** (`packages/primitives`)
    *   **Components**: `Button`, `Card`, `Input`, `Dialog`, `Icons`, etc.
    *   **Utils**: `cn` (Tailwind merge), `formatRelativeTime`, `copyToClipboard`.
2.  **@clarity-chat/react** (`packages/react`)
    *   **Hooks**: `useClarityChat`, `useTokenBudgetMonitor`, `useAssistant`.
    *   **Components**: `ClarityChat`, `ChatWindow`, `MessageList`.
    *   **Utils**: Advanced AI helpers, streaming utilities.
3.  **@clarity-chat/utils** (`packages/utils`)
    *   **Modules**: `format`, `cache`, `async`, `validation`, `errors`.

## Critical Issues (Must Fix)

| File | Issue | Existing Asset to Use | Refactor Approach |
|------|-------|----------------------|-------------------|
| `apps/marketing-site/lib/utils.ts` | Duplicate `cn` utility function | `@clarity-chat/primitives/lib/utils` or `@clarity-chat/react` | Remove local definition, import from package. |
| `apps/marketing-site/components/marketing-assistant/ChatWidget.tsx` | Re-implements chat logic using raw `ai/react` | `@clarity-chat/react` (`useClarityChat`) | Replace `useChat` with `useClarityChat` to inherit enterprise features (token tracking, etc.). |
| `apps/marketing-site/components/ui/MagneticButton.tsx` | Custom Button with hardcoded styles | `@clarity-chat/primitives` (`Button`) | Refactor to use `Button` as base, or move "Magnetic" logic to a wrapper/hook in primitives. |
| `apps/marketing-site/components/marketing-assistant/ChatWidget.tsx` | Local Lucide icons imports | `@clarity-chat/primitives/components/icons` | Standardize on package icons to ensure consistent stroke width/size. |

## Opportunities (Nice to Have)

1.  **Consolidate Styling**:
    *   `MagneticButton` uses hardcoded colors (e.g., `from-clarity-500`). These should be defined as Tailwind theme tokens if they aren't already, ensuring `primitives` and `apps` share the same palette.

2.  **Extract "Magnetic" Effect**:
    *   The magnetic cursor effect in `MagneticButton` is a generic UI pattern.
    *   **Recommendation**: Extract to `packages/primitives/src/hooks/use-magnetic.ts` so it can be applied to any component.

3.  **Standardize Animation**:
    *   `apps/marketing-site` uses `framer-motion` directly.
    *   Check if `packages/primitives` or `react` has an animation system (e.g., `packages/react/src/animations`) to ensure consistent spring physics across the platform.

## New Abstractions

*   **`useMagnetic`**: Hook for mouse-following effects.
*   **`ChatWidget`**: The floating chat widget pattern is likely needed by other apps (e.g., `docs-site`). It should be promoted to `@clarity-chat/react/components/chat/floating-chat-widget.tsx`.
