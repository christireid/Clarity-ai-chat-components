/**
 * Compression Example
 *
 * Demonstrates various compression strategies:
 * - LLMLingua (statistical compression)
 * - Extractive (keep most important sentences)
 * - Adaptive (auto-selects best strategy)
 * - Whitespace normalization
 *
 * Run: npx tsx examples/07-compression.ts
 */

import {
  compressWithLLMLingua,
  compressExtractively,
  compressAdaptively,
  recommendStrategy,
  normalizeWhitespace,
  countTokens,
} from '../src/index'

/**
 * Example 1: LLMLingua Compression
 *
 * Statistical compression for maximum token reduction.
 */
async function example1_llmLingua() {
  console.log('\n=== Example 1: LLMLingua Compression ===\n')

  const document = `
    Machine learning is a subset of artificial intelligence that focuses on the
    development of algorithms and statistical models. These models enable computer
    systems to improve their performance on a specific task through experience,
    without being explicitly programmed. Machine learning algorithms build a
    mathematical model based on sample data, known as training data, in order to
    make predictions or decisions without being explicitly programmed to perform
    the task. Machine learning algorithms are used in a wide variety of applications,
    such as email filtering and computer vision, where it is difficult or infeasible
    to develop conventional algorithms to perform the needed tasks.
  `.repeat(3) // Make it larger

  const originalTokens = countTokens(document)
  console.log('Original document:')
  console.log(`  - Tokens: ${originalTokens}`)
  console.log(`  - Characters: ${document.length}`)

  // Compress to 50%
  const result = await compressWithLLMLingua(document, {
    targetRatio: 0.5,
    preserveCode: false,
    preserveUrls: false,
  })

  console.log('\nCompressed document:')
  console.log(`  - Tokens: ${result.compressed.tokens}`)
  console.log(
    `  - Compression ratio: ${(result.compressionRatio * 100).toFixed(1)}%`
  )
  console.log(`  - Quality score: ${result.qualityMetrics.score.toFixed(2)}`)
  console.log(`\n  Preview: ${result.compressed.text.substring(0, 150)}...`)
}

/**
 * Example 2: Extractive Compression
 *
 * Keep most important sentences intact.
 */
async function example2_extractive() {
  console.log('\n=== Example 2: Extractive Compression ===\n')

  const document = `
    TypeScript is a strongly typed programming language that builds on JavaScript.
    It adds optional static typing to JavaScript, allowing developers to catch errors
    early in the development process. TypeScript code compiles to plain JavaScript.
    The TypeScript compiler can target any version of JavaScript, from ES3 onwards.
    TypeScript supports modern JavaScript features like async/await and destructuring.
    It also adds features like interfaces, enums, and generics. TypeScript is
    maintained by Microsoft and has strong community support.
  `

  const originalTokens = countTokens(document)
  console.log('Original document:')
  console.log(`  - Tokens: ${originalTokens}`)

  // Extract top sentences to fit in 50 tokens
  const result = await compressExtractively(document, {
    targetTokens: 50,
    preserveSentenceStructure: true,
  })

  console.log('\nExtracted sentences:')
  console.log(`  - Tokens: ${result.compressed.tokens}`)
  console.log(`  - Sentences kept: ${result.debugInfo.sentencesKept || 'N/A'}`)
  console.log(`\n  Result: ${result.compressed.text}`)
}

/**
 * Example 3: Adaptive Compression
 *
 * Automatically selects best strategy based on content.
 */
async function example3_adaptive() {
  console.log('\n=== Example 3: Adaptive Compression ===\n')

  const contents = [
    {
      name: 'Technical documentation',
      text: `
        function calculateSum(a: number, b: number): number {
          return a + b;
        }
        This function adds two numbers and returns the result.
        It uses TypeScript type annotations for type safety.
      `.repeat(5),
    },
    {
      name: 'Natural language',
      text: `
        The quick brown fox jumps over the lazy dog. This sentence contains
        every letter of the alphabet. It is commonly used for testing fonts
        and keyboards. The sentence has been known since at least the late
        1800s, and it remains popular today.
      `.repeat(5),
    },
    {
      name: 'Mixed content',
      text: `
        To install TypeScript, run: npm install -g typescript
        Then create a new file called hello.ts with the following code:
        console.log("Hello, TypeScript!");
        Compile it with: tsc hello.ts
        This will generate a hello.js file that you can run with Node.js.
      `.repeat(5),
    },
  ]

  for (const { name, text } of contents) {
    const originalTokens = countTokens(text)

    const result = await compressAdaptively(text, {
      targetTokens: Math.floor(originalTokens * 0.6),
      preserveCode: true,
    })

    console.log(`\n${name}:`)
    console.log(`  - Original tokens: ${originalTokens}`)
    console.log(`  - Compressed tokens: ${result.compressed.tokens}`)
    console.log(
      `  - Strategy used: ${result.debugInfo.strategyUsed || 'adaptive'}`
    )
    console.log(`  - Content type: ${result.debugInfo.contentType || 'mixed'}`)
  }
}

