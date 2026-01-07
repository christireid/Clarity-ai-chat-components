"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { EmailSignupInline } from "./email-signup-modal";

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.2_0.05_280)] to-[oklch(0.15_0.03_240)] border border-border p-8 sm:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 gradient-blob opacity-30" />
          <div className="absolute bottom-0 left-0 w-80 h-80 gradient-blob opacity-20" style={{ animationDelay: "10s" }} />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your{" "}
                <span className="gradient-text">AI Chat Experience?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join developers building the next generation of AI products with Clarity Chat.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Email Signup */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.6_0.15_280/0.1)] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[oklch(0.6_0.15_280)]" />
                  </div>
                  <h3 className="text-xl font-semibold">Get Early Access</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Sign up to be notified when Clarity Chat launches and receive exclusive early access.
                </p>
                <EmailSignupInline />
              </div>

              {/* Contact Form Link */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.65_0.12_200/0.1)] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-[oklch(0.65_0.12_200)]" />
                  </div>
                  <h3 className="text-xl font-semibold">Enterprise Inquiry</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Need custom solutions, priority support, or have questions about enterprise features?
                </p>
                <Button
                  asChild
                  className="w-full sm:w-auto primary-button font-semibold"
                >
                  <a href="#contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Or email us directly at{" "}
                  <a href="mailto:info@codeclarity.ai" className="text-[oklch(0.6_0.15_280)] hover:underline">
                    info@codeclarity.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
