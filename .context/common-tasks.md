# Common Tasks

Quick reference for frequent development operations in Clarity Chat.

## Project Setup

### Initialize New Project
```bash
# Using CLI
npx @clarity-chat/cli init my-project
cd my-project
npm install

# Manual setup
git clone https://github.com/your-org/clarity-chat.git
cd clarity-chat
npm install
```

### Configure Environment
```bash
# Copy template
cp .env.local.example .env.local

# Edit with your API keys
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

### Start Development Server
```bash
# Next.js dev server (hot reload)
npm run dev

# PM2 (daemon mode)
pm2 start ecosystem.config.cjs

# Specific example
cd examples/analytics-console-demo
npm install
npm run dev
```

## Running Examples

### Analytics Console Demo
```bash
cd examples/analytics-console-demo
npm install
npm run dev
# → http://localhost:3000

# Or with PM2
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/analytics/summary
```

### RAG Workbench Demo
```bash
cd examples/rag-workbench-demo
npm install
cp .env.local.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
# → http://localhost:3000
```

### Model Comparison Demo
```bash
cd examples/model-comparison-demo
npm install
cp .env.local.example .env.local
# Add all three API keys to .env.local
npm run dev
# → http://localhost:3000
```

## Development Workflows

### Adding New Features

**1. Create Feature Branch**
```bash
git checkout -b feature/new-feature
```

**2. Implement Feature**
```bash
# Add files
touch src/lib/new-feature.ts

# Write code
code src/lib/new-feature.ts

# Add tests
touch src/lib/new-feature.test.ts
```

**3. Test Locally**
```bash
npm run dev
# Test in browser

npm run build
# Ensure builds successfully
```

**4. Commit Changes**
```bash
git add .
git commit -m "feat: Add new feature description"
git push origin feature/new-feature
```

### Adding New API Route

**1. Create Route File**
```bash
mkdir -p src/app/api/my-route
touch src/app/api/my-route/route.ts
```

**2. Implement Handler**
```typescript
// src/app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await processData(body)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
```

**3. Test API**
```bash
# Start server
npm run dev

# Test endpoint
curl http://localhost:3000/api/my-route
curl -X POST http://localhost:3000/api/my-route \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'
```

### Adding New Package

**1. Create Package Directory**
```bash
mkdir -p packages/my-package/src
cd packages/my-package
```

**2. Initialize Package**
```bash
npm init -y
# Edit package.json
```

**3. Add to Workspace**
```json
// Root package.json
{
  "workspaces": [
    "packages/*",
    "packages/my-package"  // Add this
  ]
}
```

**4. Install Dependencies**
```bash
cd ../..  # Back to root
npm install
```

## Testing

### Run Unit Tests
```bash
npm test
# Or specific file
npm test src/lib/my-feature.test.ts
```

### Test API Endpoints
```bash
# Start server
npm run dev

# Test with curl
curl http://localhost:3000/api/test

# Test with httpie
http GET localhost:3000/api/test

# Test with Postman/Insomnia
# Import examples/api-collection.json
```

### Test Streaming
```bash
# SSE endpoint
curl -N http://localhost:3000/api/stream

# With event parsing
curl -N http://localhost:3000/api/stream | \
  while IFS= read -r line; do
    echo "$line"
  done
```

## PM2 Management

### Start Services
```bash
# Start all
pm2 start ecosystem.config.cjs

# Start specific app
pm2 start ecosystem.config.cjs --only my-app
```

### Monitor Services
```bash
# List all services
pm2 list

# Monitor in real-time
pm2 monit

# Check logs (non-blocking)
pm2 logs my-app --nostream --lines 50

# Follow logs
pm2 logs my-app
```

### Manage Services
```bash
# Restart
pm2 restart my-app

# Stop
pm2 stop my-app

# Delete
pm2 delete my-app

# Restart all
pm2 restart all

# Delete all
pm2 delete all
```

### Clean Port 3000
```bash
# Kill process on port 3000
fuser -k 3000/tcp 2>/dev/null || true

# Or with PM2
pm2 delete all
```

## Building & Deployment

### Build for Production
```bash
# Clean build
rm -rf .next dist

# Build Next.js app
npm run build

# Test production build
npm run start
```

### Deploy with PM2
```bash
# Build first
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Environment-Specific Builds
```bash
# Development
NODE_ENV=development npm run build

# Production
NODE_ENV=production npm run build

# Staging
NODE_ENV=staging npm run build
```

## Git Workflows

### Commit Message Format
```bash
# Feature
git commit -m "feat: Add streaming chat support"

# Bug fix
git commit -m "fix: Resolve memory leak in analytics"

# Documentation
git commit -m "docs: Update API reference"

# Refactor
git commit -m "refactor: Simplify provider abstraction"

# Test
git commit -m "test: Add unit tests for RAG chunking"

# Chore
git commit -m "chore: Update dependencies"
```

