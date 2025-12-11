import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Hero Particles Demo - Interactive 3D Particle Animation',
  description:
    'Explore the HeroParticles component with interactive controls. Features mouse/touch interaction, bloom effects, and theme-aware colors built with React Three Fiber.',
  keywords: [
    'particles',
    'animation',
    'three.js',
    'react-three-fiber',
    'WebGL',
    'interactive',
    '3D',
    'hero section',
  ],
  openGraph: {
    title: 'Hero Particles Demo',
    description:
      'Interactive 3D particle animation with mouse/touch interaction and bloom effects.',
    type: 'website',
  },
}

export default function ParticlesLayout({ children }: { children: ReactNode }) {
  return children
}