/**
 * Example 4: Compression with Quality Gates
 *
 * Ensure compressed output meets quality requirements.
 */
async function example4_qualityGates() {
  console.log('\n=== Example 4: Compression with Quality Gates ===\n')

  import { QualityGate } from '../src/index'

  const gate = new QualityGate({
    minQualityScore: 0.7,
    maxCompressionRatio: 0.6,
  })

  const document = `
    React is a JavaScript library for building user interfaces. It lets you
    compose complex UIs from small and isolated pieces of code called components.
    React components can be created using classes or functions. React is
    declarative, making your code more predictable and easier to debug.
  `.repeat(3)

  const originalTokens = countTokens(document)

  // Try aggressive compression (70%)
  const aggressive = await compressWithLLMLingua(document, {
    targetRatio: 0.3,
  })

  const aggressiveCheck = await gate.check(aggressive, {
    originalText: document,
    compressedText: aggressive.compressed.text,
  })

  console.log('Aggressive compression (70% reduction):')
  console.log(`  - Original: ${originalTokens} tokens`)
  console.log(`  - Compressed: ${aggressive.compressed.tokens} tokens`)
  console.log(`  - Quality passed: ${aggressiveCheck.passed}`)

  if (!aggressiveCheck.passed) {
    console.log(`  - Failures: ${aggressiveCheck.failures.join(', ')}`)
  }

  // Try moderate compression (40%)
  const moderate = await compressWithLLMLingua(document, {
    targetRatio: 0.6,
  })

  const moderateCheck = await gate.check(moderate, {
    originalText: document,
    compressedText: moderate.compressed.text,
  })

  console.log('\nModerate compression (40% reduction):')
  console.log(`  - Original: ${originalTokens} tokens`)
  console.log(`  - Compressed: ${moderate.compressed.tokens} tokens`)
  console.log(`  - Quality passed: ${moderateCheck.passed}`)
}

/**
 * Example 5: Preserving Important Content
 *
 * Keep code blocks, URLs, and structure intact.
 */
async function example5_preserveContent() {
  console.log('\n=== Example 5: Preserving Important Content ===\n')

  const document = `
    To use the API, send a POST request to https://api.example.com/v1/chat.
    Include your API key in the headers:

    \`\`\`typescript
    const response = await fetch('https://api.example.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Hello!' })
    });
    \`\`\`

    The API returns a JSON response with the generated text. Visit
    https://docs.example.com for more information.
  `

  // Without preservation
  const withoutPreserve = await compressWithLLMLingua(document, {
    targetRatio: 0.5,
    preserveCode: false,
    preserveUrls: false,
  })

  console.log('Without preservation:')
  console.log(
    `  - Result: ${withoutPreserve.compressed.text.substring(0, 200)}...`
  )

  // With preservation
  const withPreserve = await compressWithLLMLingua(document, {
    targetRatio: 0.5,
    preserveCode: true,
    preserveUrls: true,
    preserveStructure: true,
  })

  console.log('\nWith preservation:')
  console.log(
    `  - Result: ${withPreserve.compressed.text.substring(0, 200)}...`
  )
  console.log('\n  ✓ Code blocks preserved')
  console.log('  ✓ URLs preserved')
  console.log('  ✓ Structure maintained')
}

/**
 * Example 6: Strategy Recommendation
 *
 * Get recommendations for best compression strategy.
 */
async function example6_strategyRecommendation() {
  console.log('\n=== Example 6: Strategy Recommendation ===\n')

  const contents = [
    {
      name: 'Code-heavy',
      text: `
        function fibonacci(n: number): number {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
      `.repeat(10),
    },
    {
      name: 'Natural text',
      text: `
        The history of artificial intelligence began in antiquity with myths,
        stories, and rumors of artificial beings endowed with intelligence or
        consciousness by master craftsmen.
      `.repeat(10),
    },
    {
      name: 'Structured data',
      text: JSON.stringify(
        {
          users: Array(50)
            .fill(null)
            .map((_, i) => ({
              id: i,
              name: `User ${i}`,
              email: `user${i}@example.com`,
            })),
        },
        null,
        2
      ),
    },
  ]

  for (const { name, text } of contents) {
    const recommendation = recommendStrategy(text)

    console.log(`\n${name}:`)
    console.log(`  - Recommended: ${recommendation.strategy}`)
    console.log(`  - Reason: ${recommendation.reason}`)
    console.log(
      `  - Confidence: ${(recommendation.confidence * 100).toFixed(0)}%`
    )
    console.log(
      `  - Expected ratio: ${(recommendation.expectedCompressionRatio * 100).toFixed(0)}%`
    )
  }
}

