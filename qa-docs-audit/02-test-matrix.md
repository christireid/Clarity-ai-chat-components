# QA Docs Audit - Test Matrix

## Route Coverage

### Core Pages

| Route           | Category | HTTP Test | Visual | Interactive | Mobile | Dark Mode |
| --------------- | -------- | --------- | ------ | ----------- | ------ | --------- |
| `/`             | Home     | PASS      | TODO   | TODO        | TODO   | TODO      |
| `/about`        | Info     | TODO      | TODO   | TODO        | TODO   | TODO      |
| `/blog`         | Info     | TODO      | TODO   | TODO        | TODO   | TODO      |
| `/changelog`    | Info     | TODO      | TODO   | TODO        | TODO   | TODO      |
| `/compare`      | Info     | PASS      | TODO   | TODO        | TODO   | TODO      |
| `/contributing` | Info     | TODO      | TODO   | TODO        | TODO   | TODO      |
| `/license`      | Info     | TODO      | TODO   | TODO        | TODO   | TODO      |

### Demo Pages (Priority)

| Route                             | HTTP Test | Chat Works | Streaming | Error States | Mobile |
| --------------------------------- | --------- | ---------- | --------- | ------------ | ------ |
| `/demos`                          | PASS      | N/A        | N/A       | N/A          | TODO   |
| `/demos/zero-to-chat`             | PASS      | TODO       | TODO      | TODO         | TODO   |
| `/demos/streaming-states`         | PASS      | TODO       | TODO      | TODO         | TODO   |
| `/demos/tool-calling`             | PASS      | TODO       | TODO      | TODO         | TODO   |
| `/demos/token-visualizer`         | PASS      | N/A        | N/A       | N/A          | TODO   |
| `/demos/accessibility-audit`      | PASS      | TODO       | TODO      | TODO         | TODO   |
| `/demos/memory-context`           | PASS      | TODO       | TODO      | TODO         | TODO   |
| `/demos/provider-hotswap`         | TODO      | TODO       | TODO      | TODO         | TODO   |
| `/demos/enterprise-production`    | TODO      | TODO       | TODO      | TODO         | TODO   |
| `/demos/bundle-comparison`        | TODO      | N/A        | N/A       | N/A          | TODO   |
| `/demos/customization-playground` | TODO      | TODO       | TODO      | TODO         | TODO   |

### Learn Section

| Route                        | HTTP Test | Code Blocks | Navigation | Mobile |
| ---------------------------- | --------- | ----------- | ---------- | ------ |
| `/learn/quick-start`         | PASS      | TODO        | TODO       | TODO   |
| `/learn/installation`        | TODO      | TODO        | TODO       | TODO   |
| `/learn/tutorial`            | TODO      | TODO        | TODO       | TODO   |
| `/learn/concepts`            | TODO      | TODO        | TODO       | TODO   |
| `/learn/concepts/animations` | TODO      | TODO        | TODO       | TODO   |
| `/learn/concepts/components` | TODO      | TODO        | TODO       | TODO   |
| `/learn/concepts/hooks`      | TODO      | TODO        | TODO       | TODO   |
| `/learn/concepts/theming`    | TODO      | TODO        | TODO       | TODO   |
| `/learn/architecture`        | TODO      | TODO        | TODO       | TODO   |
| `/learn/deployment/*`        | TODO      | TODO        | TODO       | TODO   |
| `/learn/guides/*`            | TODO      | TODO        | TODO       | TODO   |
| `/learn/faq`                 | TODO      | TODO        | TODO       | TODO   |
| `/learn/troubleshooting`     | TODO      | TODO        | TODO       | TODO   |

### Guides Section (60+ pages)

| Route Pattern             | HTTP Test | Content | Code Blocks | Mobile |
| ------------------------- | --------- | ------- | ----------- | ------ |
| `/guides`                 | PASS      | TODO    | TODO        | TODO   |
| `/guides/getting-started` | TODO      | TODO    | TODO        | TODO   |
| `/guides/installation`    | TODO      | TODO    | TODO        | TODO   |
| `/guides/accessibility`   | TODO      | TODO    | TODO        | TODO   |
| `/guides/streaming`       | TODO      | TODO    | TODO        | TODO   |
| `/guides/error-handling`  | TODO      | TODO    | TODO        | TODO   |
| `/guides/testing`         | TODO      | TODO    | TODO        | TODO   |
| `/guides/performance`     | TODO      | TODO    | TODO        | TODO   |
| `/guides/theming`         | TODO      | TODO    | TODO        | TODO   |
| `/guides/customization`   | TODO      | TODO    | TODO        | TODO   |
| ... (50+ more)            | TODO      | TODO    | TODO        | TODO   |

### Reference Section (170+ pages)

| Route Pattern                        | HTTP Test | API Docs | Code Samples | Types |
| ------------------------------------ | --------- | -------- | ------------ | ----- |
| `/reference/components`              | PASS      | TODO     | TODO         | TODO  |
| `/reference/components/chat-input`   | PASS      | TODO     | TODO         | TODO  |
| `/reference/components/message`      | PASS      | TODO     | TODO         | TODO  |
| `/reference/components/clarity-chat` | PASS      | TODO     | TODO         | TODO  |
| `/reference/hooks`                   | PASS      | TODO     | TODO         | TODO  |
| `/reference/hooks/use-chat`          | PASS      | TODO     | TODO         | TODO  |
| `/reference/hooks/use-clarity-chat`  | PASS      | TODO     | TODO         | TODO  |
| `/reference/api`                     | TODO      | TODO     | TODO         | TODO  |
| `/reference/cheat-sheet`             | TODO      | TODO     | TODO         | TODO  |
| ... (160+ more)                      | TODO      | TODO     | TODO         | TODO  |

