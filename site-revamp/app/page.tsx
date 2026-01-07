import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { FeaturesSection } from "@/components/features-section";
import { ComparisonSection } from "@/components/comparison-section";
import { CTASection } from "@/components/cta-section";
import { ContactForm } from "@/components/contact-form";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ComparisonSection />
        <CTASection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
