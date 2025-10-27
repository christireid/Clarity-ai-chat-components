# Troubleshooting Guide

Common issues and their solutions in Clarity Chat development.

## Next.js 15 Issues

### Issue: Route Isolation - Data Not Persisting Across Routes

**Symptom**: Data stored in one API route isn't accessible from another route.

**Example**:
```typescript
// src/app/api/store/route.ts
const data = []  // ❌ Only visible to this route
export async function POST(req: Request) {
  data.push(await req.json())
}

// src/app/api/retrieve/route.ts
const data = []  // ❌ Different instance!
export async function GET(req: Request) {
  return Response.json(data)  // Always empty!
}
```

**Root Cause**: Next.js 15 API routes run in isolated contexts with separate memory spaces.

**Solutions**:

1. **Use External Storage (Production)**:
```typescript
// src/lib/storage.ts
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function store(data: any) {
  await pool.query('INSERT INTO data VALUES ($1)', [data])
}

export async function retrieve() {
  const result = await pool.query('SELECT * FROM data')
  return result.rows
}
```

2. **Use Shared Module (Development)**:
```typescript
// src/lib/shared-storage.ts
const storage = new Map<string, any>()

export function set(key: string, value: any) {
  storage.set(key, value)
}

export function get(key: string) {
  return storage.get(key)
}

// Import in both routes
import { set, get } from '@/lib/shared-storage'
```

3. **Use Redis**:
```typescript
import { Redis } from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

export async function store(key: string, value: any) {
  await redis.set(key, JSON.stringify(value))
}
```

**Status**: ✅ Documented - This is expected Next.js behavior, not a bug.

---

### Issue: Hydration Errors

**Symptom**: React hydration mismatch warnings in console.

**Example Error**:
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Common Causes**:
1. Date/time rendering (timezone differences)
2. Random IDs/keys
3. Browser-only APIs used during SSR

**Solutions**:

1. **Suppress Hydration for Dynamic Content**:
```typescript
<div suppressHydrationWarning>
  {new Date().toLocaleTimeString()}
</div>
```

2. **Client-Only Rendering**:
```typescript
'use client'
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null

return <div>{browserOnlyContent}</div>
```

3. **Use Stable Keys**:
```typescript
// ❌ Random keys cause hydration issues
{items.map(item => <div key={Math.random()}>{item}</div>)}

// ✅ Stable keys
{items.map(item => <div key={item.id}>{item}</div>)}
```

---

## PM2 Issues

### Issue: PM2 Service Won't Start

**Symptom**: `pm2 start` fails or service crashes immediately.

**Debugging Steps**:

1. **Check Logs**:
```bash
pm2 logs my-app --lines 100
pm2 logs my-app --err --lines 50
```

2. **Check Configuration**:
```bash
cat ecosystem.config.cjs
# Verify script path, args, and working directory
```

3. **Test Command Manually**:
```bash
# If PM2 config is: script: 'node', args: 'server.js'
# Test manually:
node server.js
```

4. **Check Port Availability**:
```bash
lsof -i :3000
fuser -k 3000/tcp 2>/dev/null || true
```

**Common Fixes**:

```bash
# Kill all PM2 processes
pm2 kill

# Clean port
fuser -k 3000/tcp 2>/dev/null || true

# Restart
pm2 start ecosystem.config.cjs
```

---

### Issue: PM2 Logs Not Appearing

**Symptom**: `pm2 logs` shows nothing or is outdated.

**Solution**:
```bash
# Flush logs
pm2 flush

# Restart service
pm2 restart my-app

# Check log files directly
cat ~/.pm2/logs/my-app-out.log
cat ~/.pm2/logs/my-app-error.log
```

---

## API Issues

### Issue: API Returns 404

**Symptom**: API route returns 404 even though file exists.

**Checklist**:

1. **File Location**: Must be in `src/app/api/`
```
✅ src/app/api/my-route/route.ts
❌ src/api/my-route.ts
❌ src/app/my-route/route.ts
```

2. **File Name**: Must be `route.ts` or `route.js`
```
✅ route.ts
❌ index.ts
❌ api.ts
```

3. **Export Name**: Must be HTTP method
```typescript
✅ export async function GET(req: NextRequest) {}
❌ export async function get(req: NextRequest) {}
❌ export default async function(req: NextRequest) {}
```

4. **Server Running**: Restart after adding new routes
```bash
# Kill and restart
pm2 restart my-app
# Or ctrl+c and npm run dev
```

---

### Issue: API Returns Empty Response

**Symptom**: API call succeeds but returns empty or undefined data.

**Debugging**:

1. **Add Logging**:
```typescript
export async function GET(req: NextRequest) {
  console.log('API called:', req.url)
  
  const data = await fetchData()
  console.log('Data fetched:', data)
  
  return NextResponse.json(data)
}
```

2. **Check Response Format**:
```typescript
// ❌ Invalid - returns Promise
return data

// ✅ Correct
return NextResponse.json(data)
```

3. **Check Async/Await**:
```typescript
// ❌ Missing await
const data = fetchData()  // Returns Promise!

// ✅ Correct
const data = await fetchData()
```

---

## Environment Variable Issues

### Issue: Environment Variables Undefined

**Symptom**: `process.env.MY_VAR` is `undefined`.

**Checklist**:

1. **File Name**: Must be `.env.local`
```
✅ .env.local
❌ .env
❌ env.local
❌ .env.development
```

2. **File Location**: Must be in project root
```
✅ /project/.env.local
❌ /project/src/.env.local
❌ /project/examples/.env.local
```

