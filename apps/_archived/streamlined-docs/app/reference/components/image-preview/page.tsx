'use client'

import React, { useState } from 'react'
import {
  Image as ImageIcon,
  ZoomIn,
  Maximize2,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Keyboard,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'

const features = [
  {
    icon: ZoomIn,
    label: 'Zoom & Pan',
    description: 'Smooth pinch-to-zoom and drag',
  },
  {
    icon: Maximize2,
    label: 'Gallery Mode',
    description: 'Swipe between multiple images',
  },
  {
    icon: Loader2,
    label: 'Lazy Loading',
    description: 'Progressive image loading',
  },
  {
    icon: Keyboard,
    label: 'Keyboard Shortcuts',
    description: 'Arrow keys, ESC to close',
  },
]

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'props', title: 'Props', level: 2 },
  { id: 'gesture-controls', title: 'Gesture Controls', level: 2 },
  { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts', level: 2 },
  { id: 'examples', title: 'Examples', level: 2 },
  { id: 'performance', title: 'Performance', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related', level: 2 },
]

const relatedAPIs = [
  {
    name: 'FileUpload',
    type: 'component' as const,
    description: 'Upload component that integrates with ImagePreview for uploaded images',
    href: '/reference/components/file-upload',
  },
  {
    name: 'MultiModalPreview',
    type: 'component' as const,
    description: 'Preview component for multiple media types including images',
    href: '/reference/components/multi-modal-preview',
  },
  {
    name: 'ProgressiveImage',
    type: 'component' as const,
    description: 'Lazy loading image component with blur-up effect',
    href: '/reference/components/progressive-image',
  },
]

const footerNavigation = [
  {
    label: 'MultiModalPreview',
    href: '/reference/components/multi-modal-preview',
    direction: 'previous' as const,
  },
  {
    label: 'ProgressiveImage',
    href: '/reference/components/progressive-image',
    direction: 'next' as const,
  },
]

const props: PropDefinition[] = [
  {
    name: 'src',
    type: 'string',
    required: true,
    description:
      'URL of the image to display. Can be a local path or external URL. Supports CORS for external images.',
  },
  {
    name: 'alt',
    type: 'string',
    required: true,
    description:
      'Alternative text for the image. Essential for accessibility and SEO.',
  },
  {
    name: 'images',
    type: 'Array<{ src: string; alt: string; caption?: string }>',
    description:
      'Array of images for gallery mode. When provided, enables swipe navigation between images.',
  },
  {
    name: 'initialIndex',
    type: 'number',
    default: '0',
    description:
      'Initial image index to display in gallery mode. Used when opening gallery at a specific image.',
  },
  {
    name: 'enableZoom',
    type: 'boolean',
    default: 'true',
    description:
      'Enable zoom functionality. Supports pinch-to-zoom on touch devices and mouse wheel on desktop.',
  },
  {
    name: 'minZoom',
    type: 'number',
    default: '1',
    description:
      'Minimum zoom level. 1 = 100% (original size). Must be less than maxZoom.',
  },
  {
    name: 'maxZoom',
    type: 'number',
    default: '3',
    description:
      'Maximum zoom level. 3 = 300% (3x original size). Higher values allow more detail.',
  },
  {
    name: 'zoomStep',
    type: 'number',
    default: '0.5',
    description:
      'Zoom increment for zoom controls. 0.5 = 50% per step. Smaller values provide finer control.',
  },
  {
    name: 'enablePan',
    type: 'boolean',
    default: 'true',
    description:
      'Enable pan/drag functionality when zoomed. Allows exploring zoomed images by dragging.',
  },
  {
    name: 'enableRotation',
    type: 'boolean',
    default: 'true',
    description:
      'Enable rotation controls. Allows rotating image in 90-degree increments.',
  },
  {
    name: 'enableFullscreen',
    type: 'boolean',
    default: 'true',
    description:
      'Enable fullscreen mode. Uses native Fullscreen API for immersive viewing.',
  },
  {
    name: 'enableDownload',
    type: 'boolean',
    default: 'false',
    description:
      'Show download button. Allows users to download the current image.',
  },
  {
    name: 'lazyLoad',
    type: 'boolean',
    default: 'true',
    description:
      'Enable lazy loading. Defers loading images until they are needed for better performance.',
  },
  {
    name: 'showThumbnails',
    type: 'boolean',
    default: 'true',
    description:
      'Show thumbnail strip in gallery mode. Provides quick navigation between images.',
  },
  {
    name: 'thumbnailPosition',
    type: "'bottom' | 'top' | 'left' | 'right'",
    default: "'bottom'",
    description:
      'Position of thumbnail strip. Adapts automatically on mobile devices.',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    default: 'true',
    description:
      'Close preview when Escape key is pressed. Standard modal behavior.',
  },
  {
    name: 'closeOnBackdropClick',
    type: 'boolean',
    default: 'true',
    description:
      'Close preview when clicking outside the image. Provides intuitive dismiss behavior.',
  },
  {
    name: 'showCaption',
    type: 'boolean',
    default: 'true',
    description:
      'Display image caption if provided. Shows below image in gallery mode.',
  },
  {
    name: 'showControls',
    type: 'boolean',
    default: 'true',
    description:
      'Show zoom, rotation, and navigation controls. Can be hidden for minimal UI.',
  },
  {
    name: 'controlsPosition',
    type: "'top' | 'bottom' | 'overlay'",
    default: "'overlay'",
    description:
      'Position of control buttons. Overlay provides floating controls over the image.',
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '300',
    description:
      'Animation duration in milliseconds. Affects zoom, pan, and slide transitions.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Additional CSS classes to apply to the preview container.',
  },
  {
    name: 'onOpen',
    type: '() => void',
    description:
      'Callback fired when preview opens. Useful for analytics or state management.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description:
      'Callback fired when preview closes. Can be used to cleanup or update parent state.',
  },
  {
    name: 'onZoomChange',
    type: '(zoom: number) => void',
    description:
      'Callback fired when zoom level changes. Receives current zoom level (1-3).',
  },
  {
    name: 'onImageChange',
    type: '(index: number) => void',
    description:
      'Callback fired when active image changes in gallery mode. Receives new image index.',
  },
]

export default function ImagePreviewPage() {
  const [currentDemo, setCurrentDemo] = useState<
    'single' | 'gallery' | 'zoom' | null
  >(null)

  return (
    <DocumentationPage
      title="ImagePreview"
      description="Advanced image preview with zoom, pan, rotation, and gallery mode for rich media experiences"
      icon={ImageIcon}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-muted-foreground leading-relaxed">
          The <code className="text-sm">ImagePreview</code> component provides a
          powerful, accessible interface for viewing images with advanced features
          like zoom, pan, rotation, and gallery navigation. Perfect for chat
          applications where users share and view images.
        </p>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Key Features
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Smooth zoom with pinch-to-zoom and mouse wheel support</li>
            <li>• Pan/drag functionality when zoomed in</li>
            <li>• Rotation controls (90-degree increments)</li>
            <li>• Gallery mode with swipe navigation</li>
            <li>• Lazy loading for optimal performance</li>
            <li>• Fullscreen mode with native Fullscreen API</li>
            <li>• Keyboard shortcuts for all interactions</li>
            <li>• Touch gestures for mobile devices</li>
            <li>• Thumbnail strip for quick navigation</li>
            <li>• WCAG 2.1 AA compliant with full keyboard support</li>
            <li>• Respects reduced motion preferences</li>
            <li>• Responsive design adapts to all screen sizes</li>
          </ul>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react
# or
yarn add @clarity-chat/react
# or
pnpm add @clarity-chat/react`}
        />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <CodeBlock
          language="tsx"
          code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function ChatImageViewer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {/* Thumbnail trigger */}
      <img
        src="/image-thumbnail.jpg"
        alt="Click to preview"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg hover:opacity-80 transition"
      />

      {/* Full preview */}
      {isOpen && (
        <ImagePreview
          src="/image-full.jpg"
          alt="Full resolution image"
          onClose={() => setIsOpen(false)}
          enableZoom
          enableRotation
          enableFullscreen
        />
      )}
    </div>
  )
}`}
        />
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <div className="space-y-6">
          <div className="p-6 border border-border/50 rounded-lg bg-card">
            <h4 className="font-semibold mb-4">Interactive Demos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Single Image Demo */}
              <div
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-border hover:border-brand-500 transition-colors"
                onClick={() => setCurrentDemo('single')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-brand-500" />
                    <p className="text-sm font-medium">Single Image</p>
                    <p className="text-xs text-muted-foreground">
                      Click to preview
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Demo */}
              <div
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-border hover:border-brand-500 transition-colors"
                onClick={() => setCurrentDemo('gallery')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <Maximize2 className="w-12 h-12 mx-auto mb-2 text-brand-500" />
                    <p className="text-sm font-medium">Gallery Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Click to preview
                    </p>
                  </div>
                </div>
              </div>

              {/* Zoom Demo */}
              <div
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-border hover:border-brand-500 transition-colors"
                onClick={() => setCurrentDemo('zoom')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <ZoomIn className="w-12 h-12 mx-auto mb-2 text-brand-500" />
                    <p className="text-sm font-medium">Advanced Zoom</p>
                    <p className="text-xs text-muted-foreground">
                      Click to preview
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {currentDemo && (
              <div className="mt-4 p-4 bg-muted/30 border border-border/40 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">
                    {currentDemo === 'single' && 'Single Image Preview'}
                    {currentDemo === 'gallery' && 'Gallery Mode Preview'}
                    {currentDemo === 'zoom' && 'Advanced Zoom Preview'}
                  </p>
                  <button
                    onClick={() => setCurrentDemo(null)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentDemo === 'single' &&
                    'Preview showing zoom, pan, and rotation controls.'}
                  {currentDemo === 'gallery' &&
                    'Navigate between multiple images with thumbnails.'}
                  {currentDemo === 'zoom' &&
                    'High-resolution zoom with smooth pan controls.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Props */}
      <Section id="props" title="Props">
        <PropsTable props={props} />
      </Section>

      {/* Gesture Controls */}
      <Section id="gesture-controls" title="Gesture Controls">
        <p className="text-muted-foreground mb-4">
          ImagePreview supports intuitive touch and mouse gestures for natural
          interaction:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Device</th>
                <th className="text-left py-3 px-4 font-semibold">Gesture</th>
                <th className="text-left py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Touch</td>
                <td className="py-3 px-4">Pinch to zoom</td>
                <td className="py-3 px-4">Zoom in/out smoothly</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Touch</td>
                <td className="py-3 px-4">Drag (when zoomed)</td>
                <td className="py-3 px-4">Pan around image</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Touch</td>
                <td className="py-3 px-4">Swipe left/right</td>
                <td className="py-3 px-4">Navigate gallery</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Touch</td>
                <td className="py-3 px-4">Double tap</td>
                <td className="py-3 px-4">Toggle zoom (1x / 2x)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Mouse</td>
                <td className="py-3 px-4">Scroll wheel</td>
                <td className="py-3 px-4">Zoom in/out</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Mouse</td>
                <td className="py-3 px-4">Drag</td>
                <td className="py-3 px-4">Pan when zoomed</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-muted-foreground">Mouse</td>
                <td className="py-3 px-4">Click + buttons</td>
                <td className="py-3 px-4">Use zoom controls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Keyboard Shortcuts */}
      <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
        <p className="text-muted-foreground mb-4">
          Full keyboard support for accessibility and power users:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Key</th>
                <th className="text-left py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd>
                </td>
                <td className="py-3 px-4">Close preview</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Arrow Left
                  </kbd>
                </td>
                <td className="py-3 px-4">Previous image (gallery mode)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Arrow Right
                  </kbd>
                </td>
                <td className="py-3 px-4">Next image (gallery mode)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">+</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">=</kbd>
                </td>
                <td className="py-3 px-4">Zoom in</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">-</kbd>
                </td>
                <td className="py-3 px-4">Zoom out</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">0</kbd>
                </td>
                <td className="py-3 px-4">Reset zoom to 100%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">r</kbd>
                </td>
                <td className="py-3 px-4">Rotate clockwise 90°</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift</kbd>{' '}
                  +{' '}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">r</kbd>
                </td>
                <td className="py-3 px-4">Rotate counter-clockwise 90°</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">f</kbd>
                </td>
                <td className="py-3 px-4">Toggle fullscreen</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                </td>
                <td className="py-3 px-4">Next image (gallery mode)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                </td>
                <td className="py-3 px-4">Focus next control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Examples */}
      <Section id="examples" title="Examples">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Single Image Preview</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function SingleImageExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Image
      </button>

      {isOpen && (
        <ImagePreview
          src="/photos/image.jpg"
          alt="Beautiful landscape"
          onClose={() => setIsOpen(false)}
          enableZoom
          enableRotation
          enableFullscreen
        />
      )}
    </>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Gallery Mode with Multiple Images</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function GalleryExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    {
      src: '/photos/image1.jpg',
      alt: 'First image',
      caption: 'Beautiful sunset over the mountains',
    },
    {
      src: '/photos/image2.jpg',
      alt: 'Second image',
      caption: 'Crystal clear lake reflection',
    },
    {
      src: '/photos/image3.jpg',
      alt: 'Third image',
      caption: 'Vibrant autumn colors',
    },
  ]

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            onClick={() => {
              setCurrentIndex(index)
              setIsOpen(true)
            }}
            className="cursor-pointer rounded-lg hover:opacity-80 transition"
          />
        ))}
      </div>

      {isOpen && (
        <ImagePreview
          images={images}
          initialIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onImageChange={(index) => setCurrentIndex(index)}
          showThumbnails
          showCaption
        />
      )}
    </>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Custom Zoom Settings</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function CustomZoomExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View High-Res Image
      </button>

      {isOpen && (
        <ImagePreview
          src="/photos/high-resolution.jpg"
          alt="High resolution image"
          onClose={() => setIsOpen(false)}
          // Custom zoom settings for high-res images
          minZoom={1}
          maxZoom={5}
          zoomStep={0.25}
          onZoomChange={(newZoom) => {
            setZoom(newZoom)
            console.log('Current zoom:', newZoom)
          }}
        />
      )}

      {isOpen && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      )}
    </>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Lazy Loading with Gallery</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function LazyLoadGalleryExample() {
  const [isOpen, setIsOpen] = useState(false)

  // Large image gallery
  const images = Array.from({ length: 50 }, (_, i) => ({
    src: \`/photos/gallery/image-\${i + 1}.jpg\`,
    alt: \`Gallery image \${i + 1}\`,
    caption: \`Photo #\${i + 1} from the collection\`,
  }))

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Gallery (50 images)
      </button>

      {isOpen && (
        <ImagePreview
          images={images}
          initialIndex={0}
          onClose={() => setIsOpen(false)}
          // Lazy load images for better performance
          lazyLoad={true}
          showThumbnails
          thumbnailPosition="bottom"
        />
      )}
    </>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Minimal UI Mode</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { useState } from 'react'

function MinimalUIExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <img
        src="/photos/minimal.jpg"
        alt="Click to view"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      />

      {isOpen && (
        <ImagePreview
          src="/photos/minimal.jpg"
          alt="Minimal preview"
          onClose={() => setIsOpen(false)}
          // Minimal UI configuration
          showControls={false}
          showCaption={false}
          closeOnBackdropClick={true}
          closeOnEscape={true}
          // Still enable core features
          enableZoom={true}
          enablePan={true}
        />
      )}
    </>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">With Chat Integration</h4>
            <CodeBlock
              language="tsx"
              code={`import { ImagePreview } from '@clarity-chat/react'
import { MessageAttachment } from '@clarity-chat/types'
import { useState } from 'react'

function ChatImagePreviewExample() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageClick = (attachment: MessageAttachment) => {
    if (attachment.type === 'image') {
      setPreviewImage(attachment.url)
    }
  }

  return (
    <div className="chat-container">
      {/* Chat messages with image attachments */}
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
          {message.attachments?.map((attachment) => (
            <img
              key={attachment.id}
              src={attachment.url}
              alt={attachment.name}
              onClick={() => handleImageClick(attachment)}
              className="cursor-pointer rounded-lg"
            />
          ))}
        </div>
      ))}

      {/* Image preview */}
      {previewImage && (
        <ImagePreview
          src={previewImage}
          alt="Chat image preview"
          onClose={() => setPreviewImage(null)}
          enableZoom
          enableFullscreen
          enableDownload
        />
      )}
    </div>
  )
}`}
            />
          </div>
        </div>
      </Section>

      {/* Performance */}
      <Section id="performance" title="Performance">
        <p className="text-muted-foreground mb-4">
          ImagePreview is optimized for performance with several strategies:
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Lazy Loading Strategy</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Images are loaded on-demand to minimize initial load time and bandwidth:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Only load visible images in gallery mode</li>
              <li>• Preload adjacent images for smooth navigation</li>
              <li>• Cancel pending loads when navigating away</li>
              <li>• Use responsive image sizes via srcSet</li>
              <li>• Progressive enhancement with blur-up placeholders</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Image Optimization</h4>
            <CodeBlock
              language="tsx"
              code={`// Recommended: Use responsive images
