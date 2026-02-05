import type { ComponentDoc } from '@/components/doc-panel'

export const loadingStatesDocs: Record<string, ComponentDoc | ComponentDoc[]> =
  {
    'Spinner Loaders': {
      name: 'AnimatedDots',
      description:
        'Reusable animated dots indicator for loading spinners, typing indicators, and progress feedback. Supports multiple animation variants (bounce, pulse, wave, fade), configurable dot count and size, and respects reduced motion preferences.',
      importPath: '@clarity-chat/react',
      usageCode: `<AnimatedDots variant="bounce" size="md" />

{/* Pre-configured convenience variants */}
<BouncingDots />
<PulsingDots />
<WaveDots />
<FadingDots />

{/* Customized */}
<AnimatedDots
  variant="wave"
  count={4}
  size="lg"
  staggerDelay={0.2}
  className="text-primary"
  ariaLabel="Processing request"
/>`,
      props: [
        {
          name: 'variant',
          type: "'bounce' | 'pulse' | 'wave' | 'fade'",
          default: '"bounce"',
          description:
            'Animation variant. "bounce" is the classic iMessage-style, "pulse" expands/contracts, "wave" fades with scale, and "fade" is a subtle opacity-only animation.',
          commonlyUsed: true,
        },
        {
          name: 'count',
          type: 'number',
          default: '3',
          description: 'Number of dots to render. Clamped between 1 and 10.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Size preset controlling dot dimensions and gap. sm = 4px dots, md = 8px dots, lg = 12px dots.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the container element.',
        },
        {
          name: 'dotClassName',
          type: 'string',
          description:
            'Additional CSS class names applied to each individual dot.',
        },
        {
          name: 'staggerDelay',
          type: 'number',
          default: '0.15',
          description:
            'Delay in seconds between each dot starting its animation cycle.',
        },
        {
          name: 'duration',
          type: 'number',
          description:
            'Override the animation duration in seconds. When omitted, each variant uses its own default (bounce: 0.6s, pulse: 1s, wave: 1.2s, fade: 1.4s).',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Loading"',
          description:
            'Accessible label for screen readers. The component renders with role="status" and aria-busy="true".',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also exported as pre-configured convenience components: BouncingDots, PulsingDots, WaveDots, and FadingDots.',
        'Automatically falls back to a subtle opacity animation when the user prefers reduced motion.',
        'Uses Framer Motion for animations. Each dot is a motion.span with will-change-transform for GPU acceleration.',
        'Invalid variant or size values are safely handled with fallbacks to the defaults.',
      ],
    },

    'Skeleton Loaders': [
      {
        name: 'Skeleton',
        description:
          'Base skeleton loading placeholder with shimmer or pulse animation. Serves as the foundation for all skeleton variants. Renders a motion.div with configurable dimensions, border radius, and animation type.',
        importPath: '@clarity-chat/react',
        usageCode: `<Skeleton variant="shimmer" width="100%" height="1rem" />

{/* Different shapes */}
<Skeleton width={200} height={24} rounded="sm" />
<Skeleton width={48} height={48} rounded="full" />
<Skeleton variant="pulse" width="80%" height={16} />`,
        props: [
          {
            name: 'variant',
            type: "'pulse' | 'shimmer' | 'none'",
            default: '"shimmer"',
            description:
              'Animation type. "shimmer" shows a moving gradient, "pulse" fades in/out, and "none" renders a static placeholder.',
            commonlyUsed: true,
          },
          {
            name: 'width',
            type: 'string | number',
            default: '"100%"',
            description:
              'Width of the skeleton. Accepts CSS values (string) or pixel numbers.',
            commonlyUsed: true,
          },
          {
            name: 'height',
            type: 'string | number',
            default: '"1rem"',
            description:
              'Height of the skeleton. Accepts CSS values (string) or pixel numbers.',
            commonlyUsed: true,
          },
          {
            name: 'rounded',
            type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
            default: '"md"',
            description:
              'Border radius preset. Use "full" for circular shapes like avatars.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description:
              'Additional CSS class names applied to the skeleton element.',
          },
          {
            name: 'style',
            type: 'React.CSSProperties',
            description:
              'Additional inline styles merged with the computed styles.',
          },
        ],
        notes: [
          'Automatically respects prefers-reduced-motion by switching to the "none" variant.',
          'Uses Framer Motion animations under the hood.',
          'Extends HTMLMotionProps<"div"> so all standard div and motion props are supported.',
        ],
      },
      {
        name: 'SkeletonText',
        description:
          'Multi-line text skeleton placeholder. Renders a configurable number of horizontal bars with the last line shortened for a realistic text appearance.',
        importPath: '@clarity-chat/react',
        usageCode: `<SkeletonText lines={3} />

{/* Customized */}
<SkeletonText
  lines={5}
  lineHeight={14}
  gap={6}
  lastLineWidth={60}
  variant="pulse"
/>`,
        props: [
          {
            name: 'lines',
            type: 'number',
            default: '3',
            description: 'Number of text lines to render.',
            commonlyUsed: true,
          },
          {
            name: 'lineHeight',
            type: 'number',
            default: '16',
            description: 'Height of each line in pixels.',
          },
          {
            name: 'gap',
            type: 'number',
            default: '8',
            description: 'Gap between lines in pixels.',
          },
          {
            name: 'lastLineWidth',
            type: 'number',
            default: '70',
            description:
              'Width percentage for the last line, creating a natural trailing-off effect.',
            commonlyUsed: true,
          },
          {
            name: 'variant',
            type: "'pulse' | 'shimmer' | 'none'",
            default: '"shimmer"',
            description: 'Animation variant for all lines.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the container.',
          },
        ],
      },
      {
        name: 'SkeletonMessage',
        description:
          'Chat message skeleton placeholder combining an avatar and multi-line text. Supports user and assistant roles with appropriate alignment.',
        importPath: '@clarity-chat/react',
        usageCode: `<SkeletonMessage role="assistant" lines={3} />

{/* User-side message skeleton */}
<SkeletonMessage role="user" lines={2} showAvatar={false} />`,
        props: [
          {
            name: 'role',
            type: "'user' | 'assistant'",
            default: '"assistant"',
            description:
              'Message role controlling alignment. "user" reverses the row direction.',
            commonlyUsed: true,
          },
          {
            name: 'showAvatar',
            type: 'boolean',
            default: 'true',
            description: 'Whether to render a circular avatar skeleton.',
            commonlyUsed: true,
          },
          {
            name: 'lines',
            type: 'number',
            default: '3',
            description: 'Number of text lines in the message body.',
            commonlyUsed: true,
          },
          {
            name: 'variant',
            type: "'pulse' | 'shimmer' | 'none'",
            default: '"shimmer"',
            description: 'Animation variant for the skeleton elements.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the container.',
          },
        ],
      },
      {
        name: 'SkeletonCard',
        description:
          'Card layout skeleton placeholder with optional image, header, body text, and footer sections. Useful for content cards, blog posts, and product listings.',
        importPath: '@clarity-chat/react',
        usageCode: `<SkeletonCard />

{/* Minimal card without image or footer */}
<SkeletonCard showImage={false} showFooter={false} bodyLines={2} />`,
        props: [
          {
            name: 'showImage',
            type: 'boolean',
            default: 'true',
            description: 'Whether to render the image placeholder area.',
            commonlyUsed: true,
          },
          {
            name: 'imageHeight',
            type: 'number',
            default: '200',
            description: 'Height of the image placeholder in pixels.',
          },
          {
            name: 'showHeader',
            type: 'boolean',
            default: 'true',
            description: 'Whether to render the title/subtitle header section.',
          },
          {
            name: 'bodyLines',
            type: 'number',
            default: '3',
            description: 'Number of body text lines.',
            commonlyUsed: true,
          },
          {
            name: 'showFooter',
            type: 'boolean',
            default: 'true',
            description: 'Whether to render the footer action buttons area.',
          },
          {
            name: 'variant',
            type: "'pulse' | 'shimmer' | 'none'",
            default: '"shimmer"',
            description: 'Animation variant for all skeleton elements.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the card container.',
          },
        ],
      },
    ],

    'Shimmer Effects': [
      {
        name: 'TextShimmer',
        description:
          'Animated shimmer effect for text placeholder loading states. Renders configurable lines with a moving gradient highlight. Supports multiple visual variants (text, paragraph, heading, code, inline), size presets, custom line widths, and custom shimmer colors.',
        importPath: '@clarity-chat/react',
        usageCode: `<TextShimmer />

{/* Paragraph placeholder */}
<TextShimmer variant="paragraph" lines={5} />

{/* Heading placeholder */}
<TextShimmer variant="heading" />

{/* Code block placeholder */}
<TextShimmer variant="code" lines={4} />

{/* Custom line widths for realistic appearance */}
<TextShimmer lines={3} lineWidths={['100%', '80%', '60%']} speed="fast" />

{/* Pre-configured convenience variants */}
<ParagraphShimmer lines={4} />
<HeadingShimmer />
<CodeShimmer lines={6} />
<InlineShimmer width="60px" />`,
        props: [
          {
            name: 'lines',
            type: 'number',
            default: 'varies by variant',
            description:
              'Number of shimmer lines. Defaults depend on variant: text=1, inline=1, paragraph=4, heading=1, code=3. Capped at 20.',
            commonlyUsed: true,
          },
          {
            name: 'width',
            type: 'string',
            default: 'varies by variant',
            description:
              'Container width as a CSS value (e.g., "200px", "100%", "15rem"). Defaults: text/paragraph/code="100%", heading="60%", inline="8rem".',
            commonlyUsed: true,
          },
          {
            name: 'variant',
            type: "'text' | 'paragraph' | 'heading' | 'code' | 'inline'",
            default: '"text"',
            description:
              'Visual variant controlling defaults for lines, size, width, and styling. "code" adds monospace font and muted background.',
            commonlyUsed: true,
          },
          {
            name: 'speed',
            type: "'slow' | 'normal' | 'fast'",
            default: '"normal"',
            description:
              'Animation speed. slow=2.5s, normal=1.8s, fast=1.2s per shimmer cycle.',
            commonlyUsed: true,
          },
          {
            name: 'size',
            type: "'sm' | 'md' | 'lg' | 'xl'",
            default: 'varies by variant',
            description:
              'Size preset affecting line height and gap. sm=h-3, md=h-4, lg=h-5, xl=h-6.',
          },
          {
            name: 'lineWidths',
            type: 'string[]',
            description:
              'Custom widths for each line as CSS values. Cycles through the array if fewer widths than lines. Overrides variant defaults.',
          },
          {
            name: 'lineGap',
            type: 'string',
            description:
              'Gap between lines as a Tailwind gap class. Defaults to the size preset value.',
          },
          {
            name: 'borderRadius',
            type: 'string',
            default: '"4px"',
            description: 'Border radius applied to each shimmer line.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the container.',
          },
          {
            name: 'lineClassName',
            type: 'string',
            description:
              'Additional CSS class names applied to each individual line.',
          },
          {
            name: 'aria-label',
            type: 'string',
            default: '"Loading content"',
            description: 'Accessible label for screen readers.',
          },
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
            description:
              'Whether the shimmer animation is active. When false, renders static placeholders.',
            commonlyUsed: true,
          },
          {
            name: 'disableAnimations',
            type: 'boolean',
            default: 'false',
            description:
              'Completely disable all animations regardless of active state.',
          },
          {
            name: 'shimmerColors',
            type: '{ base?: string; highlight?: string }',
            description:
              'Custom shimmer gradient colors. Defaults use CSS variables: base = hsl(var(--muted) / 0.4), highlight = hsl(var(--muted) / 0.7).',
          },
        ],
        notes: [
          'Also exported as convenience variants: ParagraphShimmer, HeadingShimmer, CodeShimmer, and InlineShimmer.',
          'TextShimmerGroup provides a container that passes shared speed, size, active, and disableAnimations props to all children.',
          'The useTextShimmer hook manages active state with optional auto-deactivation timer and callbacks.',
          'Uses Framer Motion for the shimmer gradient animation with staggered delays per line.',
          'Respects prefers-reduced-motion by falling back to a gentle opacity pulse.',
        ],
      },
      {
        name: 'StreamingTextShimmer',
        description:
          'Applies a shimmer animation effect to actual streaming text content. Unlike TextShimmer (which shows placeholder lines), this component wraps real text and applies a gradient shimmer during active streaming. Includes an optional blinking cursor.',
        importPath: '@clarity-chat/react',
        usageCode: `<StreamingTextShimmer isStreaming={true}>
  {streamingContent}
</StreamingTextShimmer>

{/* With custom speed and variant */}
<StreamingTextShimmer isStreaming={true} speed="fast" variant="primary">
  Processing your request...
</StreamingTextShimmer>

{/* Without cursor */}
<StreamingTextShimmer isStreaming={true} showCursor={false}>
  {content}
</StreamingTextShimmer>`,
        props: [
          {
            name: 'children',
            type: 'React.ReactNode',
            required: true,
            description: 'The text content to display with the shimmer effect.',
            commonlyUsed: true,
          },
          {
            name: 'isStreaming',
            type: 'boolean',
            default: 'false',
            description:
              'Whether streaming is active. When true, enables the shimmer animation and ARIA live attributes.',
            commonlyUsed: true,
          },
          {
            name: 'speed',
            type: "'slow' | 'normal' | 'fast'",
            default: '"normal"',
            description:
              'Animation speed preset controlling shimmer cycle duration.',
            commonlyUsed: true,
          },
          {
            name: 'variant',
            type: "'default' | 'primary' | 'muted'",
            default: '"default"',
            description: 'Color variant for the shimmer gradient.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the wrapper span.',
          },
          {
            name: 'showCursor',
            type: 'boolean',
            default: 'true',
            description:
              'Show a blinking cursor character at the end of the text during streaming.',
            commonlyUsed: true,
          },
          {
            name: 'cursorChar',
            type: 'string',
            default: '"\\u258B"',
            description:
              'Custom cursor character. Defaults to the block cursor character.',
          },
          {
            name: 'disableAnimation',
            type: 'boolean',
            default: 'false',
            description:
              'Disable the shimmer animation while still showing the cursor and ARIA attributes.',
          },
          {
            name: 'aria-label',
            type: 'string',
            description: 'Accessible label for screen readers.',
          },
        ],
        notes: [
          'The useStreamingShimmer hook provides state management with startStreaming, stopStreaming, toggleStreaming, and optional auto-timeout.',
          'Automatically respects prefers-reduced-motion by disabling the shimmer gradient.',
          'Sets role="status", aria-live="polite", and aria-busy on the wrapper during streaming.',
          'The cursor component (StreamingCursor) is also exported separately for standalone use.',
        ],
      },
    ],

    'Progress Indicators': {
      name: 'DashboardStateTransition',
      description:
        'Wrapper component that handles animated transitions between loading, error, and content states. Shows a skeleton placeholder while loading, an error state on failure, and smoothly transitions to the actual content. Includes screen reader announcements for state changes.',
      importPath: '@clarity-chat/react',
      usageCode: `<DashboardStateTransition
  isLoading={isLoading}
  error={error}
  skeleton={<AnalyticsDashboardSkeleton />}
  dashboardName="Analytics"
>
  <AnalyticsDashboard data={data} />
</DashboardStateTransition>

{/* Without animations */}
<DashboardStateTransition
  isLoading={isLoading}
  skeleton={<ProgressWidgetSkeleton />}
  animate={false}
>
  <ProgressWidget data={data} />
</DashboardStateTransition>`,
      props: [
        {
          name: 'isLoading',
          type: 'boolean',
          required: true,
          description:
            'Whether the content is currently loading. Controls which state (skeleton, error, or content) is displayed.',
          commonlyUsed: true,
        },
        {
          name: 'error',
          type: 'Error | string | null',
          description:
            'Error state. When set and not loading, displays the error component instead of children.',
          commonlyUsed: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description:
            'The actual content to display when loading is complete and there is no error.',
          commonlyUsed: true,
        },
        {
          name: 'skeleton',
          type: 'React.ReactNode',
          required: true,
          description:
            'Skeleton component to display while loading. Typically an AnalyticsDashboardSkeleton, UsageDashboardSkeleton, or similar.',
          commonlyUsed: true,
        },
        {
          name: 'errorComponent',
          type: 'React.ReactNode',
          description:
            'Custom error component. When omitted, a default error card with icon and message is rendered.',
        },
        {
          name: 'dashboardName',
          type: 'string',
          default: '"Dashboard"',
          description:
            'Name used in accessibility announcements (e.g., "Analytics loaded successfully") and the default error message.',
          commonlyUsed: true,
        },
        {
          name: 'animate',
          type: 'boolean',
          default: 'true',
          description:
            'Whether to animate transitions between states using CSS fade/slide animations.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the outer container.',
        },
      ],
      notes: [
        'Uses the LoadingAnnouncer internally to announce state transitions to screen readers via aria-live="polite".',
        'Respects prefers-reduced-motion by disabling transition animations automatically.',
        'Pre-built dashboard skeletons available: AnalyticsDashboardSkeleton, UsageDashboardSkeleton, TokenOptimizationDashboardSkeleton, PerformanceDashboardSkeleton.',
        'Also exports MetricCardSkeleton, ProgressWidgetSkeleton, ListItemSkeleton, and ChartSkeleton for building custom dashboard skeletons.',
        'The DashboardEmptyState component is also available for no-data states with optional action buttons.',
      ],
    },

    'AI Loading States': [
      {
        name: 'TypingIndicator',
        description:
          'Classic "typing..." indicator for chat interfaces. Displays an animated dot bubble with an optional avatar, matching modern chat application patterns (iMessage, Slack, Discord). Uses spring physics for smooth entrance animations.',
        importPath: '@clarity-chat/react',
        usageCode: `{isAITyping && <TypingIndicator />}

{/* With custom label */}
<TypingIndicator label="Assistant is thinking" />

{/* Without avatar */}
<TypingIndicator showAvatar={false} />

{/* Different animation variant */}
<TypingIndicator variant="pulse" />

{/* With custom avatar */}
<TypingIndicator
  avatarSrc="/ai-avatar.png"
  avatarFallback="AI"
  label="Generating response"
/>`,
        props: [
          {
            name: 'showAvatar',
            type: 'boolean',
            default: 'true',
            description:
              'Whether to render an avatar next to the typing bubble.',
            commonlyUsed: true,
          },
          {
            name: 'avatarSrc',
            type: 'string',
            description:
              'URL for the avatar image. When omitted, the fallback text is displayed.',
          },
          {
            name: 'avatarFallback',
            type: 'string',
            default: '"AI"',
            description:
              'Fallback text shown when no avatar image is provided or it fails to load.',
          },
          {
            name: 'label',
            type: 'string',
            default: '"AI is typing"',
            description:
              'Accessible label announced by screen readers. Also used as the aria-label on the container.',
            commonlyUsed: true,
          },
          {
            name: 'variant',
            type: "'dots' | 'pulse' | 'wave'",
            default: '"dots"',
            description:
              'Animation variant for the dots inside the typing bubble. "dots" maps to the bounce animation internally.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names for the outer container.',
          },
        ],
        notes: [
          'Uses Framer Motion spring physics for entrance animations (damping: 20, stiffness: 300).',
          'Internally uses the AnimatedDots component for the dot animation.',
          'Sets role="status" and aria-live="polite" for accessibility.',
          'Respects prefers-reduced-motion by falling back to a simple fade-in animation.',
        ],
      },
      {
        name: 'EnhancedSkeleton',
        description:
          'Advanced skeleton component from the enhanced skeleton system with additional animation variants (wave, gradient, dots), transition support, performance monitoring, and accessibility features. Suitable for AI-specific loading states.',
        importPath: '@clarity-chat/react',
        usageCode: `<EnhancedSkeleton variant="shimmer" width="100%" height="4rem" />

{/* Wave animation */}
<EnhancedSkeleton variant="wave" width="200px" height="40px" rounded="lg" />

{/* With performance monitoring */}
<EnhancedSkeleton
  variant="gradient"
  width="100%"
  height="120px"
  performanceId="ai-response-skeleton"
  ariaLabel="AI response loading"
/>`,
        props: [
          {
            name: 'variant',
            type: "'pulse' | 'shimmer' | 'wave' | 'gradient' | 'dots' | 'none'",
            default: '"shimmer"',
            description:
              'Animation type. Extends the base Skeleton with wave, gradient, and dots animations.',
            commonlyUsed: true,
          },
          {
            name: 'width',
            type: 'string | number',
            default: '"100%"',
            description:
              'Width of the skeleton. Accepts CSS values or pixel numbers.',
            commonlyUsed: true,
          },
          {
            name: 'height',
            type: 'string | number',
            default: '"1rem"',
            description:
              'Height of the skeleton. Accepts CSS values or pixel numbers.',
            commonlyUsed: true,
          },
          {
            name: 'rounded',
            type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
            default: '"md"',
            description: 'Border radius preset.',
            commonlyUsed: true,
          },
          {
            name: 'enableTransition',
            type: 'boolean',
            default: 'true',
            description:
              'Enable smooth transition when skeleton is replaced with real content.',
          },
          {
            name: 'transitionDuration',
            type: 'number',
            default: '300',
            description: 'Transition duration in milliseconds.',
          },
          {
            name: 'transitionEasing',
            type: 'string',
            default: '"ease-out"',
            description: 'CSS easing function for the transition.',
          },
          {
            name: 'performanceId',
            type: 'string',
            description:
              'Unique identifier for performance monitoring. When set, tracks render timing in development.',
          },
          {
            name: 'ariaLabel',
            type: 'string',
            default: '"Loading..."',
            description:
              'Accessible label for screen readers. The component renders with aria-busy="true" and aria-live="polite".',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS class names.',
          },
          {
            name: 'style',
            type: 'React.CSSProperties',
            description: 'Additional inline styles.',
          },
        ],
        notes: [
          'Part of the skeleton-enhanced system which also includes SkeletonTransition, SkeletonThemeProvider, SkeletonComposer, AccessibleSkeleton, SmartSkeleton, and MicroInteractionSkeleton.',
          'The SkeletonTransition component manages animated transitions between loading and content states with direction options: fade, slide-up, slide-down, scale, morph.',
          'Uses CSS-based animations (no Framer Motion dependency) for better performance.',
          'All enhanced skeleton components include built-in backdrop-blur for a glass-morphism effect.',
        ],
      },
    ],
  }