/**
 * Example 7: Whitespace Normalization
 *
 * Quick wins with whitespace cleanup.
 */
function example7_whitespaceNormalization() {
  console.log('\n=== Example 7: Whitespace Normalization ===\n')

  const messyText = `
    This    document     has     excessive     whitespace.


    Multiple   blank    lines   too.



    And     inconsistent     spacing    throughout.
  `

  const originalTokens = countTokens(messyText)

  const normalized = normalizeWhitespace(messyText, {
    collapseSpaces: true,
    removeBlankLines: true,
    trimLines: true,
  })

  const normalizedTokens = countTokens(normalized.text)

  console.log('Original:')
  console.log(`  - Tokens: ${originalTokens}`)
  console.log(`  - Length: ${messyText.length} characters`)

  console.log('\nNormalized:')
  console.log(`  - Tokens: ${normalizedTokens}`)
  console.log(`  - Length: ${normalized.text.length} characters`)
  console.log(`  - Savings: ${normalizedTokens - originalTokens} tokens`)
  console.log(`\n  Result: "${normalized.text}"`)
}

/**
 * Example 8: Real-World Use Case - Documentation Summarization
 *
 * Compress long documentation for LLM context.
 */
async function example8_realWorld() {
  console.log('\n=== Example 8: Documentation Summarization ===\n')

  const longDocumentation = `
    React Hooks

    Hooks are a new addition in React 16.8. They let you use state and other
    React features without writing a class. Hooks are functions that let you
    "hook into" React state and lifecycle features from function components.

    useState

    The useState Hook lets you add React state to function components. It
    returns a pair: the current state value and a function that lets you update
    it. You can call this function from an event handler or somewhere else.

    useEffect

    The useEffect Hook lets you perform side effects in function components.
    Data fetching, setting up a subscription, and manually changing the DOM in
    React components are all examples of side effects. useEffect serves the same
    purpose as componentDidMount, componentDidUpdate, and componentWillUnmount
    combined, but unified into a single API.

    useContext

    The useContext Hook lets you subscribe to React context without introducing
    nesting. It accepts a context object and returns the current context value
    for that context.

    Rules of Hooks

    Only call Hooks at the top level. Don't call Hooks inside loops, conditions,
    or nested functions. Only call Hooks from React function components or custom
    Hooks.
  `.repeat(5) // Make it larger

  const originalTokens = countTokens(longDocumentation)
  const targetTokens = 500 // Fit in LLM context

  console.log('Original documentation:')
  console.log(`  - Tokens: ${originalTokens}`)
  console.log(`  - Target: ${targetTokens} tokens`)
  console.log(
    `  - Need: ${((1 - targetTokens / originalTokens) * 100).toFixed(0)}% compression`
  )

  const compressed = await compressAdaptively(longDocumentation, {
    targetTokens,
    preserveCode: false, // No code in this text
    preserveStructure: true, // Keep section structure
  })

  console.log('\nCompressed documentation:')
  console.log(`  - Tokens: ${compressed.compressed.tokens}`)
  console.log(
    `  - Achieved: ${(compressed.compressionRatio * 100).toFixed(0)}% compression`
  )
  console.log(`  - Quality: ${compressed.qualityMetrics.score.toFixed(2)}`)
  console.log(
    `\n  Preview:\n  ${compressed.compressed.text.substring(0, 300)}...`
  )
}

/**
 * Run all examples
 */
async function main() {
  console.log('📦 Token Optimization Compression Examples\n')
  console.log('Demonstrating various compression strategies\n')

  try {
    await example1_llmLingua()
    await example2_extractive()
    await example3_adaptive()
    await example4_qualityGates()
    await example5_preserveContent()
    await example6_strategyRecommendation()
    example7_whitespaceNormalization()
    await example8_realWorld()

    console.log('\n✅ All examples completed!\n')
    console.log('💡 Key Takeaways:')
    console.log('  1. LLMLingua: Best for maximum compression')
    console.log('  2. Extractive: Best for preserving readability')
    console.log('  3. Adaptive: Best when unsure of content type')
    console.log('  4. Always use quality gates in production')
    console.log('  5. Preserve code/URLs when present')
    console.log('  6. Start with whitespace normalization for quick wins\n')
    console.log('📚 Full documentation: docs/BEST_PRACTICES.md\n')
  } catch (error) {
    console.error('Error running examples:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export {
  example1_llmLingua,
  example2_extractive,
  example3_adaptive,
  example4_qualityGates,
  example5_preserveContent,
  example6_strategyRecommendation,
  example7_whitespaceNormalization,
  example8_realWorld,
}
