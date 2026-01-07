"use client";

import { Check, X, Minus } from "lucide-react";

const comparisonData = [
  {
    feature: "Ready-to-use Components",
    clarity: "200+",
    vercel: "0",
    assistant: "0",
    chatscope: "~50",
  },
  {
    feature: "Custom Hooks",
    clarity: "95+",
    vercel: "3",
    assistant: "10+",
    chatscope: "~20",
  },
  {
    feature: "Theme Presets",
    clarity: "15",
    vercel: "0",
    assistant: "0",
    chatscope: "1",
  },
  {
    feature: "Token Optimization",
    clarity: true,
    vercel: false,
    assistant: false,
    chatscope: false,
  },
  {
    feature: "Memory System",
    clarity: true,
    vercel: false,
    assistant: false,
    chatscope: false,
  },
  {
    feature: "RAG Pipeline",
    clarity: true,
    vercel: false,
    assistant: false,
    chatscope: false,
  },
  {
    feature: "Accessibility",
    clarity: "WCAG AAA",
    vercel: "WCAG AA",
    assistant: "WCAG AA",
    chatscope: "WCAG AA",
  },
  {
    feature: "Animation System",
    clarity: "150+",
    vercel: false,
    assistant: false,
    chatscope: false,
  },
  {
    feature: "TypeScript",
    clarity: "100%",
    vercel: "100%",
    assistant: "100%",
    chatscope: "100%",
  },
  {
    feature: "React 19 Ready",
    clarity: true,
    vercel: true,
    assistant: "partial",
    chatscope: false,
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-500/50 mx-auto" />;
  }
  if (value === "partial") {
    return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />;
  }
  return <span className="font-medium">{value}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Not Just a SDK</span> - A Complete Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Clarity Chat compares to other solutions in the market.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold">Feature</th>
                <th className="text-center py-4 px-4">
                  <div className="font-bold text-lg gradient-text">Clarity Chat</div>
                </th>
                <th className="text-center py-4 px-4">
                  <div className="font-medium text-muted-foreground">Vercel AI SDK</div>
                </th>
                <th className="text-center py-4 px-4">
                  <div className="font-medium text-muted-foreground">assistant-ui</div>
                </th>
                <th className="text-center py-4 px-4">
                  <div className="font-medium text-muted-foreground">chatscope</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4 text-sm">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-sm bg-[oklch(0.6_0.15_280/0.05)]">
                    <CellValue value={row.clarity} />
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                    <CellValue value={row.vercel} />
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                    <CellValue value={row.assistant} />
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                    <CellValue value={row.chatscope} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Clarity Chat reduces development time from weeks to minutes while providing institutional-grade features.
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-card border border-border">
            <div className="text-left">
              <div className="text-2xl font-bold gradient-text">249K+</div>
              <div className="text-xs text-muted-foreground">Lines of code</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-left">
              <div className="text-2xl font-bold gradient-text">80%+</div>
              <div className="text-xs text-muted-foreground">Test coverage</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-left">
              <div className="text-2xl font-bold gradient-text">100%</div>
              <div className="text-xs text-muted-foreground">TypeScript</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
