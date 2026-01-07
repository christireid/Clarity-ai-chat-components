"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  MessageSquare,
  Coins,
  BookOpen,
  Code2,
  Accessibility,
  Package
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Expert React/TypeScript development for complex applications. From UI/UX audits to full MVPs, we build interfaces that developers love.",
    features: [
      "UI/UX audits & redesigns",
      "Feature development",
      "Accessibility audits & refactors",
      "MVP development",
    ],
    gradient: "from-emerald-500 to-teal-400",
    href: "/services",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Applications",
    description:
      "Build ChatGPT-quality chat interfaces using our Clarity Chat library. Production-ready AI applications delivered in weeks, not months.",
    features: [
      "Custom AI chatbots",
      "Enterprise chat interfaces",
      "Multi-provider support",
      "Built on Clarity Chat",
    ],
    gradient: "from-primary to-blue-400",
    href: "/services/ai-development",
  },
  {
    icon: Coins,
    title: "Token Optimization",
    description:
      "Reduce AI API costs by 40-70% with expert analysis. We leverage our token optimization tooling to save companies significant money.",
    features: [
      "Token expenditure assessment",
      "KV-cache optimization",
      "Semantic caching setup",
      "Cost monitoring dashboards",
    ],
    gradient: "from-accent to-yellow-400",
    href: "/services/token-optimization",
  },
  {
    icon: BookOpen,
    title: "AI-Friendly Documentation",
    description:
      "Optimize your technical docs for AI consumption. Enable autocomplete, AI assistants, and ensure AI can fully leverage your software.",
    features: [
      "AI crawlability audits",
      "Semantic structuring",
      "AI doc assistant setup",
      "Developer adoption boost",
    ],
    gradient: "from-secondary to-purple-400",
    href: "/services/documentation",
  },
  {
    icon: Package,
    title: "SDK & API Wrappers",
    description:
      "Wrap complex AI APIs in frontend-friendly React/TypeScript SDKs. Dramatically cut developer adoption time with intuitive interfaces.",
    features: [
      "React/TS SDK development",
      "API abstraction layers",
      "Type-safe interfaces",
      "Developer experience focus",
    ],
    gradient: "from-rose-500 to-pink-400",
    href: "/services",
  },
  {
    icon: Accessibility,
    title: "Accessibility & Compliance",
    description:
      "Ensure your AI applications are accessible to everyone. WCAG AAA audits, remediation, and ongoing compliance monitoring.",
    features: [
      "WCAG AAA audits",
      "Accessibility remediation",
      "Screen reader optimization",
      "Keyboard navigation",
    ],
    gradient: "from-indigo-500 to-violet-400",
    href: "/services",
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

export function ServicesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb gradient-orb-secondary w-[500px] h-[500px] -top-32 -right-32 opacity-20" />
        <div className="gradient-orb gradient-orb-primary w-[400px] h-[400px] bottom-0 -left-32 opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary mb-6">
            Consulting Services
          </span>
          <h2 className="text-headline font-bold mb-4">
            Expert <span className="gradient-text">Development</span> & Consulting
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Code & Clarity builds AI-powered applications and helps teams ship faster.
            From MVPs to enterprise solutions, we deliver excellence.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="premium-card h-full p-6 rounded-2xl flex flex-col">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium group/link"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Not sure which service you need? Let's talk about your project.
          </p>
          <Link
            href="#contact"
            className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg"
          >
            Book a Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection
