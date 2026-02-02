'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// MARQUEE - Infinite scrolling content
// =============================================================================

interface MarqueeProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  speed?: 'slow' | 'normal' | 'fast'
  pauseOnHover?: boolean
  className?: string
  repeat?: number
}

export function Marquee({
  children,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = false,
  className,
  repeat = 2,
}: MarqueeProps) {
  const speedMap = { slow: 50, normal: 30, fast: 15 }
  const duration = speedMap[speed]

  const animationClass = {
    left: 'animate-marquee-left',
    right: 'animate-marquee-right',
    up: 'animate-marquee-up',
    down: 'animate-marquee-down',
  }[direction]

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        pauseOnHover && '[&:hover>*]:pause',
        className
      )}
    >
      <div
        className={cn('flex', animationClass)}
        style={{ animationDuration: `${duration}s` }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            {children}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes marquee-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes marquee-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
        .animate-marquee-up {
          animation: marquee-up linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down linear infinite;
        }
        .pause {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// CONFETTI - Celebration confetti animation
// =============================================================================

interface ConfettiProps {
  active?: boolean
  duration?: number
  particleCount?: number
  colors?: string[]
  className?: string
}

export function Confetti({
  active = true,
  duration = 3000,
  particleCount = 50,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
  className,
}: ConfettiProps) {
  const [particles, setParticles] = React.useState<
    Array<{
      id: number
      x: number
      y: number
      rotation: number
      scale: number
      color: string
      velocity: { x: number; y: number }
    }>
  >([])

  React.useEffect(() => {
    if (!active) return

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 2 + 1,
      },
    }))

    setParticles(newParticles)

    const timeout = setTimeout(() => {
      setParticles([])
    }, duration)

    return () => clearTimeout(timeout)
  }, [active, particleCount, colors, duration])

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// SCROLL PROGRESS - Circular/Linear progress indicators
// =============================================================================

interface ScrollProgressProps {
  variant?: 'linear' | 'circular'
  className?: string
  color?: string
}

export function ScrollProgress({
  variant = 'linear',
  className,
  color = 'hsl(var(--accent))',
}: ScrollProgressProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 20
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className={cn('fixed bottom-8 right-8 z-50', className)}>
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.2"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50 h-1', className)}>
      <div
        className="h-full transition-all duration-100 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  )
}

// =============================================================================
// PARALLAX SECTION - Smooth parallax scrolling
// =============================================================================

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const parallax = scrolled * speed
      setOffset(parallax)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>
    </div>
  )
}

// =============================================================================
// STACKED CARDS - Cards that stack on scroll
// =============================================================================

interface StackedCardsProps {
  cards: Array<{
    id: string
    content: React.ReactNode
  }>
  className?: string
}

export function StackedCards({ cards, className }: StackedCardsProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(
        0,
        -rect.top / (rect.height - window.innerHeight)
      )
      const index = Math.floor(scrollProgress * cards.length)
      setActiveIndex(Math.min(index, cards.length - 1))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [cards.length])

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: `${cards.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              'absolute w-full max-w-2xl transition-all duration-500',
              index === activeIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            )}
            style={{
              transform: `translateY(${(index - activeIndex) * 20}px) scale(${index === activeIndex ? 1 : 0.95})`,
            }}
          >
            {card.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// ANIMATED TABS - Tabs with smooth indicator
// =============================================================================

interface AnimatedTabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
  }>
  className?: string
}

export function AnimatedTabs({ tabs, className }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id)
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  })
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  React.useEffect(() => {
    const activeButton = tabRefs.current.get(activeTab)
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      })
    }
  }, [activeTab])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative border-b border-border">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el)
              }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors relative z-10',
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-0.5 bg-accent transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'transition-all duration-300',
              activeTab === tab.id
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 absolute pointer-events-none'
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// INFINITE CAROUSEL - Auto-scrolling carousel
// =============================================================================

interface InfiniteCarouselProps {
  items: React.ReactNode[]
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

export function InfiniteCarousel({
  items,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className,
}: InfiniteCarouselProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        pauseOnHover && '[&:hover>*]:pause',
        className
      )}
    >
      <div
        className={cn(
          'flex gap-4',
          direction === 'left'
            ? 'animate-carousel-left'
            : 'animate-carousel-right'
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes carousel-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes carousel-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-carousel-left {
          animation: carousel-left linear infinite;
        }
        .animate-carousel-right {
          animation: carousel-right linear infinite;
        }
        .pause {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// REVEAL ON SCROLL - Elements reveal on scroll
// =============================================================================

interface RevealOnScrollProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom'
  delay?: number
  className?: string
}

export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  className,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    zoom: 'scale-95',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// =============================================================================
// BENTO GRID - Animated bento grid layout
// =============================================================================

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]',
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div
          className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-all duration-300"
          style={{
            animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          {child}
        </div>
      ))}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
