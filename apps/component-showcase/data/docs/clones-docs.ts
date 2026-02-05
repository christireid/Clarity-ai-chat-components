import type { ComponentDoc } from '@/components/doc-panel'

export const clonesDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  Claude: {
    name: 'ClaudeClone',
    description:
      'A pixel-perfect recreation of the Anthropic Claude chat interface. Features a sidebar with chat history, model selector dropdown, message bubbles with copy/retry/thumbs-up/thumbs-down actions, an attachment button, and the characteristic warm amber branding.',
    importPath: '@clarity-chat/react',
    usageCode: `<ClaudeClone
  messages={[
    { id: '1', role: 'assistant', content: 'Good afternoon. How can I help you today?' },
    { id: '2', role: 'user', content: 'Explain React hooks.' },
  ]}
  onSend={(message) => console.log('Send:', message)}
  placeholder="Message Claude..."
  className="h-[600px]"
/>`,
    props: [
      {
        name: 'messages',
        type: 'ChatMessage[]',
        description:
          'Array of chat messages to display. Each message requires id (string), role ("user" | "assistant"), content (string), and an optional timestamp (Date).',
        commonlyUsed: true,
      },
      {
        name: 'onSend',
        type: '(message: string) => void',
        description:
          'Callback invoked when the user submits a message via the input area or Enter key.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Message Claude..."',
        description:
          'Placeholder text displayed in the message input textarea.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container for custom sizing and styling.',
      },
    ],
    notes: [
      'Messages from the assistant are displayed with the Claude amber avatar and include copy, retry, thumbs-up, and thumbs-down action buttons.',
      'User messages appear as right-aligned rounded bubbles with a muted background.',
      'The sidebar includes a model selector dropdown (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku), a new chat button, and conversation history grouped by date.',
      'Pressing Enter sends the message; Shift+Enter inserts a newline.',
      'The component includes an attachment button (Paperclip icon) in the input area for file upload integration.',
    ],
  },

  ChatGPT: {
    name: 'ChatGPTClone',
    description:
      'A pixel-perfect recreation of the OpenAI ChatGPT interface. Features a collapsible sidebar with conversation history, a model badge (4o), message bubbles with copy/thumbs/retry actions, and a rounded input area with attachment and send controls.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChatGPTClone
  messages={[
    { id: '1', role: 'assistant', content: 'How can I help you today?' },
    { id: '2', role: 'user', content: 'Write a sorting algorithm.' },
  ]}
  onSend={(message) => console.log('Send:', message)}
  placeholder="Message ChatGPT..."
  className="h-[600px]"
/>`,
    props: [
      {
        name: 'messages',
        type: 'ChatMessage[]',
        description:
          'Array of chat messages to display. Each message requires id (string), role ("user" | "assistant"), content (string), and an optional timestamp (Date).',
        commonlyUsed: true,
      },
      {
        name: 'onSend',
        type: '(message: string) => void',
        description:
          'Callback invoked when the user submits a message via the input area or Enter key.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Message ChatGPT..."',
        description:
          'Placeholder text displayed in the message input textarea.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container for custom sizing and styling.',
      },
    ],
    notes: [
      'The sidebar is collapsible via a hamburger menu button in the header and includes a "New chat" button, search, and conversation history grouped by date.',
      'Assistant messages display with a green Sparkles avatar, a "ChatGPT" label, and action buttons for copy, thumbs-up, thumbs-down, and retry.',
      'The empty state displays a centered prompt with "How can I help you today?" and the ChatGPT icon.',
      'A "4o" model badge appears in the header next to the ChatGPT title.',
      'Pressing Enter sends the message; Shift+Enter inserts a newline. The send button is a circular arrow-up icon.',
      'A disclaimer footer reads "ChatGPT can make mistakes. Check important info."',
    ],
  },

  Perplexity: {
    name: 'PerplexityClone',
    description:
      'A pixel-perfect recreation of the Perplexity AI search interface. Features an initial search landing page with focus selectors (All, Academic, Writing, Video), source cards with citation previews, AI-generated answers with source attribution, and a follow-up input for conversational search.',
    importPath: '@clarity-chat/react',
    usageCode: `<PerplexityClone
  messages={[
    { id: '1', role: 'user', content: 'What is quantum computing?' },
    { id: '2', role: 'assistant', content: 'Quantum computing leverages...' },
  ]}
  onSend={(message) => console.log('Search:', message)}
  placeholder="Ask anything..."
  className="h-[600px]"
/>`,
    props: [
      {
        name: 'messages',
        type: 'ChatMessage[]',
        description:
          'Array of chat messages to display. Each message requires id (string), role ("user" | "assistant"), content (string), and an optional timestamp (Date).',
        commonlyUsed: true,
      },
      {
        name: 'onSend',
        type: '(message: string) => void',
        description:
          'Callback invoked when the user submits a search query via the input or clicks the search button.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Ask anything..."',
        description: 'Placeholder text displayed in the search input field.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container for custom sizing and styling.',
      },
    ],
    notes: [
      'The empty state displays a full landing page with the Perplexity branding, "Where knowledge begins" heading, and focus mode selectors (All, Academic, Writing, Video).',
      'Search results are displayed with source cards showing favicons, titles, and domains from cited web sources.',
      'Assistant responses are prefixed with a Globe icon and "Answer" label to distinguish AI-generated content from source citations.',
      'Trending topic badges appear below the search input and can be clicked to populate the search field.',
      'The follow-up input only appears when there are existing messages, enabling conversational search threads.',
      'The search button uses the Perplexity cyan accent color (#20b8cd).',
    ],
  },

  Grok: {
    name: 'GrokClone',
    description:
      'A pixel-perfect recreation of the X/Grok chat interface. Features a dark-themed design with the X branding, conversation history, a Beta badge, message bubbles with copy/retry/reaction controls, and a rounded input area matching the X platform aesthetic.',
    importPath: '@clarity-chat/react',
    usageCode: `<GrokClone
  messages={[
    { id: '1', role: 'assistant', content: "Hey, I'm Grok! Ask me anything." },
    { id: '2', role: 'user', content: 'Explain quantum physics simply.' },
  ]}
  onSend={(message) => console.log('Send:', message)}
  placeholder="Ask Grok anything..."
  className="h-[600px]"
/>`,
    props: [
      {
        name: 'messages',
        type: 'ChatMessage[]',
        description:
          'Array of chat messages to display. Each message requires id (string), role ("user" | "assistant"), content (string), and an optional timestamp (Date).',
        commonlyUsed: true,
      },
      {
        name: 'onSend',
        type: '(message: string) => void',
        description:
          'Callback invoked when the user submits a message via the input area or Enter key.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Ask Grok anything..."',
        description:
          'Placeholder text displayed in the message input textarea.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container for custom sizing and styling.',
      },
    ],
    notes: [
      'Uses a fully dark theme (black background) to match the X/Twitter platform aesthetic.',
      'The Grok assistant avatar features a Zap icon with a gradient background (blue to purple), and a "Beta" badge appears in the header.',
      'The empty state includes clickable suggestion cards such as "What\'s happening on X?", "Tell me a joke", etc.',
      'The sidebar includes navigation items for Grok, Messages, and Bookmarks styled as X platform nav items.',
      'The send button uses the X platform blue accent color (#1d9bf0) with a circular shape.',
      'Pressing Enter sends the message; Shift+Enter inserts a newline.',
    ],
  },

  Manus: {
    name: 'ManusChat',
    description:
      'A recreation of the Manus autonomous agent interface. Built using the Chat compound component pattern with Chat.Provider, Chat.Messages, and Chat.Input. Features a code-focused agent theme, slash commands for actions like /explain, /fix, and /test, and message bubbles with timestamps and delivery status indicators.',
    importPath: '@clarity-chat/react',
    usageCode: `<ManusChat className="h-[600px]" />`,
    props: [
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the wrapper div for custom sizing and styling.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Uses the Chat compound component pattern internally: Chat.Provider manages state, Chat.Messages renders the message list, and Chat.Input handles user input.',
      'Pre-configured with an initial assistant greeting message: "Hey! I\'m Manus. I can help you build, debug, and ship code faster."',
      'Supports slash commands: /explain (explain code), /fix (fix bugs), and /test (generate tests), displayed in a command popover.',
      'Message bubbles include timestamps and CheckCircle delivery status indicators.',
      'The agent avatar uses a gradient background (blue to purple) with a Code icon.',
      'The showcase page presents a more elaborate version with task cards, subtask progress bars, live terminal output, and agent status indicators.',
    ],
  },

  Emergent: {
    name: 'EmergentChat',
    description:
      'A recreation of a multi-agent collaboration interface. Built using the Chat compound component pattern with Chat.Provider, Chat.Messages, and Chat.Input. Features a colorful gradient theme, tool usage badges on assistant messages, a thinking indicator, and a multi-agent coordination aesthetic.',
    importPath: '@clarity-chat/react',
    usageCode: `<EmergentChat className="h-[600px]" />`,
    props: [
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the wrapper div for custom sizing and styling.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Uses the Chat compound component pattern internally: Chat.Provider manages state, Chat.Messages renders the message list with custom EmergentBubble rendering, and Chat.Input handles user input.',
      'Pre-configured with an initial assistant greeting: "Hello! I\'m E1, your AI coding agent."',
      'Assistant messages can display tool usage badges (e.g., "Code Generation", "File System") via the message metadata.tools array.',
      'Includes a thinking indicator ("E1 is thinking...") with a pulsing animation shown while the assistant is processing.',
      'The agent avatar uses a tri-color gradient (emerald, blue, purple) with a Sparkles icon.',
      'The header includes a Zap status indicator showing "E1 Agent - Ready" and a "New Chat" button.',
      'The showcase page presents a more elaborate version with an animated agent visualization, orbital rings, agent nodes, activity feed, and token/time metrics.',
    ],
  },

  Lovable: {
    name: 'LoveableChat',
    description:
      'A recreation of the Lovable creative AI partner interface. Built using the Chat compound component pattern with Chat.Provider, Chat.Messages, and Chat.Input. Features a pink-to-purple gradient theme, rounded bubble messages, emoji reactions on messages, and a creative, warm aesthetic.',
    importPath: '@clarity-chat/react',
    importName: 'LoveableChat',
    usageCode: `<LoveableChat className="h-[600px]" />`,
    props: [
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the wrapper div for custom sizing and styling.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Uses the Chat compound component pattern internally: Chat.Provider manages state, Chat.Messages renders the message list with custom LoveableBubble rendering, and Chat.Input handles user input.',
      'Pre-configured with an initial assistant greeting with an emoji reaction: "Hi there! I\'m here to help you create something amazing!" with a heart reaction.',
      'Supports emoji reactions on messages via the message metadata.reaction field, displayed alongside the timestamp.',
      'The assistant avatar uses a gradient (pink, purple, indigo) with a heart emoji center.',
      'User message bubbles use a gradient (pink to purple) with white text, while assistant bubbles have a white/dark card style with a pink border.',
      'The input area includes an image upload button and a placeholder reading "Tell me what you\'d love to create..."',
      'The showcase page presents a more elaborate version with a split-panel layout: a chat panel on the left and a live preview panel on the right with desktop/tablet/mobile responsive preview modes, a browser chrome header, and a Deploy button.',
      'Note: The library export is spelled "LoveableChat" (with an "e") while the showcase tab is labeled "Lovable".',
    ],
  },
}
