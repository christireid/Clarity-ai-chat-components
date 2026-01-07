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
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "50ms average interaction time with optimistic UI updates",
    size: "small",
    highlight: "50ms",
  },
  {
    icon: Coins,
    title: "Token Optimization",
    description:
      "KV-cache alignment, semantic caching, and dynamic output limits save 40-60% on API costs",
    size: "large",
    highlight: "40-60%",
    visual: "token-chart",
  },
  {
    icon: Radio,
    title: "Streaming Excellence",
    description:
      "SSE & WebSocket hooks with real-time UI updates and optimistic rendering for seamless chat experiences",
    size: "large",
    highlight: "Real-time",
    visual: "streaming",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "WCAG 2.1 AA compliant with full keyboard navigation",
    size: "small",
    highlight: "WCAG 2.1",
  },
  {
    icon: Plug,
    title: "Multi-Provider",
    description: "OpenAI, Anthropic Claude, Google Gemini with one unified API",
    size: "medium",
    highlight: "Unified API",
  },
  {
    icon: Brain,
    title: "Memory Management",
    description:
      "Conversation context, sliding window, and hybrid summarization strategies",
    size: "medium",
    highlight: "Smart Context",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "TypeScript strict mode, 181/181 tests passing, battle-tested",
    size: "medium",
    highlight: "181 tests",
  },
]

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
            Everything you need to build production-ready AI chat interfaces
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
          {/* Row 1 */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              50ms average interaction time
            </p>
            <div className="mt-4">
              <span className="text-3xl font-bold gradient-text">50ms</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Coins className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Token Optimization</h3>
            <p className="text-sm text-muted-foreground">
              KV-cache alignment, semantic caching, dynamic output limits
            </p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold gradient-text-gold">
                40-60%
              </span>
              <span className="text-muted-foreground">cost savings</span>
            </div>
            <TokenChart />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Accessibility className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Accessible</h3>
            <p className="text-sm text-muted-foreground">
              WCAG 2.1 AA compliant
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">AA</span>
              <span className="text-sm text-muted-foreground">
                keyboard-first
              </span>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Radio className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Streaming Excellence</h3>
            <p className="text-sm text-muted-foreground">
              SSE & WebSocket hooks with real-time UI updates and optimistic
              rendering
            </p>
            <StreamingVisual />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Plug className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Provider</h3>
            <p className="text-sm text-muted-foreground">
              OpenAI, Claude, Gemini
            </p>
            <div className="mt-4 flex gap-2">
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

          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Memory Management</h3>
            <p className="text-sm text-muted-foreground">
              Smart context windows
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

          {/* Row 3 */}
          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="feature-icon w-12 h-12 rounded-xl mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Enterprise Ready</h3>
            <p className="text-sm text-muted-foreground">
              TypeScript strict mode, comprehensive test coverage
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold gradient-text">181</span>
                <span className="text-muted-foreground">/181 tests</span>
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

          <motion.div
            variants={itemVariants}
            className="bento-card p-6 rounded-2xl md:col-span-2 lg:col-span-2"
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
                {"// That's all you need"}
              </div>
              <div>
                <span className="text-primary">const</span>
                {" { messages, send } = "}
                <span className="text-secondary">useChat</span>
                {"();"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesBento
