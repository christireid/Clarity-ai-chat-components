# DOCSASSISTANT_TEST_PLAN.md - Battle Test Plan

**Component:** `apps/docs/components/AI/DocsAssistant.tsx` **Last Updated:** 2025-12-19 **Status:**
IN PROGRESS

---

## Section 0: Configuration

| Field                         | Value                                        |
| ----------------------------- | -------------------------------------------- |
| Docs Site Path                | `/apps/docs`                                 |
| DocsAssistant Component       | `/apps/docs/components/AI/DocsAssistant.tsx` |
| Dev Server Port               | `http://localhost:3000`                      |
| Allowed to change public APIs | No                                           |
| Target Browsers               | Chrome, Firefox, Safari (latest)             |

---

## Test Categories

### A. OPEN/CLOSE INTERACTIONS

| Test ID | Test Case                  | Expected Behavior                      | Status | Notes |
| ------- | -------------------------- | -------------------------------------- | ------ | ----- |
| A1      | Click chat button to open  | Dialog opens with animation            | ⏳     |       |
| A2      | Click chat button to close | Dialog closes with animation           | ⏳     |       |
| A3      | Press Cmd+. to toggle      | Opens/closes based on state            | ⏳     |       |
| A4      | Press Escape to close      | Dialog closes, focus restored          | ⏳     |       |
| A5      | Click backdrop to close    | Dialog closes                          | ⏳     |       |
| A6      | Verify focus restoration   | Focus returns to previous element      | ⏳     |       |
| A7      | Open toast appears         | Shows "Press Escape or Cmd+. to close" | ⏳     |       |

### B. STREAMING & MESSAGING

| Test ID | Test Case                   | Expected Behavior                   | Status | Notes |
| ------- | --------------------------- | ----------------------------------- | ------ | ----- |
| B1      | Send message via input      | Message appears, response streams   | ⏳     |       |
| B2      | Send via Enter key          | Message sends correctly             | ⏳     |       |
| B3      | Streaming text visible      | Text appears progressively          | ⏳     |       |
| B4      | AI status indicator         | Shows "thinking", "streaming", etc. | ⏳     |       |
| B5      | Cancel streaming            | Stops mid-stream if supported       | ⏳     |       |
| B6      | Auto-scroll on new messages | Chat scrolls to bottom              | ⏳     |       |
| B7      | Loading indicator           | Shows while processing              | ⏳     |       |

### C. MESSAGE OPERATIONS

| Test ID | Test Case                      | Expected Behavior                  | Status | Notes |
| ------- | ------------------------------ | ---------------------------------- | ------ | ----- |
| C1      | Copy message content           | Copies to clipboard, toast appears | ⏳     |       |
| C2      | Retry failed message           | Re-sends message                   | ⏳     |       |
| C3      | Feedback (thumbs up/down)      | Feedback recorded                  | ⏳     |       |
| C4      | Clear conversation             | All messages removed               | ⏳     |       |
| C5      | Export conversation (JSON)     | Downloads JSON file                | ⏳     |       |
| C6      | Export conversation (Markdown) | Downloads MD file                  | ⏳     |       |
| C7      | Empty state with suggestions   | Shows starter prompts              | ⏳     |       |
| C8      | Click starter prompt           | Sends that message                 | ⏳     |       |

### D. MARKDOWN & CODE BLOCKS

| Test ID | Test Case                   | Expected Behavior            | Status | Notes |
| ------- | --------------------------- | ---------------------------- | ------ | ----- |
| D1      | Render inline code          | `code` renders styled        | ⏳     |       |
| D2      | Render code blocks          | Syntax highlighted           | ⏳     |       |
| D3      | Copy code button            | Copies code, shows feedback  | ⏳     |       |
| D4      | "Open in Playground" button | Opens CodeSandbox/StackBlitz | ⏳     |       |
| D5      | Render bullet lists         | Proper list formatting       | ⏳     |       |
| D6      | Render numbered lists       | Proper list formatting       | ⏳     |       |
| D7      | Render links                | Clickable, opens in new tab  | ⏳     |       |
| D8      | Render headers (h1-h6)      | Proper heading styles        | ⏳     |       |
| D9      | Render bold/italic          | Correct text styling         | ⏳     |       |

### E. CITATIONS & RAG

| Test ID | Test Case                | Expected Behavior            | Status | Notes |
| ------- | ------------------------ | ---------------------------- | ------ | ----- |
| E1      | Citations panel appears  | Shows when citations exist   | ⏳     |       |
| E2      | Citation count displayed | "Sources (N)" header         | ⏳     |       |
| E3      | Click citation source    | Opens source URL in new tab  | ⏳     |       |
| E4      | Confidence scores shown  | Each citation has confidence | ⏳     |       |
| E5      | Citation preview text    | Shows snippet from source    | ⏳     |       |

### F. TOOL USE & RESULTS

| Test ID | Test Case            | Expected Behavior              | Status | Notes |
| ------- | -------------------- | ------------------------------ | ------ | ----- |
| F1      | Tool use indicator   | Shows "Using tool: X"          | ⏳     |       |
| F2      | Tool result renderer | Displays tool output correctly | ⏳     |       |
| F3      | Multiple tool calls  | All results shown              | ⏳     |       |

### G. ERROR HANDLING

| Test ID | Test Case                    | Expected Behavior           | Status | Notes |
| ------- | ---------------------------- | --------------------------- | ------ | ----- |
| G1      | Network error                | Shows error message         | ⏳     |       |
| G2      | API rate limit               | Shows appropriate error     | ⏳     |       |
| G3      | Timeout handling             | Shows timeout message       | ⏳     |       |
| G4      | Error boundary catches crash | Shows error UI, "Try Again" | ⏳     |       |
| G5      | Retry after error            | Can retry failed request    | ⏳     |       |

### H. OFFLINE & QUEUE

| Test ID | Test Case                   | Expected Behavior              | Status | Notes |
| ------- | --------------------------- | ------------------------------ | ------ | ----- |
| H1      | NetworkStatus shows offline | Indicator visible when offline | ⏳     |       |
| H2      | Queue indicator             | Shows "N queued" when offline  | ⏳     |       |
| H3      | Messages sent when online   | Queued messages send           | ⏳     |       |

### I. KEYBOARD NAVIGATION & ACCESSIBILITY

| Test ID | Test Case                    | Expected Behavior             | Status | Notes |
| ------- | ---------------------------- | ----------------------------- | ------ | ----- |
| I1      | Cmd+. opens/closes           | Works globally                | ⏳     |       |
| I2      | Escape closes dialog         | Works from any state          | ⏳     |       |
| I3      | ? shows shortcuts help       | Only when dialog open         | ⏳     |       |
| I4      | Cmd+K toggles search         | Only when messages exist      | ⏳     |       |
| I5      | Focus trap in modal          | Tab stays within dialog       | ⏳     |       |
| I6      | Focus on textarea on open    | Auto-focuses input            | ⏳     |       |
| I7      | Screen reader: role="dialog" | Has correct ARIA role         | ⏳     |       |
| I8      | Screen reader: aria-modal    | Is marked as modal            | ⏳     |       |
| I9      | Screen reader: title         | Has labelledby/describedby    | ⏳     |       |
| I10     | Reduced motion respected     | Minimal animations if enabled | ⏳     |       |

### J. SEARCH & HISTORY

| Test ID | Test Case               | Expected Behavior         | Status | Notes |
| ------- | ----------------------- | ------------------------- | ------ | ----- |
| J1      | Search toggle button    | Shows when messages exist | ⏳     |       |
| J2      | Search panel opens      | Cmd+K or button click     | ⏳     |       |
| J3      | Search filters messages | Shows matching messages   | ⏳     |       |
| J4      | History sidebar toggle  | Button shows branch name  | ⏳     |       |
| J5      | Switch branch           | Loads branch messages     | ⏳     |       |
| J6      | Create new branch       | Creates empty chat        | ⏳     |       |

### K. VOICE INPUT

| Test ID | Test Case                | Expected Behavior       | Status | Notes |
| ------- | ------------------------ | ----------------------- | ------ | ----- |
| K1      | Voice button visible     | Shows in header area    | ⏳     |       |
| K2      | Click to start recording | Shows recording state   | ⏳     |       |
| K3      | Transcript auto-submits  | Sends message when done | ⏳     |       |

### L. PERFORMANCE & LONG SESSIONS

| Test ID | Test Case                  | Expected Behavior      | Status | Notes |
| ------- | -------------------------- | ---------------------- | ------ | ----- |
| L1      | 50+ messages               | No lag, scroll works   | ⏳     |       |
| L2      | Long code blocks           | Renders without freeze | ⏳     |       |
| L3      | Multiple open/close cycles | No memory leaks        | ⏳     |       |
| L4      | Token counter updates      | Shows current usage    | ⏳     |       |
| L5      | Token warning/critical     | Shows at thresholds    | ⏳     |       |

### M. MOBILE RESPONSIVENESS

| Test ID | Test Case                  | Expected Behavior            | Status | Notes |
| ------- | -------------------------- | ---------------------------- | ------ | ----- |
| M1      | Mobile layout              | Full screen with padding     | ⏳     |       |
| M2      | Touch interactions         | Buttons respond to tap       | ⏳     |       |
| M3      | Virtual keyboard           | Input visible above keyboard | ⏳     |       |
| M4      | touch-manipulation enabled | Smooth touch scrolling       | ⏳     |       |

---

## Issues Found

| Issue ID | Description | Severity | Status | Fix Applied |
| -------- | ----------- | -------- | ------ | ----------- |
|          |             |          |        |             |

---

## Summary

| Category       | Total Tests | Passed | Failed | Blocked |
| -------------- | ----------- | ------ | ------ | ------- |
| Open/Close     | 7           | 0      | 0      | 0       |
| Streaming      | 7           | 0      | 0      | 0       |
| Message Ops    | 8           | 0      | 0      | 0       |
| Markdown       | 9           | 0      | 0      | 0       |
| Citations      | 5           | 0      | 0      | 0       |
| Tool Use       | 3           | 0      | 0      | 0       |
| Errors         | 5           | 0      | 0      | 0       |
| Offline        | 3           | 0      | 0      | 0       |
| Keyboard/A11y  | 10          | 0      | 0      | 0       |
| Search/History | 6           | 0      | 0      | 0       |
| Voice          | 3           | 0      | 0      | 0       |
| Performance    | 5           | 0      | 0      | 0       |
| Mobile         | 4           | 0      | 0      | 0       |
| **TOTAL**      | **75**      | **0**  | **0**  | **0**   |

---

## Re-Test Log

| Date       | Tester | Notes                     |
| ---------- | ------ | ------------------------- |
| 2025-12-19 | Claude | Initial test plan created |
