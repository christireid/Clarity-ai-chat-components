import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  ArrowLeft,
  Coins,
  Check,
  TrendingDown,
  BarChart3,
  Gauge,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Token Optimization",
  description:
    "Reduce your AI API costs by 40-60% with expert token optimization. Audit, analyze, and implement proven strategies.",
}

const features = [
  {
    icon: TrendingDown,
    title: "40-60% Cost Reduction",
    description:
      "Proven strategies that dramatically reduce your AI API spending without sacrificing quality.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Comprehensive dashboards to monitor token usage, costs, and optimization opportunities.",
  },
  {
    icon: Gauge,
    title: "Performance Maintained",
    description:
      "Optimize costs while maintaining or improving response quality and speed.",
  },
]

const deliverables = [
  "Comprehensive API cost audit",
  "Token usage analysis and reporting",
  "KV-cache optimization implementation",
  "Semantic caching strategy",
  "Prompt engineering optimization",
  "Context window management",
  "Cost monitoring dashboard setup",
  "Usage alerts and thresholds",
  "Ongoing optimization recommendations",
]

const stats = [
  { value: "40-60%", label: "Average cost reduction" },
  { value: "2-3 weeks", label: "Time to implement" },
  { value: "100%", label: "Quality maintained" },
]

export default function TokenOptimizationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-accent to-yellow-400 shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-display font-bold mb-6">
                Token <span className="gradient-text">Optimization</span>
              </h1>
              <p className="text-body-large text-muted-foreground mb-8">
                Reduce your AI API costs by 40-60% with expert token optimization.
                We audit, analyze, and implement proven strategies for maximum
                efficiency.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="cta-button inline-flex items-center gap-2 px-6 py-3 rounded-xl"
                >
                  Get a Cost Audit
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="premium-card p-8 rounded-2xl">
              <h3 className="font-semibold mb-6">What You Get</h3>
              <ul className="space-y-4">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-headline font-bold text-center mb-12">
            How We <span className="gradient-text">Optimize</span> Your Costs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6 rounded-xl">
                <feature.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-headline font-bold mb-4">
            Stop Overpaying for AI
          </h2>
          <p className="text-body-large text-muted-foreground mb-8">
            Get a free cost audit and discover how much you can save.
          </p>
          <Link
            href="/#contact"
            className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg"
          >
            Request Free Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