### Branching Strategy
```bash
# Feature branch
git checkout -b feature/feature-name

# Bug fix branch
git checkout -b fix/bug-description

# Documentation branch
git checkout -b docs/update-readme

# Merge to main
git checkout main
git merge feature/feature-name
git push origin main
```

### Syncing with Upstream
```bash
# Fetch latest
git fetch origin main

# Rebase your branch
git rebase origin/main

# Or merge
git merge origin/main
```

## Package Management

### Install Dependencies
```bash
# Install all
npm install

# Install specific package
npm install <package-name>

# Install dev dependency
npm install -D <package-name>

# Install in workspace
npm install <package-name> -w packages/my-package
```

### Update Dependencies
```bash
# Check outdated
npm outdated

# Update all
npm update

# Update specific
npm update <package-name>

# Update to latest (breaking)
npm install <package-name>@latest
```

### Clean Install
```bash
# Remove node_modules and lock
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Or use clean-install
npm ci
```

## Debugging

### Debug Next.js Server
```bash
# Start with Node inspector
NODE_OPTIONS='--inspect' npm run dev

# Connect with Chrome DevTools
# chrome://inspect
```

### Debug API Routes
```typescript
// Add console.log
export async function GET(request: NextRequest) {
  console.log('Request:', request.url)
  console.log('Headers:', Object.fromEntries(request.headers))
  
  const data = await fetchData()
  console.log('Response data:', data)
  
  return NextResponse.json(data)
}
```

### Debug PM2 Services
```bash
# Check error logs
pm2 logs my-app --err --lines 100

# Check output logs
pm2 logs my-app --out --lines 100

# Full log file
cat ~/.pm2/logs/my-app-error.log
cat ~/.pm2/logs/my-app-out.log
```

### Debug TypeScript Issues
```bash
# Type checking
npx tsc --noEmit

# Show all errors
npx tsc --noEmit --pretty false

# Watch mode
npx tsc --noEmit --watch
```

## Code Quality

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Lint specific file
npx eslint src/lib/my-file.ts
```

### Formatting
```bash
# Format with Prettier
npx prettier --write .

# Check formatting
npx prettier --check .

# Format specific file
npx prettier --write src/lib/my-file.ts
```

### Type Checking
```bash
# Check types
npm run type-check

# Or directly
npx tsc --noEmit
```

## Documentation

### Update README
```bash
# Edit README
code README.md

# Preview markdown
# Use VS Code markdown preview
# Or install markdown preview tool
```

### Update Context Docs
```bash
# Edit context docs
code .context/my-doc.md

# Update all context docs when architecture changes
ls .context/*.md | xargs -I {} code {}
```

### Generate API Docs
```bash
# Using JSDoc/TSDoc comments in code
npm run docs

# Or use TypeDoc
npx typedoc --out docs src
```

## Performance Testing

### Load Testing
```bash
# Install autocannon
npm install -g autocannon

# Test API endpoint
autocannon -c 10 -d 30 http://localhost:3000/api/chat

# With POST data
autocannon -c 10 -d 30 \
  -m POST \
  -H "Content-Type: application/json" \
  -b '{"prompt":"test"}' \
  http://localhost:3000/api/chat
```

### Memory Profiling
```bash
# Start with heap snapshot
node --expose-gc --inspect npm run dev

# Take heap snapshot in Chrome DevTools
# Memory tab → Take snapshot
```

### Bundle Analysis
```bash
# Analyze Next.js bundle
npm run build

# View bundle analyzer
ANALYZE=true npm run build
```

## Troubleshooting Quick Fixes

### Port Already in Use
```bash
fuser -k 3000/tcp 2>/dev/null || true
pm2 delete all
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### PM2 Not Working
```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.cjs
```

### Git Conflicts
```bash
# Abort merge
git merge --abort

# Use theirs
git checkout --theirs <file>

# Use ours
git checkout --ours <file>
```

## Quick References

### Environment Variables
```bash
# Check if set
echo $OPENAI_API_KEY

# Set temporarily
export OPENAI_API_KEY=sk-...

# Set in .env.local (persistent)
echo "OPENAI_API_KEY=sk-..." >> .env.local
```

### Port Management
```bash
# Find process on port
lsof -i :3000

# Kill process
kill -9 $(lsof -t -i:3000)

# Or use fuser
fuser -k 3000/tcp
```

### File Operations
```bash
# Find files
find . -name "*.ts" -type f

# Search content
grep -r "searchterm" src/

# Count lines of code
find src -name "*.ts" | xargs wc -l
```

---

**Last Updated**: 2025-10-27  
**Version**: 1.0
