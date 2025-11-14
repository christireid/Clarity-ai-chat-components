# Setup Verification

Quick checks to ensure everything is working correctly.

## ✅ Quick Verification

Run this in your browser console or a test file:

```tsx
import { 
  getModelProfile, 
  estimateMessageArrayTokens,
  MODEL_PROFILES 
} from '@clarity-chat/react/prompt'

// Test 1: Model profiles work
const model = getModelProfile('gpt-4')
console.assert(model !== undefined, 'Model profile should exist')
console.assert(model.name === 'GPT-4', 'Model name should match')
console.log('✅ Model profiles working')

// Test 2: Token estimation works
const tokens = estimateMessageArrayTokens([
  { role: 'user', content: 'Hello!' }
], { model: 'gpt-4' })
console.assert(typeof tokens === 'number', 'Tokens should be a number')
console.assert(tokens > 0, 'Tokens should be positive')
console.log('✅ Token estimation working')

// Test 3: Available models
const modelCount = Object.keys(MODEL_PROFILES).length
console.assert(modelCount > 10, 'Should have many models')
console.log(`✅ ${modelCount} models available`)
```

## ✅ Import Verification

Test that all imports work:

```tsx
// Core utilities
import {
  createPromptRecipe,
  estimatePromptTokens,
  optimizeMessagesForBudget,
  getModelProfile,
  MODEL_PROFILES,
} from '@clarity-chat/react/prompt'

// React hooks
import {
  usePromptRecipe,
  useTokenBudget,
  useOptimizedChatContext,
  usePromptInspector,
  usePromptOptimizer,
  useDynamicModelRouting,
  usePromptDebugger,
} from '@clarity-chat/react/prompt'

// Advanced features
import {
  prioritizeContext,
  compressContext,
  chooseOptimizationStrategy,
  optimizePrompt,
} from '@clarity-chat/react/prompt'

console.log('✅ All imports working')
```

## ✅ Hook Verification

Test that hooks work:

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react/prompt'

function TestComponent() {
  const { optimizedMessages, tokenStats } = usePromptOptimizer({
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
    model: getModelProfile('gpt-4'),
    targetTokens: 1000,
    autoOptimize: true,
  })

  console.assert(optimizedMessages.length > 0, 'Should have messages')
  console.assert(tokenStats.currentTokens >= 0, 'Should have token stats')
  console.log('✅ Hooks working')
  
  return null
}
```

## ✅ Integration Verification

Test with useClarityChat:

```tsx
import { useClarityChat } from '@clarity-chat/react'

function TestChat() {
  const { messages, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
    },
  })

  console.assert(messages !== undefined, 'Should have messages')
  console.assert(tokenStats !== undefined, 'Should have token stats')
  console.log('✅ Integration working')
  
  return null
}
```

## ❌ Common Issues

### Issue: "Cannot find module '@clarity-chat/react/prompt'"

**Check:**
1. Is `@clarity-chat/react` installed? Run: `npm list @clarity-chat/react`
2. Are you using the correct import path? Should be `@clarity-chat/react/prompt`
3. Is the package built? Run: `npm run build` in the react package

**Fix:**
```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
```

### Issue: "getModelProfile is not a function"

**Check:**
1. Are you importing from the correct path?
2. Is the module exported correctly?

**Fix:**
```tsx
// ✅ Correct
import { getModelProfile } from '@clarity-chat/react/prompt'

// ❌ Wrong
import { getModelProfile } from '@clarity-chat/react'
```

### Issue: "Type errors"

**Check:**
1. Are TypeScript types installed?
2. Is your TypeScript version compatible? (Should be 5.0+)

**Fix:**
```bash
npm install --save-dev typescript@^5.0.0
```

### Issue: "Optimization not working"

**Check:**
1. Is `enabled: true` set?
2. Is `targetTokens` set?
3. Are messages exceeding the budget?

**Fix:**
```tsx
promptOptimization: {
  enabled: true,  // ✅ Must be true
  targetTokens: 4000,  // ✅ Set a budget
}
```

## ✅ Full Test Suite

Run this complete test:

```tsx
import {
  getModelProfile,
  estimateMessageArrayTokens,
  createPromptRecipe,
  usePromptOptimizer,
  MODEL_PROFILES,
} from '@clarity-chat/react/prompt'

async function runTests() {
  console.log('🧪 Running verification tests...\n')

  // Test 1: Model profiles
  try {
    const model = getModelProfile('gpt-4')
    console.assert(model !== undefined, 'Model should exist')
    console.log('✅ Test 1: Model profiles')
  } catch (e) {
    console.error('❌ Test 1 failed:', e)
  }

  // Test 2: Token estimation
  try {
    const tokens = estimateMessageArrayTokens([
      { role: 'user', content: 'Hello!' }
    ], { model: 'gpt-4' })
    console.assert(tokens > 0, 'Tokens should be positive')
    console.log('✅ Test 2: Token estimation')
  } catch (e) {
    console.error('❌ Test 2 failed:', e)
  }

  // Test 3: Prompt recipes
  try {
    const recipe = createPromptRecipe({
      id: 'test',
      name: 'Test',
      system: 'You are helpful.',
      user: '{{message}}',
    })
    const prompt = recipe.build({ message: 'Hello' })
    console.assert(prompt.messages.length > 0, 'Should have messages')
    console.log('✅ Test 3: Prompt recipes')
  } catch (e) {
    console.error('❌ Test 3 failed:', e)
  }

  // Test 4: Available models
  try {
    const count = Object.keys(MODEL_PROFILES).length
    console.assert(count > 10, 'Should have many models')
    console.log(`✅ Test 4: ${count} models available`)
  } catch (e) {
    console.error('❌ Test 4 failed:', e)
  }

  console.log('\n✨ All tests passed!')
}

runTests()
```

## 🎯 Success Criteria

You're all set if:
- ✅ All imports work without errors
- ✅ Model profiles load correctly
- ✅ Token estimation returns numbers
- ✅ Hooks work in React components
- ✅ useClarityChat integration works
- ✅ No TypeScript errors

## Next Steps

Once verified:
1. ✅ Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. ✅ Try [COPY_PASTE_EXAMPLES.md](./COPY_PASTE_EXAMPLES.md)
3. ✅ Check [examples/](./examples/)

Happy coding! 🚀
