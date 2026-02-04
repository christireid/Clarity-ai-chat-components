/**
 * Test bundle WITHOUT tokenizers
 * Should be small - only estimation functions
 */
import { estimateTokens } from '@clarity-chat/token-optimization'

// Use the function to prevent tree-shaking
const result = estimateTokens('Hello world')
console.log(result)
