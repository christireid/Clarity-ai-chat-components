'use client'

/**
 * ItemCarousel Component
 *
 * A carousel component for displaying items such as team members, products,
 * or any collection of cards with smooth navigation and animations.
 *
 * Features:
 * - Multiple variants (cards, avatars, images, minimal)
 * - Navigation arrows and dots
 * - Auto-play with pause on hover
 * - Touch/swipe support
 * - Keyboard navigation
 * - Responsive item count
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Team carousel
 * <ItemCarousel
 *   items={[
 *     { id: '1', name: 'Alice', image: '/alice.jpg', role: 'Designer' },
 *     { id: '2', name: 'Bob', image: '/bob.jpg', role: 'Developer' },
 *   ]}
 *   variant="avatars"
 * />
 *
 * // Product carousel
 * <ItemCarousel
 *   items={products}
 *   variant="cards"
 *   itemsPerView={3}
 *   autoPlay
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type ItemCarouselVariant = 'cards' | 'avatars' | 'images' | 'minimal'
export type ItemCarouselSize = 'sm' | 'md' | 'lg'

export interface CarouselItem {
  /** Unique identifier */
  id: string
  /** Display name */
  name?: string
  /** Image URL */
  image?: string
  /** Secondary image/avatar */
  avatar?: string
  /** Title/role */
  title?: string
  /** Description */
  description?: string
  /** Link URL */
  href?: string
  /** Custom badge */
  badge?: string
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Custom metadata */
  metadata?: Record<string, string | number>
  /** Custom render content */
  content?: React.ReactNode
}

