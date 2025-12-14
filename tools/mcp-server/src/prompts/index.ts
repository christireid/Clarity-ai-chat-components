/**
 * MCP Prompts for Clarity Chat
 *
 * Prompt templates that AI agents can use for common tasks
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js'
import { logger } from '../utils/logger.js'
import { NotFoundError } from '../utils/errors.js'
import { validateRequired, validateString } from '../utils/validation.js'

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
        required: true,
      },
      {
        name: 'provider',
        description: 'AI provider to use (openai, anthropic, google)',
        required: false,
      },
    ],
  },
  {
    name: 'debug-issue',
    description: 'Analyze and suggest fixes for an issue',
    arguments: [
      {
        name: 'issue',
        description: 'Description of the issue',
        required: true,
      },
      {
        name: 'code',
        description: 'Relevant code snippet',
        required: false,
      },
    ],
  },
  {
    name: 'optimize-performance',
    description: 'Suggest performance optimizations',
    arguments: [
      {
        name: 'context',
        description: 'Context about current implementation',
        required: true,
      },
    ],
  },
  {
    name: 'review-code',
    description: 'Perform code review and suggest improvements',
    arguments: [
      {
        name: 'code',
        description: 'Code to review',
        required: true,
      },
      {
        name: 'focus',
        description:
          'Specific aspect to focus on (security, performance, readability)',
        required: false,
      },
    ],
  },
  {
    name: 'convert-example',
    description: 'Convert code example to different provider or framework',
    arguments: [
      {
        name: 'code',
        description: 'Original code to convert',
        required: true,
      },
      {
        name: 'from',
        description: 'Source provider/framework',
        required: true,
      },
      {
        name: 'to',
        description: 'Target provider/framework',
        required: true,
      },
    ],
  },
  // =============================================================================
  // Interactive Demo Prompts
  // =============================================================================
  {
    name: 'quick-start-demo',
    description:
      'Interactive guide to build your first Clarity Chat application in 5 minutes',
    arguments: [
      {
        name: 'provider',
        description: 'AI provider to use (openai, anthropic, google)',
        required: false,
      },
      {
        name: 'framework',
        description: 'Framework to use (nextjs, react, express)',
        required: false,
      },
    ],
  },
  {
    name: 'explore-components',
    description:
      'Interactive walkthrough of the Clarity Chat component library',
    arguments: [
      {
        name: 'category',
        description:
          'Component category to explore (chat, input, message, feedback)',
        required: false,
      },
    ],
  },
  {
    name: 'build-chatbot',
    description: 'Step-by-step guide to building a production-ready chatbot',
    arguments: [
      {
        name: 'type',
        description:
          'Type of chatbot (customer-support, coding-assistant, general)',
        required: true,
      },
      {
        name: 'features',
        description:
          'Comma-separated features (streaming, voice, file-upload, memory)',
        required: false,
      },
    ],
  },
  {
    name: 'accessibility-guide',
    description: 'Interactive accessibility audit and implementation guide',
    arguments: [
      {
        name: 'wcagLevel',
        description: 'WCAG conformance level target (A, AA, AAA)',
        required: false,
      },
    ],
  },
  {
    name: 'model-comparison',
    description: 'Interactive comparison of AI models for your use case',
    arguments: [
      {
        name: 'useCase',
        description: 'Your use case (chat, coding, analysis, creative)',
        required: true,
      },
      {
        name: 'budget',
        description: 'Monthly budget constraint in USD',
        required: false,
      },
    ],
  },
]

/**
 * Handle prompt generation with validation
 */
