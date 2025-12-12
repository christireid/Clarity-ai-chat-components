import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
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
        <FeaturesSection />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
