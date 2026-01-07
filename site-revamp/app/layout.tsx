import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Clarity Chat | AI Chat Components for React",
  description:
    "Ship AI chat UIs in minutes with 200+ production-ready React components. Built-in token optimization saves 60-90% on AI costs. WCAG AAA accessible.",
  keywords: ["AI chat", "React components", "chat UI", "LLM", "token optimization", "TypeScript", "accessibility"],
  openGraph: {
    title: "Clarity Chat - AI Chat Components for React",
    description: "200+ production-ready React components for AI chat interfaces. Save 60-90% on AI costs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarity Chat",
    description: "Ship AI Chat UIs in Minutes, Not Months",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
