"use client"

import { motion } from "framer-motion"
import { Search, Lightbulb, Code2, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery",
    description:
      "We start by understanding your goals, technical landscape, and pain points. Whether it's an AI integration, accessibility audit, or documentation overhaul, we map out exactly what success looks like.",
    details: [
      "Technical requirements gathering",
      "Codebase & architecture review",
      "Stakeholder alignment",
    ],
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Strategy",
    description:
      "Based on discovery, we create a detailed implementation plan. You'll know the timeline, deliverables, and exactly how we'll tackle each challenge.",
    details: [
      "Solution architecture",
      "Technology recommendations",
      "Clear milestones & timeline",
    ],
  },
  {
    number: "03",
    icon: Code2,
    title: "Build",
    description:
      "Our team executes with precision. Regular check-ins keep you informed, and our iterative approach means you can provide feedback throughout the process.",
    details: [
      "Agile development sprints",
      "Continuous integration",
      "Weekly progress updates",
    ],
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch & Support",
    description:
      "We don't just ship and disappear. We ensure smooth deployment, provide documentation, and offer ongoing support to keep everything running perfectly.",
    details: [
      "Production deployment",
      "Knowledge transfer",
      "Ongoing maintenance options",
    ],
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export function ProcessSection() {
  return (
    <section id="process" className="relative py-24 overflow-hidden bg-muted/20">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

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
            How We Work
          </span>
          <h2 className="text-headline font-bold mb-4">
            A <span className="gradient-text">Clear Process</span> for Every Project
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            From initial consultation to ongoing support, we follow a proven methodology
            that delivers results consistently.
          </p>
        </motion.div>

        {/* Process steps */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Vertical line connector */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-primary/50 hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } ${index > 0 ? "md:mt-16" : ""}`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`premium-card p-6 md:p-8 rounded-2xl ${
                    index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  }`}>
                    {/* Step number */}
                    <span className="text-5xl font-bold gradient-text opacity-30 mb-4 block">
                      {step.number}
                    </span>

                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    <ul className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className={`flex items-center gap-2 text-sm text-muted-foreground ${
                            index % 2 === 0 ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Icon (center on desktop) */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg glow-primary">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="glass-card inline-block p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">Ready to Get Started?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              Tell us about your project and we'll schedule a free consultation to discuss how we can help.
            </p>
            <Link
              href="#contact"
              className="cta-button inline-flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProcessSection
