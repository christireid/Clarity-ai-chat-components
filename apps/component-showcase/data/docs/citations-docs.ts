import type { ComponentDoc } from '@/components/doc-panel'

export const citationsDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Citation Chips
  // ===========================================================================
  'Citation Chips': [
    {
      name: 'CitationChip',
      description:
        'Compact clickable citation chip for inline source references. Supports multiple variants including default (with hover card preview), compact, and inline (with tooltip). Can accept either a Citation object or direct title/url props.',
      importPath: '@clarity-chat/react',
      importName: 'CitationChip',
      usageCode: `import { CitationChip } from '@clarity-chat/react'

{
  /* Default variant with hover card */
}
<CitationChip
  citation={citation}
  index={1}
  variant="default"
/>

{
  /* Inline variant with tooltip */
}
<CitationChip
  index={2}
  title="React Documentation"
  url="https://react.dev"
  variant="inline"
/>

{
  /* Compact variant */
}
<CitationChip
  index={3}
  title="MDN Web Docs"
  url="https://developer.mozilla.org"
  variant="compact"
/>`,
      props: [
        {
          name: 'citation',
          type: 'Citation',
          required: true,
          description:
            'Citation data object containing id, title, url, snippet, domain, and favicon. Can be used instead of individual title/url props.',
          commonlyUsed: true,
        },
        {
          name: 'onClick',
          type: '() => void',
          description: 'The onClick prop.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root element.',
        },
        {
          name: 'index',
          type: 'number',
          required: true,
          description: 'The citation number displayed in the chip badge.',
          commonlyUsed: true,
        },
        {
          name: 'title',
          type: 'string',
          description:
            'Source title. Falls back to citation.title or "Source {index}" if not provided.',
          commonlyUsed: true,
        },
        {
          name: 'url',
          type: 'string',
          description:
            'Source URL for the link. Falls back to citation.url or "#" if not provided.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'compact' | 'inline'",
          default: '"default"',
          description:
            'Display variant. "default" shows a hover card preview, "compact" shows a small pill, and "inline" renders a circular numbered badge with a tooltip.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'The default variant uses a HoverCard to show source details including title, domain, snippet, and URL on hover.',
        'The inline variant uses a Tooltip and renders as a small circular badge suitable for embedding within text.',
        'The compact variant renders a small pill with the citation number and truncated title.',
        'All variants open the source URL in a new tab when clicked.',
        'Includes hydration safety -- the component defers rendering until mounted to prevent tooltip/hover card hydration mismatches.',
      ],
      sourceFile: 'components/clarity/citation-chip.tsx',
    },
    {
      name: 'InlineCitation',
      description:
        'Inline citation marker for use within flowing text. Renders as a small superscript-style numbered badge with a tooltip showing the source title. Designed for embedding directly in paragraphs.',
      importPath: '@clarity-chat/react',
      importName: 'InlineCitation',
      usageCode: `import { InlineCitation } from '@clarity-chat/react'
<p>
  React Hooks allow you to use state
  <InlineCitation
    number={1}
    source={{
      title: 'React Hooks Documentation',
      url: 'https://react.dev/docs/hooks-intro',
      author: 'React Team',
      snippet:
        'Hooks let you use state and other React features without writing a class.',
    }}
    variant="number"
  />
  without writing a class.
</p>`,
      props: [
        {
          name: 'citation',
          type: 'Citation',
          required: true,
          description: 'The citation prop.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Click handler. When not provided and the source has a URL, clicking opens the URL in a new tab.',
          commonlyUsed: true,
        },
        {
          name: 'showPreview',
          type: 'boolean',
          default: 'true',
          description:
            'Whether to show a hover preview popover with source details including title, snippet, author, date, and URL.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the wrapper element.',
        },
        {
          name: 'number',
          type: 'number',
          required: true,
          description: 'The citation number to display.',
          commonlyUsed: true,
        },
        {
          name: 'source',
          type: 'CitationSource',
          required: true,
          description:
            'Source information object with title, url, author, date, publisher, snippet, favicon, and type fields.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'InlineCitationVariant',
          default: '"number"',
          description:
            'Display variant. "number" shows the plain number, "bracket" wraps in [n], "superscript" renders as superscript, "footnote" shows *n as superscript, and "link" displays the source title with an external link icon.',
          commonlyUsed: true,
        },
        {
          name: 'isVerified',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to show a verified badge in the citation preview indicating the source has been verified.',
        },
      ],
      notes: [
        'CitationSource interface includes: title (string, required), url (string), author (string), date (string), publisher (string), snippet (string), favicon (string), and type ("webpage" | "article" | "paper" | "book" | "video" | "document").',
        'The hover preview shows a rich popover with the source icon/favicon, publisher, author, title, snippet, date, and URL.',
        'Supports keyboard navigation: Enter or Space activates the citation, focus shows the preview.',
        'Animation is controlled by the useReducedMotion hook and scales the button on hover/tap.',
        'Also available: InlineCitationList for rendering a comma-separated group of inline citations.',
      ],
      sourceFile: 'components/clarity/citation-chip.tsx',
    },
  ],

  // ===========================================================================
  // Source Cards
  // ===========================================================================
  'Source Cards': [
    {
      name: 'SourceCitation',
      description:
        'Comprehensive source citation display component with multiple variants (inline, card, list). Supports favicons, confidence scores, expandable details, grouped-by-domain layout, loading skeletons, and staggered animations. Fully accessible with keyboard navigation and ARIA attributes.',
      importPath: '@clarity-chat/react',
      importName: 'SourceCitation',
      usageCode: `import { SourceCitation } from '@clarity-chat/react'
<SourceCitation
  sources={[
    {
      url: 'https://react.dev/docs/hooks-intro',
      title: 'React Hooks Introduction',
      snippet: 'Hooks are a new addition in React 16.8...',
      confidence: 0.95,
      favicon: 'https://react.dev/favicon.ico',
    },
    {
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      title: 'JavaScript | MDN',
      snippet:
        'JavaScript is a lightweight, interpreted...',
      confidence: 0.82,
    },
  ]}
  variant="card"
  size="md"
  showConfidence
  showFavicons
  showDomain
  onSourceClick={(source, index) =>
    console.log('Clicked:', source.title)
  }
/>`,
      props: [
        {
          name: 'sources',
          type: 'Source[]',
          required: true,
          description:
            'Array of source citations to display. Each Source requires url and title, plus optional snippet, favicon, confidence (0-1), domain, date, author, and metadata.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'SourceCitationVariant',
          default: '"card"',
          description:
            'Display variant. "inline" renders compact pill-style chips, "card" renders detailed cards with expandable snippets, and "list" renders a vertical list with hover-expand snippets.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: 'SourceCitationSize',
          default: '"md"',
          description:
            'Size variant controlling font sizes, padding, favicon dimensions, and badge sizes.',
          commonlyUsed: true,
        },
        {
          name: 'maxVisible',
          type: 'number',
          description:
            'Maximum number of sources to show before displaying a "show more" button. When omitted, all sources are shown.',
          commonlyUsed: true,
        },
        {
          name: 'showConfidence',
          type: 'boolean',
          default: 'false',
          description:
            'Show confidence/relevance score badges (High, Medium, Low, Very Low) color-coded by threshold.',
        },
        {
          name: 'showDomain',
          type: 'boolean',
          default: 'true',
          description: 'Show the source domain extracted from the URL.',
        },
        {
          name: 'showDate',
          type: 'boolean',
          default: 'false',
          description: 'Show the publication date if available on the source.',
        },
        {
          name: 'showAuthor',
          type: 'boolean',
          default: 'false',
          description: 'Show the author name if available on the source.',
        },
        {
          name: 'showFavicons',
          type: 'boolean',
          default: 'true',
          description:
            'Show favicons next to source items. Falls back to Google favicon service if not provided.',
          commonlyUsed: true,
        },
        {
          name: 'expandOnHover',
          type: 'boolean',
          default: 'true',
          description:
            'Expand source snippet on hover for inline and list variants.',
        },
        {
          name: 'onSourceClick',
          type: '(source: Source, index: number) => void',
          description: 'Callback when a source item is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'onExpandChange',
          type: '(expanded: boolean) => void',
          description:
            'Callback when the expand/collapse state changes via the "show more" button.',
        },
        {
          name: 'openInNewTab',
          type: 'boolean',
          default: 'true',
          description: 'Whether source links open in a new browser tab.',
        },
        {
          name: 'groupByDomain',
          type: 'boolean',
          default: 'false',
          description:
            'Group sources by their domain, showing a domain header with favicon and source count for each group.',
        },
        {
          name: 'title',
          type: 'string',
          description:
            'Optional header title displayed above the sources list.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'sourceClassName',
          type: 'string',
          description: 'Custom CSS class for individual source items.',
        },
        {
          name: 'disableAnimations',
          type: 'boolean',
          default: 'false',
          description:
            'Disable all entry and stagger animations regardless of reduced motion preference.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Show a skeleton loading state matching the selected variant.',
        },
        {
          name: 'emptyMessage',
          type: 'string',
          default: '"No sources available"',
          description: 'Message displayed when the sources array is empty.',
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible label for the source citations region.',
        },
      ],
      notes: [
        'The Source interface requires url (string) and title (string). Optional fields include snippet, favicon, confidence (0-1), domain, date (string | Date), author, and metadata (Record<string, string | number | boolean>).',
        'The card variant supports expandable snippets via a "Show more"/"Show less" toggle when the snippet exceeds 100 characters.',
        'Metadata key-value pairs are displayed in an expandable section within card items.',
        'Animations use Framer Motion with staggered delays and respect the prefers-reduced-motion media query.',
        'Also exported: useSourceCitation hook for managing source state (add, remove, update, sort by confidence, get unique domains).',
        'Sub-components (Favicon, ConfidenceBadge, InlineSourceItem, CardSourceItem, ListSourceItem, SourceCitationSkeleton) are exported for custom compositions.',
      ],
      sourceFile: 'components/ai/source-citation/SourceCitation.tsx',
    },
    {
      name: 'CitationCard',
      description:
        'Individual citation card for RAG (Retrieval-Augmented Generation) sources. Displays the source name, author, confidence badge, expandable text preview, metadata tags, and a link to the original source. Supports click-to-expand and animated transitions.',
      importPath: '@clarity-chat/react',
      importName: 'CitationCard',
      usageCode: `import { CitationCard } from '@clarity-chat/react'
<CitationCard
  citation={{
    id: '1',
    source: 'React Hooks Documentation',
    chunkText:
      'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class component...',
    confidence: 0.92,
    url: 'https://react.dev/docs/hooks-intro',
    metadata: {
      author: 'React Team',
      date: '2023',
      page: '1',
      section: 'Introduction',
    },
  }}
  showConfidence
  previewLength={150}
  onSourceClick={(url) => window.open(url)}
/>`,
      props: [
        {
          name: 'citation',
          type: 'Citation',
          required: true,
          description:
            'Citation data object with id, source (title), chunkText (cited text), optional confidence (0-1), url, and metadata record.',
          commonlyUsed: true,
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Callback when the card is clicked. When not provided, clicking toggles the expanded state.',
          commonlyUsed: true,
        },
        { name: 'onCopy', type: '() => void', description: 'The onCopy prop.' },
        { name: 'copied', type: 'boolean', description: 'The copied prop.' },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: 'Additional CSS class for the card container.',
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the card starts in the expanded state showing the full chunk text.',
        },
        {
          name: 'previewLength',
          type: 'number',
          default: '150',
          description:
            'Maximum number of characters to show before truncation in the collapsed preview.',
          commonlyUsed: true,
        },
        {
          name: 'showConfidence',
          type: 'boolean',
          default: 'true',
          description:
            'Show the confidence score badge (High/Medium/Low/Very Low) with color-coded variants.',
          commonlyUsed: true,
        },
        {
          name: 'onSourceClick',
          type: '(url: string) => void',
          description:
            'Callback when the source link icon is clicked. When not provided, the URL opens in a new tab.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'The Citation interface (from adapters/types) includes: id (string), source (string), chunkText (string), confidence (number, 0-1), metadata (Record<string, unknown>), and url (string).',
        'Metadata fields "author", "date", "page", and "section" are rendered as badges if present.',
        'The card is fully keyboard accessible with Enter/Space to toggle, proper ARIA roles, and aria-expanded state.',
        'Confidence thresholds: >= 0.9 High (success), >= 0.7 Medium (info), >= 0.5 Low (warning), < 0.5 Very Low (destructive).',
        'Uses Framer Motion for slide-up entrance animation and respects the useReducedMotion hook.',
      ],
      sourceFile: 'components/clarity/inline-citation.tsx',
    },
  ],

  // ===========================================================================
  // Link Preview
  // ===========================================================================
  'Link Preview': [
    {
      name: 'LinkPreview',
      description:
        'Rich link preview component with multiple display variants (card, compact, inline). The card variant shows an image thumbnail, favicon, domain, title, description, and supports rich embeds for YouTube, Vimeo, and Spotify. Includes loading skeletons, error states, and accessible keyboard navigation.',
      importPath: '@clarity-chat/react',
      importName: 'LinkPreview',
      usageCode: `import { LinkPreview } from '@clarity-chat/react'

{
  /* Card variant with metadata */
}
<LinkPreview
  metadata={{
    url: 'https://react.dev',
    title: 'React Documentation',
    description:
      'The library for web and native user interfaces',
    image: 'https://react.dev/og-image.png',
    favicon: 'https://react.dev/favicon.ico',
    siteName: 'React',
  }}
  variant="card"
  showImage
  showFavicon
  showDescription
  onClick={() => window.open('https://react.dev')}
/>

{
  /* Compact variant */
}
<LinkPreview
  metadata={{
    url: 'https://react.dev',
    title: 'React',
    favicon: 'https://react.dev/favicon.ico',
  }}
  variant="compact"
/>

{
  /* Inline variant */
}
<LinkPreview
  metadata={{ url: 'https://react.dev', title: 'React' }}
  variant="inline"
/>`,
      props: [
        {
          name: 'metadata',
          type: 'LinkMetadata',
          required: true,
          description:
            'Link metadata object containing url (required), and optional title, description, image, siteName, favicon, type, embedType, and embedId.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'LinkPreviewVariant',
          default: '"card"',
          description:
            'Visual variant. "card" shows full preview with image and description, "compact" shows a condensed row, and "inline" renders as a styled anchor link.',
          commonlyUsed: true,
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Click handler for the preview. When provided on the card variant, adds cursor-pointer and hover shadow.',
          commonlyUsed: true,
        },
        {
          name: 'onRemove',
          type: '() => void',
          description:
            'Callback for the remove button that appears on hover in the top-right corner of the card.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Show a skeleton loading state matching the selected variant.',
        },
        {
          name: 'showImage',
          type: 'boolean',
          default: 'true',
          description: 'Show the image thumbnail in the card variant.',
          commonlyUsed: true,
        },
        {
          name: 'showFavicon',
          type: 'boolean',
          default: 'true',
          description: 'Show the favicon next to the domain name.',
        },
        {
          name: 'showDomain',
          type: 'boolean',
          default: 'true',
          description: 'Show the domain badge below the description.',
        },
        {
          name: 'showDescription',
          type: 'boolean',
          default: 'true',
          description: 'Show the description text in the card variant.',
        },
        {
          name: 'expandableDescription',
          type: 'boolean',
          default: 'false',
          description:
            'Allow long descriptions to be expanded/collapsed instead of truncated.',
        },
        {
          name: 'fallback',
          type: 'React.ReactNode',
          description:
            'Fallback content rendered when no metadata URL is available.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'aria-label',
          type: 'string',
          description:
            'Accessible label for the link preview. Defaults to "Link to {title or domain}".',
        },
      ],
      notes: [
        'LinkMetadata interface includes: url (string, required), title (string), description (string), image (string), siteName (string), favicon (string), type ("website" | "article" | "video" | "music" | "profile"), embedType (EmbedType), and embedId (string).',
        'Rich embeds are automatically detected for YouTube, Vimeo, and Spotify URLs and render an embedded player.',
        'Invalid or unsafe URLs display a LinkPreviewError component instead of the preview.',
        'The card variant includes a gradient bottom border animation on hover when onClick is provided.',
        'Also available: SmartLinkPreview (auto-fetches metadata from a URL), InlineLink (with hover preview), and useLinkPreview hook for managing metadata fetching with LRU caching.',
        'Image and favicon errors are handled gracefully with fallback displays.',
      ],
      sourceFile: 'components/ui/link-preview/LinkPreview.tsx',
    },
    {
      name: 'LinkPreviewList',
      description:
        'Renders a list of link previews with staggered animations, optional max items with overflow count, and configurable layout direction.',
      importPath: '@clarity-chat/react',
      importName: 'LinkPreviewList',
      usageCode: `import { LinkPreviewList } from '@clarity-chat/react'
<LinkPreviewList
  links={[
    {
      url: 'https://react.dev',
      title: 'React',
      description: '...',
    },
    {
      url: 'https://nextjs.org',
      title: 'Next.js',
      description: '...',
    },
  ]}
  variant="compact"
  layout="vertical"
  maxItems={5}
  onLinkClick={(url) => console.log('Clicked:', url)}
/>`,
      props: [
        {
          name: 'links',
          type: 'LinkPreviewData[]',
          required: true,
          description:
            'Array of link preview data objects, each containing url (required), and optional title, description, image, favicon, siteName, type, author, and publishedAt.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'LinkPreviewVariant',
          default: '"compact"',
          description: 'Visual variant applied to all preview items.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: 'LinkPreviewSize',
          default: '"md"',
          description: 'Size preset applied to all preview items.',
        },
        {
          name: 'maxItems',
          type: 'number',
          description:
            'Maximum number of items to display. Shows a "+N more" indicator for hidden items.',
        },
        {
          name: 'layout',
          type: "'horizontal' | 'vertical' | 'grid'",
          default: '"vertical"',
          description: 'Layout direction for the list of previews.',
          commonlyUsed: true,
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Show loading skeleton for all items.',
        },
        {
          name: 'onLinkClick',
          type: '(url: string) => void',
          description: 'Callback when any link preview is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the list container.',
        },
      ],
      notes: [
        'Items animate in with staggered delays using Framer Motion and respect the prefers-reduced-motion preference.',
        'The list is rendered with proper ARIA list/listitem roles for screen readers.',
        'When maxItems is set and links exceed the limit, a "+N more link(s)" indicator is shown below.',
      ],
      sourceFile: 'components/ai/LinkPreview.tsx',
    },
  ],

  // ===========================================================================
  // Citations List
  // ===========================================================================
  'Citations List': [
    {
      name: 'CitationList',
      description:
        'Full academic-style citation list component with collapsible behavior, copy-to-clipboard, and external link actions. Shows numbered citation cards with type icons, snippets, and hover-reveal action buttons.',
      importPath: '@clarity-chat/react',
      importName: 'CitationList',
      usageCode: `import { CitationList } from '@clarity-chat/react'
<CitationList
  citations={[
    {
      id: '1',
      number: 1,
      title: 'Introducing Hooks',
      author: 'React Team',
      source: 'React Documentation',
      url: 'https://react.dev/docs/hooks-intro',
      type: 'document',
      publishedDate: '2019',
    },
    {
      id: '2',
      number: 2,
      title: 'Hooks API Reference',
      author: 'React Team',
      source: 'React Documentation',
      url: 'https://react.dev/docs/hooks-reference',
      type: 'document',
    },
  ]}
  onCitationClick={(citation) =>
    console.log('Selected:', citation.title)
  }
  collapsible
  maxVisible={3}
/>`,
      props: [
        {
          name: 'citations',
          type: 'Citation[]',
          required: true,
          description:
            'Array of citation objects, each with id, number, title, and optional url, snippet, source, type, publishedDate, author, and favicon.',
          commonlyUsed: true,
        },
        {
          name: 'onCitationClick',
          type: '(citation: Citation) => void',
          description: 'Callback when a citation card is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'true',
          description:
            'Enable collapse/expand behavior to hide citations beyond maxVisible.',
          commonlyUsed: true,
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the list starts in the expanded state showing all citations.',
        },
        {
          name: 'maxVisible',
          type: 'number',
          default: '3',
          description:
            'Maximum number of citations to show before the "show more" button when collapsible is enabled.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the list container.',
        },
      ],
      notes: [
        'The Citation type used here (from inline-citation.tsx) includes: id (string), number (number), title (string), url (string), snippet (string), source (string), type (SourceType), publishedDate (string), author (string), and favicon (string).',
        'SourceType can be: "web", "document", "book", "article", "video", "image", "file", or "unknown".',
        'Each citation card displays a type-appropriate icon, copy URL button, and external link button that appear on hover.',
        'The list header shows a "Sources" title with a count badge.',
        'Returns null when the citations array is empty.',
      ],
      sourceFile: 'components/clarity/inline-citation.tsx',
    },
    {
      name: 'CitationFootnotes',
      description:
        'Academic footnote-style citation list rendered as an ordered list at the bottom of content. Displays each citation with its number, favicon/icon, title as a link, author, publisher, date, snippet, and optional verified badge.',
      importPath: '@clarity-chat/react',
      importName: 'CitationFootnotes',
      usageCode: `import { CitationFootnotes } from '@clarity-chat/react'
<CitationFootnotes
  citations={[
    {
      number: 1,
      source: {
        title: 'React Hooks Documentation',
        url: 'https://react.dev/docs/hooks-intro',
        author: 'React Team',
        publisher: 'Meta',
        date: '2023',
        snippet:
          'Hooks let you use state and other React features...',
      },
      isVerified: true,
    },
    {
      number: 2,
      source: {
        title: 'Understanding useState',
        url: 'https://dev.to/article/usestate',
        author: 'Dev Community',
        date: '2023',
      },
    },
  ]}
  title="References"
/>`,
      props: [
        {
          name: 'citations',
          type: 'Array<{ number: number; source: CitationSource; isVerified?: boolean }>',
          required: true,
          description:
            'Array of citation entries, each with a number, source (CitationSource), and optional isVerified flag.',
          commonlyUsed: true,
        },
        {
          name: 'title',
          type: 'string',
          default: '"References"',
          description:
            'Title for the footnotes section, used as the ARIA region label.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the footnotes container.',
        },
      ],
      notes: [
        'CitationSource includes: title (string, required), url (string), author (string), date (string), publisher (string), snippet (string), favicon (string), and type ("webpage" | "article" | "paper" | "book" | "video" | "document").',
        'Title renders as an anchor link when url is provided, otherwise as plain text.',
        'Verified citations show a checkmark icon next to the title.',
        'The component returns null when the citations array is empty.',
        'Uses Framer Motion slide-up animation for the container and respects reduced motion preferences.',
        'Rendered as an ordered list (ol) with proper semantic HTML for screen readers.',
      ],
      sourceFile: 'components/ai/InlineCitation.tsx',
    },
  ],

  // ===========================================================================
  // Quote Blocks
  // ===========================================================================
  'Quote Blocks': [
    {
      name: 'CitationHighlight',
      description:
        'Wraps text content with a highlighted citation background and appends an inline citation marker. Useful for marking quoted passages within AI-generated content with a direct reference to the source.',
      importPath: '@clarity-chat/react',
      importName: 'CitationHighlight',
      usageCode: `import { CitationHighlight } from '@clarity-chat/react'
<p>
  As the documentation states,{' '}
  <CitationHighlight
    citation={{
      id: '1',
      number: 1,
      title: 'React Hooks Documentation',
      url: 'https://react.dev/docs/hooks-intro',
      source: 'React Documentation',
    }}
  >
    Hooks are a new addition in React 16.8
  </CitationHighlight>{' '}
  which revolutionized how we write React components.
</p>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'The text content to highlight as a quoted passage.',
          commonlyUsed: true,
        },
        {
          name: 'citation',
          type: 'Citation',
          required: true,
          description:
            'Citation data object for the inline citation marker appended after the highlighted text.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the wrapper span.',
        },
      ],
      notes: [
        'Renders children wrapped in a span with accent/10 background and rounded corners.',
        'Appends an InlineCitation component after the highlighted text with the provided citation data.',
        'Designed for use inline within paragraphs -- renders as a span, not a block element.',
      ],
      sourceFile: 'components/clarity/inline-citation.tsx',
    },
    {
      name: 'SuperscriptCitation',
      description:
        'Renders one or more citation numbers as a grouped superscript reference (e.g., [1,2,3]) with an optional popover showing preview details for each cited source. Suitable for academic-style multi-source references.',
      importPath: '@clarity-chat/react',
      importName: 'SuperscriptCitation',
      usageCode: `import { SuperscriptCitation } from '@clarity-chat/react'
<p>
  This technique has been widely documented
  <SuperscriptCitation
    citations={[
      {
        id: '1',
        number: 1,
        title: 'React Documentation',
        url: 'https://react.dev',
        source: 'React',
      },
      {
        id: '2',
        number: 2,
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        source: 'Mozilla',
      },
    ]}
    showPreview
  />
  across multiple sources.
</p>`,
      props: [
        {
          name: 'citations',
          type: 'Citation[]',
          required: true,
          description:
            'Array of citation objects to render as grouped superscript numbers.',
          commonlyUsed: true,
        },
        {
          name: 'showPreview',
          type: 'boolean',
          default: 'true',
          description:
            'Whether clicking the superscript opens a popover with citation previews for each source.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the superscript element.',
        },
      ],
      notes: [
        'Renders as a <sup> element with comma-separated citation numbers wrapped in brackets.',
        'When showPreview is true, clicking opens a Popover with a CitationPreview for each citation.',
        'Returns null when the citations array is empty.',
        'Styled with accent color and cursor pointer to indicate interactivity.',
      ],
      sourceFile: 'components/clarity/inline-citation.tsx',
    },
    {
      name: 'Citation',
      description:
        'A standalone citation display component with both compact (inline badge) and expanded (card) variants. Shows the document name, relevance confidence score, cited text, and optional page number and URL link. Uses color-coded confidence labels.',
      importPath: '@clarity-chat/react',
      importName: 'Citation',
      usageCode: `import { Citation } from '@clarity-chat/react'

{
  /* Expanded card variant */
}
<Citation
  source={{
    documentName: 'React Hooks Guide',
    text: 'Hooks let you use state and other React features without writing a class component. They were introduced in React 16.8.',
    relevanceScore: 0.92,
    page: 14,
    url: 'https://react.dev/docs/hooks-intro',
  }}
  index={1}
/>

{
  /* Compact inline variant */
}
<Citation
  source={{
    documentName: 'React Docs',
    text: 'Hooks introduction...',
    relevanceScore: 0.85,
  }}
  index={1}
  compact
/>`,
      props: [
        {
          name: 'index',
          type: 'number',
          required: true,
          description:
            'Citation number displayed in the badge. Defaults to 1 if not provided.',
          commonlyUsed: true,
        },
        {
          name: 'source',
          type: 'string',
          description:
            'Source data object with documentName (string), text (string), relevanceScore (number 0-1), and optional page (number) and url (string).',
          commonlyUsed: true,
        },
        { name: 'url', type: 'string', description: 'The url prop.' },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root element.',
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'When true, renders a compact inline badge with the citation number and truncated document name. When false, renders a full card with text excerpt, confidence badge, and source link.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'CitationSource includes: documentName (string), text (string), relevanceScore (number), page (number), and url (string).',
        'Confidence thresholds: > 0.8 "High" (green), > 0.5 "Medium" (yellow), <= 0.5 "Low" (red).',
        'The compact variant shows a tooltip with the confidence score on hover.',
        'The expanded variant displays the cited text with line-clamp-3 truncation.',
        'Spreads additional HTML div attributes via the rest props pattern.',
      ],
      sourceFile: 'components/ai/citation.tsx',
    },
  ],
}
