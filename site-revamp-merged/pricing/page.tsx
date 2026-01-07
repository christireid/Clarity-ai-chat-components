import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Check, Sparkles, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Clarity Chat. Start free, scale as you grow.",
}

const tiers = [
  {
    name: "Community",
    price: "$0",
    period: "forever",
    description: "Perfect for side projects and learning",
    features: [
      "Core chat components",
      "Basic hooks (useChat, useMessages)",
      "MIT licensed",
      "GitHub issues support",
      "Community Discord access",
    ],
    cta: "Get Started",
    href: "/docs/getting-started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$299",
    period: "/dev/year",
    description: "For teams building production AI apps",
    features: [
      "Everything in Community",
      "Token optimization hooks",
      "Memory management components",
      "Advanced streaming hooks",
      "Multi-provider support",
      "Priority email support",
      "Private Discord channel",
      "Early access to features",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with specific needs",
    features: [
      "Everything in Pro",
      "Volume licensing",
      "SLA guarantee",
      "Dedicated support engineer",
      "Custom integrations",
      "On-premise deployment option",
      "Security audit reports",
      "Training sessions",
    ],
    cta: "Contact Sales",
    href: "/#contact",
    highlighted: false,
  },
]

const faqs = [
  {
    question: "Can I try Pro before committing?",
    answer:
      "Yes! We offer a 14-day free trial of Pro with no credit card required. Experience all features before making a decision.",
  },
  {
    question: "What happens when my license expires?",
    answer:
      "Your code continues to work forever. An active license is required for updates, new features, and support access.",
  },
  {
    question: "Do you offer educational discounts?",
    answer:
      "Yes! We offer 50% off for students and educators. Contact us with a valid educational email address.",
  },
  {
    question: "Can I upgrade or downgrade at any time?",
    answer:
      "Absolutely. Upgrade anytime and pay the prorated difference. Downgrade takes effect at your next renewal.",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-display font-bold mb-6">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h1>
            <p className="text-body-large text-muted-foreground">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative ${tier.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="badge-gradient px-4 py-1 rounded-full text-sm inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended
                    </span>
                  </div>
                )}

                <div
                  className={`h-full p-8 rounded-2xl flex flex-col ${
                    tier.highlighted
                      ? "premium-card border-primary/30 glow-primary"
                      : "glass-card"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tier.highlighted ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              tier.highlighted
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`w-full py-3 px-6 rounded-xl text-center font-medium transition-all inline-flex items-center justify-center gap-2 ${
                      tier.highlighted ? "cta-button" : "secondary-button"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include TypeScript definitions, SSR support, and our
              documentation.
              <br />
              <Link
                href="/docs/license"
                className="text-primary hover:underline"
              >
                View license details
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="glass-card p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-headline font-bold mb-4">Still Have Questions?</h2>
          <p className="text-body-large text-muted-foreground mb-8">
            Our team is here to help you find the right plan for your needs.
          </p>
          <Link
            href="/#contact"
            className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
