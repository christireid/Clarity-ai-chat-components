"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Add lenis class to html for CSS compatibility
    document.documentElement.classList.add("lenis", "lenis-smooth")

    return () => {
      lenis.destroy()
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)
  return lenisRef.current
}
