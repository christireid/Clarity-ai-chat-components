"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { EmailSignupModal } from "@/components/email-signup-modal";

const plans = [
  {
    name: "Open Source",
    price: "Free",
    description: "Everything you need to build AI chat interfaces",
    highlight: false,
    features: [
      "200+ React components",
      "95+ custom hooks",
      "15 theme presets",
      "Token optimization utilities",
      "Memory system (in-memory)",
      "WCAG AAA accessibility",
      "MIT License",
      "Community support",
    ],
    cta: "Get Started",
    ctaLink: "https://github.com/christireid/Clarity-ai-chat-components",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For teams building production applications",
    highlight: true,
    features: [
      "Everything in Open Source",
      "Priority email support",
      "Pro theme pack (10+ themes)",
      "Advanced code examples",
      "Memory system (all backends)",
      "Early access to new features",
      "Private Discord channel",
      "Video tutorials",
    ],
    cta: "Get Early Access",
    ctaAction: "signup",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with specific requirements",
    highlight: false,
    features: [
      "Everything in Pro",
      "SSO/RBAC components",
      "Dedicated support engineer",
      "Custom theming service",
      "SLA guarantee",
      "Security review",
      "On-premise deployment",
      "Training sessions",
    ],
    cta: "Contact Sales",
    ctaLink: "#contact",
  },
];

export default function PricingPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6">
              <Sparkles className="w-4 h-4 text-[oklch(0.6_0.15_280)]" />
              <span className="text-sm font-medium">Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free with our open source library. Upgrade for premium features and support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-[oklch(0.6_0.15_280)] bg-[oklch(0.6_0.15_280/0.05)]"
                    : "border-border bg-card"
                } minimal-card`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[oklch(0.6_0.15_280)] to-[oklch(0.65_0.12_200)] text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-[oklch(0.6_0.15_280)] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.ctaAction === "signup" ? (
                  <Button
                    onClick={() => setShowSignup(true)}
                    className={`w-full ${
                      plan.highlight ? "primary-button" : ""
                    } font-semibold`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    asChild
                    className={`w-full ${
                      plan.highlight ? "primary-button" : ""
                    } font-semibold`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <a href={plan.ctaLink}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-2">Is the open source version really free?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! The core library with 200+ components and 95+ hooks is completely free and open source under the MIT license. You can use it in commercial projects without any restrictions.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-2">What's included in the Pro plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Pro includes priority support, additional premium themes, advanced code examples with real-world patterns, access to all memory system backends, and early access to new features before they're released publicly.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-2">How does token optimization save money?</h3>
                <p className="text-sm text-muted-foreground">
                  Our token optimization system automatically tracks context, bundles related information efficiently, and prunes unnecessary tokens. Users typically see 60-90% cost savings on AI inference costs compared to naive implementations.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee for Pro subscriptions. If you're not satisfied, contact us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <EmailSignupModal open={showSignup} onOpenChange={setShowSignup} />
    </>
  );
}
