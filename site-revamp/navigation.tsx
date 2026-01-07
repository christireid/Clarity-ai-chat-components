"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { EmailSignupModal } from "./email-signup-modal";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-3 group min-h-[44px]">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-110 duration-300 flex items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.6_0.15_280)] to-[oklch(0.65_0.12_200)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Clarity Chat</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[oklch(0.5_0.12_280)] after:to-[oklch(0.6_0.1_240)] hover:after:w-full after:transition-all after:duration-300"
            >
              Features
            </Link>
            <Link
              href="/components"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[oklch(0.5_0.12_280)] after:to-[oklch(0.6_0.1_240)] hover:after:w-full after:transition-all after:duration-300"
            >
              Components
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[oklch(0.5_0.12_280)] after:to-[oklch(0.6_0.1_240)] hover:after:w-full after:transition-all after:duration-300"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[oklch(0.5_0.12_280)] after:to-[oklch(0.6_0.1_240)] hover:after:w-full after:transition-all after:duration-300"
            >
              Contact
            </Link>
            <Button
              onClick={() => setShowSignup(true)}
              size="sm"
              className="primary-button font-semibold"
            >
              Get Early Access
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Features
              </Link>
              <Link
                href="/components"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Components
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Contact
              </Link>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSignup(true);
                }}
                className="w-full primary-button font-semibold mt-2"
              >
                Get Early Access
              </Button>
            </div>
          </div>
        )}
      </nav>

      <EmailSignupModal open={showSignup} onOpenChange={setShowSignup} />
    </>
  );
}
