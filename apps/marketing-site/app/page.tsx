import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import ComparisonSection from '../components/sections/ComparisonSection'
import PricingSection from '../components/sections/PricingSection'
import CTASection from '../components/sections/CTASection'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <Testimonials />
        <ComparisonSection />
        <PricingSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
