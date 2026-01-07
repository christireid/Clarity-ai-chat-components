"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  Send,
  Settings,
  Code2,
  Sparkles,
  Check,
  Copy,
  Sun,
  Moon,
  Coins,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

const presetQuestions = [
  "How do I implement streaming?",
  "Show me token optimization",
  "What components are included?",
]

const codeExamples = {
  basic: `import { ClarityChat } from '@clarity-chat/react';

function App() {
  return (
    <ClarityChat
      preset="professional"
      provider="openai"
      model="gpt-4"
      onMessage={(msg) => console.log(msg)}
    />
  );
}

// That's it! Full chat UI in one line.`,
  streaming: `import { useChat, StreamingMessage } from '@clarity-chat/react';

function StreamingChat() {
  const { messages, send, isStreaming } = useChat({
    provider: 'anthropic',
    model: 'claude-3-opus',
    streaming: true,
  });

  return (
    <ChatWindow>
      <MessageList messages={messages}>
        {isStreaming && <StreamingMessage />}
      </MessageList>
      <ChatInput onSend={send} />
    </ChatWindow>
  );
}`,
  tokenOptimized: `import { useChat, TokenBudgetBar } from '@clarity-chat/react';

function OptimizedChat() {
  const { messages, send, tokenUsage } = useChat({
    tokenOptimization: {
      budget: 10000,
      kvCacheAlignment: true,
      semanticCaching: true,
    },
  });

  return (
    <>
      <TokenBudgetBar
        budget={10000}
        used={tokenUsage.total}
        showSavings
      />
      <ChatWindow>
        <MessageList messages={messages} />
        <ChatInput onSend={send} />
      </ChatWindow>
    </>
  );
}`,
}

const aiResponses: Record<string, string> = {
  "How do I implement streaming?": `Streaming is built-in with Clarity Chat! Use the \`useChat\` hook with streaming enabled:

\`\`\`tsx
const { messages, send, isStreaming } = useChat({
  streaming: true,
  onToken: (token) => console.log(token),
});
\`\`\`

The \`StreamingMessage\` component handles the UI automatically with smooth text animation.`,
  "Show me token optimization": `Token optimization can save you 60-90% on API costs! Here's how:

\`\`\`tsx
<TokenBudgetBar budget={10000} used={3500} showSavings />

useChat({
  tokenOptimization: {
    budget: 10000,
    kvCacheAlignment: true,
    semanticCaching: true,
  },
});
\`\`\`

The \`TokenBudgetBar\` component visualizes your savings in real-time.`,
  "What components are included?": `Clarity Chat includes **200+ components** and **95+ hooks**:

**Chat Components:** ClarityChat, ChatWindow, MessageList, ChatInput, StreamingMessage, ThinkingIndicator, FloatingChatWidget...

**Token Management:** TokenBudgetBar, TokenCounter, TokenCostPreview, TokenOptimizationDashboard...

**UI Components:** Toast, Skeleton, FeedbackAnimation, AnimatedList, CodeBlock...

All with **15 theme presets** and **WCAG AAA accessibility**.`,
}

export function ChatDemoSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>("basic")
  const [copied, setCopied] = useState(false)
  const [demoTheme, setDemoTheme] = useState<"dark" | "light">("dark")
  const [tokenSavings, setTokenSavings] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate token savings accumulating
  useEffect(() => {
    if (messages.length > 0) {
      const interval = setInterval(() => {
        setTokenSavings(prev => Math.min(prev + Math.random() * 5, 127.40))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [messages.length])

  const simulateStreaming = (text: string, messageId: string) => {
    let index = 0
    const words = text.split(" ")

    const interval = setInterval(() => {
      if (index < words.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: words.slice(0, index + 1).join(" "),
                  isStreaming: index < words.length - 1,
                }
              : msg
          )
        )
        index++
      } else {
        clearInterval(interval)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          )
        )
        setIsTyping(false)
      }
    }, 40)
  }

  const sendMessage = (content: string) => {
    if (!content.trim() || isTyping) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const responseContent =
        aiResponses[content.trim()] ||
        "I can help you with Clarity Chat! Try asking about streaming, token optimization, or what components are included."

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        isStreaming: true,
      }

      setMessages((prev) => [...prev, assistantMessage])
      simulateStreaming(responseContent, assistantMessage.id)
    }, 500)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative py-24 overflow-hidden" id="demo">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline font-bold mb-4">
            See it in <span className="gradient-text">action</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Interactive demo built with actual Clarity Chat components
          </p>
        </motion.div>

        {/* Demo container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Chat demo */}
          <div className="premium-card rounded-2xl overflow-hidden">
            {/* Demo header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-sm text-muted-foreground font-mono">
                  &lt;ClarityChat /&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setDemoTheme(demoTheme === "dark" ? "light" : "dark")
                  }
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Toggle theme"
                >
                  {demoTheme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Token savings bar - simulating TokenBudgetBar component */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-b border-white/10 bg-muted/30">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    Token Budget
                  </span>
                  <span className="text-green-500 font-medium">
                    Saved: ${tokenSavings.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}

            {/* Chat area */}
            <div
              className={`h-[350px] flex flex-col ${
                demoTheme === "light" ? "bg-white text-black" : ""
              }`}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Sparkles
                      className={`w-8 h-8 mb-3 ${
                        demoTheme === "light"
                          ? "text-blue-500"
                          : "text-primary"
                      }`}
                    />
                    <p
                      className={`text-sm mb-4 ${
                        demoTheme === "light"
                          ? "text-gray-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      Try the interactive demo
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {presetQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            demoTheme === "light"
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 ${
                          message.role === "user"
                            ? demoTheme === "light"
                              ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
                              : "chat-bubble-user"
                            : demoTheme === "light"
                              ? "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm"
                              : "chat-bubble-ai"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                          {message.isStreaming && (
                            <span className="typing-cursor" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className={`p-4 border-t ${
                  demoTheme === "light" ? "border-gray-200" : "border-white/10"
                }`}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(inputValue)
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about Clarity Chat..."
                    disabled={isTyping}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors ${
                      demoTheme === "light"
                        ? "bg-gray-100 text-gray-900 placeholder:text-gray-400"
                        : "bg-muted placeholder:text-muted-foreground/50"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center disabled:opacity-50 transition-opacity"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </div>

            {/* Demo controls */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">Components:</span>
                <div className="flex gap-1">
                  {["ChatWindow", "MessageList", "ChatInput"].map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Token-optimized
                </span>
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="premium-card rounded-2xl overflow-hidden">
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Implementation</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code tabs */}
            <div className="flex border-b border-white/10">
              {(
                Object.keys(codeExamples) as Array<keyof typeof codeExamples>
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "basic"
                    ? "Quick Start"
                    : tab === "streaming"
                      ? "Streaming"
                      : "Token Optimized"}
                </button>
              ))}
            </div>

            {/* Code content */}
            <div className="h-[400px] overflow-auto p-4">
              <pre className="text-sm font-mono">
                <code>
                  {codeExamples[activeTab].split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-muted-foreground/50 select-none text-right pr-4">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: syntaxHighlight(line),
                        }}
                      />
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Code footer */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                200+ components
              </span>
              <Check className="w-4 h-4 text-green-500 ml-4" />
              <span className="text-xs text-muted-foreground">
                95+ hooks
              </span>
              <Check className="w-4 h-4 text-green-500 ml-4" />
              <span className="text-xs text-muted-foreground">WCAG AAA</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Simple syntax highlighting
function syntaxHighlight(code: string): string {
  return code
    .replace(
      /(import|from|function|const|return|true|false|export)/g,
      '<span class="text-primary">$1</span>'
    )
    .replace(
      /('[@\w\/\-.]+')/g,
      '<span class="text-accent">$1</span>'
    )
    .replace(
      /(useChat|ClarityChat|ChatWindow|MessageList|ChatInput|StreamingMessage|TokenBudgetBar|ThinkingIndicator)/g,
      '<span class="text-secondary">$1</span>'
    )
    .replace(
      /(\/\/.+)/g,
      '<span class="text-muted-foreground">$1</span>'
    )
}

export default ChatDemoSection