export interface ItemCarouselProps {
  /** Array of items to display */
  items: CarouselItem[]
  /** Visual variant */
  variant?: ItemCarouselVariant
  /** Size preset */
  size?: ItemCarouselSize
  /** Items visible at once */
  itemsPerView?: number
  /** Gap between items */
  gap?: number
  /** Show navigation arrows */
  showArrows?: boolean
  /** Show navigation dots */
  showDots?: boolean
  /** Enable auto-play */
  autoPlay?: boolean
  /** Auto-play interval (ms) */
  autoPlayInterval?: number
  /** Pause auto-play on hover */
  pauseOnHover?: boolean
  /** Enable infinite loop */
  loop?: boolean
  /** Enable drag/swipe */
  draggable?: boolean
  /** Title */
  title?: string
  /** Item click handler */
  onItemClick?: (item: CarouselItem, index: number) => void
  /** Slide change handler */
  onSlideChange?: (index: number) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// CarouselItem Components
// ============================================================================

interface ItemCardProps {
  item: CarouselItem
  variant: ItemCarouselVariant
  size: ItemCarouselSize
  onClick?: () => void
}

function ItemCard({ item, variant, size, onClick }: ItemCardProps) {
  const prefersReducedMotion = useReducedMotion()

  // Avatar variant
  if (variant === 'avatars') {
    return (
      <motion.div
        className={cn('carousel-item', 'carousel-item-avatar', `carousel-item-${size}`)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        whileHover={prefersReducedMotion ? {} : { y: -4 }}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        <div className="carousel-avatar-wrapper">
          {item.image || item.avatar ? (
            <img
              src={item.image || item.avatar}
              alt={item.name || ''}
              className="carousel-avatar"
            />
          ) : (
            <div className="carousel-avatar carousel-avatar-placeholder">
              {item.name?.charAt(0) || '?'}
            </div>
          )}
          {item.status && (
            <span className={cn('carousel-status', `carousel-status-${item.status}`)} />
          )}
        </div>
        {item.name && <span className="carousel-item-name">{item.name}</span>}
        {item.title && <span className="carousel-item-title">{item.title}</span>}
      </motion.div>
    )
  }

  // Images variant
  if (variant === 'images') {
    return (
      <motion.div
        className={cn('carousel-item', 'carousel-item-image', `carousel-item-${size}`)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name || ''}
            className="carousel-image"
          />
        ) : (
          <div className="carousel-image carousel-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {(item.name || item.badge) && (
          <div className="carousel-image-overlay">
            {item.name && <span className="carousel-item-name">{item.name}</span>}
            {item.badge && <span className="carousel-item-badge">{item.badge}</span>}
          </div>
        )}
      </motion.div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <motion.div
        className={cn('carousel-item', 'carousel-item-minimal', `carousel-item-${size}`)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        whileHover={prefersReducedMotion ? {} : { backgroundColor: 'var(--carousel-item-hover-bg)' }}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        {item.image && (
          <img src={item.image} alt="" className="carousel-item-icon" />
        )}
        <div className="carousel-item-info">
          {item.name && <span className="carousel-item-name">{item.name}</span>}
          {item.title && <span className="carousel-item-title">{item.title}</span>}
        </div>
      </motion.div>
    )
  }

  // Cards variant (default)
  return (
    <motion.div
      className={cn('carousel-item', 'carousel-item-card', `carousel-item-${size}`)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      whileHover={prefersReducedMotion ? {} : { y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ duration: DURATION_SECONDS.fast }}
    >
      {item.content ? (
        item.content
      ) : (
        <>
          {item.image && (
            <div className="carousel-card-image">
              <img src={item.image} alt={item.name || ''} />
              {item.badge && (
                <span className="carousel-item-badge">{item.badge}</span>
              )}
            </div>
          )}
          <div className="carousel-card-content">
            {item.avatar && (
              <img src={item.avatar} alt="" className="carousel-card-avatar" />
            )}
            {item.name && (
              <h4 className="carousel-item-name">{item.name}</h4>
            )}
            {item.title && (
              <span className="carousel-item-title">{item.title}</span>
            )}
            {item.description && (
              <p className="carousel-item-description">{item.description}</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

// ============================================================================
// ItemCarousel Component
// ============================================================================

export function ItemCarousel({
  items,
  variant = 'cards',
  size = 'md',
  itemsPerView = 3,
  gap = 16,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  pauseOnHover = true,
  loop = true,
  draggable = true,
  title,
  onItemClick,
  onSlideChange,
  className,
}: ItemCarouselProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const totalSlides = Math.max(1, items.length - itemsPerView + 1)
  const canGoNext = loop || currentIndex < totalSlides - 1
  const canGoPrev = loop || currentIndex > 0

  // Auto-play
  React.useEffect(() => {
    if (!autoPlay || isPaused || items.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= totalSlides) {
          return loop ? 0 : prev
        }
        return next
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, isPaused, autoPlayInterval, totalSlides, loop, items.length, itemsPerView])

  // Notify slide change
  React.useEffect(() => {
    onSlideChange?.(currentIndex)
  }, [currentIndex, onSlideChange])

  const goToSlide = (index: number) => {
    let newIndex = index
    if (loop) {
      if (index < 0) newIndex = totalSlides - 1
      else if (index >= totalSlides) newIndex = 0
    } else {
      newIndex = Math.max(0, Math.min(index, totalSlides - 1))
    }
    setCurrentIndex(newIndex)
  }

  const handlePrev = () => {
    if (canGoPrev) goToSlide(currentIndex - 1)
  }

  const handleNext = () => {
    if (canGoNext) goToSlide(currentIndex + 1)
  }

  // Drag handling
  const handleDragEnd = (_: never, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 50
    if (info.offset.x > threshold && canGoPrev) {
      handlePrev()
    } else if (info.offset.x < -threshold && canGoNext) {
      handleNext()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  const itemWidth = containerRef.current
    ? (containerRef.current.offsetWidth - gap * (itemsPerView - 1)) / itemsPerView
    : 0

  return (
    <motion.div
      className={cn(
        'item-carousel',
        `item-carousel-${variant}`,
        `item-carousel-${size}`,
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={title || 'Carousel'}
      aria-roledescription="carousel"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
    >
      {title && <h3 className="item-carousel-title">{title}</h3>}

      <div className="item-carousel-wrapper">
        {/* Previous button */}
        {showArrows && (
          <button
            type="button"
            className={cn(
              'item-carousel-arrow',
              'item-carousel-arrow-prev',
              !canGoPrev && 'item-carousel-arrow-disabled'
            )}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Track */}
        <div
          ref={containerRef}
          className="item-carousel-track-container"
        >
          <motion.div
            className="item-carousel-track"
            drag={draggable ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            animate={{
              x: -(currentIndex * (itemWidth + gap)),
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{
              gap,
              cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="item-carousel-slide"
                  style={{
                    minWidth: itemWidth || `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`,
                    maxWidth: itemWidth || `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`,
                  }}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: DURATION_SECONDS.fast,
                    delay: prefersReducedMotion ? 0 : index * 0.05,
                  }}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${items.length}`}
                >
                  <ItemCard
                    item={item}
                    variant={variant}
                    size={size}
                    onClick={
                      onItemClick && !isDragging
                        ? () => onItemClick(item, index)
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Next button */}
        {showArrows && (
          <button
            type="button"
            className={cn(
              'item-carousel-arrow',
              'item-carousel-arrow-next',
              !canGoNext && 'item-carousel-arrow-disabled'
            )}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div className="item-carousel-dots" role="tablist">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                'item-carousel-dot',
                index === currentIndex && 'item-carousel-dot-active'
              )}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// useItemCarousel Hook
// ============================================================================

export interface UseItemCarouselOptions {
  /** Initial items */
  initialItems?: CarouselItem[]
  /** Items per view */
  itemsPerView?: number
  /** Enable auto-play */
  autoPlay?: boolean
  /** Auto-play interval */
  interval?: number
  /** Enable loop */
  loop?: boolean
}

export interface UseItemCarouselReturn {
  /** Current items */
  items: CarouselItem[]
  /** Current slide index */
  currentIndex: number
  /** Total slides */
  totalSlides: number
  /** Go to next slide */
  next: () => void
  /** Go to previous slide */
  prev: () => void
  /** Go to specific slide */
  goTo: (index: number) => void
  /** Add item */
  addItem: (item: CarouselItem) => void
  /** Remove item */
  removeItem: (id: string) => void
  /** Update item */
  updateItem: (id: string, updates: Partial<CarouselItem>) => void
  /** Set all items */
  setItems: (items: CarouselItem[]) => void
  /** Is at first slide */
  isFirst: boolean
  /** Is at last slide */
  isLast: boolean
}

export function useItemCarousel(
  options: UseItemCarouselOptions = {}
): UseItemCarouselReturn {
  const {
    initialItems = [],
    itemsPerView = 3,
    autoPlay = false,
    interval = 5000,
    loop = true,
  } = options

  const [items, setItems] = React.useState<CarouselItem[]>(initialItems)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const totalSlides = Math.max(1, items.length - itemsPerView + 1)

  // Auto-play
  React.useEffect(() => {
    if (!autoPlay || items.length <= itemsPerView) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= totalSlides) {
          return loop ? 0 : prev
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, totalSlides, loop, items.length, itemsPerView])

  const next = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= totalSlides) {
        return loop ? 0 : prev
      }
      return next
    })
  }, [totalSlides, loop])

  const prev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev - 1
      if (next < 0) {
        return loop ? totalSlides - 1 : 0
      }
      return next
    })
  }, [totalSlides, loop])

  const goTo = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalSlides - 1))
      setCurrentIndex(clamped)
    },
    [totalSlides]
  )

  const addItem = React.useCallback((item: CarouselItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateItem = React.useCallback(
    (id: string, updates: Partial<CarouselItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      )
    },
    []
  )

  return {
    items,
    currentIndex,
    totalSlides,
    next,
    prev,
    goTo,
    addItem,
    removeItem,
    updateItem,
    setItems,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalSlides - 1,
  }
}

export default ItemCarousel
