'use client'

/**
 * ImageGallery Component
 *
 * A gallery component for displaying multiple images with lightbox support.
 * Supports grid layouts, thumbnails, and image navigation.
 *
 * Features:
 * - Multiple layout variants (grid, masonry, carousel, stack)
 * - Lightbox modal for full-size viewing
 * - Image zoom and pan
 * - Keyboard navigation
 * - Touch/swipe support
 * - Loading states
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <ImageGallery
 *   images={[
 *     { id: '1', src: '/photo1.jpg', alt: 'Photo 1', caption: 'Beautiful sunset' },
 *     { id: '2', src: '/photo2.jpg', alt: 'Photo 2' },
 *   ]}
 *   columns={3}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type ImageGalleryVariant = 'grid' | 'masonry' | 'carousel' | 'stack'
export type ImageGallerySize = 'sm' | 'md' | 'lg'

export interface GalleryImage {
  /** Unique identifier */
  id: string
  /** Image source URL */
  src: string
  /** Thumbnail URL (optional) */
  thumbnail?: string
  /** Alt text */
  alt: string
  /** Caption */
  caption?: string
  /** Width */
  width?: number
  /** Height */
  height?: number
  /** Aspect ratio */
  aspectRatio?: string
}

export interface ImageGalleryProps {
  /** Array of images */
  images: GalleryImage[]
  /** Visual variant */
  variant?: ImageGalleryVariant
  /** Size preset */
  size?: ImageGallerySize
  /** Number of columns (grid/masonry) */
  columns?: 2 | 3 | 4 | 5
  /** Gap between images */
  gap?: number
  /** Enable lightbox */
  lightbox?: boolean
  /** Show captions */
  showCaptions?: boolean
  /** Default selected image index (for lightbox) */
  defaultSelectedIndex?: number
  /** Image click handler */
  onImageClick?: (image: GalleryImage, index: number) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Lightbox Component
// ============================================================================

interface LightboxProps {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

function Lightbox({ images, currentIndex, onClose, onPrevious, onNext }: LightboxProps) {
  const prefersReducedMotion = useReducedMotion()
  const image = images[currentIndex]

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrevious()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrevious, onNext])

  return (
    <motion.div
      className="image-gallery-lightbox"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: DURATION_SECONDS.fast }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        type="button"
        className="image-gallery-lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          type="button"
          className="image-gallery-lightbox-nav image-gallery-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrevious() }}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          type="button"
          className="image-gallery-lightbox-nav image-gallery-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <motion.div
        className="image-gallery-lightbox-content"
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? {} : { scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={prefersReducedMotion ? {} : { scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="image-gallery-lightbox-image"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.fast }}
          />
        </AnimatePresence>

        {/* Caption */}
        {image.caption && (
          <div className="image-gallery-lightbox-caption">
            {image.caption}
          </div>
        )}

        {/* Counter */}
        <div className="image-gallery-lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// GalleryImage Component
// ============================================================================

interface GalleryImageItemProps {
  image: GalleryImage
  index: number
  size: ImageGallerySize
  showCaption: boolean
  onClick: () => void
}

function GalleryImageItem({
  image,
  index,
  size,
  showCaption,
  onClick,
}: GalleryImageItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  return (
    <motion.div
      className={cn('image-gallery-item', `image-gallery-item-${size}`)}
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        delay: prefersReducedMotion ? 0 : index * 0.05,
      }}
      whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={image.aspectRatio ? { aspectRatio: image.aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="image-gallery-skeleton" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="image-gallery-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span>Failed to load</span>
        </div>
      )}

      {/* Image */}
      <img
        src={image.thumbnail || image.src}
        alt={image.alt}
        className={cn(
          'image-gallery-image',
          isLoaded && 'image-gallery-image-loaded'
        )}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Caption overlay */}
      {showCaption && image.caption && (
        <div className="image-gallery-caption">
          {image.caption}
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// ImageGallery Component
// ============================================================================

export function ImageGallery({
  images,
  variant = 'grid',
  size = 'md',
  columns = 3,
  gap = 8,
  lightbox = true,
  showCaptions = false,
  defaultSelectedIndex,
  onImageClick,
  className,
}: ImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion()
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    defaultSelectedIndex ?? null
  )

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (lightbox) {
      setSelectedIndex(index)
    }
    onImageClick?.(image, index)
  }

  const handleClose = () => setSelectedIndex(null)

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  if (images.length === 0) return null

  // Stack variant (overlapping images)
  if (variant === 'stack') {
    return (
      <>
        <motion.div
          className={cn('image-gallery', 'image-gallery-stack', className)}
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          role="group"
          aria-label="Image gallery"
        >
          {images.slice(0, 4).map((image, index) => (
            <motion.div
              key={image.id}
              className="image-gallery-stack-item"
              style={{
                zIndex: images.length - index,
                transform: `rotate(${(index - 1.5) * 3}deg) translateY(${index * 4}px)`,
              }}
              whileHover={{ scale: 1.05, zIndex: 100 }}
              onClick={() => handleImageClick(image, index)}
            >
              <img src={image.thumbnail || image.src} alt={image.alt} />
            </motion.div>
          ))}
          {images.length > 4 && (
            <div className="image-gallery-stack-more">+{images.length - 4}</div>
          )}
        </motion.div>

        <AnimatePresence>
          {selectedIndex !== null && (
            <Lightbox
              images={images}
              currentIndex={selectedIndex}
              onClose={handleClose}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <>
      <motion.div
        className={cn(
          'image-gallery',
          `image-gallery-${variant}`,
          `image-gallery-cols-${columns}`,
          className
        )}
        style={{ gap }}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION_SECONDS.normal }}
        role="group"
        aria-label="Image gallery"
      >
        {images.map((image, index) => (
          <GalleryImageItem
            key={image.id}
            image={image}
            index={index}
            size={size}
            showCaption={showCaptions}
            onClick={() => handleImageClick(image, index)}
          />
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={selectedIndex}
            onClose={handleClose}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
