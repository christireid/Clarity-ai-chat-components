# BOTAURA_TEST_PLAN.md - Battle Test Plan

**Component:** `packages/react/src/components/chat/floating-chat-widget.tsx` (Bot Aura) **Marketing
Site Integration:** `apps/marketing-site/components/marketing-assistant/ChatWidget.tsx` **Last
Updated:** 2025-12-19 **Status:** BLOCKED - Component not integrated

---

## Section 0: Configuration

| Field                            | Value                                                                |
| -------------------------------- | -------------------------------------------------------------------- |
| Marketing Site Path              | `/apps/marketing-site`                                               |
| Bot Aura Component               | `/packages/react/src/components/chat/floating-chat-widget.tsx`       |
| Marketing ChatWidget             | `/apps/marketing-site/components/marketing-assistant/ChatWidget.tsx` |
| Dev Server Port                  | `http://localhost:3001`                                              |
| Allowed to change public APIs    | No                                                                   |
| Allowed to change marketing copy | No                                                                   |
| Target Browsers                  | Chrome, Firefox, Safari (latest)                                     |

---

## CRITICAL BLOCKER

**Status:** The `FloatingChatWidget` component exists in the library but is NOT integrated into the
marketing site.

**Evidence:**

```tsx
// apps/marketing-site/components/marketing-assistant/ChatWidget.tsx
'use client'

// Placeholder component - FloatingChatWidget is not yet available
// TODO: Enable when @clarity-chat/react exports FloatingChatWidget

export default function MarketingAssistant() {
  // Component disabled until FloatingChatWidget is available
  return null
}
```

**Resolution Required:**

1. Export `FloatingChatWidget` from `@clarity-chat/react` public API
2. Import and configure in marketing site
3. Create API endpoint for Bot Aura at `/api/chat`
4. Connect to `aura-knowledge.json` for knowledge base

---

## Test Categories (FOR WHEN INTEGRATED)

### A. OPEN/CLOSE INTERACTIONS

| Test ID | Test Case                     | Expected Behavior                  | Status     | Notes |
| ------- | ----------------------------- | ---------------------------------- | ---------- | ----- |
| A1      | Click floating button to open | Chat window appears with animation | ⏳ BLOCKED |       |
| A2      | Click button again to close   | Chat window closes                 | ⏳ BLOCKED |       |
| A3      | Click close (X) button        | Chat window closes                 | ⏳ BLOCKED |       |
| A4      | Hover shows tooltip           | "Chat with Aura" tooltip           | ⏳ BLOCKED |       |
| A5      | Pulse animation on button     | Shows when chat closed             | ⏳ BLOCKED |       |

### B. MESSAGING & STREAMING

| Test ID | Test Case                   | Expected Behavior                | Status     | Notes |
| ------- | --------------------------- | -------------------------------- | ---------- | ----- |
| B1      | Initial welcome message     | "Hi! I'm Aura. Ask me anything!" | ⏳ BLOCKED |       |
| B2      | Send user message           | Appears in chat, AI responds     | ⏳ BLOCKED |       |
| B3      | Loading indicator           | Shows bouncing dots              | ⏳ BLOCKED |       |
| B4      | Response renders            | Assistant message appears        | ⏳ BLOCKED |       |
| B5      | Auto-scroll on new messages | Scrolls to bottom                | ⏳ BLOCKED |       |

### C. ACCURACY & TRUST (CRITICAL FOR GTM)

| Test ID | Test Case                | Expected Behavior                       | Status     | Notes |
| ------- | ------------------------ | --------------------------------------- | ---------- | ----- |
| C1      | "What is Clarity Chat?"  | Accurate product description            | ⏳ BLOCKED |       |
| C2      | "How much does it cost?" | Links to pricing, accurate tiers        | ⏳ BLOCKED |       |
| C3      | "How do I install it?"   | Shows npm install command               | ⏳ BLOCKED |       |
| C4      | Ask about features       | Lists real features, not hallucinations | ⏳ BLOCKED |       |
| C5      | Competitor comparison    | Fair, factual comparison                | ⏳ BLOCKED |       |
| C6      | Request enterprise info  | Directs to contact form                 | ⏳ BLOCKED |       |
| C7      | Off-topic question       | Graceful redirect to docs               | ⏳ BLOCKED |       |

### D. CTA HANDOFFS

