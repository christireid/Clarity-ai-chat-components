
> clarity-chat@0.1.0 build
> npx turbo run build

turbo 2.5.8

• Packages in scope: @clarity-chat/ai-research-platform, @clarity-chat/ai-sales-copilot, @clarity-chat/cli, @clarity-chat/codemods, @clarity-chat/conversational-analytics, @clarity-chat/dev-tools, @clarity-chat/devops-command-center, @clarity-chat/docs, @clarity-chat/docs-site, @clarity-chat/enterprise-ai-ops, @clarity-chat/enterprise-knowledge-hub, @clarity-chat/error-handling, @clarity-chat/errors, @clarity-chat/licensing, @clarity-chat/marketing-site, @clarity-chat/playground, @clarity-chat/primitives, @clarity-chat/react, @clarity-chat/storybook, @clarity-chat/token-optimization-demo, @clarity-chat/types, ai-assistant-demo, analytics-console-demo, basic-chat-demo, clarity-chat-showcase, code-assistant-demo, customer-support-demo, ecommerce-assistant-demo, model-comparison-demo, multi-user-chat-demo, rag-workbench-demo, streaming-chat-demo, vercel-ai-sdk-compatible-demo
• Running build in 33 packages
• Remote caching disabled
@clarity-chat/codemods:build: cache miss, executing 46f29d9b4a0fca2c
@clarity-chat/errors:build: cache miss, executing 296d267535fd0ccf
analytics-console-demo:build: cache miss, executing 0e4a03543c744d05
@clarity-chat/react:build: cache miss, executing a3e02557c6b57fa4
@clarity-chat/types:build: cache miss, executing b9d6d2fa4fc4b448
@clarity-chat/primitives:build: cache miss, executing 2827569dcb79c0df
@clarity-chat/error-handling:build: cache miss, executing 8955a4ce42c3df6b
@clarity-chat/cli:build: cache miss, executing b58e8304281cc999
@clarity-chat/licensing:build: cache miss, executing 6520a6bc7b418b50
@clarity-chat/codemods:build: 
@clarity-chat/codemods:build: > @clarity-chat/codemods@0.1.0 build
@clarity-chat/codemods:build: > tsc
@clarity-chat/codemods:build: 
@clarity-chat/types:build: 
@clarity-chat/types:build: > @clarity-chat/types@0.1.0 build
@clarity-chat/types:build: > tsup src/index.ts --format cjs,esm --dts
@clarity-chat/types:build: 
analytics-console-demo:build: 
analytics-console-demo:build: > analytics-console-demo@0.1.0 build
analytics-console-demo:build: > next build
analytics-console-demo:build: 
@clarity-chat/react:build: 
@clarity-chat/react:build: > @clarity-chat/react@0.1.0 build
@clarity-chat/react:build: > tsup
@clarity-chat/react:build: 
@clarity-chat/error-handling:build: 
@clarity-chat/error-handling:build: > @clarity-chat/error-handling@2.0.0 build
@clarity-chat/error-handling:build: > vite build && tsc --emitDeclarationOnly
@clarity-chat/error-handling:build: 
@clarity-chat/errors:build: 
@clarity-chat/errors:build: > @clarity-chat/errors@1.0.0 build
@clarity-chat/errors:build: > tsc
@clarity-chat/errors:build: 
@clarity-chat/licensing:build: 
@clarity-chat/licensing:build: > @clarity-chat/licensing@0.1.0 build
@clarity-chat/licensing:build: > tsup
@clarity-chat/licensing:build: 
@clarity-chat/primitives:build: 
@clarity-chat/primitives:build: > @clarity-chat/primitives@0.1.0 build
@clarity-chat/primitives:build: > tsup
@clarity-chat/primitives:build: 
@clarity-chat/cli:build: 
@clarity-chat/cli:build: > @clarity-chat/cli@0.1.0 build
@clarity-chat/cli:build: > tsup src/index.ts --format esm --dts --clean
@clarity-chat/cli:build: 
@clarity-chat/react:build: CLI Building entry: src/index.ts, src/styles/index.css
@clarity-chat/react:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/react:build: CLI tsup v8.5.0
@clarity-chat/react:build: CLI Using tsup config: /workspace/packages/react/tsup.config.ts
@clarity-chat/react:build: CLI Target: es2020
@clarity-chat/react:build: CLI Cleaning output folder
@clarity-chat/types:build: CLI Building entry: src/index.ts
@clarity-chat/types:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/types:build: CLI tsup v8.5.0
@clarity-chat/types:build: CLI Target: es2020
@clarity-chat/types:build: CJS Build start
@clarity-chat/types:build: ESM Build start
@clarity-chat/react:build: CJS Build start
@clarity-chat/react:build: ESM Build start
@clarity-chat/cli:build: CLI Building entry: src/index.ts
@clarity-chat/cli:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/types:build: ESM dist/index.mjs 0 B
@clarity-chat/types:build: ESM ⚡️ Build success in 53ms
@clarity-chat/cli:build: CLI tsup v8.5.0
@clarity-chat/cli:build: CLI Using tsup config: /workspace/packages/cli/tsup.config.ts
@clarity-chat/types:build: CJS dist/index.js 758.00 B
@clarity-chat/types:build: CJS ⚡️ Build success in 56ms
@clarity-chat/cli:build: CLI Target: es2022
@clarity-chat/cli:build: CLI Cleaning output folder
@clarity-chat/cli:build: ESM Build start
@clarity-chat/cli:build: ESM dist/index.js 69.26 KB
@clarity-chat/cli:build: ESM ⚡️ Build success in 43ms
@clarity-chat/licensing:build: CLI Building entry: src/index.ts
@clarity-chat/licensing:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/licensing:build: CLI tsup v8.5.0
@clarity-chat/licensing:build: CLI Using tsup config: /workspace/packages/licensing/tsup.config.ts
@clarity-chat/licensing:build: CLI Target: es2020
@clarity-chat/licensing:build: CLI Cleaning output folder
@clarity-chat/licensing:build: ESM Build start
@clarity-chat/licensing:build: CJS Build start
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "ClockIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:9:
@clarity-chat/react:build:       5 │ import { ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } fr...
@clarity-chat/react:build:         ╵          ~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "DollarSignIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:20:
@clarity-chat/react:build:       5 │ import { ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } fr...
@clarity-chat/react:build:         ╵                     ~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "TrendingUpIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:36:
@clarity-chat/react:build:       5 │ ...ockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } from './ic...
@clarity-chat/react:build:         ╵                             ~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "ShieldIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:52:
@clarity-chat/react:build:       5 │ ...ckIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } from './icons'
@clarity-chat/react:build:         ╵                                            ~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "FilterIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/advanced-message-search.tsx:13:21:
@clarity-chat/react:build:       13 │ import { SearchIcon, FilterIcon, XIcon } from './icons'
@clarity-chat/react:build:          ╵                      ~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "ClockIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:9:
@clarity-chat/react:build:       5 │ import { ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } fr...
@clarity-chat/react:build:         ╵          ~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "DollarSignIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:20:
@clarity-chat/react:build:       5 │ import { ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } fr...
@clarity-chat/react:build:         ╵                     ~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "TrendingUpIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:36:
@clarity-chat/react:build:       5 │ ...ockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } from './ic...
@clarity-chat/react:build:         ╵                             ~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "ShieldIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/message-metadata.tsx:5:52:
@clarity-chat/react:build:       5 │ ...ckIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon } from './icons'
@clarity-chat/react:build:         ╵                                            ~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] No matching export in "src/components/icons.tsx" for import "FilterIcon"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/components/advanced-message-search.tsx:13:21:
@clarity-chat/react:build:       13 │ import { SearchIcon, FilterIcon, XIcon } from './icons'
@clarity-chat/react:build:          ╵                      ~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: CJS Build failed
@clarity-chat/react:build: Error: Build failed with 5 errors:
@clarity-chat/react:build: src/components/advanced-message-search.tsx:13:21: ERROR: No matching export in "src/components/icons.tsx" for import "FilterIcon"
@clarity-chat/react:build: src/components/message-metadata.tsx:5:9: ERROR: No matching export in "src/components/icons.tsx" for import "ClockIcon"
@clarity-chat/react:build: src/components/message-metadata.tsx:5:20: ERROR: No matching export in "src/components/icons.tsx" for import "DollarSignIcon"
@clarity-chat/react:build: src/components/message-metadata.tsx:5:36: ERROR: No matching export in "src/components/icons.tsx" for import "TrendingUpIcon"
@clarity-chat/react:build: src/components/message-metadata.tsx:5:52: ERROR: No matching export in "src/components/icons.tsx" for import "ShieldIcon"
@clarity-chat/react:build:     at failureErrorWithLog (/workspace/node_modules/esbuild/lib/main.js:1467:15)
@clarity-chat/react:build:     at /workspace/node_modules/esbuild/lib/main.js:926:25
@clarity-chat/react:build:     at runOnEndCallbacks (/workspace/node_modules/esbuild/lib/main.js:1307:45)
@clarity-chat/react:build:     at buildResponseToResult (/workspace/node_modules/esbuild/lib/main.js:924:7)
@clarity-chat/react:build:     at /workspace/node_modules/esbuild/lib/main.js:951:16
@clarity-chat/react:build:     at responseCallbacks.<computed> (/workspace/node_modules/esbuild/lib/main.js:603:9)
@clarity-chat/react:build:     at handleIncomingPacket (/workspace/node_modules/esbuild/lib/main.js:658:12)
@clarity-chat/react:build:     at Socket.readFromStdout (/workspace/node_modules/esbuild/lib/main.js:581:7)
@clarity-chat/react:build:     at Socket.emit (node:events:519:28)
@clarity-chat/react:build:     at addChunk (node:internal/streams/readable:561:12)
@clarity-chat/react:build: ESM Build failed
@clarity-chat/react:build: npm error Lifecycle script `build` failed with error:
@clarity-chat/react:build: npm error code 1
@clarity-chat/react:build: npm error path /workspace/packages/react
@clarity-chat/react:build: npm error workspace @clarity-chat/react@0.1.0
@clarity-chat/react:build: npm error location /workspace/packages/react
@clarity-chat/react:build: npm error command failed
@clarity-chat/react:build: npm error command sh -c tsup
@clarity-chat/react:build: ERROR: command finished with error: command (/workspace/packages/react) /home/ubuntu/.nvm/versions/node/v22.21.1/bin/npm run build exited (1)
@clarity-chat/react#build: command (/workspace/packages/react) /home/ubuntu/.nvm/versions/node/v22.21.1/bin/npm run build exited (1)

 Tasks:    0 successful, 9 total
Cached:    0 cached, 9 total
  Time:    2.524s 
Failed:    @clarity-chat/react#build

 ERROR  run failed: command  exited (1)
