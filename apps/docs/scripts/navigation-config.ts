/**
 * Navigation configuration for llms.txt generation
 * This defines the documentation structure and descriptions for AI indexing
 */

import type { NavigationSection } from './types'
import { LIBRARY_STATS, LIBRARY_DESCRIPTIONS } from '../lib/library-stats'

export const BASE_URL = 'https://clarity-chat.dev'

/**
 * Documentation navigation structure
 * Used to generate llms.txt with proper organization and descriptions
 */
export const navigationConfig: NavigationSection[] = [
  {
    title: 'Quick Start',
    items: [
      {
        title: 'Installation',
        href: '/learn/installation',
        description: 'Install via npm: `npm install @clarity-chat/react`',
      },
      {
        title: 'Quick Start Guide',
        href: '/learn/quick-start',
        description: 'Build your first chat interface in 5 minutes',
      },
      {
        title: 'Interactive Playground',
        href: '/playground',
        description: 'Try components live in the browser',
      },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      {
        title: 'Component System',
        href: '/learn/concepts/components',
        description:
          "Understanding Clarity's composable component architecture",
      },
      {
        title: 'React Hooks',
        href: '/learn/concepts/hooks',
        description:
          LIBRARY_DESCRIPTIONS.hooksDescription,
      },
      {
        title: 'Theming System',
        href: '/learn/concepts/theming',
        description: LIBRARY_DESCRIPTIONS.themesDescription,
      },
      {
        title: 'Animations',
        href: '/learn/concepts/animations',
        description: `${LIBRARY_STATS.animations} micro-interactions with Framer Motion`,
      },
      {
        title: 'Architecture',
        href: '/learn/architecture',
        description: 'Three-tier API design philosophy',
      },
    ],
  },
  {
    title: 'Main Components',
    items: [
      {
        title: 'ClarityChat',
        href: '/reference/components/clarity-chat',
        description: 'All-in-one chat component with built-in features',
      },
      {
        title: 'ChatWindow',
        href: '/reference/components/chat-window',
        description: 'Container component for chat interfaces',
      },
      {
        title: 'MessageList',
        href: '/reference/components/message-list',
        description: 'Display messages with virtualization support',
      },
      {
        title: 'ChatInput',
        href: '/reference/components/chat-input',
        description: 'User input with attachments and voice support',
      },
      {
        title: 'StreamingMessage',
        href: '/reference/components/streaming-message',
        description: 'Real-time streaming response display',
      },
      {
        title: 'ThinkingIndicator',
        href: '/reference/components/thinking-indicator',
        description: 'AI processing state indicator',
      },
      {
        title: 'TokenCounter',
        href: '/reference/components/token-counter',
        description: 'Track token usage in real-time',
      },
    ],
  },
  {
    title: 'Core Hooks',
    items: [
      {
        title: 'useClarityChat',
        href: '/reference/hooks/use-clarity-chat',
        description:
          'Primary hook for chat state and operations with memory integration',
      },
      {
        title: 'useStreamingSSE',
        href: '/reference/hooks/use-streaming-sse',
        description: 'Server-Sent Events streaming',
      },
      {
        title: 'useStreamingWebSocket',
        href: '/reference/hooks/use-streaming-websocket',
        description: 'WebSocket streaming with auto-reconnection',
      },
      {
        title: 'useTokenTracker',
        href: '/reference/hooks/use-token-tracker',
        description: 'Monitor token consumption',
      },
      {
        title: 'useTokenOptimization',
        href: '/reference/hooks/use-token-optimization',
        description: 'Optimize context window usage',
      },
      {
        title: 'useVoiceInput',
        href: '/reference/hooks/use-voice-input',
        description: 'Voice-to-text input',
      },
      {
        title: 'useChatHandlers',
        href: '/reference/hooks/use-chat-handlers',
        description: 'Pre-configured handlers for ChatWindow',
      },
    ],
  },
  {
    title: 'UI Components',
    items: [
      {
        title: 'Button',
        href: '/reference/components/button',
        description: 'Accessible button with variants',
      },
      {
        title: 'Avatar',
        href: '/reference/components/avatar',
        description: 'User and AI avatars',
      },
      {
        title: 'Badge',
        href: '/reference/components/badge',
        description: 'Status and info badges',
      },
      {
        title: 'Toast',
        href: '/reference/components/toast',
        description: 'Notification system',
      },
      {
        title: 'Tooltip',
        href: '/reference/components/tooltip',
        description: 'Contextual tooltips',
      },
      {
        title: 'Skeleton',
        href: '/reference/components/skeleton',
        description: 'Loading state placeholders',
      },
      {
        title: 'Progress',
        href: '/reference/components/progress',
        description: 'Progress indicators',
      },
    ],
  },
  {
    title: 'Advanced Features',
    items: [
      {
        title: 'VoiceInput',
        href: '/reference/components/voice-input',
        description: 'Speech-to-text integration',
      },
      {
        title: 'FileUpload',
        href: '/reference/components/file-upload',
        description: 'Document and image uploads',
      },
      {
        title: 'MarkdownRenderer',
        href: '/reference/components/markdown-renderer-enhanced',
        description:
          'Rich markdown with syntax-highlighted code blocks and math support',
      },
      {
        title: 'CommandPalette',
        href: '/reference/components/command-palette',
        description: 'Keyboard-driven command menu',
      },
      {
        title: 'ConversationTimeline',
        href: '/reference/components/conversation-timeline',
        description: 'Visual conversation history',
      },
      {
        title: 'MemoryInspector',
        href: '/reference/components/memory-inspector',
        description: 'Debug context and memory',
      },
    ],
  },
  {
    title: 'Token Optimization',
    items: [
      {
        title: 'Token Optimization Guide',
        href: '/guides/token-optimization',
        description: 'Reduce API costs by up to 70%',
      },
      {
        title: 'TokenOptimizationDashboard',
        href: '/reference/components/token-optimization-dashboard',
        description: 'Visual optimization controls',
      },
      {
        title: 'ContextVisualizer',
        href: '/reference/components/context-visualizer',
        description: "See what's in your context window",
      },
    ],
  },
  {
    title: 'Guides',
    items: [
      {
        title: 'Streaming',
        href: '/guides/streaming',
        description: 'Implement real-time streaming responses',
      },
      {
        title: 'State Management',
        href: '/guides/state-management',
        description: 'Manage chat state effectively',
      },
      {
        title: 'Performance',
        href: '/learn/guides/performance',
        description: 'Optimize for large conversations',
      },
      {
        title: 'Accessibility',
        href: '/learn/guides/accessibility',
        description: 'WCAG AAA compliance',
      },
      {
        title: 'Styling',
        href: '/learn/guides/styling',
        description: 'Customizing component styles',
      },
      {
        title: 'TypeScript',
        href: '/learn/guides/typescript',
        description: 'TypeScript best practices',
      },
      {
        title: 'Testing',
        href: '/learn/guides/testing',
        description: 'Testing your chat components',
      },
    ],
  },
  {
    title: 'Examples',
    items: [
      {
        title: 'Simple Chat',
        href: '/examples/simple-chat',
        description: 'Basic chat implementation',
      },
      {
        title: 'Streaming Chat',
        href: '/examples/streaming',
        description: 'Real-time streaming demo',
      },
      {
        title: 'Themed Chat',
        href: '/examples/themed-chat',
        description: 'Custom theme showcase',
      },
      {
        title: 'Code Assistant',
        href: '/examples/code-assistant',
        description: 'Developer-focused chat',
      },
      {
        title: 'Customer Support',
        href: '/examples/ecommerce-assistant',
        description: 'E-commerce chatbot',
      },
      {
        title: 'AI Agents Workflow',
        href: '/examples/ai-agents-workflow',
        description: 'Multi-agent implementation',
      },
    ],
  },
  {
    title: 'Cookbook Recipes',
    items: [
      {
        title: 'OpenAI Streaming',
        href: '/cookbook/openai-streaming-chat',
        description: 'Integrate with OpenAI API',
      },
      {
        title: 'RAG Document Chat',
        href: '/cookbook/rag-document-chat',
        description: 'Build retrieval-augmented chat',
      },
      {
        title: 'Agent with Tools',
        href: '/cookbook/agent-with-tools',
        description: 'Create tool-using agents',
      },
      {
        title: 'Custom Theming',
        href: '/cookbook/custom-theming',
        description: 'Design your own theme',
      },
      {
        title: 'Memory Integration',
        href: '/cookbook/memory-integration',
        description: 'Add conversation memory',
      },
      {
        title: 'Error Handling',
        href: '/cookbook/error-handling',
        description: 'Handle errors gracefully',
      },
      {
        title: 'Authentication',
        href: '/cookbook/authentication',
        description: 'Add user authentication',
      },
      {
        title: 'Offline First',
        href: '/cookbook/offline-first-chat',
        description: 'Build offline-capable chat',
      },
      {
        title: 'Voice Chat',
        href: '/cookbook/voice-chat',
        description: 'Add voice input/output',
      },
      {
        title: 'Multi-Agent Orchestration',
        href: '/cookbook/multi-agent-orchestration',
        description: 'Coordinate multiple AI agents',
      },
    ],
  },
  {
    title: 'Integrations',
    items: [
      {
        title: 'Next.js',
        href: '/integrations/nextjs',
        description: 'Server components and App Router',
      },
      {
        title: 'Vite',
        href: '/integrations/vite',
        description: 'Fast development setup',
      },
      {
        title: 'Remix',
        href: '/integrations/remix',
        description: 'Full-stack integration',
      },
    ],
  },
  {
    title: 'API Reference',
    items: [
      {
        title: 'Components API',
        href: '/reference/components',
        description: 'All component props and types',
      },
      {
        title: 'Hooks API',
        href: '/reference/hooks',
        description: 'Hook signatures and return types',
      },
      {
        title: 'Utilities',
        href: '/reference/api/utilities',
        description: 'Helper functions and utilities',
      },
      {
        title: 'Type Definitions',
        href: '/reference/api/types',
        description: 'TypeScript type reference',
      },
    ],
  },
  {
    title: 'Optional',
    isOptional: true,
    items: [
      {
        title: 'Enterprise Features',
        href: '/enterprise',
        description: 'SSO, RBAC, multi-tenancy, audit logs',
      },
      {
        title: 'Migration from Vercel AI SDK',
        href: '/learn/migration/from-vercel-ai-sdk',
        description: 'Step-by-step migration guide',
      },
      {
        title: 'Deployment - Vercel',
        href: '/learn/deployment/vercel',
        description: 'Deploy to Vercel with zero configuration',
      },
      {
        title: 'Deployment - AWS',
        href: '/learn/deployment/aws',
        description: 'Deploy to AWS with Lambda, ECS, or EC2',
      },
      {
        title: 'Deployment - Docker',
        href: '/learn/deployment/docker',
        description: 'Deploy with Docker and docker-compose',
      },
      {
        title: 'Troubleshooting',
        href: '/learn/troubleshooting',
        description: 'Common issues and solutions',
      },
      {
        title: 'CLI Tools',
        href: '/tools/cli',
        description: 'Command-line utilities',
      },
      {
        title: 'Testing Toolkit',
        href: '/tools/testing',
        description: 'Testing utilities and mocks',
      },
    ],
  },
]

/**
 * Project description for llms.txt header
 */
export const projectDescription = `Enterprise-grade React component library for building beautiful, accessible AI chat interfaces. Features 200+ production-ready components, 95+ custom hooks, 15 themes, and comprehensive token optimization. Built with TypeScript, React 19, and Tailwind CSS.

Clarity Chat is the most complete open-source solution for building AI chat interfaces in React. It provides everything you need from basic chat windows to enterprise features like SSO, multi-tenancy, and advanced analytics.`

/**
 * MCP Server configuration for llms.txt
 */
export const mcpServerConfig = `{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["tsx", "apps/docs/mcp-server/index.ts"]
    }
  }
}`

export const mcpTools = [
  'list_components',
  'get_component',
  'list_hooks',
  'get_hook',
  'search_docs',
  'health_check',
]
