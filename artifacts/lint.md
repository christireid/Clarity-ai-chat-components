
> clarity-chat@0.1.0 lint
> npx turbo run lint


Attention:
Turborepo now collects completely anonymous telemetry regarding usage.
This information is used to shape the Turborepo roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://turborepo.com/docs/telemetry

turbo 2.5.8

• Packages in scope: @clarity-chat/ai-research-platform, @clarity-chat/ai-sales-copilot, @clarity-chat/cli, @clarity-chat/codemods, @clarity-chat/conversational-analytics, @clarity-chat/dev-tools, @clarity-chat/devops-command-center, @clarity-chat/docs, @clarity-chat/docs-site, @clarity-chat/enterprise-ai-ops, @clarity-chat/enterprise-knowledge-hub, @clarity-chat/error-handling, @clarity-chat/errors, @clarity-chat/licensing, @clarity-chat/marketing-site, @clarity-chat/playground, @clarity-chat/primitives, @clarity-chat/react, @clarity-chat/storybook, @clarity-chat/token-optimization-demo, @clarity-chat/types, ai-assistant-demo, analytics-console-demo, basic-chat-demo, clarity-chat-showcase, code-assistant-demo, customer-support-demo, ecommerce-assistant-demo, model-comparison-demo, multi-user-chat-demo, rag-workbench-demo, streaming-chat-demo, vercel-ai-sdk-compatible-demo
• Running lint in 33 packages
• Remote caching disabled
@clarity-chat/react:build: cache miss, executing 7a24bebb6cf2a7d0
@clarity-chat/react:lint: cache miss, executing 80c8fbfeeada5a46
@clarity-chat/types:build: cache miss, executing b9d6d2fa4fc4b448
@clarity-chat/primitives:build: cache miss, executing 2827569dcb79c0df
@clarity-chat/licensing:lint: cache miss, executing 89979881c5d304bb
@clarity-chat/error-handling:lint: cache miss, executing b9b4e23708f350ef
@clarity-chat/errors:build: cache miss, executing 296d267535fd0ccf
analytics-console-demo:lint: cache miss, executing ebc7a468d30a59ef
@clarity-chat/primitives:lint: cache miss, executing d0a4c557bea92611
@clarity-chat/react:lint: 
@clarity-chat/react:lint: > @clarity-chat/react@0.1.0 lint
@clarity-chat/react:lint: > eslint src --ext ts,tsx
@clarity-chat/react:lint: 
@clarity-chat/types:build: 
@clarity-chat/types:build: > @clarity-chat/types@0.1.0 build
@clarity-chat/types:build: > tsup src/index.ts --format cjs,esm --dts
@clarity-chat/types:build: 
@clarity-chat/primitives:lint: 
@clarity-chat/primitives:lint: > @clarity-chat/primitives@0.1.0 lint
@clarity-chat/primitives:lint: > eslint src --ext ts,tsx
@clarity-chat/primitives:lint: 
@clarity-chat/react:build: 
@clarity-chat/react:build: > @clarity-chat/react@0.1.0 build
@clarity-chat/react:build: > tsup
@clarity-chat/react:build: 
analytics-console-demo:lint: 
analytics-console-demo:lint: > analytics-console-demo@0.1.0 lint
analytics-console-demo:lint: > next lint
analytics-console-demo:lint: 
@clarity-chat/errors:build: 
@clarity-chat/errors:build: > @clarity-chat/errors@1.0.0 build
@clarity-chat/errors:build: > tsc
@clarity-chat/errors:build: 
@clarity-chat/licensing:lint: 
@clarity-chat/licensing:lint: > @clarity-chat/licensing@0.1.0 lint
@clarity-chat/licensing:lint: > eslint src --ext ts
@clarity-chat/licensing:lint: 
@clarity-chat/primitives:build: 
@clarity-chat/primitives:build: > @clarity-chat/primitives@0.1.0 build
@clarity-chat/primitives:build: > tsup
@clarity-chat/primitives:build: 
@clarity-chat/error-handling:lint: 
@clarity-chat/error-handling:lint: > @clarity-chat/error-handling@2.0.0 lint
@clarity-chat/error-handling:lint: > eslint .
@clarity-chat/error-handling:lint: 
@clarity-chat/types:build: CLI Building entry: src/index.ts
@clarity-chat/types:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/types:build: CLI tsup v8.5.0
@clarity-chat/types:build: CLI Target: es2020
@clarity-chat/types:build: CJS Build start
@clarity-chat/types:build: ESM Build start
@clarity-chat/types:build: ESM dist/index.mjs 0 B
@clarity-chat/types:build: ESM ⚡️ Build success in 80ms
@clarity-chat/types:build: CJS dist/index.js 758.00 B
@clarity-chat/types:build: CJS ⚡️ Build success in 82ms
analytics-console-demo:lint: (node:3078) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///workspace/examples/analytics-console-demo/next.config.js is not specified and it doesn't parse as CommonJS.
analytics-console-demo:lint: Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
analytics-console-demo:lint: To eliminate this warning, add "type": "module" to /workspace/examples/analytics-console-demo/package.json.
analytics-console-demo:lint: (Use `node --trace-warnings ...` to show where the warning was created)
@clarity-chat/primitives:build: CLI Building entry: src/index.ts
@clarity-chat/primitives:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/primitives:build: CLI tsup v8.5.0
@clarity-chat/primitives:build: CLI Using tsup config: /workspace/packages/primitives/tsup.config.ts
@clarity-chat/primitives:build: CLI Target: es2020
@clarity-chat/primitives:build: CLI Cleaning output folder
@clarity-chat/primitives:build: CJS Build start
@clarity-chat/primitives:build: ESM Build start
@clarity-chat/react:build: CLI Building entry: src/index.ts, src/styles/index.css
@clarity-chat/react:build: CLI Using tsconfig: tsconfig.json
@clarity-chat/react:build: CLI tsup v8.5.0
@clarity-chat/react:build: CLI Using tsup config: /workspace/packages/react/tsup.config.ts
@clarity-chat/react:build: CLI Target: es2020
@clarity-chat/react:build: CLI Cleaning output folder
@clarity-chat/react:build: CJS Build start
@clarity-chat/react:build: ESM Build start
@clarity-chat/react:build: ✘ [ERROR] Unexpected "catch"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/hooks/use-chat-enhanced.ts:467:10:
@clarity-chat/react:build:       467 │         } catch (err) {
@clarity-chat/react:build:           ╵           ~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] Unexpected "catch"
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/hooks/use-chat-enhanced.ts:467:10:
@clarity-chat/react:build:       467 │         } catch (err) {
@clarity-chat/react:build:           ╵           ~~~~~
@clarity-chat/react:build: 
@clarity-chat/types:build: DTS Build start
@clarity-chat/react:build: ✘ [ERROR] Cannot assign to "remainingBudget" because it is a constant
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/utils/memory/token-optimized-context.ts:177:8:
@clarity-chat/react:build:       177 │         remainingBudget -= msgTokens
@clarity-chat/react:build:           ╵         ~~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build:   The symbol "remainingBudget" was declared a constant here:
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/utils/memory/token-optimized-context.ts:168:10:
@clarity-chat/react:build:       168 │     const remainingBudget = budget - essentialTokens
@clarity-chat/react:build:           ╵           ~~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ✘ [ERROR] Cannot assign to "remainingBudget" because it is a constant
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/utils/memory/token-optimized-context.ts:177:8:
@clarity-chat/react:build:       177 │         remainingBudget -= msgTokens
@clarity-chat/react:build:           ╵         ~~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build:   The symbol "remainingBudget" was declared a constant here:
@clarity-chat/react:build: 
@clarity-chat/react:build:     src/utils/memory/token-optimized-context.ts:168:10:
@clarity-chat/react:build:       168 │     const remainingBudget = budget - essentialTokens
@clarity-chat/react:build:           ╵           ~~~~~~~~~~~~~~~
@clarity-chat/react:build: 
@clarity-chat/react:build: ESM Build failed
@clarity-chat/react:build: Error: Build failed with 2 errors:
@clarity-chat/react:build: src/hooks/use-chat-enhanced.ts:467:10: ERROR: Unexpected "catch"
@clarity-chat/react:build: src/utils/memory/token-optimized-context.ts:177:8: ERROR: Cannot assign to "remainingBudget" because it is a constant
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
@clarity-chat/react:build: CJS Build failed
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
  Time:    2.051s 
Failed:    @clarity-chat/react#build

 ERROR  run failed: command  exited (1)
