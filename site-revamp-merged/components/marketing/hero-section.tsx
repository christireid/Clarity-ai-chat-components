"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  staggerContainer,
  fadeInUp,
  fadeInScale,
} from "@/lib/animations"

// Dynamically import the 3D canvas to avoid SSR issues
const ParticleFieldCanvas = dynamic(
  () => import("@/components/three/particle-field"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
    ),
  }
)

// Hook to detect WebGL support
function useWebGLSupport() {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setSupported(!!gl)
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}

// Static gradient fallback for non-WebGL browsers
function GradientFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </div>
  )
}

// Hero-specific container with slower stagger
const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

// Hero-specific item with slightly longer duration
const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const supportsWebGL = useWebGLSupport()
  const showParticles = supportsWebGL && !prefersReducedMotion

  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo")
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb gradient-orb-primary w-[600px] h-[600px] -top-48 -left-48" />
        <div
          className="gradient-orb gradient-orb-secondary w-[500px] h-[500px] top-1/2 -right-48"
          style={{ animationDelay: "-10s" }}
        />
        <div
          className="gradient-orb gradient-orb-primary w-[400px] h-[400px] -bottom-32 left-1/3"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* 3D Particle Field or Fallback */}
      {showParticles ? (
        <ParticleFieldCanvas className="absolute inset-0 z-0" />
      ) : (
        <GradientFallback />
      )}

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 radial-gradient-bg pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={prefersReducedMotion ? undefined : heroContainer}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
      >
        {/* Eyebrow */}
        <motion.div
          variants={prefersReducedMotion ? undefined : heroItem}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Save 60-90% on AI costs with built-in token optimization</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={prefersReducedMotion ? undefined : heroItem}
          className="text-display font-bold tracking-tight mb-6"
        >
          <span className="block">Build ChatGPT-quality</span>
          <span className="block gradient-text">AI chat interfaces</span>
          <span className="block">in hours, not months.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={prefersReducedMotion ? undefined : heroItem}
          className="text-body-large text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          The premium React component library for AI chat applications.
          <br className="hidden sm:block" />
          Token-optimized. Enterprise-ready. Multi-provider support.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={prefersReducedMotion ? undefined : heroItem}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/docs/getting-started"
            className="cta-button px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={scrollToDemo}
            className="secondary-button px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
          >
            See it in action
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={prefersReducedMotion ? undefined : heroItem}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "200+", label: "Components" },
            { value: "95+", label: "Hooks" },
            { value: "WCAG AAA", label: "Accessible" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* 3D Scene Container (below content) */}
      <motion.div
        variants={prefersReducedMotion ? undefined : fadeInScale}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        className="relative z-10 w-full max-w-4xl mx-auto mt-16 px-6"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden glass-card glow-primary">
          {/* Simulated chat interface preview */}
          <div className="absolute inset-0 p-6">
            <div className="h-full flex flex-col">
              {/* Chat header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-sm text-muted-foreground">
                  Clarity Chat Demo
                </span>
              </div>

              {/* Chat messages preview */}
              <div className="flex-1 py-6 space-y-4 overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 1.5 }}
                  className="flex justify-end"
                >
                  <div className="chat-bubble-user px-4 py-2 max-w-[70%]">
                    How do I implement streaming?
                  </div>
                </motion.div>

                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 2 }}
                  className="flex justify-start"
                >
                  <div className="chat-bubble-ai px-4 py-3 max-w-[80%]">
                    <p className="text-sm mb-2">
                      Here's how to implement streaming with Clarity Chat:
                    </p>
                    <div className="code-block rounded-lg p-3 text-xs">
                      <code className="text-primary">
                        const {"{"} messages, send {"}"}
                      </code>
                      <code className="text-muted-foreground">
                        {" "}
                        = useStreamingChat();
                      </code>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 2.5 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 px-4 py-2">
                    <span className="typing-cursor" />
                    <span className="text-sm text-muted-foreground">
                      AI is typing...
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Input bar */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                  <input
                    type="text"
                    placeholder="Ask anything about Clarity Chat..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                    disabled
                  />
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={scrollToDemo}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 scroll-indicator" />
        </button>
      </motion.div>
    </section>
  )
}

export default HeroSection
