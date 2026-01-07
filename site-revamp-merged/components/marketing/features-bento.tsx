"use client"

import { motion } from "framer-motion"
import {
  Zap,
  Coins,
  Radio,
  Accessibility,
  Plug,
  Brain,
  Shield,
  Code2,
  Box,
  Palette,
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

// Animated token savings visualization
function TokenChart() {
  return (
    <div className="mt-4 flex items-end gap-2 h-20">
      {[40, 65, 85, 55, 90, 45, 75].map((height, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/50 to-primary"
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
        />
      ))}
    </div>
  )
}

// Animated streaming dots
function StreamingVisual() {
  return (
    <div className="mt-4 flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Component count visualization
function ComponentGrid() {
  return (
    <div className="mt-4 grid grid-cols-8 gap-1">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-sm bg-primary"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.3 + (i % 3) * 0.2, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.02 }}
        />
      ))}
    </div>
  )
}

export function FeaturesBento() {
  return (
    <section className="relative py-24 overflow-hidden">
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
          <h2 className="text-headline font-bold mb-4">
            Why teams choose{" "}
            <span className="gradient-text">Clarity Chat</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            The most complete AI chat component library available
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1 - Components count */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">200+ Components</h3>
            <p className="text-sm text-muted-foreground">
              Production-ready UI components
            </p>
            <ComponentGrid />
          </motion.div>

          {/* Token Optimization - Large */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Coins className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Token Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Built-in budget tracking, KV-cache alignment, and semantic caching
            </p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold gradient-text-gold">
                60-90%
              </span>
              <span className="text-muted-foreground">cost savings</span>
            </div>
            <TokenChart />
          </motion.div>

          {/* Themes */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">15 Theme Presets</h3>
            <p className="text-sm text-muted-foreground">
              Instant customization
            </p>
            <div className="mt-4 flex gap-1">
              {["bg-primary", "bg-secondary", "bg-accent", "bg-emerald-500", "bg-rose-500"].map((bg, i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-6 rounded-full ${bg}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Row 2 - Streaming */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Radio className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Streaming Excellence</h3>
            <p className="text-sm text-muted-foreground">
              SSE & WebSocket hooks with real-time UI updates and optimistic rendering
            </p>
            <StreamingVisual />
          </motion.div>

          {/* Multi-Provider */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Plug className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Provider</h3>
            <p className="text-sm text-muted-foreground">
              One API, any provider
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["OpenAI", "Claude", "Gemini"].map((provider) => (
                <span
                  key={provider}
                  className="text-xs px-2 py-1 rounded-full bg-muted"
                >
                  {provider}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Memory */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Built-in Memory</h3>
            <p className="text-sm text-muted-foreground">
              Zero-config persistence
            </p>
            <div className="mt-4">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 w-2 rounded-sm ${
                      i < 5 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Row 3 - Accessibility */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Accessibility className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">WCAG AAA Accessible</h3>
            <p className="text-sm text-muted-foreground">
              Full keyboard navigation, screen reader support, high contrast modes
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold gradient-text">AAA</span>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                <span className="text-sm text-muted-foreground">
                  Keyboard-first
                </span>
              </div>
            </div>
          </motion.div>

          {/* Test Coverage */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Enterprise Ready</h3>
            <p className="text-sm text-muted-foreground">
              100% TypeScript strict mode, comprehensive test coverage
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold gradient-text">313</span>
                <span className="text-muted-foreground"> tests</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="text-3xl font-bold gradient-text">80%+</span>
                <span className="text-muted-foreground"> coverage</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  All passing
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hooks count */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">95+ Hooks</h3>
            <p className="text-sm text-muted-foreground">
              Full headless control
            </p>
            <div className="mt-4">
              <span className="text-3xl font-bold gradient-text">95+</span>
            </div>
          </motion.div>

          {/* DX */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl lg:col-span-3"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Developer Experience</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Intuitive APIs designed for React developers
            </p>
            <div className="code-block rounded-lg p-4 text-sm font-mono">
              <div className="text-muted-foreground">
                {"// Full chat UI in one line"}
              </div>
              <div>
                <span className="text-primary">import</span>
                {" { "}
                <span className="text-secondary">ClarityChat</span>
                {" } "}
                <span className="text-primary">from</span>
                <span className="text-accent"> '@clarity-chat/react'</span>
              </div>
              <div className="mt-2">
                {"<"}
                <span className="text-secondary">ClarityChat</span>
                {" "}
                <span className="text-accent">preset</span>
                {"="}
                <span className="text-accent">"professional"</span>
                {" />"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesBento
