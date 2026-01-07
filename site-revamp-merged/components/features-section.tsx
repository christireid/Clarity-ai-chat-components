"use client";

import { useRef, useState, useEffect } from "react";
import {
  Coins,
  Brain,
  Sparkles,
  Shield,
  Accessibility,
  Code2,
} from "lucide-react";

const features = [
  {
    icon: Coins,
    title: "Token Optimization",
    description:
      "Save 60-90% on AI inference costs with automatic token budget tracking and smart context bundling. Unique to Clarity Chat.",
    highlight: "60-90% savings",
    demo: <TokenBudgetDemo />,
  },
  {
    icon: Brain,
    title: "Built-in Memory System",
    description:
      "Zero-config conversation memory with multiple storage backends. In-memory, IndexedDB, file-based, or Redis - all built in.",
    highlight: "Zero config",
    demo: <MemoryDemo />,
  },
  {
    icon: Sparkles,
    title: "150+ Animations",
    description:
      "Framer Motion powered with full prefers-reduced-motion support. Fade, slide, scale, bounce, and more - all accessible.",
    highlight: "WCAG 2.3.3 compliant",
    demo: <AnimationDemo />,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "OWASP LLM Top 10 2025 compliant. Prompt injection detection with 90%+ accuracy. PII masking and XSS protection built in.",
    highlight: "90%+ detection",
    demo: <SecurityDemo />,
  },
  {
    icon: Accessibility,
    title: "WCAG AAA Accessible",
    description:
      "Full keyboard navigation, screen reader support, high contrast modes. Skip links, ARIA live regions, focus management.",
    highlight: "AAA compliant",
    demo: <AccessibilityDemo />,
  },
  {
    icon: Code2,
    title: "Shiki Code Blocks",
    description:
      "15+ syntax highlighting themes with diff support and copy functionality. Streaming code blocks for AI responses.",
    highlight: "15+ themes",
    demo: <CodeBlockDemo />,
  },
];

function TokenBudgetDemo() {
  const [usage, setUsage] = useState(35);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsage((prev) => (prev >= 85 ? 35 : prev + Math.random() * 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background/50 rounded-lg p-3 space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Token Budget</span>
        <span className="font-mono">{Math.round(usage)}% used</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[oklch(0.6_0.15_280)] to-[oklch(0.65_0.12_200)] transition-all duration-500"
          style={{ width: `${usage}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Saved: <span className="text-green-500 font-semibold">$127.40</span> this month
      </div>
    </div>
  );
}

function MemoryDemo() {
  return (
    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>3 memories stored</span>
      </div>
      <div className="space-y-1 text-muted-foreground">
        <div className="truncate">User prefers TypeScript examples</div>
        <div className="truncate">Working on chat app project</div>
        <div className="truncate">Uses React 19</div>
      </div>
    </div>
  );
}

function AnimationDemo() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setAnimate((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background/50 rounded-lg p-3 flex gap-2 justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full bg-[oklch(0.6_0.15_280)] transition-all duration-500 ${
            animate ? "scale-125 opacity-100" : "scale-100 opacity-50"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}

function SecurityDemo() {
  return (
    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-xs">
      <div className="flex items-center gap-2 text-green-500">
        <Shield className="w-3 h-3" />
        <span>All checks passed</span>
      </div>
      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>Prompt injection</span>
          <span className="text-green-500">Clean</span>
        </div>
        <div className="flex justify-between">
          <span>PII detected</span>
          <span className="text-green-500">None</span>
        </div>
      </div>
    </div>
  );
}

function AccessibilityDemo() {
  return (
    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Tab</kbd>
        <span className="text-muted-foreground">Navigate</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">?</kbd>
        <span className="text-muted-foreground">Shortcuts</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
        <span className="text-muted-foreground">Close</span>
      </div>
    </div>
  );
}

function CodeBlockDemo() {
  return (
    <div className="bg-background/50 rounded-lg p-3 font-mono text-xs overflow-hidden">
      <div className="text-muted-foreground mb-1">typescript</div>
      <pre className="text-[10px] leading-relaxed">
        <span className="text-[oklch(0.6_0.15_280)]">const</span>{" "}
        <span className="text-[oklch(0.65_0.12_200)]">chat</span> ={" "}
        <span className="text-[oklch(0.6_0.15_280)]">useChat</span>()
      </pre>
    </div>
  );
}

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = containerRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Build AI Chat</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not just a SDK - it's a complete UI platform with features you won't find anywhere else.
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`minimal-card bg-card rounded-2xl border border-border p-6 transition-all duration-500 ${
                visibleCards.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center holographic-icon">
                  <feature.icon className="w-6 h-6 text-[oklch(0.6_0.15_280)]" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[oklch(0.6_0.15_280/0.1)] text-[oklch(0.6_0.15_280)]">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>
              {feature.demo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
