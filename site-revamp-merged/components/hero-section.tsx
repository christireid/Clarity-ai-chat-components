"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { EmailSignupModal } from "./email-signup-modal";

export function HeroSection() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] gradient-blob" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] gradient-blob"
          style={{ animationDelay: "10s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl text-center">
        <div className="space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border fade-in">
            <Sparkles className="w-4 h-4 text-[oklch(0.6_0.15_280)]" />
            <span className="text-sm font-medium">200+ Components &bull; 95+ Hooks &bull; 15 Themes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance fade-in">
            Ship AI Chat UIs in{" "}
            <span className="gradient-text">
              Minutes, Not Months
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed fade-in-delay-1">
            The complete React component library for AI chat interfaces.
            Built-in token optimization saves 60-90% on AI costs.
            WCAG AAA accessible out of the box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 fade-in-delay-2">
            <Button
              size="lg"
              onClick={() => setShowSignup(true)}
              className="w-full sm:w-auto text-lg px-12 py-7 primary-button font-semibold"
            >
              Get Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-lg px-12 py-7 font-medium hover:bg-muted transition-all duration-300"
            >
              <a href="#features">See Features</a>
            </Button>
          </div>

          <div className="pt-8 fade-in-delay-3">
            <HeroChatDemo />
          </div>
        </div>
      </div>

      <EmailSignupModal open={showSignup} onOpenChange={setShowSignup} />
    </section>
  );
}

function HeroChatDemo() {
  const [messages] = useState([
    { role: "user", content: "How do I implement streaming in my chat app?" },
    { role: "assistant", content: "With Clarity Chat, streaming is built-in! Just use the `useChat` hook:\n\n```tsx\nconst { messages, isStreaming } = useChat({\n  onStream: (chunk) => console.log(chunk)\n});\n```\n\nThe `StreamingMessage` component handles the UI automatically." },
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">ClarityChat Demo</span>
          <div className="w-16" />
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap text-left">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm"
              disabled
            />
            <Button size="sm" className="primary-button">
              Send
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Live interactive demo &bull; Built with actual Clarity Chat components
      </p>
    </div>
  );
}