3. **Syntax**: No spaces around `=`
```bash
✅ OPENAI_API_KEY=sk-123
❌ OPENAI_API_KEY = sk-123
❌ OPENAI_API_KEY= sk-123
```

4. **Restart Server**: Changes require restart
```bash
# Kill and restart
pm2 restart my-app
# Or ctrl+c and npm run dev
```

5. **Client vs Server**:
```typescript
// ❌ Client-side - undefined
'use client'
const key = process.env.OPENAI_API_KEY  // undefined!

// ✅ Server-side only
export async function GET() {
  const key = process.env.OPENAI_API_KEY  // works!
}
```

---

## TypeScript Issues

### Issue: Type Errors in Next.js

**Symptom**: TypeScript can't find Next.js types.

**Solution**:
```bash
# Ensure proper imports
import { NextRequest, NextResponse } from 'next/server'

# Check tsconfig.json
{
  "compilerOptions": {
    "types": ["node"],
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### Issue: Module Not Found

**Symptom**: `Cannot find module '@/lib/utils'`

**Solutions**:

1. **Check Path Alias**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Ensure this exists
    }
  }
}
```

2. **Verify File Exists**:
```bash
ls -la src/lib/utils.ts
```

3. **Restart TypeScript**:
```bash
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
# Or restart dev server
```

---

## AI Provider Issues

### Issue: OpenAI Rate Limit Error

**Symptom**: `RateLimitError: You exceeded your current quota`

**Solutions**:

1. **Check API Key**:
```bash
echo $OPENAI_API_KEY
# Should start with sk-
```

2. **Check Billing**:
- Visit https://platform.openai.com/account/billing
- Add payment method
- Check usage limits

3. **Add Retry Logic**:
```typescript
async function callOpenAIWithRetry(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await openai.chat.completions.create({...})
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      throw error
    }
  }
}
```

---

### Issue: Anthropic API Error

**Symptom**: `Authentication error` or `Invalid API key`

**Check**:
```bash
# Verify key format (should start with sk-ant-)
echo $ANTHROPIC_API_KEY

# Test directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-opus-20240229",
    "max_tokens": 10,
    "messages": [{"role": "user", "content": "Hi"}]
  }'
```

---

## Build Issues

### Issue: Build Fails with TypeScript Errors

**Symptom**: `npm run build` fails with type errors.

**Steps**:

1. **Fix Type Errors**:
```bash
npx tsc --noEmit
# Shows all type errors
```

2. **Check for Strict Mode Issues**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,  // Try setting to false temporarily
    "noImplicitAny": false
  }
}
```

3. **Clean and Rebuild**:
```bash
rm -rf .next
npm run build
```

---

### Issue: Out of Memory During Build

**Symptom**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or add to package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## Dependency Issues

### Issue: npm install Fails

**Symptom**: `npm ERR! code ERESOLVE`

**Solutions**:

1. **Use Legacy Peer Deps**:
```bash
npm install --legacy-peer-deps
```

2. **Clear Cache**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Use Specific Versions**:
```json
{
  "dependencies": {
    "next": "15.1.3",  // Pin exact version
    "react": "19.0.0"
  }
}
```

---

## Performance Issues

### Issue: Slow API Responses

**Debugging**:

```typescript
export async function GET() {
  const start = Date.now()
  
  const data = await fetchData()
  console.log('Fetch time:', Date.now() - start, 'ms')
  
  return NextResponse.json(data)
}
```

**Common Causes & Fixes**:

1. **Sequential API Calls**:
```typescript
// ❌ Slow - sequential
const a = await fetchA()
const b = await fetchB()
const c = await fetchC()

// ✅ Fast - parallel
const [a, b, c] = await Promise.all([
  fetchA(),
  fetchB(),
  fetchC()
])
```

2. **No Caching**:
```typescript
const cache = new Map()

async function getCached(key: string, fn: () => Promise<any>) {
  if (cache.has(key)) return cache.get(key)
  const result = await fn()
  cache.set(key, result)
  return result
}
```

3. **Large Payloads**:
```typescript
// Paginate results
return NextResponse.json({
  data: data.slice(0, 100),
  total: data.length,
  page: 1,
  pageSize: 100
})
```

---

## Git Issues

### Issue: Merge Conflicts

**Simple Resolution**:
```bash
# Abort merge
git merge --abort

# Start fresh
git fetch origin main
git rebase origin/main

# Or accept theirs
git checkout --theirs conflicted-file.ts
git add conflicted-file.ts
git commit
```

---

### Issue: Accidentally Committed .env.local

**Fix**:
```bash
# Remove from git
git rm --cached .env.local

# Add to .gitignore
echo ".env.local" >> .gitignore

# Commit
git add .gitignore
git commit -m "Remove .env.local from git"

# IMPORTANT: Rotate all API keys immediately!
```

---

## Quick Diagnostic Commands

```bash
# Check all services
pm2 list

# Check port usage
lsof -i :3000

# Check environment
env | grep -i api

# Check Node version
node -v  # Should be 18+

# Check npm version
npm -v

# Check TypeScript
npx tsc --version

# Check build
npm run build 2>&1 | tee build.log
```

---

## Getting Help

If issues persist:

1. **Check Examples**: See working code in `examples/`
2. **Read Context Docs**: Review `.context/` documentation
3. **Check Git History**: See how issues were fixed before
4. **Add Logging**: Debug with console.log
5. **Simplify**: Create minimal reproduction case

---

**Last Updated**: 2025-10-27  
**Version**: 1.0
