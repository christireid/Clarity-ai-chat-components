# FIRST RUN EXPERIENCE

**Perspective:** First-time user discovering Clarity Chat
**Simulation:** Cold onboarding from GitHub discovery

---

## The Journey

### Minute 0: Find the repo
I searched "react ai chat components" on GitHub. Let's say I found this repo somehow.

### Minute 1: Read the README
- Good: Clean, concise, well-structured. "Pre-release" badge is honest.
- Good: Quick start code looks simple — 3 lines to a chat UI.
- Good: Feature comparison table is honest, recommends competitors.
- **Problem:** I see "npm install @clarity-chat/react" — let me try it.

### Minute 2: Try to install
```bash
npm install @clarity-chat/react
```
**FAIL.** Package not found. My journey ends here.

90% of developers would close the tab at this point. The README promises something that doesn't exist.

---

## If I Were More Persistent (hypothetical)

### Minute 3: Look for alternatives
I check if there's a GitHub Packages registry, a download link, or build instructions. The ROADMAP.md admits the package isn't published. At least they're honest.

### Minute 5: Try cloning
```bash
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
pnpm install
```
Okay, 16 packages installing. This is a big monorepo for a component library. Takes a while.

### Minute 8: Try to build
```bash
pnpm build
```
This requires 2GB heap. My laptop might struggle. Build takes several minutes across 16 packages.

### Minute 15: Try to see something
```bash
pnpm storybook
```
If this works, I finally see components. **15 minutes to first visual.** For a component library, this should be 30 seconds via npm + import.

### Minute 20: Try to use a component
I'm now 20 minutes in and still haven't used a component in my own project. To do that, I'd need to:
1. Build the packages
2. Link them locally (`pnpm link`)
3. Import in my project
4. Hope the build output paths are correct

**This is an unacceptable developer experience.** No component library can survive this.

---

## Docs friction: INFINITE
- No deployed documentation site
- Docs exist in source but require building the Next.js app
- Multiple docs sites (docs, streamlined-docs, docs-site) — which one?
- Getting-started.md references npm install (broken)

---

## Confusion points
1. **"What is this?"** — README is clear enough. It's a React AI chat library.
2. **"How do I install it?"** — You can't. Full stop.
3. **"What does it look like?"** — No demo. No screenshots. No deployed Storybook.
4. **"Is this production-ready?"** — README says pre-release. Good.
5. **"How is this different from Vercel AI SDK?"** — Comparison table helps. Could be sharper.
6. **"Who uses this?"** — Nobody. 0 stars, 0 downloads.

---

## Activation failure analysis

| Activation step | Status | Fix |
|---|---|---|
| Find the product | FAIL — No discoverability | Publish, post, market |
| Install | FAIL — Not on npm | Publish to npm |
| See it work | FAIL — No demo/Storybook deployed | Deploy Storybook or demo |
| Use in own project | FAIL — Can't install | Publish to npm |
| Get value | BLOCKED — Can't reach this step | Fix all above |
| Recommend to others | BLOCKED | Fix all above |

---

## What a good first-run looks like (from a competitor)

### assistant-ui:
1. `npm install @assistant-ui/react` — works immediately
2. Visit assistant-ui.com — live demo, documentation
3. Copy-paste example — working chat in 2 minutes
4. Customize — docs show how

### What Clarity Chat needs to match this:
1. `npm install @clarity-chat/react` — must work
2. clarity-chat.dev or codeclarity.ai — must be live with docs
3. Example in README — must be copy-pasteable and work
4. Storybook at storybook.clarity-chat.dev — must be browseable

---

## Grade: F

The first-run experience is a total failure because the product cannot be installed. Everything else is irrelevant until this is fixed.
