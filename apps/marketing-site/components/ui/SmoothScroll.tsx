'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import { durations } from '@/lib/constants'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: durations.slower, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  )
}
