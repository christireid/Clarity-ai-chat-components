import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Brain,
  Code2,
  Search,
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI-Enhanced Documentation",
  description:
    "Documentation optimized for both humans and AI. Enable AI-assisted development with docs that power code completion.",
}

const features = [
  {
    icon: Brain,
    title: "AI-Optimized Structure",
    description:
      "Documentation structured for optimal AI consumption and retrieval-augmented generation.",
  },
  {
    icon: Code2,
    title: "Code Completion Ready",
    description:
      "Semantic chunking that enables AI assistants to suggest accurate code completions.",
  },
  {
    icon: Search,
    title: "Enhanced Discoverability",
    description:
      "Both developers and AI tools can quickly find the information they need.",
  },
]

const deliverables = [
  "Documentation architecture audit",
  "AI-optimized content structure",
  "Semantic chunking implementation",
  "API reference optimization",
  "Code example enhancement",
  "Interactive documentation features",
  "Search optimization",
  "Developer portal design",
  "Maintenance guidelines",
]

export default function DocumentationPage() {
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
              <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-secondary to-purple-400 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-display font-bold mb-6">
                AI-Enhanced <span className="gradient-text">Documentation</span>
              </h1>
              <p className="text-body-large text-muted-foreground mb-8">
                Documentation optimized for both humans and AI. Enable AI-assisted
                development with docs that power code completion and
                recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="cta-button inline-flex items-center gap-2 px-6 py-3 rounded-xl"
                >
                  Discuss Your Docs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="premium-card p-8 rounded-2xl">
              <h3 className="font-semibold mb-6">What You Get</h3>
              <ul className="space-y-4">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-secondary" />
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
            Documentation That Works for{" "}
            <span className="gradient-text">Everyone</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6 rounded-xl">
                <feature.icon className="w-10 h-10 text-secondary mb-4" />
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
            Ready to Upgrade Your Docs?
          </h2>
          <p className="text-body-large text-muted-foreground mb-8">
            Let's make your documentation work harder for developers and AI alike.
          </p>
          <Link
            href="/#contact"
            className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg"
          >
            Book a Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
