import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { Suspense } from "react"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

export const metadata: Metadata = {
  metadataBase: new URL("https://codeclarity.ai"),
  title: {
    default: "Code & Clarity | Premium AI Chat Components for React",
    template: "%s | Code & Clarity",
  },
  description:
    "Build ChatGPT-quality AI chat interfaces in hours, not months. Token-optimized, enterprise-ready React components with multi-provider support.",
  keywords: [
    "AI chat",
    "React components",
    "ChatGPT UI",
    "token optimization",
    "streaming chat",
    "AI development",
    "Clarity Chat",
  ],
  authors: [{ name: "Code & Clarity" }],
  creator: "Code & Clarity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codeclarity.ai",
    siteName: "Code & Clarity",
    title: "Code & Clarity | Premium AI Chat Components",
    description:
      "Build ChatGPT-quality AI chat interfaces in hours, not months.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code & Clarity - Premium AI Chat Components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code & Clarity | Premium AI Chat Components",
    description:
      "Build ChatGPT-quality AI chat interfaces in hours, not months.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {children}
          </Suspense>
        </SmoothScrollProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(240, 10%, 8%)",
              border: "1px solid hsl(240, 5%, 17%)",
              color: "hsl(0, 0%, 98%)",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