const optimizedImage = {
  src: '/photos/image-1280w.jpg',
  srcSet: \`
    /photos/image-640w.jpg 640w,
    /photos/image-1280w.jpg 1280w,
    /photos/image-1920w.jpg 1920w
  \`,
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1280px'
}

<ImagePreview
  src={optimizedImage.src}
  srcSet={optimizedImage.srcSet}
  sizes={optimizedImage.sizes}
  alt="Optimized image"
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Memory Management</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Component efficiently manages memory for large galleries:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Virtual scrolling for thumbnail strips</li>
              <li>• Automatic cleanup of off-screen images</li>
              <li>• Request animation frame for smooth animations</li>
              <li>• Debounced gesture handlers</li>
              <li>• Memoized expensive calculations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Performance Metrics</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Metric</th>
                    <th className="text-left py-3 px-4 font-semibold">Target</th>
                    <th className="text-left py-3 px-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Time to Interactive</td>
                    <td className="py-3 px-4">&lt;100ms</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      Component ready for user interaction
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Zoom Response Time</td>
                    <td className="py-3 px-4">&lt;16ms</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      60 FPS for smooth animations
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Gallery Navigation</td>
                    <td className="py-3 px-4">&lt;50ms</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      Instant slide transitions
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Memory Usage</td>
                    <td className="py-3 px-4">&lt;50MB</td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      For galleries with 100+ images
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Best Practices</h4>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Use WebP format for better compression (50-30% smaller)</li>
                <li>✓ Provide multiple resolutions via srcSet</li>
                <li>✓ Enable lazy loading for galleries with 10+ images</li>
                <li>✓ Compress images before upload (target 200KB per image)</li>
                <li>✓ Use CDN for faster delivery globally</li>
                <li>✓ Set proper cache headers (1 year for immutable images)</li>
                <li>✓ Consider progressive JPEG for large images</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Keyboard Navigation</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Full keyboard support ensures all features are accessible:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All controls are keyboard focusable with visible focus indicators</li>
              <li>• Standard shortcuts (Escape to close, arrows for navigation)</li>
              <li>• Focus trapped within preview when open</li>
              <li>• Focus restored to trigger element on close</li>
              <li>• Logical tab order through controls</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Screen Reader Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Images have descriptive alt text (required prop)</li>
              <li>• Live regions announce zoom level changes</li>
              <li>• Current image index announced in gallery mode</li>
              <li>• Button labels describe their actions clearly</li>
              <li>• Role and state information for all interactive elements</li>
              <li>• Captions read after image description</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">ARIA Implementation</h4>
            <CodeBlock
              language="tsx"
              code={`// Example ARIA attributes used internally
<div
  role="dialog"
  aria-modal="true"
  aria-label="Image preview"
  aria-describedby="image-description"
>
  <img
    src={src}
    alt={alt}
    aria-live="polite"
    aria-atomic="true"
  />

  <div role="status" aria-live="polite" className="sr-only">
    {/* Zoom level announcements */}
    Zoom level: {zoomPercent}%
  </div>

  <button
    aria-label="Zoom in"
    aria-keyshortcuts="Plus"
    onClick={handleZoomIn}
  >
    <ZoomInIcon aria-hidden="true" />
  </button>

  {/* Gallery navigation */}
  <div role="region" aria-label="Image gallery">
    <button aria-label="Previous image" aria-keyshortcuts="ArrowLeft">
      <ChevronLeftIcon aria-hidden="true" />
    </button>
    <div aria-live="polite" aria-atomic="true">
      Image {currentIndex + 1} of {totalImages}
    </div>
  </div>
</div>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Color Contrast</h4>
            <p className="text-sm text-muted-foreground mb-2">
              All UI elements meet WCAG 2.1 AA standards:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Control buttons: 4.5:1 contrast ratio</li>
              <li>✓ Captions: 4.5:1 contrast ratio</li>
              <li>✓ Focus indicators: 3:1 contrast ratio</li>
              <li>✓ Hover states clearly visible</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Reduced Motion</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Respects user's motion preferences:
            </p>
            <CodeBlock
              language="tsx"
              code={`// Component respects prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  /* Disable zoom animations */
  .image-preview {
    transition: none;
  }

  /* Instant slide transitions */
  .gallery-slide {
    animation: none;
  }
}

// Or disable programmatically
<ImagePreview
  src="/image.jpg"
  alt="Image"
  animationDuration={prefersReducedMotion ? 0 : 300}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">WCAG 2.1 Compliance</h4>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h5 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                AA Compliance
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ 1.1.1 Non-text Content (Level A)</li>
                <li>✓ 1.4.3 Contrast (Minimum) (Level AA)</li>
                <li>✓ 2.1.1 Keyboard (Level A)</li>
                <li>✓ 2.1.2 No Keyboard Trap (Level A)</li>
                <li>✓ 2.4.3 Focus Order (Level A)</li>
                <li>✓ 2.4.7 Focus Visible (Level AA)</li>
                <li>✓ 3.2.1 On Focus (Level A)</li>
                <li>✓ 4.1.2 Name, Role, Value (Level A)</li>
                <li>✓ 4.1.3 Status Messages (Level AA)</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
