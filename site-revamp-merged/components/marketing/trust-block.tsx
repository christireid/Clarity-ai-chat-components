"use client"

import { motion } from "framer-motion"
import { Box, Layers, Palette, Percent, Code2, Shield } from "lucide-react"

const stats = [
  {
    icon: Box,
    value: "200",
    suffix: "+",
    label: "React Components",
  },
  {
    icon: Layers,
    value: "95",
    suffix: "+",
    label: "Custom Hooks",
  },
  {
    icon: Palette,
    value: "15",
    suffix: "",
    label: "Theme Presets",
  },
  {
    icon: Percent,
    value: "60-90",
    suffix: "%",
    label: "Cost Savings",
  },
]

const highlights = [
  {
    icon: Code2,
    title: "100% TypeScript",
    description: "Fully typed with strict mode enabled",
  },
  {
    icon: Shield,
    title: "WCAG AAA",
    description: "Accessibility-first design",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export function TrustBlock() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 radial-gradient-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-headline font-bold mb-4">
            The <span className="gradient-text">Complete</span> AI Chat Library
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Not just a SDK - it's a production-ready UI platform with everything you need.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl feature-icon mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold">
                <span className="gradient-text">{stat.value}</span>
                <span className="text-muted-foreground">{stat.suffix}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.title}
              variants={itemVariants}
              className="premium-card p-6 rounded-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl feature-icon flex items-center justify-center">
                <highlight.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{highlight.title}</div>
                <div className="text-sm text-muted-foreground">
                  {highlight.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            249K+ lines of meticulously crafted, tested code
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default TrustBlock
