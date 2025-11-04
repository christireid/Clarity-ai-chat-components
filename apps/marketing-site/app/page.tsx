import { Metadata } from 'next'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/PricingPreview'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Ship production-ready AI chat interfaces 10-50x faster. Save $150K+ vs custom build. WCAG AAA certified. Start free, upgrade anytime.',
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  )
}

