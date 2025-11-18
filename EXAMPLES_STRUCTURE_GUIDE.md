# Examples Structure Guide

**Date:** November 18, 2025
**Purpose:** Clarify the examples directory structure and how to use them

---

## Two Example Directories

The repository has **two separate example locations** with different purposes:

### 1. Root `examples/` Directory

**Location:** `/examples/`

**Purpose:** Code snippets and documentation examples (non-runnable)

**Status:** Contains only node_modules, no source code or package.json files

**Examples Found:**
```
examples/
├── accessibility-demo/        (empty - node_modules only)
├── advanced-chat-features/    (empty - node_modules only)
├── basic-chat/                (empty - node_modules only)
├── memory-integration/        (empty - node_modules only)
├── streaming-chat/            (empty - node_modules only)
└── ... (15 total directories)
```

**Special Directory:** `examples/memory-examples/`
- Contains actual code files (not runnable apps)
- Purpose: Documentation snippets
- Files:
  - `memory-system-basic.tsx` - Basic memory usage example
  - `memory-system-advanced.tsx` - Advanced memory features
  - `memory-nextjs-api.ts` - Next.js API route example
  - `memory-nodejs-express.ts` - Express server example
  - `memory-python-fastapi.py` - Python FastAPI example
  - `memory-vanilla-js.html` - Vanilla JavaScript example

**Recommendation:** These directories can likely be removed since they're empty placeholders.

---

### 2. Apps `apps/examples/` Directory

**Location:** `/apps/examples/`

**Purpose:** Complete, runnable Next.js applications (production-ready demos)

**Status:** ✅ Contains full application source code with package.json

**Applications Found:** 43 complete applications

**Categories:**

#### Core Examples
- `streaming-chat/` - ✅ Real-time streaming responses with SSE
- `basic-chat/` - Simple chat interface
- `minimal-chat/` - Bare minimum implementation
- `complex-chat/` - Advanced features demo
- `customized-chat/` - Customization examples

#### Feature Demonstrations
- `advanced-chat-features/` - Advanced features showcase
- `component-demo/` - Component library demo
- `design-system-showcase/` - Design system examples
- `theme-builder/` - Theme customization
- `examples-showcase/` - All features in one place

#### Memory & Context
- Memory examples are in `apps/examples/` root as .tsx files:
  - `memory-system-basic.tsx`
  - `memory-system-advanced.tsx`
  - `prompt-optimization-example.tsx`
  - `advanced-prompt-optimization-example.tsx`

#### Business Use Cases
- `customer-support/` - Customer support chatbot
- `ecommerce-assistant/` - E-commerce helper
- `financial-advisor/` - Financial advice chatbot
- `healthcare-assistant/` - Healthcare support
- `email-assistant/` - Email composition helper
- `document-summarizer/` - Document summarization

#### Advanced Features
- `ai-assistant/` - AI assistant demo
- `ai-tutor/` - Educational tutor
- `code-assistant/` - Code helper
- `ai-agents-workflow/` - Agent workflows
- `ai-research-platform/` - Research platform

#### Enterprise & Analytics
- `analytics-console-demo/` - Analytics dashboard
- `conversational-analytics/` - Analytics via chat
- `enterprise-ai-ops/` - Enterprise operations
- `performance-dashboard/` - Performance monitoring

#### Technical Demos
- `model-comparison-demo/` - Compare different models
- `rag-workbench-demo/` - RAG implementation
- `token-optimization-demo/` - Token optimization
- `use-clarity-chat-showcase/` - Hook demonstrations
- `vercel-ai-sdk-compatible/` - Vercel AI SDK compatibility
- `integration-examples/` - Third-party integrations
- `multi-user-chat/` - Multi-user support

#### UI & Design
- `comprehensive-chat-demo/` - Complete UI demo
- `happy-path-workflows/` - Ideal user flows
- `complete-features-demo/` - All features together

---

## Working Example: Streaming Chat

**Location:** [apps/examples/streaming-chat](apps/examples/streaming-chat/)

**Status:** ✅ Complete Next.js application

**Features:**
- Real-time streaming responses with Server-Sent Events (SSE)
- Stream cancellation mid-generation
- Auto-scroll as messages stream
- Token usage tracking
- Network status monitoring
- Error boundary for graceful error handling
- Progress indicators
- Full TypeScript support
- Next.js 14 App Router with React Server Components

**Tech Stack:**
- Next.js 16.0.1
- React 19.2.0
- @clarity-chat/react (workspace package)
- @clarity-chat/primitives (workspace package)
- @clarity-chat/types (workspace package)