| Test ID | Test Case           | Expected Behavior          | Status     | Notes |
| ------- | ------------------- | -------------------------- | ---------- | ----- |
| D1      | "I want to try it"  | Link to quick start        | ⏳ BLOCKED |       |
| D2      | "Show me demos"     | Link to demos page         | ⏳ BLOCKED |       |
| D3      | "Contact sales"     | Link to enterprise contact | ⏳ BLOCKED |       |
| D4      | "See documentation" | Link to docs site          | ⏳ BLOCKED |       |

### E. ERROR HANDLING

| Test ID | Test Case       | Expected Behavior           | Status     | Notes |
| ------- | --------------- | --------------------------- | ---------- | ----- |
| E1      | API error       | Shows error message in chat | ⏳ BLOCKED |       |
| E2      | Network offline | Graceful error state        | ⏳ BLOCKED |       |
| E3      | Rate limiting   | User-friendly message       | ⏳ BLOCKED |       |

### F. API KEY INPUT

| Test ID | Test Case           | Expected Behavior        | Status     | Notes |
| ------- | ------------------- | ------------------------ | ---------- | ----- |
| F1      | Key icon visible    | Shows in header          | ⏳ BLOCKED |       |
| F2      | Click toggles input | Input field appears      | ⏳ BLOCKED |       |
| F3      | Enter API key       | Shows "Key set!" message | ⏳ BLOCKED |       |
| F4      | Key is masked       | Shows as password field  | ⏳ BLOCKED |       |

### G. KEYBOARD & ACCESSIBILITY

| Test ID | Test Case                  | Expected Behavior        | Status     | Notes |
| ------- | -------------------------- | ------------------------ | ---------- | ----- |
| G1      | Floating button accessible | Has aria-label           | ⏳ BLOCKED |       |
| G2      | Close button accessible    | Has aria-label           | ⏳ BLOCKED |       |
| G3      | Submit button accessible   | Has aria-label           | ⏳ BLOCKED |       |
| G4      | Focus on input             | Auto-focuses when opened | ⏳ BLOCKED |       |
| G5      | Tab navigation             | Focus moves correctly    | ⏳ BLOCKED |       |

### H. MOBILE RESPONSIVENESS

| Test ID | Test Case          | Expected Behavior          | Status     | Notes |
| ------- | ------------------ | -------------------------- | ---------- | ----- |
| H1      | Mobile layout      | Slightly smaller on mobile | ⏳ BLOCKED |       |
| H2      | Touch interactions | All buttons work           | ⏳ BLOCKED |       |
| H3      | Virtual keyboard   | Input stays visible        | ⏳ BLOCKED |       |

---

## Integration Tasks Required

| Task                                            | Priority | Status | Assignee |
| ----------------------------------------------- | -------- | ------ | -------- |
| Export FloatingChatWidget from public API       | P0       | ⏳     |          |
| Create /api/chat endpoint in marketing site     | P0       | ⏳     |          |
| Connect aura-knowledge.json to API              | P0       | ⏳     |          |
| Update ChatWidget.tsx to use FloatingChatWidget | P0       | ⏳     |          |
| Configure memory and prompt optimization        | P1       | ⏳     |          |
| Add analytics tracking                          | P2       | ⏳     |          |

---

## Issues Found

| Issue ID | Description                                     | Severity | Status | Fix Applied          |
| -------- | ----------------------------------------------- | -------- | ------ | -------------------- |
| BA-001   | FloatingChatWidget not exported from public API | CRITICAL | OPEN   | Needs implementation |
| BA-002   | Marketing site ChatWidget is placeholder        | CRITICAL | OPEN   | Needs implementation |
| BA-003   | No /api/chat endpoint exists                    | CRITICAL | OPEN   | Needs implementation |

---

## Summary

| Category       | Total Tests | Passed | Failed | Blocked |
| -------------- | ----------- | ------ | ------ | ------- |
| Open/Close     | 5           | 0      | 0      | 5       |
| Messaging      | 5           | 0      | 0      | 5       |
| Accuracy/Trust | 7           | 0      | 0      | 7       |
| CTA Handoffs   | 4           | 0      | 0      | 4       |
| Error Handling | 3           | 0      | 0      | 3       |
| API Key        | 4           | 0      | 0      | 4       |
| Keyboard/A11y  | 5           | 0      | 0      | 5       |
| Mobile         | 3           | 0      | 0      | 3       |
| **TOTAL**      | **36**      | **0**  | **0**  | **36**  |

---

## Re-Test Log

| Date       | Tester | Notes                                                           |
| ---------- | ------ | --------------------------------------------------------------- |
| 2025-12-19 | Claude | Test plan created, all tests BLOCKED due to missing integration |