export async function handlePromptGet(
  name: string,
  args: Record<string, string>
): Promise<string> {
  logger.debug('Generating prompt', { prompt: name, args })

  try {
    switch (name) {
      case 'implement-feature': {
        validateRequired(args, ['feature'])
        const feature = validateString(args.feature, 'feature')
        const provider = args.provider
          ? validateString(args.provider, 'provider')
          : undefined
        return generateImplementFeaturePrompt(feature, provider)
      }

      case 'debug-issue': {
        validateRequired(args, ['issue'])
        const issue = validateString(args.issue, 'issue')
        const code = args.code ? validateString(args.code, 'code') : undefined
        return generateDebugIssuePrompt(issue, code)
      }

      case 'optimize-performance': {
        validateRequired(args, ['context'])
        const context = validateString(args.context, 'context')
        return generateOptimizePerformancePrompt(context)
      }

      case 'review-code': {
        validateRequired(args, ['code'])
        const reviewCode = validateString(args.code, 'code')
        const focus = args.focus
          ? validateString(args.focus, 'focus')
          : undefined
        return generateReviewCodePrompt(reviewCode, focus)
      }

      case 'convert-example': {
        validateRequired(args, ['code', 'from', 'to'])
        const convertCode = validateString(args.code, 'code')
        const from = validateString(args.from, 'from')
        const to = validateString(args.to, 'to')
        return generateConvertExamplePrompt(convertCode, from, to)
      }

      // Interactive Demo Prompts
      case 'quick-start-demo':
        return generateQuickStartDemoPrompt(
          args.provider ? validateString(args.provider, 'provider') : undefined,
          args.framework
            ? validateString(args.framework, 'framework')
            : undefined
        )

      case 'explore-components':
        return generateExploreComponentsPrompt(
          args.category ? validateString(args.category, 'category') : undefined
        )

      case 'build-chatbot':
        validateRequired(args, ['type'])
        return generateBuildChatbotPrompt(
          validateString(args.type, 'type'),
          args.features ? validateString(args.features, 'features') : undefined
        )

      case 'accessibility-guide':
        return generateAccessibilityGuidePrompt(
          args.wcagLevel
            ? validateString(args.wcagLevel, 'wcagLevel')
            : undefined
        )

      case 'model-comparison':
        validateRequired(args, ['useCase'])
        return generateModelComparisonPrompt(
          validateString(args.useCase, 'useCase'),
          args.budget ? validateString(args.budget, 'budget') : undefined
        )

      default:
        throw new NotFoundError('Prompt', name)
    }
  } catch (error) {
    logger.error(
      `Failed to generate prompt: ${name}`,
      error instanceof Error ? error : undefined,
      { args }
    )
    throw error
  }
}

/**
 * Implement Feature Prompt
 */
