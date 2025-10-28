/**
 * MCP Prompts for Clarity Chat
 * 
 * Prompt templates that AI agents can use for common tasks
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js'

/**
 * Available prompts
 */
export const prompts: Prompt[] = [
  {
    name: 'implement-feature',
    description: 'Generate implementation plan for a new feature',
    arguments: [
      {
        name: 'feature',
        description: 'Description of the feature to implement',
        required: true
      },
      {
        name: 'provider',
        description: 'AI provider to use (openai, anthropic, google)',
        required: false
      }
    ]
  },
  {
    name: 'debug-issue',
    description: 'Analyze and suggest fixes for an issue',
    arguments: [
      {
        name: 'issue',
        description: 'Description of the issue',
        required: true
      },
      {
        name: 'code',
        description: 'Relevant code snippet',
        required: false
      }
    ]
  },
  {
    name: 'optimize-performance',
    description: 'Suggest performance optimizations',
    arguments: [
      {
        name: 'context',
        description: 'Context about current implementation',
        required: true
      }
    ]
  },
  {
    name: 'review-code',
    description: 'Perform code review and suggest improvements',
    arguments: [
      {
        name: 'code',
        description: 'Code to review',
        required: true
      },
      {
        name: 'focus',
        description: 'Specific aspect to focus on (security, performance, readability)',
        required: false
      }
    ]
  },
  {
    name: 'convert-example',
    description: 'Convert code example to different provider or framework',
    arguments: [
      {
        name: 'code',
        description: 'Original code to convert',
        required: true
      },
      {
        name: 'from',
        description: 'Source provider/framework',
        required: true
      },
      {
        name: 'to',
        description: 'Target provider/framework',
        required: true
      }
    ]
  }
]

/**
 * Handle prompt generation
 */
export async function handlePromptGet(name: string, args: Record<string, string>): Promise<string> {
  switch (name) {
    case 'implement-feature':
      return generateImplementFeaturePrompt(args.feature, args.provider)
    
    case 'debug-issue':
      return generateDebugIssuePrompt(args.issue, args.code)
    
    case 'optimize-performance':
      return generateOptimizePerformancePrompt(args.context)
    
    case 'review-code':
      return generateReviewCodePrompt(args.code, args.focus)
    
    case 'convert-example':
      return generateConvertExamplePrompt(args.code, args.from, args.to)
    
    default:
      throw new Error(`Unknown prompt: ${name}`)
  }
}

/**
 * Implement Feature Prompt
 */
function generateImplementFeaturePrompt(feature: string, provider?: string): string {
  const providerContext = provider ? ` using ${provider.toUpperCase()}` : ''
  
  return `You are an expert developer working with the Clarity Chat framework. I need help implementing a new feature${providerContext}.

Feature Description:
${feature}

Please provide:

1. **Implementation Plan**:
   - Break down the feature into logical steps
   - Identify which components need to be created or modified
   - Specify required dependencies

2. **Code Structure**:
   - Recommended file organization
   - Key functions/components to implement
   - Data models or interfaces needed

3. **Example Implementation**:
   - Complete, production-ready code
   - Error handling
   - TypeScript types
   - Comments explaining key decisions

4. **Testing Strategy**:
   - What to test
   - Example test cases
   - Edge cases to consider

5. **Best Practices**:
   - Clarity Chat conventions to follow
   - Performance considerations
   - Security considerations

Please provide clear, detailed guidance that follows Clarity Chat patterns and best practices.`
}

/**
 * Debug Issue Prompt
 */
function generateDebugIssuePrompt(issue: string, code?: string): string {
  const codeContext = code ? `\n\nRelevant Code:\n\`\`\`typescript\n${code}\n\`\`\`` : ''
  
  return `You are a debugging expert familiar with the Clarity Chat framework. I'm encountering an issue that needs troubleshooting.

Issue Description:
${issue}${codeContext}

Please help by providing:

1. **Root Cause Analysis**:
   - What is likely causing this issue?
   - Why is it happening?
   - Common scenarios where this occurs

2. **Diagnosis Steps**:
   - How to confirm the root cause
   - What to check or log
   - Debugging techniques to use

3. **Solution**:
   - Step-by-step fix instructions
   - Code changes needed (if applicable)
   - Configuration changes needed (if applicable)

4. **Prevention**:
   - How to prevent this issue in the future
   - Best practices to follow
   - Patterns to avoid

5. **Additional Resources**:
   - Related documentation
   - Similar issues and solutions
   - Helpful tools or libraries

Please provide clear, actionable guidance with code examples where appropriate.`
}

