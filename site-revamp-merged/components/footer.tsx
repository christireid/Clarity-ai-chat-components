"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail, ArrowUpRight, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { subscribeToNewsletter } from "@/app/actions/send-email"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "#demo" },
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ],
  services: [
    { label: "AI Chat Development", href: "/services/ai-development" },
    { label: "Token Optimization", href: "/services/token-optimization" },
    { label: "AI-Enhanced Docs", href: "/services/documentation" },
    { label: "Consulting", href: "/services/consulting" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "License", href: "/license" },
  ],
}

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/codeandclarity",
    icon: Github,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/codeandclarity",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/codeandclarity",
    icon: Linkedin,
  },
]

export function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmitNewsletter = async (data: NewsletterFormData) => {
    try {
      const result = await subscribeToNewsletter(data)

      if (result.success) {
        toast.success("Subscribed successfully!", {
          description: "You'll receive the latest updates in your inbox.",
        })
        setSubscribed(true)
        reset()
      } else {
        toast.error("Failed to subscribe", {
          description: result.error || "Please try again later.",
        })
      }
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      })
    }
  }

  return (
    <footer className="relative border-t border-white/5 bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 radial-gradient-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 group w-fit mb-6">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Code & Clarity Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">
                Code & <span className="gradient-text">Clarity</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Build ChatGPT-quality AI chat interfaces in hours, not months.
              Premium React components for modern AI applications.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Stay updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates on Clarity Chat and AI development tips.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitNewsletter)} className="flex flex-col gap-2 w-full md:w-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className={`flex-1 md:w-64 px-4 py-3 rounded-xl bg-muted text-sm outline-none transition-all ${
                      errors.email
                        ? "ring-2 ring-destructive"
                        : "focus:ring-2 focus:ring-primary"
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-button px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Code & Clarity. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@codeclarity.ai"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              hello@codeclarity.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