function generateImplementFeaturePrompt(
  feature: string,
  provider?: string
): string {
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
  const codeContext = code
    ? `\n\nRelevant Code:\n\`\`\`typescript\n${code}\n\`\`\``
    : ''

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
function generateConvertExamplePrompt(
  code: string,
  from: string,
  to: string
): string {
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

// =============================================================================
// Interactive Demo Prompt Generators
// =============================================================================

/**
 * Quick Start Demo Prompt
 */
function generateQuickStartDemoPrompt(
  provider?: string,
  framework?: string
): string {
  const selectedProvider = provider || 'openai'
  const selectedFramework = framework || 'nextjs'

  return `Let's build your first Clarity Chat application together! This interactive guide will help you create a working AI chat app in about 5 minutes.

## Configuration
- **AI Provider**: ${selectedProvider.toUpperCase()}
- **Framework**: ${selectedFramework}

## Step 1: Project Setup

First, let's create your project. Run these commands:

\`\`\`bash
npx create-next-app@latest my-chat-app --typescript
cd my-chat-app
npm install @clarity-chat/react ai
\`\`\`

## Step 2: Environment Configuration

Create a \`.env.local\` file with your API key:

\`\`\`bash
${selectedProvider === 'openai' ? 'OPENAI_API_KEY=your-api-key-here' : selectedProvider === 'anthropic' ? 'ANTHROPIC_API_KEY=your-api-key-here' : 'GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here'}
\`\`\`

## Step 3: Create the API Route

Create \`app/api/chat/route.ts\`:

\`\`\`typescript
import { ${selectedProvider === 'openai' ? 'openai' : selectedProvider === 'anthropic' ? 'anthropic' : 'google'} } from '@ai-sdk/${selectedProvider}'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: ${selectedProvider === 'openai' ? "openai('gpt-4o')" : selectedProvider === 'anthropic' ? "anthropic('claude-3-5-sonnet-20241022')" : "google('gemini-1.5-pro')"},
    messages,
  })

  return result.toDataStreamResponse()
}
\`\`\`

## Step 4: Create the Chat Page

Update \`app/page.tsx\`:

\`\`\`typescript
'use client'

import { ClarityChat } from '@clarity-chat/react'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <ClarityChat
        api="/api/chat"
        placeholder="Ask me anything..."
      />
    </main>
  )
}
\`\`\`

## Step 5: Run Your App!

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 and start chatting!

---

**Next Steps:**
- Add streaming animations with \`<StreamingMessage />\`
- Add conversation history with \`useMessageHistory\`
- Add voice input with \`useVoiceInput\`
- Add file uploads with \`<FileUpload />\`

Would you like me to help you add any of these features?`
}

/**
 * Explore Components Prompt
 */
function generateExploreComponentsPrompt(category?: string): string {
  const categoryGuide = category
    ? `Let's explore the **${category}** category components in detail.`
    : `Let's take a tour of the Clarity Chat component library.`

  return `# Clarity Chat Component Explorer

${categoryGuide}

## Interactive Exploration Guide

I'll help you discover the components you need. Let's start by understanding what you're building:

### Quick Questions:
1. **What type of interface are you building?**
   - Full chat application
   - Embedded chat widget
   - Customer support interface
   - Developer tool / IDE integration

2. **What features do you need?**
   - Basic text messaging
   - Streaming responses
   - Voice input/output
   - File attachments
   - Code syntax highlighting
   - Multi-conversation support

### Component Categories Overview:

**Top-Level Components** (Start here)
- \`ClarityChat\` - Complete chat interface in one component
- \`ClarityChatProvider\` - Context provider for state management

**Input Components**
- \`ChatInput\` - Text input with send button
- \`VoiceInput\` - Voice-to-text input
- \`FileUpload\` - File attachment handling
- \`CommandPalette\` - Slash commands and shortcuts

**Message Components**
- \`Message\` - Single message display
- \`MessageList\` - Scrollable message container
- \`StreamingMessage\` - Animated streaming text
- \`TypingIndicator\` - "AI is typing" indicator

**Feedback Components**
- \`Toast\` - Notification messages
- \`ErrorState\` - Error display with retry
- \`LoadingSpinner\` - Loading indicators
- \`RetryButton\` - Retry failed operations

**Enterprise Components**
- \`AnalyticsDashboard\` - Usage analytics
- \`AuditLogViewer\` - Security audit logs
- \`TokenUsageDisplay\` - Cost tracking

### Try It Out:

Use the Clarity Chat tools to explore:
- \`clarity_discover_components\` - Search for components
- \`clarity_get_component_docs\` - Get detailed documentation
- \`clarity_generate_code\` - Generate starter code

What would you like to explore first?`
}

/**
 * Build Chatbot Prompt
 */
function generateBuildChatbotPrompt(type: string, features?: string): string {
  // Limit input length before splitting to prevent memory issues
  const MAX_FEATURES_INPUT_LENGTH = 1000
  const sanitizedFeatures = features?.slice(0, MAX_FEATURES_INPUT_LENGTH) || ''
  const featureList = sanitizedFeatures
    .split(',')
    .map((f) => f.trim())
    .filter((f) => f.length > 0)
    .slice(0, 20)
  const hasStreaming = featureList.includes('streaming')
  const hasVoice = featureList.includes('voice')
  const hasFileUpload = featureList.includes('file-upload')
  const hasMemory = featureList.includes('memory')

  const typeConfigs: Record<
    string,
    { title: string; systemPrompt: string; features: string[] }
  > = {
    'customer-support': {
      title: 'Customer Support Chatbot',
      systemPrompt:
        'You are a helpful customer support agent. Be friendly, professional, and solution-oriented. Always try to resolve issues on the first interaction.',
      features: [
        'Quick responses',
        'Escalation handling',
        'FAQ integration',
        'Sentiment analysis',
      ],
    },
    'coding-assistant': {
      title: 'Coding Assistant',
      systemPrompt:
        'You are an expert programming assistant. Provide clear, well-documented code examples. Explain your reasoning and suggest best practices.',
      features: [
        'Code syntax highlighting',
        'Multi-language support',
        'Code execution',
        'Documentation generation',
      ],
    },
    general: {
      title: 'General Purpose Chatbot',
      systemPrompt:
        'You are a helpful, harmless, and honest AI assistant. Provide accurate information and helpful responses.',
      features: [
        'Conversation memory',
        'Context awareness',
        'Multi-turn dialogue',
        'Topic handling',
      ],
    },
  }

  const config = typeConfigs[type] || typeConfigs['general']

  return `# Building a ${config.title}

Let's build a production-ready ${config.title.toLowerCase()} step by step!

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ClarityChat Component                                      │
│  ├── ChatInput${hasVoice ? ' + VoiceInput' : ''}${hasFileUpload ? ' + FileUpload' : ''}                               │
│  ├── MessageList                                           │
│  │   ├── Message${hasStreaming ? ' / StreamingMessage' : ''}                            │
│  │   └── TypingIndicator                                   │
│  └── ChatHeader                                            │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                              │
│  └── /api/chat endpoint${hasMemory ? ' + Conversation Storage' : ''}                      │
├─────────────────────────────────────────────────────────────┤
│                      AI Provider                            │
│  └── OpenAI / Anthropic / Google                           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Step 1: System Prompt Configuration

\`\`\`typescript
const SYSTEM_PROMPT = \`${config.systemPrompt}\`
\`\`\`

## Step 2: API Route Implementation

\`\`\`typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText${hasMemory ? ', convertToCoreMessages' : ''} } from 'ai'

export async function POST(req: Request) {
  const { messages${hasMemory ? ', conversationId' : ''} } = await req.json()
  ${
    hasMemory
      ? `
  // Load conversation history if exists
  const history = await loadConversationHistory(conversationId)
  const allMessages = [...history, ...messages]
  `
      : ''
  }
  const result = streamText({
    model: openai('gpt-4o'),
    system: SYSTEM_PROMPT,
    messages${hasMemory ? ': allMessages' : ''},${hasStreaming ? '\n    maxTokens: 4096,' : ''}
  })
  ${
    hasMemory
      ? `
  // Save updated history
  await saveConversationHistory(conversationId, allMessages)
  `
      : ''
  }
  return result.toDataStreamResponse()
}
\`\`\`

## Step 3: Frontend Component

\`\`\`typescript
'use client'

import {
  ClarityChat,
  ${hasStreaming ? 'StreamingMessage,' : ''}
  ${hasVoice ? 'VoiceInput,' : ''}
  ${hasFileUpload ? 'FileUpload,' : ''}
  ${hasMemory ? 'useMessageHistory,' : ''}
} from '@clarity-chat/react'

export function ${type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')}Chat() {
  ${hasMemory ? 'const { messages, addMessage } = useMessageHistory("conversation-1")' : ''}

  return (
    <ClarityChat
      api="/api/chat"
      ${hasMemory ? 'initialMessages={messages}' : ''}
      placeholder="How can I help you today?"
      ${hasStreaming ? 'renderMessage={(msg) => msg.role === "assistant" ? <StreamingMessage content={msg.content} /> : null}' : ''}
    >
      ${hasVoice ? '<VoiceInput position="before-send" />' : ''}
      ${hasFileUpload ? '<FileUpload maxFiles={3} accept={["image/*", "application/pdf"]} />' : ''}
    </ClarityChat>
  )
}
\`\`\`

## Step 4: Recommended Features for ${config.title}

${config.features.map((f) => `- [ ] ${f}`).join('\n')}

## Testing Checklist

- [ ] Basic message send/receive works
- [ ] Streaming displays correctly${hasVoice ? '\n- [ ] Voice input transcribes accurately' : ''}${hasFileUpload ? '\n- [ ] File uploads process correctly' : ''}${hasMemory ? '\n- [ ] Conversation history persists' : ''}
- [ ] Error states handled gracefully
- [ ] Accessibility requirements met

Would you like me to elaborate on any of these steps or help implement specific features?`
}

/**
 * Accessibility Guide Prompt
 */
function generateAccessibilityGuidePrompt(wcagLevel?: string): string {
  const level = wcagLevel || 'AA'

  return `# Accessibility Implementation Guide for Clarity Chat

**Target WCAG Level: ${level}**

Let's ensure your chat application is accessible to all users. This guide covers keyboard navigation, screen reader support, and ARIA best practices.

## Quick Accessibility Audit

Use the \`clarity_check_accessibility\` tool to audit your components:

\`\`\`
Tool: clarity_check_accessibility
Arguments: { "wcagLevel": "${level}" }
\`\`\`

## Key Accessibility Requirements

### 1. Keyboard Navigation (WCAG 2.1.1)

All functionality must be available via keyboard:

\`\`\`typescript
// ChatInput with keyboard support
<ChatInput
  onSend={handleSend}
  shortcuts={{
    'Enter': 'send',           // Send message
    'Shift+Enter': 'newline',  // New line
    'Escape': 'clear',         // Clear input
    'Ctrl+/': 'help'           // Show shortcuts
  }}
/>
\`\`\`

**Keyboard Requirements:**
- Tab: Move between interactive elements
- Enter: Activate buttons/send messages
- Escape: Close modals/clear input
- Arrow keys: Navigate message list

### 2. Screen Reader Support (WCAG 1.3.1, 4.1.2)

\`\`\`typescript
// Message with proper ARIA
<Message
  role="article"
  aria-label={\`Message from \${sender}, \${timestamp}\`}
  content={content}
/>

// Live region for new messages
<div
  role="log"
  aria-live="polite"
  aria-label="Chat messages"
>
  {messages.map(m => <Message key={m.id} {...m} />)}
</div>

// Loading state announcement
<TypingIndicator
  aria-live="polite"
  aria-label="AI is typing a response"
/>
\`\`\`

### 3. Focus Management (WCAG 2.4.3)

\`\`\`typescript
import { useFocusManagement } from '@clarity-chat/react'

function AccessibleChat() {
  const { focusRef, restoreFocus } = useFocusManagement()

  return (
    <ClarityChat
      inputRef={focusRef}
      onMessageSent={() => {
        // Return focus to input after sending
        restoreFocus()
      }}
    />
  )
}
\`\`\`

### 4. Color Contrast (WCAG 1.4.3${level === 'AAA' ? ', 1.4.6' : ''})

\`\`\`css
/* Minimum contrast ratios */
/* AA: 4.5:1 for normal text, 3:1 for large text */
/* AAA: 7:1 for normal text, 4.5:1 for large text */

.chat-message {
  color: #1a1a1a;           /* Text on light background */
  background: #ffffff;
}

.chat-message-assistant {
  color: #ffffff;           /* Text on dark background */
  background: #1e40af;      /* Blue with sufficient contrast */
}
\`\`\`

### 5. Error Handling (WCAG 3.3.1)

\`\`\`typescript
<ErrorState
  error={error}
  role="alert"
  aria-live="assertive"
  onRetry={handleRetry}
  retryLabel="Try sending your message again"
/>
\`\`\`

## Component-Specific Accessibility

### ClarityChat
- \`aria-label\`: "Chat interface"
- \`role\`: "application" for complex interactions
- Focus trap when modal

### MessageList
- \`role\`: "log"
- \`aria-live\`: "polite"
- Virtual scrolling preserves focus

### ChatInput
- \`aria-label\`: "Message input"
- \`aria-describedby\`: Link to character count
- \`aria-invalid\`: Indicate errors

## Testing Tools

1. **Automated Testing**: axe-core, WAVE
2. **Manual Testing**: Keyboard-only navigation
3. **Screen Readers**: NVDA, VoiceOver, JAWS
4. **Color Contrast**: WebAIM Contrast Checker

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus is visible and logical
- [ ] Screen reader announcements are clear
- [ ] Color contrast meets ${level} requirements
- [ ] Error messages are accessible
- [ ] Time limits can be extended (if any)
- [ ] Content is readable at 200% zoom

Would you like me to help implement any specific accessibility feature?`
}

/**
 * Model Comparison Prompt
 */
function generateModelComparisonPrompt(
  useCase: string,
  budget?: string
): string {
  const budgetConstraint = budget ? `\n**Monthly Budget**: $${budget}` : ''

  const useCaseGuides: Record<
    string,
    { models: string[]; considerations: string[] }
  > = {
    chat: {
      models: ['gpt-4o-mini', 'claude-3-5-haiku-20241022', 'gemini-1.5-flash'],
      considerations: [
        'Response latency',
        'Conversational quality',
        'Cost per message',
      ],
    },
    coding: {
      models: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'codestral-latest'],
      considerations: [
        'Code accuracy',
        'Language support',
        'Context window size',
      ],
    },
    analysis: {
      models: ['gpt-4o', 'claude-3-opus-20240229', 'gemini-1.5-pro'],
      considerations: [
        'Reasoning quality',
        'Document processing',
        'Output length',
      ],
    },
    creative: {
      models: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'gemini-1.5-pro'],
      considerations: [
        'Creative writing quality',
        'Style consistency',
        'Instruction following',
      ],
    },
  }

  const guide = useCaseGuides[useCase] || useCaseGuides['chat']

  return `# AI Model Comparison for ${useCase.charAt(0).toUpperCase() + useCase.slice(1)}
${budgetConstraint}

## Recommended Models for Your Use Case

Based on your needs, here are the top models to consider:

### Comparison Table

| Model | Provider | Input Cost | Output Cost | Context | Best For |
|-------|----------|------------|-------------|---------|----------|
| gpt-4o | OpenAI | $2.50/1M | $10/1M | 128K | General, Vision |
| gpt-4o-mini | OpenAI | $0.15/1M | $0.60/1M | 128K | Cost-effective chat |
| claude-3-5-sonnet | Anthropic | $3/1M | $15/1M | 200K | Coding, Analysis |
| claude-3-5-haiku | Anthropic | $0.80/1M | $4/1M | 200K | Fast responses |
| gemini-1.5-pro | Google | $1.25/1M | $5/1M | 2M | Long context |
| gemini-1.5-flash | Google | $0.075/1M | $0.30/1M | 1M | Ultra low-cost |

### Top Picks for ${useCase}:

${guide.models.map((model, i) => `${i + 1}. **${model}**`).join('\n')}

### Key Considerations:

${guide.considerations.map((c) => `- ${c}`).join('\n')}

## Cost Calculator

Use the \`calculate_cost\` tool to estimate costs:

\`\`\`
Tool: calculate_cost
Arguments: {
  "modelName": "gpt-4o",
  "promptTokens": 1000,
  "completionTokens": 500
}
\`\`\`

## Quick Decision Guide

**Choose gpt-4o-mini if:**
- Budget is a primary concern
- Tasks are relatively simple
- High volume of requests expected

**Choose claude-3-5-sonnet if:**
- Quality is paramount
- Coding or analytical tasks
- Need large context window

**Choose gemini-1.5-flash if:**
- Ultra-low latency needed
- Very cost-sensitive
- Processing long documents

${
  budget
    ? `## Budget Analysis

With a $${budget}/month budget:
- gpt-4o-mini: ~${Math.floor(Number(budget) / 0.00075)} messages
- claude-3-5-haiku: ~${Math.floor(Number(budget) / 0.0048)} messages
- gemini-1.5-flash: ~${Math.floor(Number(budget) / 0.000405)} messages

*(Assuming average 1000 input + 500 output tokens per message)*
`
    : ''
}

## Interactive Comparison

Use \`get_model_info\` to dive deeper into any model:

\`\`\`
Tool: get_model_info
Arguments: { "modelName": "claude-3-5-sonnet" }
\`\`\`

Would you like me to provide more details on any specific model or help you set up a hybrid approach using multiple models?`
}