### Cookbook Section (45+ pages)

| Route Pattern                   | HTTP Test | Recipe Works | Code Blocks | Copy Button |
| ------------------------------- | --------- | ------------ | ----------- | ----------- |
| `/cookbook`                     | PASS      | N/A          | TODO        | TODO        |
| `/cookbook/streaming-setup`     | PASS      | TODO         | TODO        | TODO        |
| `/cookbook/custom-theming`      | PASS      | TODO         | TODO        | TODO        |
| `/cookbook/quick-start-3-lines` | TODO      | TODO         | TODO        | TODO        |
| `/cookbook/nextjs-integration`  | TODO      | TODO         | TODO        | TODO        |
| `/cookbook/authentication`      | TODO      | TODO         | TODO        | TODO        |
| `/cookbook/rag-integration`     | TODO      | TODO         | TODO        | TODO        |
| ... (35+ more)                  | TODO      | TODO         | TODO        | TODO        |

### Examples Section (18+ pages)

| Route                             | HTTP Test | Demo Works | Interactive | Mobile |
| --------------------------------- | --------- | ---------- | ----------- | ------ |
| `/examples`                       | PASS      | N/A        | TODO        | TODO   |
| `/examples/simple-chat`           | TODO      | TODO       | TODO        | TODO   |
| `/examples/streaming`             | TODO      | TODO       | TODO        | TODO   |
| `/examples/themed-chat`           | TODO      | TODO       | TODO        | TODO   |
| `/examples/tool-calling-showcase` | TODO      | TODO       | TODO        | TODO   |
| ... (13+ more)                    | TODO      | TODO       | TODO        | TODO   |

### Interactive Features

| Route                  | HTTP Test | Playground Works | Settings | Export |
| ---------------------- | --------- | ---------------- | -------- | ------ |
| `/playground`          | PASS      | TODO             | TODO     | TODO   |
| `/playground/guide`    | TODO      | TODO             | TODO     | TODO   |
| `/playground/security` | TODO      | TODO             | TODO     | TODO   |

### Enterprise Section

| Route                      | HTTP Test | Content | Mobile |
| -------------------------- | --------- | ------- | ------ |
| `/enterprise`              | PASS      | TODO    | TODO   |
| `/enterprise/pricing`      | TODO      | TODO    | TODO   |
| `/enterprise/case-studies` | TODO      | TODO    | TODO   |
| `/enterprise-standalone`   | TODO      | TODO    | TODO   |

### Integration Pages

| Route                  | HTTP Test | Content | Code Blocks |
| ---------------------- | --------- | ------- | ----------- |
| `/integrations/nextjs` | TODO      | TODO    | TODO        |
| `/integrations/vite`   | TODO      | TODO    | TODO        |
| `/integrations/remix`  | TODO      | TODO    | TODO        |

---

## Device/Breakpoint Matrix

| Device             | Width  | Priority | Tested |
| ------------------ | ------ | -------- | ------ |
| Mobile (iPhone SE) | 375px  | High     | TODO   |
| Mobile (iPhone 14) | 390px  | High     | TODO   |
| Tablet (iPad Mini) | 768px  | Medium   | TODO   |
| Tablet (iPad)      | 1024px | Medium   | TODO   |
| Desktop (13")      | 1280px | High     | TODO   |
| Desktop (15")      | 1440px | High     | TODO   |
| Desktop (4K)       | 1920px | Low      | TODO   |

---

## "Must Pass" Behaviors

### Critical (P0)

- [ ] All pages return 200 (not 404/500)
- [ ] No JavaScript console errors that break functionality
- [ ] Navigation works (links, back/forward)
- [ ] Search opens and functions
- [ ] Code blocks render syntax highlighting
- [ ] Theme toggle works (light/dark)
- [ ] Demo chat responds to input (with mock)

### Major (P1)

- [ ] All code blocks have copy button
- [ ] All internal links resolve
- [ ] Mobile navigation works
- [ ] Keyboard navigation works
- [ ] Skip to content link works
- [ ] No layout shifts on load
- [ ] Footer is visible

### Nice-to-have (P2)

- [ ] Animations are smooth
- [ ] Reduced motion is respected
- [ ] External links open in new tab
- [ ] Page load < 3s (dev mode)
- [ ] No hydration warnings

---

## Test Execution Log

| Date       | Scope                | Pass | Fail | Notes            |
| ---------- | -------------------- | ---- | ---- | ---------------- |
| 2025-12-30 | Core routes (10)     | 10   | 0    | All returned 200 |
| 2025-12-30 | Demo routes (6)      | 6    | 0    | All returned 200 |
| 2025-12-30 | Reference routes (6) | 6    | 0    | All returned 200 |
| TBD        | Full route crawl     | -    | -    | 421 routes       |
