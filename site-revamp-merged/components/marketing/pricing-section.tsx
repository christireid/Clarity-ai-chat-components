"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

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
    href: "#contact",
    highlighted: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export function PricingSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 radial-gradient-bg opacity-50" />
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
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={itemVariants}
              className={`relative ${tier.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Recommended badge */}
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
                {/* Tier name */}
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tier.highlighted
                            ? "bg-primary/20"
                            : "bg-muted"
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

                {/* CTA */}
                <Link
                  href={tier.href}
                  className={`w-full py-3 px-6 rounded-xl text-center font-medium transition-all inline-flex items-center justify-center gap-2 ${
                    tier.highlighted
                      ? "cta-button"
                      : "secondary-button"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            All plans include TypeScript definitions, SSR support, and our documentation.
            <br />
            <Link href="/docs/license" className="text-primary hover:underline">
              View license details
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
