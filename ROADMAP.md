# Clarity Chat Roadmap: From Code to Business

**Last updated:** February 18, 2026
**Current status:** Pre-release (never published to npm)

This document is the honest, detailed plan for turning Clarity Chat from a well-engineered codebase into a real business with users, revenue, and community.

---

## Current State (Honest Assessment)

| Dimension | Status |
|---|---|
| npm package published | No |
| npm downloads | 0 |
| GitHub stars | 0 |
| External contributors | 0 |
| External user-filed issues | 0 |
| Documentation site live | No |
| Community (Discord, etc.) | None |
| Revenue | $0 |
| Team size | 1 + AI tooling |

**What exists:** ~150 React components, 70+ hooks, TypeScript strict mode, WCAG accessibility, streaming, token optimization, memory management, error handling, 16 packages in a monorepo, 26 CI/CD workflows, 450+ tests, 16 examples.

**What doesn't exist:** Any form of market validation.

---

## Phase 0: Ship or Die (Week 1-2)

**Goal:** Exist in the market. Be installable. Be findable.

### 0.1 Publish to npm

- [ ] Verify all packages build cleanly: `pnpm build:packages`
- [ ] Verify all tests pass: `pnpm test`
- [ ] Verify all type checks pass: `pnpm typecheck`
- [ ] Verify export paths resolve to actual built files
- [ ] Create npm account for `@clarity-chat` scope (or verify ownership)
- [ ] Run `pnpm changeset` to create initial changelog entries
- [ ] Run `pnpm version-packages` to set versions
- [ ] Publish packages in dependency order:
  1. `@clarity-chat/types` (no deps)
  2. `@clarity-chat/utils` (no internal deps)
  3. `@clarity-chat/primitives`
  4. `@clarity-chat/token-optimization`
  5. `@clarity-chat/memory`
  6. `@clarity-chat/error-handling`
  7. `@clarity-chat/react` (depends on all above)
- [ ] Verify `npm install @clarity-chat/react` works from a clean project
- [ ] Verify tree-shaking works: import single component, check bundle size

### 0.2 Deploy documentation site

- [ ] Choose platform: Vercel (recommended, already configured) or GitHub Pages
- [ ] Deploy `apps/docs` or `apps/streamlined-docs` to `clarity-chat.dev` or a subdomain
- [ ] Verify all pages render correctly
- [ ] Set up custom domain if available
- [ ] Add Google Analytics or Plausible for traffic tracking
- [ ] Ensure getting-started.md is the landing experience

### 0.3 Fix GitHub presence

- [ ] Add repository description: "React components for AI chat interfaces. 150+ components, 70+ hooks, TypeScript-first, accessibility-first."
- [ ] Add topics: `react`, `ai`, `chat`, `components`, `typescript`, `accessibility`, `openai`, `anthropic`, `streaming`, `hooks`
- [ ] Add social preview image (1280x640 with logo and tagline)
- [ ] Enable GitHub Discussions
- [ ] Create a "Welcome" discussion post explaining the project
- [ ] Add pinned issue: "Feedback wanted: What would make you use this?"

### 0.4 Brand cleanup

- [ ] Verify `codeclarity.ai` domain ownership and configure
- [x] Remove all references to `codeandclarity.com` (different company)
- [ ] Remove all references to `claritychat.dev` and `clarity-chat.dev` unless you own and configure them
- [x] Standardize all package.json author fields to `codeclarity.ai`
- [x] Update all email references to `hello@codeclarity.ai`

### 0.5 Deploy live demo

- [ ] Deploy `examples/quickstart` to Vercel (zero-config, no API key needed)
- [ ] Add "Try it live" button to README linking to deployed demo
- [ ] Ensure the demo loads in under 3 seconds
- [ ] Add the Vercel deploy button to README

---

## Phase 1: Focus (Week 2-4)

**Goal:** Have a clear, differentiated product that people can understand in 10 seconds.

### 1.1 Choose ONE differentiator

Pick one of these and make it the entire narrative:

**Option A: Accessibility-first AI chat (Recommended)**
- No other AI chat library claims WCAG AAA
- Enterprise buyers care about accessibility (legal compliance)
- Differentiation is defensible and verifiable
- Narrative: "The only AI chat library built for WCAG AAA from day one"

**Option B: Token cost optimization built-in**
- Unique angle: provider-native caching, compression, budget monitoring
- Direct cost savings resonates with engineering leaders
- Measurable: show before/after token costs
- Narrative: "AI chat components that cut your token costs by 60-90%"

**Option C: Full-stack AI chat kit (everything included)**
- Memory, RAG, tools, security, analytics all in one
- Risk: "jack of all trades, master of none"
- Only works if the integration story is incredibly smooth

- [ ] Choose the differentiator
- [ ] Rewrite the README first paragraph around it
- [ ] Create a dedicated landing page/section for it
- [ ] Build benchmark/proof for the claim

### 1.2 Scope the v1 package set

For the npm publish, focus on packages that matter:

**Ship in v1:**
- `@clarity-chat/react` (core chat components)
- `@clarity-chat/types` (type definitions)
- `@clarity-chat/primitives` (base UI)
- `@clarity-chat/utils` (utilities)
- `@clarity-chat/token-optimization` (differentiator)
- `@clarity-chat/error-handling` (error recovery)

**Defer to v2:**
- `@clarity-chat/memory` (needs more battle-testing)
- `@clarity-chat/license` (not needed until premium tier launches)
- `@clarity-chat/cli` (nice-to-have)
- `@clarity-chat/codemods` (nice-to-have)
- `@clarity-chat/dev-tools` (nice-to-have)
- `@clarity-chat/ai-infrastructure` (scope creep)
- `@clarity-chat/playground` (nice-to-have)

- [ ] Archive/mark deferred packages as experimental
- [ ] Update README to only showcase v1 packages
- [ ] Ensure deferred packages don't appear in install instructions

### 1.3 Fix the marketing honesty gap

- [ ] Remove "Trusted by developers worldwide" (0 users)
- [ ] Change "production-ready" to "pre-release" or "beta"
- [ ] Remove specific performance numbers without methodology (hallucination rate, response quality)
- [ ] Add honest "Status" section: "Clarity Chat is in active pre-release development."
- [ ] Add "Maturity: Pre-release" to comparison table (done)
- [ ] Keep technical claims that are verifiable (TypeScript strict, WCAG target, component count)

---

## Phase 2: Traction (Month 2-3)

**Goal:** Get first 100 real users (measured by npm downloads).

### 2.1 Launch

- [ ] **Show HN post** - Write an honest "Show HN: I built an AI chat component library for React"
  - Be transparent about being solo + AI-assisted
  - Focus on the differentiator
  - Include live demo link
  - Accept feedback gracefully
- [ ] **r/reactjs post** - "I built this" format with demo GIF
- [ ] **r/webdev post** - Focus on the accessibility angle
- [ ] **Dev.to article** - "Building accessible AI chat interfaces with React"
- [ ] **X/Twitter launch thread** - Show the one-liner API, demo GIF, comparison

### 2.2 Content marketing

Write 3-5 articles (on your blog + cross-post to Dev.to/Medium):

- [ ] "Vercel AI SDK vs Clarity Chat: An honest comparison" (drives SEO)
- [ ] "How to build an accessible AI chat UI in React" (educational, demonstrates expertise)
- [ ] "Reducing AI API costs with prompt caching: A practical guide" (if token optimization is differentiator)
- [ ] "The hidden complexity of AI chat interfaces" (repurpose existing Medium article with honest framing)
- [ ] "Building a React component library with AI assistance: Lessons learned" (transparency builds trust)

### 2.3 Community seeding

