"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Layers,
  Coins,
  Palette,
  Code2,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

const componentCategories = [
  {
    name: "Chat Components",
    icon: MessageSquare,
    count: 15,
    description: "Core chat UI components",
    components: [
      {
        name: "ClarityChat",
        description: "Primary drop-in chat component with full functionality",
        code: `import { ClarityChat } from '@clarity-chat/react';

<ClarityChat
  preset="professional"
  onMessage={handleMessage}
/>`,
      },
      {
        name: "ChatWindow",
        description: "Composable chat container with message area and input",
        code: `import { ChatWindow, MessageList, ChatInput } from '@clarity-chat/react';

<ChatWindow>
  <MessageList messages={messages} />
  <ChatInput onSend={handleSend} />
</ChatWindow>`,
      },
      {
        name: "FloatingChatWidget",
        description: "Floating chat bubble widget for customer support",
        code: `import { FloatingChatWidget } from '@clarity-chat/react';

<FloatingChatWidget
  position="bottom-right"
  greeting="How can I help?"
/>`,
      },
      {
        name: "StreamingMessage",
        description: "Message component with streaming text support",
        code: `import { StreamingMessage } from '@clarity-chat/react';

<StreamingMessage
  content={streamingContent}
  isStreaming={isLoading}
/>`,
      },
      {
        name: "ThinkingIndicator",
        description: "AI thinking/processing indicator animation",
        code: `import { ThinkingIndicator } from '@clarity-chat/react';

<ThinkingIndicator variant="dots" />`,
      },
    ],
  },
  {
    name: "Token Management",
    icon: Coins,
    count: 7,
    description: "Cost optimization components",
    components: [
      {
        name: "TokenBudgetBar",
        description: "Visual budget tracking with usage indicator",
        code: `import { TokenBudgetBar } from '@clarity-chat/react';

<TokenBudgetBar
  budget={10000}
  used={3500}
  showCost
/>`,
      },
      {
        name: "TokenCounter",
        description: "Real-time token consumption display",
        code: `import { TokenCounter } from '@clarity-chat/react';

<TokenCounter
  tokens={usage.tokens}
  model="gpt-4"
/>`,
      },
      {
        name: "TokenCostPreview",
        description: "Cost estimation before sending messages",
        code: `import { TokenCostPreview } from '@clarity-chat/react';

<TokenCostPreview
  message={draft}
  model="claude-3-opus"
/>`,
      },
    ],
  },
  {
    name: "Code & AI",
    icon: Code2,
    count: 6,
    description: "Code display and AI features",
    components: [
      {
        name: "CodeBlock",
        description: "Shiki-powered syntax highlighting with 15+ themes",
        code: `import { CodeBlock } from '@clarity-chat/react';

<CodeBlock
  language="typescript"
  theme="github-dark"
  showLineNumbers
>
  {code}
</CodeBlock>`,
      },
      {
        name: "StreamingCodeBlock",
        description: "Code block with streaming text support",
        code: `import { StreamingCodeBlock } from '@clarity-chat/react';

<StreamingCodeBlock
  content={streamingCode}
  language="python"
/>`,
      },
      {
        name: "Citation",
        description: "Source citation display for RAG responses",
        code: `import { Citation } from '@clarity-chat/react';

<Citation
  source={source}
  confidence={0.95}
/>`,
      },
    ],
  },
  {
    name: "UI & Feedback",
    icon: Sparkles,
    count: 23,
    description: "Interactive feedback components",
    components: [
      {
        name: "Toast",
        description: "Toast notifications with multiple variants",
        code: `import { toast } from '@clarity-chat/react';

toast.success('Message sent!');
toast.error('Failed to connect');`,
      },
      {
        name: "Skeleton",
        description: "Loading skeleton with shimmer animation",
        code: `import { Skeleton } from '@clarity-chat/react';

<Skeleton variant="message" count={3} />`,
      },
      {
        name: "FeedbackAnimation",
        description: "Animated feedback for user interactions",
        code: `import { FeedbackAnimation } from '@clarity-chat/react';

<FeedbackAnimation
  variant="success"
  trigger={isSuccess}
/>`,
      },
      {
        name: "AnimatedList",
        description: "List with staggered entry animations",
        code: `import { AnimatedList } from '@clarity-chat/react';

<AnimatedList
  animation="slide-up"
  stagger={0.1}
>
  {items.map(item => <Item key={item.id} />)}
</AnimatedList>`,
      },
    ],
  },
  {
    name: "Themes",
    icon: Palette,
    count: 15,
    description: "Built-in theme presets",
    components: [
      {
        name: "ThemeProvider",
        description: "Theme context provider with 15 presets",
        code: `import { ThemeProvider } from '@clarity-chat/react';

<ThemeProvider theme="midnight">
  <App />
</ThemeProvider>`,
      },
      {
        name: "ThemeSelector",
        description: "Interactive theme switching component",
        code: `import { ThemeSelector } from '@clarity-chat/react';

<ThemeSelector
  themes={['default', 'midnight', 'neon']}
/>`,
      },
    ],
  },
  {
    name: "Hooks",
    icon: Layers,
    count: 95,
    description: "Custom React hooks",
    components: [
      {
        name: "useChat",
        description: "Primary chat hook with streaming support",
        code: `import { useChat } from '@clarity-chat/react';

const { messages, send, isLoading } = useChat({
  onStream: (chunk) => console.log(chunk),
});`,
      },
      {
        name: "useTokenBudget",
        description: "Token budget tracking and management",
        code: `import { useTokenBudget } from '@clarity-chat/react';

const { budget, used, remaining } = useTokenBudget({
  limit: 10000,
});`,
      },
      {
        name: "useMemory",
        description: "Conversation memory with persistence",
        code: `import { useMemory } from '@clarity-chat/react';

const { memories, addMemory, search } = useMemory({
  storage: 'indexeddb',
});`,
      },
      {
        name: "useAutoScroll",
        description: "Automatic scrolling to new messages",
        code: `import { useAutoScroll } from '@clarity-chat/react';

const { ref, scrollToBottom } = useAutoScroll();`,
      },
    ],
  },
];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState(componentCategories[0].name);

  const category = componentCategories.find((c) => c.name === selectedCategory);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Component Library</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              200+ production-ready components and 95+ hooks for building AI chat interfaces.
              Copy, paste, and customize.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-2">
                {componentCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      selectedCategory === cat.name
                        ? "bg-[oklch(0.6_0.15_280/0.1)] text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <cat.icon className={`w-5 h-5 ${
                      selectedCategory === cat.name
                        ? "text-[oklch(0.6_0.15_280)]"
                        : ""
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs opacity-70">{cat.count} items</div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {category && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center holographic-icon">
                      <category.icon className="w-6 h-6 text-[oklch(0.6_0.15_280)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {category.components.map((component) => (
                      <div
                        key={component.name}
                        className="bg-card rounded-2xl border border-border overflow-hidden minimal-card"
                      >
                        <div className="p-6 border-b border-border">
                          <h3 className="text-lg font-semibold mb-1">
                            {component.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {component.description}
                          </p>
                        </div>
                        <div className="relative">
                          <pre className="p-4 overflow-x-auto text-sm">
                            <code className="text-muted-foreground">
                              {component.code}
                            </code>
                          </pre>
                          <CopyButton code={component.code} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[oklch(0.2_0.05_280)] to-[oklch(0.15_0.03_240)] border border-border text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to get started?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get early access to the full component library with all 200+ components.
                </p>
                <Button className="primary-button font-semibold" asChild>
                  <a href="/#contact">
                    Get Early Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
