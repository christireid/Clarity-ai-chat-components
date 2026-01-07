"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  Send,
  Settings,
  Code2,
  Palette,
  Sparkles,
  Check,
  Copy,
  Sun,
  Moon,
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
  "What providers are supported?",
]

const codeExamples = {
  basic: `import { useChat } from '@clarity/chat';

function ChatApp() {
  const { messages, sendMessage, isLoading } = useChat({
    provider: 'openai',
    model: 'gpt-4',
  });

  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </ChatContainer>
  );
}`,
  streaming: `import { useStreamingChat } from '@clarity/chat';

function StreamingChat() {
  const { messages, send, isStreaming } = useStreamingChat({
    provider: 'anthropic',
    model: 'claude-3-opus',
    onToken: (token) => console.log('Token:', token),
  });

  return (
    <ChatContainer>
      <MessageList messages={messages} showTypingIndicator={isStreaming} />
      <ChatInput onSend={send} />
    </ChatContainer>
  );
}`,
  tokenOptimized: `import { useChat, TokenOptimizer } from '@clarity/chat';

function OptimizedChat() {
  const { messages, send } = useChat({
    provider: 'openai',
    tokenOptimization: {
      kvCacheAlignment: true,
      semanticCaching: true,
      maxContextTokens: 4000,
    },
  });

  return (
    <TokenOptimizer savings={true}>
      <ChatContainer>
        <MessageList messages={messages} />
        <ChatInput onSend={send} />
      </ChatContainer>
    </TokenOptimizer>
  );
}`,
}

const aiResponses: Record<string, string> = {
  "How do I implement streaming?": `To implement streaming with Clarity Chat, use the \`useStreamingChat\` hook:

\`\`\`tsx
const { messages, send, isStreaming } = useStreamingChat({
  provider: 'openai',
  onToken: (token) => console.log(token),
});
\`\`\`

The hook automatically handles SSE connections and provides real-time updates.`,
  "Show me token optimization": `Token optimization in Clarity Chat can reduce your API costs by 40-60%. Enable it like this:

\`\`\`tsx
useChat({
  tokenOptimization: {
    kvCacheAlignment: true,
    semanticCaching: true,
    dynamicLimits: true,
  },
});
\`\`\`

KV-cache alignment ensures optimal prompt structure for faster inference.`,
  "What providers are supported?": `Clarity Chat supports multiple AI providers through a unified API:

- **OpenAI** - GPT-4, GPT-3.5
- **Anthropic** - Claude 3 Opus, Sonnet, Haiku
- **Google** - Gemini Pro, Gemini Ultra

Switch providers with a single prop change - no code refactoring needed.`,
}

export function ChatDemoSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>("basic")
  const [copied, setCopied] = useState(false)
  const [demoTheme, setDemoTheme] = useState<"dark" | "light">("dark")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    }, 50)
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

    // Simulate AI response
    setTimeout(() => {
      const responseContent =
        aiResponses[content.trim()] ||
        "I can help you with Clarity Chat! Try asking about streaming, token optimization, or supported providers."

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
            Interactive demo of Clarity Chat components with live code preview
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
                <span className="ml-2 text-sm text-muted-foreground">
                  Clarity Chat Demo
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

            {/* Chat area */}
            <div
              className={`h-[400px] flex flex-col ${
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
                      Try asking a question
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
                    placeholder="Ask anything about Clarity Chat..."
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
                <span className="text-xs text-muted-foreground">Provider:</span>
                <select className="text-xs bg-muted px-2 py-1 rounded">
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                  <option>Google</option>
                </select>
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
                <span className="text-sm font-medium">Code</span>
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
                    ? "Basic"
                    : tab === "streaming"
                      ? "Streaming"
                      : "Optimized"}
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
                Token-optimized
              </span>
              <Check className="w-4 h-4 text-green-500 ml-4" />
              <span className="text-xs text-muted-foreground">
                Multi-provider
              </span>
              <Check className="w-4 h-4 text-green-500 ml-4" />
              <span className="text-xs text-muted-foreground">Accessible</span>
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
      /(import|from|function|const|return|true|false)/g,
      '<span class="text-primary">$1</span>'
    )
    .replace(
      /('[@\w\/\-.]+')/g,
      '<span class="text-accent">$1</span>'
    )
    .replace(
      /(useChat|useStreamingChat|ChatContainer|MessageList|ChatInput|TokenOptimizer)/g,
      '<span class="text-secondary">$1</span>'
    )
    .replace(
      /(\/\/.+)/g,
      '<span class="text-muted-foreground">$1</span>'
    )
}

export default ChatDemoSection