- [ ] Answer questions on Stack Overflow about React chat UIs
- [ ] Comment on relevant GitHub issues in competitor repos (helpfully, not spammy)
- [ ] Join React Discord servers and be helpful (don't promote, just be known)
- [ ] Create GitHub issue templates for bug reports and feature requests
- [ ] Respond to every issue and discussion within 24 hours

### 2.4 Developer experience polish

- [ ] Create a 60-second setup video (terminal recording with asciinema)
- [ ] Add CodeSandbox/StackBlitz links to README for instant try
- [ ] Ensure `npx create-clarity-chat` works (if CLI supports it)
- [ ] Add VS Code extension recommendations for best DX

---

## Phase 3: Validate (Month 3-6)

**Goal:** Find product-market fit. Answer: "Would someone pay for this?"

### 3.1 User research

- [ ] Talk to 20 potential customers (founders, engineering leads building AI features)
  - How do they currently build AI chat?
  - What's their biggest pain point?
  - Would they pay for a solution? How much?
  - What features matter most?
- [ ] Set up user feedback collection (GitHub Discussions, Canny, or simple form)
- [ ] Track feature requests and prioritize by frequency
- [ ] Create a "customer advisory board" of 5 early adopters

### 3.2 Define the premium tier

Based on user research, define what's free vs paid:

**Proposed structure:**

| Feature | Free (MIT) | Pro ($X/mo) | Enterprise (Custom) |
|---|---|---|---|
| Core chat components | Yes | Yes | Yes |
| Streaming + error handling | Yes | Yes | Yes |
| Accessibility (WCAG AAA) | Yes | Yes | Yes |
| 15 themes | Yes | Yes | Yes |
| Token optimization | Yes | Yes | Yes |
| Memory system | - | Yes | Yes |
| Custom branding (no watermark) | - | Yes | Yes |
| Analytics dashboard | - | Yes | Yes |
| Priority support | - | Yes | Yes |
| Multi-tenancy | - | - | Yes |
| SSO/SAML | - | - | Yes |
| PII detection | - | - | Yes |
| SLA + dedicated support | - | - | Yes |

- [ ] Validate pricing with 10 potential customers
- [ ] Build license gating mechanism
- [ ] Set up payment processing (Stripe)
- [ ] Create pricing page on documentation site

### 3.3 Get case studies

- [ ] Offer free Pro access to 5 early adopters in exchange for:
  - Permission to use their logo
  - A 2-paragraph testimonial
  - A brief case study
- [ ] Feature case studies on docs site and README
- [ ] Create "Built with Clarity Chat" showcase

### 3.4 Metrics to track

| Metric | Target (Month 3) | Target (Month 6) |
|---|---|---|
| npm weekly downloads | 100 | 1,000 |
| GitHub stars | 100 | 500 |
| External contributors | 3 | 10 |
| Documentation site visitors/month | 500 | 2,000 |
| Issues filed by external users | 10 | 50 |
| Paying customers | 0 | 3 |

---

## Phase 4: Business (Month 6-12)

**Goal:** First revenue. Sustainable growth path.

### 4.1 Revenue model decision

Choose ONE primary revenue model:

**Option A: Open Core (MIT + Commercial)**
- Free: Core components, streaming, accessibility, token optimization
- Paid: Memory, analytics, enterprise security, priority support
- Pros: Standard model, community drives adoption
- Cons: Requires massive free-tier adoption
- Target: $500-2,000/mo per customer

**Option B: Consulting + Library**
- Free: Everything MIT
- Paid: Custom implementation, training, support contracts
- Pros: Immediate revenue, builds relationship
- Cons: Doesn't scale, time-for-money
- Target: $5,000-20,000 per engagement

**Option C: Hybrid (Recommended)**
- Start with consulting (immediate revenue)
- Use consulting engagements to validate and refine the library
- Transition to SaaS/open core as adoption grows
- Consulting demonstrates the library works in production

- [ ] Choose revenue model
- [ ] Set up legal entity if needed
- [ ] Set up Stripe billing
- [ ] Create Terms of Service and Privacy Policy
- [ ] Launch pricing page

### 4.2 Funding decision

**Bootstrap (Recommended for now):**
- Keep day job, build nights/weekends
- Revenue from consulting covers costs
- Full control, no dilution
- Slower growth but sustainable

**YC / Accelerator:**
- Apply when you have: 100+ stars, 1,000+ downloads, 3+ paying customers
- Strong signal: "Solo developer + AI built this" is a compelling narrative
- YC has funded similar projects (assistant-ui is YC-backed)

**Angel / Pre-seed:**
- Only if you have clear PMF signals
- Target: $100-250K for 6-12 months runway
- Use for: Full-time focus, hiring first engineer, marketing

- [ ] Decide bootstrap vs. fundraise timeline
- [ ] If fundraise: prepare deck, metrics, and demo

### 4.3 Team building

**Hire #1: Developer Advocate / Community Manager**
- Write tutorials, answer questions, run social media
- This person is more valuable than a second engineer right now
- Part-time / contract initially

**Hire #2: Senior React Engineer**
- Someone who can deeply understand and maintain the codebase
- Must be able to debug production issues independently
- This addresses the "bus factor" concern

- [ ] Write job descriptions
- [ ] Identify potential candidates in the React community
- [ ] Budget for first hire

---

## Phase 5: Scale (Year 2+)

**Goal:** Become a default choice for AI chat UIs.

### 5.1 Ecosystem integrations

- [ ] Official Next.js starter template
- [ ] Official Remix starter template
- [ ] Vercel AI SDK adapter (interop, not replacement)
- [ ] LangChain integration
- [ ] OpenAI / Anthropic / Google official examples

### 5.2 Enterprise features

- [ ] SOC 2 compliance (if targeting enterprise)
- [ ] On-premise deployment option
- [ ] Dedicated support SLA
- [ ] Custom component development
- [ ] White-label licensing

### 5.3 Community growth

- [ ] Launch Discord server (only when you have 500+ users to seed it)
- [ ] Annual "State of AI Chat UIs" report
- [ ] Sponsor React conferences
- [ ] Contributor bounty program

---

## Anti-Patterns to Avoid

1. **Don't build more features before publishing.** The library has 150+ components. Ship what exists.
2. **Don't compare yourself to Vercel AI SDK on downloads.** They have 20M monthly. Compare on specifics (accessibility, token optimization).
3. **Don't hide that AI helped build this.** Be transparent. It's a strength, not a weakness.
4. **Don't create a Discord server with 0 members.** Use GitHub Discussions until you have critical mass.
5. **Don't spend money on ads before product-market fit.** Free distribution first.
6. **Don't add more packages.** 16 packages for 1 developer is already too many. Consolidate.
7. **Don't claim "production-ready" until you have production users.** Call it what it is: beta.

---

## Key Decisions Needed

| Decision | Options | Deadline |
|---|---|---|
| Primary differentiator | Accessibility / Token optimization / Full-stack | Before launch |
| Revenue model | Open core / Consulting / Hybrid | Month 3 |
| Funding approach | Bootstrap / Accelerator / Angel | Month 6 |
| First hire | DevRel / Engineer | When revenue covers it |
| Premium pricing | $29/mo / $99/mo / Custom | Month 3 |

---

## Success Criteria

**This project becomes a real business when:**

1. The package is published to npm and has 1,000+ weekly downloads
2. There are 500+ GitHub stars from real users (not bots)
3. At least 10 external contributors have merged PRs
4. At least 3 companies are paying for Pro/Enterprise features
5. Monthly revenue covers at least one full-time salary
6. The documentation site gets 5,000+ monthly visitors
7. Someone other than the creator can maintain and release the library

Until these criteria are met, this is a side project with potential. That's okay. Every business started there.