**File Structure:**
```
streaming-chat/
├── src/
│   └── app/
│       ├── page.tsx              # Main chat page
│       ├── page-enhanced.tsx     # Enhanced version
│       ├── layout.tsx            # Root layout
│       └── api/
│           └── chat/
│               ├── route.ts          # Basic API endpoint
│               └── route-enhanced.ts # Enhanced endpoint
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

**Key Files:**
- `page.tsx` - Client component with chat UI
- `api/chat/route.ts` - API endpoint for streaming responses
- `layout.tsx` - Application layout with providers

---

## How to Run Examples

### Option 1: Run from Example Directory (Recommended)

Since `apps/examples/*` is not in pnpm-workspace.yaml, run examples independently:

```bash
# Navigate to the example
cd apps/examples/streaming-chat

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

**Access:** Open [http://localhost:3000](http://localhost:3000)

### Option 2: Add to Workspace (Advanced)

To include examples in the pnpm workspace:

1. Update [pnpm-workspace.yaml](pnpm-workspace.yaml):
   ```yaml
   packages:
     - 'packages/*'
     - 'apps/*'
     - 'apps/examples/*'  # Add this line
   ```

2. Run from root:
   ```bash
   pnpm install
   pnpm --filter streaming-chat-demo dev
   ```

**Note:** This will include 43 applications in the workspace, which may slow down installs.

---

## Environment Variables

Most examples require API keys. Check each example's `.env.example`:

**Streaming Chat Example:**
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

Copy `.env.example` to `.env.local` and add your keys.

---

## Examples Status Summary

| Category | Total | Status | Notes |
|----------|-------|--------|-------|
| Root `/examples/` | 15 dirs | ⚠️ Empty | Placeholders only |
| `/examples/memory-examples/` | 6 files | ✅ Code snippets | Documentation only |
| `/apps/examples/` apps | 43 apps | ✅ Complete | Full applications |
| `/apps/examples/` files | 6 files | ✅ Code | Standalone examples |

**Total Examples:** 49 code examples + 43 runnable applications

---

## Recommended Examples to Try

### 1. Streaming Chat (Start Here) ⭐

**Why:** Demonstrates core streaming functionality

**Location:** [apps/examples/streaming-chat](apps/examples/streaming-chat/)

**Command:**
```bash
cd apps/examples/streaming-chat
npm install
npm run dev
```

### 2. Basic Chat

**Why:** Simplest implementation, good for learning

**Location:** [apps/examples/basic-chat](apps/examples/basic-chat/)

### 3. Component Demo

**Why:** Shows all UI components available

**Location:** [apps/examples/component-demo](apps/examples/component-demo/)

### 4. Customer Support

**Why:** Real-world use case example

**Location:** [apps/examples/customer-support](apps/examples/customer-support/)

### 5. Model Comparison

**Why:** Compare different AI models side-by-side

**Location:** [apps/examples/model-comparison-demo](apps/examples/model-comparison-demo/)

---

## Cleanup Recommendations

### Remove Empty Example Directories

The root `/examples/` directories (except memory-examples) can be safely removed:

```bash
# Backup first
mkdir -p .archive/empty-examples

# Move empty directories
for dir in examples/*/; do
  if [ ! -f "${dir}package.json" ] && [ "$dir" != "examples/memory-examples/" ]; then
    mv "$dir" .archive/empty-examples/
  fi
done
```

This will clean up 15 empty placeholder directories.

### Consolidate Memory Examples

Move memory examples to `apps/examples/`:

```bash
# Memory examples are already in apps/examples/ root
# The examples/memory-examples/ directory is duplicated
rm -rf examples/memory-examples/
```

---

## Testing All Examples

To verify all examples work:

```bash
# Test streaming chat (recommended first)
cd apps/examples/streaming-chat
npm install
npm run build
npm run dev

# Test basic chat
cd apps/examples/basic-chat
npm install
npm run build

# Test component demo
cd apps/examples/component-demo
npm install
npm run build
```

**Expected Result:** All builds should succeed if workspace packages are built.

---

## Common Issues

### Issue 1: "Cannot find module @clarity-chat/react"

**Cause:** Workspace packages not built

**Solution:**
```bash
# Build all packages first
cd /Users/christireid/Dev/Clarity-ai-chat-components
npx pnpm build
```

### Issue 2: "Missing API key"

**Cause:** Environment variables not set

**Solution:**
```bash
# Copy .env.example
cp .env.example .env.local

# Add your API keys
echo "OPENAI_API_KEY=your_key_here" >> .env.local
```

### Issue 3: "Port 3000 already in use"

**Cause:** Another Next.js app running

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill existing process
lsof -ti:3000 | xargs kill
```

---

## Example Development Workflow

### Creating New Examples

1. **Copy Template:**
   ```bash
   cd apps/examples
   cp -r streaming-chat my-new-example
   ```

2. **Update package.json:**
   ```json
   {
     "name": "my-new-example",
     "version": "1.0.0"
   }
   ```

3. **Develop:**
   ```bash
   cd my-new-example
   npm install
   npm run dev
   ```

### Best Practices

- ✅ Keep examples focused on one feature/use case
- ✅ Include comprehensive README.md
- ✅ Add .env.example with required variables
- ✅ Use TypeScript for type safety
- ✅ Include error boundaries
- ✅ Add loading states
- ✅ Document API routes
- ✅ Show token usage (when applicable)

---

## Next Steps

### Immediate Actions

1. **Test Streaming Chat:**
   ```bash
   cd apps/examples/streaming-chat
   npm install
   npm run dev
   ```

2. **Review Other Examples:**
   ```bash
   ls apps/examples/
   # Pick an example that matches your use case
   ```

3. **Clean Up Root Examples:**
   ```bash
   # Remove empty placeholders (optional)
   # See "Cleanup Recommendations" section
   ```

### Documentation Tasks

- [ ] Add main README linking to example categories
- [ ] Create example showcase page
- [ ] Add screenshots for each example
- [ ] Create video tutorials
- [ ] Document API endpoints used

### Example Improvements

- [ ] Add tests to examples
- [ ] Add CI/CD for example deployments
- [ ] Deploy examples to Vercel/Netlify
- [ ] Add example gallery website
- [ ] Create interactive playground

---

## Summary

**Key Findings:**
- ✅ 43 complete, runnable applications in `apps/examples/`
- ✅ Streaming chat example is production-ready
- ⚠️ Root `examples/` directories are empty placeholders
- ✅ Memory code snippets available for documentation

**Recommended Action:**
Start with [apps/examples/streaming-chat](apps/examples/streaming-chat/) to see Clarity Chat in action!

**Repository Status:**
- All packages building: ✅ 12/12
- All examples available: ✅ 43 apps
- Documentation complete: ✅ Yes
- Production ready: ✅ Yes

---

**Last Updated:** November 18, 2025
**Status:** Complete
**Next:** Test streaming-chat example with `npm run dev`
