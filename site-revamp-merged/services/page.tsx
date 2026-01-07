import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, MessageSquare, Coins, BookOpen, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Expert AI development services including chat development, token optimization, and AI-enhanced documentation.",
}

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

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="badge-gradient px-4 py-1.5 rounded-full text-sm inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4" />
              Expert Services
            </span>
            <h1 className="text-display font-bold mb-6">
              Expert <span className="gradient-text">AI Development</span> Services
            </h1>
            <p className="text-body-large text-muted-foreground">
              Accelerate your AI initiatives with our specialized team. From
              greenfield projects to optimization and documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="premium-card p-8 rounded-2xl flex flex-col h-full"
              >
                <div
                  className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
                <p className="text-muted-foreground mb-6 flex-1">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-primary font-medium group"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/#contact"
              className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg"
            >
              Book a Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
