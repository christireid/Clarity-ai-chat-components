'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const textShimmerProps: Prop[] = [
  {
    name: 'lines',
    type: 'number',
    default: '1',
    description: 'Number of shimmer lines to display.',
  },
  {
    name: 'width',
    type: 'string',
    description: 'Custom width for the shimmer (CSS value).',
  },
  {
    name: 'variant',
    type: '"text" | "paragraph" | "heading" | "code" | "inline"',
    default: '"text"',
    description: 'Visual variant determining size, spacing, and default configuration.',
  },
  {
    name: 'speed',
    type: '"slow" | "normal" | "fast"',
    default: '"normal"',
    description: 'Animation speed preset.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg" | "xl"',
    description: 'Size variant affecting line height and spacing.',
  },
  {
    name: 'lineWidths',
    type: 'string[]',
    description: 'Custom line widths as array of CSS values.',
  },
  {
    name: 'active',
    type: 'boolean',
    default: 'true',
    description: 'Whether shimmer animation is active.',
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations.',
  },
]

export default function TextShimmerPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>TextShimmer</h1>

      <p className="lead">
        Animated shimmer effect for text placeholder loading states. Creates realistic
        loading skeletons for chat messages, paragraphs, and code blocks.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import {
  TextShimmer,
  ParagraphShimmer,
  HeadingShimmer,
  CodeShimmer,
  useTextShimmer
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { TextShimmer } from '@clarity-chat/react'

function Example() {
  return (
    <>
      {/* Single line shimmer */}
      <TextShimmer />

      {/* Multiple lines */}
      <TextShimmer lines={3} />

      {/* Custom width */}
      <TextShimmer width="200px" />
    </>
  )
}`}
        language="tsx"
      />

      <h2 id="variants">Variants</h2>

      <EnhancedCodeBlock
        code={`// Text variant - single line, default size
<TextShimmer variant="text" />

// Paragraph variant - multiple lines with realistic widths
<TextShimmer variant="paragraph" lines={4} />

// Heading variant - larger, bolder shimmer
<TextShimmer variant="heading" />

// Code variant - monospace appearance in code block style
<TextShimmer variant="code" lines={6} />

// Inline variant - compact for inline text
<TextShimmer variant="inline" width="8rem" />`}
        language="tsx"
      />

      <h2 id="convenience-components">Convenience Components</h2>

      <p>
        Use pre-configured variants for common use cases:
      </p>

      <EnhancedCodeBlock
        code={`import {
  ParagraphShimmer,
  HeadingShimmer,
  CodeShimmer,
  InlineShimmer
} from '@clarity-chat/react'

function Example() {
  return (
    <div>
      <HeadingShimmer />
      <ParagraphShimmer lines={5} />
      <CodeShimmer lines={8} />

      <p>Loading <InlineShimmer width="60px" /> data...</p>
    </div>
  )
}`}
        language="tsx"
      />

      <h2 id="custom-line-widths">Custom Line Widths</h2>

      <p>
        Create more realistic layouts with custom line widths:
      </p>

      <EnhancedCodeBlock
        code={`<TextShimmer
  lines={4}
  lineWidths={['100%', '95%', '80%', '60%']}
/>`}
        language="tsx"
      />

      <h2 id="with-hook">With useTextShimmer Hook</h2>

      <EnhancedCodeBlock
        code={`import { TextShimmer, useTextShimmer } from '@clarity-chat/react'

function Example() {
  const shimmer = useTextShimmer({
    autoDeactivateAfter: 3000, // Auto-hide after 3s
  })

  React.useEffect(() => {
    if (isLoading) {
      shimmer.activate()
    } else {
      shimmer.deactivate()
    }
  }, [isLoading])

  return <TextShimmer {...shimmer.shimmerProps} lines={3} />
}`}
        language="tsx"
      />

      <h2 id="shimmer-group">TextShimmerGroup</h2>

      <p>
        Group multiple shimmers with consistent styling:
      </p>

      <EnhancedCodeBlock
        code={`import { TextShimmerGroup, HeadingShimmer, ParagraphShimmer } from '@clarity-chat/react'

function Example() {
  return (
    <TextShimmerGroup speed="fast" size="lg" gap="gap-6">
      <HeadingShimmer />
      <ParagraphShimmer lines={3} />
      <TextShimmer width="50%" />
    </TextShimmerGroup>
  )
}`}
        language="tsx"
      />

      <h2 id="animation-speeds">Animation Speeds</h2>

      <EnhancedCodeBlock
        code={`// Slow animation
<TextShimmer speed="slow" lines={3} />

// Normal speed (default)
<TextShimmer speed="normal" lines={3} />

// Fast animation
<TextShimmer speed="fast" lines={3} />`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={textShimmerProps} />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ role="status" for screen readers</li>
        <li>✅ aria-busy="true" during active state</li>
        <li>✅ Customizable aria-label</li>
        <li>✅ Respects prefers-reduced-motion</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/skeleton">Skeleton</a> - Generic skeleton loader
        </li>
        <li>
          <a href="/reference/components/thinking-indicator">ThinkingIndicator</a> - Thinking dots
        </li>
      </ul>
    </>
  )
}
