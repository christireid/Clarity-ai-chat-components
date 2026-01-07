import Link from "next/link";
import { Mail, Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300 flex items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.6_0.15_280)] to-[oklch(0.65_0.12_200)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Clarity Chat</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The complete React component library for AI chat interfaces.
              200+ components, 95+ hooks, built-in token optimization.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/components"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Components
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Library Stats</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground">200+ Components</li>
              <li className="text-muted-foreground">95+ Hooks</li>
              <li className="text-muted-foreground">15 Theme Presets</li>
              <li className="text-muted-foreground">WCAG AAA Accessible</li>
              <li className="text-muted-foreground">100% TypeScript</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@codeclarity.ai"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  info@codeclarity.ai
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/christireid/Clarity-ai-chat-components"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Code & Clarity. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Built with React 19 + TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
