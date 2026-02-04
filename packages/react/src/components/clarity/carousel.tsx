'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Card, CardContent } from '@clarity-chat/primitives'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  slidesToShow?: number
  className?: string
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  loop = true,
  slidesToShow = 1,
  className,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const totalSlides = React.Children.count(children)
  const maxIndex = Math.max(0, totalSlides - slidesToShow)

  React.useEffect(() => {
    if (!autoPlay || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return loop ? 0 : prev
        }
        return prev + 1
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, loop, maxIndex])

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(loop ? maxIndex : 0)
    } else if (index > maxIndex) {
      setCurrentIndex(loop ? 0 : maxIndex)
    } else {
      setCurrentIndex(index)
    }
  }

  const goNext = () => goToSlide(currentIndex + 1)
  const goPrev = () => goToSlide(currentIndex - 1)

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && totalSlides > slidesToShow && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={goPrev}
            disabled={!loop && currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={goNext}
            disabled={!loop && currentIndex >= maxIndex}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {showDots && totalSlides > slidesToShow && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                i === currentIndex
                  ? 'bg-accent w-4'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Item carousel for products, cards, etc.
interface ItemCarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  title?: string
  slidesToShow?: number
  className?: string
}

export function ItemCarousel<T>({
  items,
  renderItem,
  title,
  slidesToShow = 3,
  className,
}: ItemCarouselProps<T>) {
  const [startIndex, setStartIndex] = React.useState(0)
  const maxStartIndex = Math.max(0, items.length - slidesToShow)

  const goNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxStartIndex))
  }

  const goPrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0))
  }

  const visibleItems = items.slice(startIndex, startIndex + slidesToShow)

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={goPrev}
              disabled={startIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={goNext}
              disabled={startIndex >= maxStartIndex}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${slidesToShow}, 1fr)` }}
      >
        {visibleItems.map((item, i) => renderItem(item, startIndex + i))}
      </div>
    </div>
  )
}

// Full-width hero carousel
interface HeroSlide {
  id: string
  image: string
  title: string
  subtitle?: string
  cta?: {
    label: string
    href: string
  }
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  height?: string
  className?: string
}

export function HeroCarousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  height = '500px',
  className,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    if (!autoPlay || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, slides.length])

  const currentSlide = slides[currentIndex]

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl', className)}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background images */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <img
            src={slide.image || '/placeholder.svg'}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-8">
        <div className="max-w-xl text-white">
          <h2 className="text-4xl font-bold mb-2 animate-in slide-in-from-bottom-4 duration-500">
            {currentSlide.title}
          </h2>
          {currentSlide.subtitle && (
            <p className="text-lg text-white/80 mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
              {currentSlide.subtitle}
            </p>
          )}
          {currentSlide.cta && (
            <Button
              size="lg"
              className="animate-in slide-in-from-bottom-4 duration-500 delay-200"
              asChild
            >
              <a href={currentSlide.cta.href}>{currentSlide.cta.label}</a>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={cn(
              'h-2 rounded-full transition-all',
              i === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 w-2 hover:bg-white/70'
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

// Testimonial carousel
interface Testimonial {
  id: string
  content: string
  author: {
    name: string
    title?: string
    avatar?: string
  }
  rating?: number
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  className?: string
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  className,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [autoPlay, testimonials.length])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className={cn('text-center max-w-2xl mx-auto', className)}>
      <div className="min-h-[200px] flex flex-col items-center justify-center">
        {currentTestimonial.rating && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'h-5 w-5',
                  i < currentTestimonial.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground'
                )}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        )}

        <blockquote className="text-xl italic mb-6 animate-in fade-in duration-500">
          &ldquo;{currentTestimonial.content}&rdquo;
        </blockquote>

        <div className="flex items-center gap-3 animate-in fade-in duration-500 delay-200">
          {currentTestimonial.author.avatar && (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src={currentTestimonial.author.avatar || '/placeholder.svg'}
                alt={currentTestimonial.author.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="text-left">
            <div className="font-semibold">
              {currentTestimonial.author.name}
            </div>
            {currentTestimonial.author.title && (
              <div className="text-sm text-muted-foreground">
                {currentTestimonial.author.title}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              i === currentIndex
                ? 'bg-accent w-4'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
