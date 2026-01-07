"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, Coins, BookOpen } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: MessageSquare,
    title: "AI Chat Development",
    description:
      "Build ChatGPT-quality applications in weeks, not months. We deliver production-ready AI chat interfaces built on Clarity Chat with enterprise-grade standards.",
    features: [
      "Greenfield AI chat projects",
      "Add AI to existing applications",
      "Custom component development",
      "Full-stack implementation",
    ],
    gradient: "from-primary to-blue-400",
    href: "/services/ai-development",
  },
  {
    icon: Coins,
    title: "Token Optimization",
    description:
      "Reduce your AI API costs by 40-60% with expert token optimization. We audit, analyze, and implement proven strategies for maximum efficiency.",
    features: [
      "API cost analysis & audit",
      "KV-cache optimization",
      "Semantic caching implementation",
      "Ongoing monitoring setup",
    ],
    gradient: "from-accent to-yellow-400",
    href: "/services/token-optimization",
  },
  {
    icon: BookOpen,
    title: "AI-Enhanced Documentation",
    description:
      "Documentation optimized for both humans and AI. Enable AI-assisted development with docs that power code completion and recommendations.",
    features: [
      "AI-optimized doc structure",
      "Semantic chunking strategies",
      "API knowledge integration",
      "Developer portal design",
    ],
    gradient: "from-secondary to-purple-400",
    href: "/services/documentation",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
          <h2 className="text-headline font-bold mb-4">
            Expert <span className="gradient-text">AI Development</span>{" "}
            Services
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Accelerate your AI initiatives with our specialized team
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="premium-card h-full p-8 rounded-2xl flex flex-col">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-primary font-medium group/link"
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