/**
 * Optimize Performance Prompt
 */
function generateOptimizePerformancePrompt(context: string): string {
  return `You are a performance optimization expert working with AI applications and the Clarity Chat framework.

Current Implementation:
${context}

Please analyze and suggest optimizations in these areas:

1. **Token Usage Optimization**:
   - Reduce unnecessary tokens in prompts
   - Optimize context management
   - Implement caching strategies

2. **Response Time Optimization**:
   - Streaming vs non-streaming trade-offs
   - Parallel request patterns
   - Request batching opportunities

3. **Cost Optimization**:
   - Model selection recommendations
   - When to use cheaper models
   - Cost-benefit analysis

4. **Code Performance**:
   - Async/await patterns
   - Memory usage optimization
   - Database query optimization (if applicable)

5. **Architecture Improvements**:
   - Caching layers
   - Rate limiting strategies
   - Error retry logic

For each optimization:
- Explain the current bottleneck
- Provide specific code changes
- Estimate the performance impact
- Note any trade-offs

Please provide production-ready solutions with code examples.`
}

/**
 * Review Code Prompt
 */
function generateReviewCodePrompt(code: string, focus?: string): string {
  const focusArea = focus ? `\n\nPlease focus especially on: ${focus}` : ''
  
  return `You are a code review expert familiar with the Clarity Chat framework and AI development best practices.

Code to Review:
\`\`\`typescript
${code}
\`\`\`${focusArea}

Please provide a comprehensive code review covering:

1. **Correctness**:
   - Are there any bugs or logic errors?
   - Does the code handle edge cases?
   - Are error conditions properly handled?

2. **Security**:
   - Are API keys properly secured?
   - Is user input validated?
   - Are there any security vulnerabilities?

3. **Performance**:
   - Are there performance bottlenecks?
   - Is async/await used correctly?
   - Are resources properly managed?

4. **Best Practices**:
   - Does it follow Clarity Chat patterns?
   - Is error handling comprehensive?
   - Are types properly defined?

5. **Readability**:
   - Is the code well-organized?
   - Are variable/function names clear?
   - Is there sufficient documentation?

6. **Suggested Improvements**:
   - Specific code changes to make
   - Alternative approaches to consider
   - Additional features to add

For each issue found:
- Explain the problem
- Show the current code
- Provide corrected code
- Explain why the change improves the code

Please be thorough but constructive in your feedback.`
}

/**
 * Convert Example Prompt
 */
function generateConvertExamplePrompt(code: string, from: string, to: string): string {
  return `You are an expert in AI frameworks and the Clarity Chat ecosystem. I need help converting code from one provider/framework to another.

Original Code (${from}):
\`\`\`typescript
${code}
\`\`\`

Target: ${to}

Please provide:

1. **Converted Code**:
   - Complete, working implementation for ${to}
   - Maintain the same functionality
   - Follow ${to} best practices and patterns

2. **Key Differences**:
   - API differences between ${from} and ${to}
   - Pattern/structure changes
   - Configuration changes

3. **Setup Requirements**:
   - Required dependencies for ${to}
   - Environment variables needed
   - Configuration files to create/modify

4. **Migration Notes**:
   - Breaking changes to be aware of
   - Behavioral differences
   - Performance considerations

5. **Testing Recommendations**:
   - What to test after conversion
   - Expected behavior differences
   - Edge cases specific to ${to}

Please ensure the converted code is:
- Production-ready
- Well-documented
- Follows Clarity Chat conventions
- Includes proper error handling
- Uses TypeScript types correctly`
}
