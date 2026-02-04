/**
 * Test bundle WITH tokenizers
 * Should be large - includes gpt-tokenizer dependency
 */
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'

// Use the function to prevent tree-shaking
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
const result = counter.count('Hello world')
console.log(result)
