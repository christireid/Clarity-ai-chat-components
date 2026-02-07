import type { ComponentDoc } from '@/components/doc-panel'

export const mediaFilesDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // File Tree
  // ===========================================================================
  'File Tree': {
    name: 'DocumentIntegration',
    description:
      'A document browser and integration component that connects to external platforms (Google Docs, Notion, Dropbox, etc.) for browsing, selecting, and extracting document content. Supports multi-select, platform switching, export, and content extraction for RAG workflows.',
    importPath: '@clarity-chat/react',
    importName: 'DocumentIntegration',
    usageCode: `import { DocumentIntegration } from '@clarity-chat/react'
<DocumentIntegration
  platforms={['google-docs', 'notion', 'local']}
  initialDocuments={documents}
  onDocumentSelect={(doc) => console.log('Selected:', doc)}
  onContentExtract={(content) =>
    console.log('Extracted:', content)
  }
  fetchDocument={async (id, platform) =>
    fetchDoc(id, platform)
  }
  listDocuments={async (platform) => listDocs(platform)}
  showPlatformSelector
  multiSelect={false}
  maxDocuments={50}
/>`,
    props: [
      {
        name: 'platforms',
        type: 'DocumentPlatform[]',
        default: "['google-docs', 'notion', 'local']",
        description:
          'Array of enabled document platforms. Supported values: "google-docs", "google-sheets", "google-slides", "notion", "confluence", "dropbox", "onedrive", "sharepoint", "local".',
        commonlyUsed: true,
      },
      {
        name: 'initialDocuments',
        type: 'DocumentMetadata[]',
        default: '[]',
        description:
          'Pre-loaded array of document metadata to display without fetching from a platform.',
        commonlyUsed: true,
      },
      {
        name: 'onDocumentSelect',
        type: '(document: DocumentContent) => void',
        description:
          'Callback invoked when a document is selected. Receives the full document content including text, html, markdown, and metadata.',
        commonlyUsed: true,
      },
      {
        name: 'onContentExtract',
        type: '(content: DocumentContent) => void',
        description:
          'Callback invoked after document content has been extracted. Useful for feeding content into RAG pipelines or chunking workflows.',
        commonlyUsed: true,
      },
      {
        name: 'onExport',
        type: '( documentId: string options: DocumentExportOptions ) => Promise<Blob>',
        description:
          'Callback to export a document in a given format. When provided, an export button appears on each document row. The returned Blob triggers a browser download.',
      },
      {
        name: 'fetchDocument',
        type: '( id: string platform: DocumentPlatform ) => Promise<DocumentContent>',
        description:
          'Custom async function to fetch a single document by ID and platform. Called when a user clicks a document in the list.',
        commonlyUsed: true,
      },
      {
        name: 'listDocuments',
        type: '(platform: DocumentPlatform) => Promise<DocumentMetadata[]>',
        description:
          'Custom async function to list documents for a given platform. Automatically called when the selected platform changes.',
        commonlyUsed: true,
      },
      {
        name: 'showPlatformSelector',
        type: 'boolean',
        default: 'true',
        description:
          'Whether to show the platform tab selector. Hidden when only one platform is configured.',
        commonlyUsed: true,
      },
      {
        name: 'multiSelect',
        type: 'boolean',
        default: 'false',
        description:
          'Enable multi-select mode with checkboxes. Shows a bulk action bar when documents are selected.',
      },
      {
        name: 'maxDocuments',
        type: 'number',
        default: '50',
        description:
          'Maximum number of documents to display in the list. Fetched results are sliced to this limit.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLDivElement>',
        description: 'Ref forwarded to the root div element.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container div.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> so standard div attributes like style, id, and aria-* are also accepted.',
      'Use the companion useDocumentIntegration hook for headless document operations (list, fetch, extract, export) without the built-in UI.',
      'The component automatically falls back to the "local" platform if an empty or invalid platforms array is provided.',
      'Respects reduced motion preferences and uses framer-motion for list item animations.',
    ],
    sourceFile: 'components/media/DocumentIntegration.tsx',
  },

  // ===========================================================================
  // Image Gallery
  // ===========================================================================
  'Image Gallery': {
    name: 'MultiModalPreview',
    description:
      'A card-based preview component for displaying multimodal attachments such as images, audio, video, files, and links. Each attachment shows a thumbnail or type icon, status badge, size, duration, and metadata. Provides action buttons for opening, retrying, and removing items.',
    importPath: '@clarity-chat/react',
    importName: 'MultiModalPreview',
    usageCode: `import { MultiModalPreview } from '@clarity-chat/react'
<MultiModalPreview
  attachments={[
    {
      id: '1',
      type: 'image',
      title: 'screenshot.png',
      thumbnailUrl: '/images/screenshot.png',
      status: 'ready',
      sizeLabel: '2.4 MB',
    },
    {
      id: '2',
      type: 'image',
      title: 'diagram.svg',
      status: 'ready',
      sizeLabel: '156 KB',
    },
  ]}
  title="Image Gallery"
  subtitle="Browse and manage images"
  onOpen={(attachment) => console.log('Open:', attachment)}
  onRemove={(attachment) =>
    console.log('Remove:', attachment)
  }
/>`,
    props: [
      {
        name: 'attachments',
        type: 'AttachmentPreview[]',
        required: true,
        description:
          'Array of attachment objects to display. Each item requires id, type ("image" | "audio" | "video" | "file" | "link"), and title. Optional fields: description, thumbnailUrl, status, durationMs, sizeLabel, metadata.',
        commonlyUsed: true,
      },
      {
        name: 'onOpen',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback invoked when the "Open" button is clicked on an attachment. When provided, an Open button renders for each item.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback invoked when "Retry processing" is clicked. Only shown for attachments with status "failed".',
      },
      {
        name: 'onRemove',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback invoked when the "Remove" button is clicked. When provided, a destructive Remove button renders for each item.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the outer Card element.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Multimodal context"',
        description: 'The heading text displayed in the card header.',
        commonlyUsed: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        default:
          '"Surface the supporting images, audio, and documents that shaped this response."',
        description:
          'Descriptive text displayed below the title in the card header.',
      },
    ],
    notes: [
      'The AttachmentPreview type field determines the icon displayed: image (sky), audio (emerald), video (purple), file (amber), link (primary).',
      'Thumbnails are rendered with ProgressiveImage for lazy loading and smooth reveal.',
      'Status badges use semantic variants: "processing" (warning), "ready" (success), "failed" (destructive).',
      'When the attachments array is empty, a dashed-border empty state placeholder is shown.',
    ],
    sourceFile: 'components/media/multi-modal-preview.tsx',
  },

  // ===========================================================================
  // Attachments
  // ===========================================================================
  Attachments: [
    {
      name: 'MultiModalPreview',
      description:
        'Displays file attachment cards with type icons, status badges, sizes, and action buttons. Each attachment shows its processing state and allows opening, retrying failed items, and removing entries.',
      importPath: '@clarity-chat/react',
      importName: 'MultiModalPreview',
      usageCode: `import { MultiModalPreview } from '@clarity-chat/react'
<MultiModalPreview
  attachments={[
    {
      id: '1',
      type: 'file',
      title: 'report.pdf',
      status: 'ready',
      sizeLabel: '2.4 MB',
      metadata: [{ label: 'Type', value: 'PDF' }],
    },
    {
      id: '2',
      type: 'file',
      title: 'presentation.pptx',
      status: 'processing',
      sizeLabel: '5.6 MB',
    },
  ]}
  title="Attachments"
  subtitle="File attachment cards with upload progress"
  onOpen={(file) => downloadFile(file)}
  onRetry={(file) => retryUpload(file)}
  onRemove={(file) => removeFile(file)}
/>`,
      props: [
        {
          name: 'attachments',
          type: 'AttachmentPreview[]',
          required: true,
          description:
            'Array of attachment objects. Each requires id, type ("image" | "audio" | "video" | "file" | "link"), and title. Optional: description, thumbnailUrl, status ("processing" | "ready" | "failed"), durationMs, sizeLabel, metadata.',
          commonlyUsed: true,
        },
        {
          name: 'onOpen',
          type: '(attachment: AttachmentPreview) => void',
          description:
            'Callback when the "Open" button is clicked on an attachment.',
          commonlyUsed: true,
        },
        {
          name: 'onRetry',
          type: '(attachment: AttachmentPreview) => void',
          description:
            'Callback for retrying failed attachments. The retry button only appears for items with status "failed".',
          commonlyUsed: true,
        },
        {
          name: 'onRemove',
          type: '(attachment: AttachmentPreview) => void',
          description:
            'Callback when the "Remove" button is clicked on an attachment.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names applied to the outer Card element.',
        },
        {
          name: 'title',
          type: 'string',
          default: '"Multimodal context"',
          description: 'Heading text displayed in the card header.',
          commonlyUsed: true,
        },
        {
          name: 'subtitle',
          type: 'string',
          default:
            '"Surface the supporting images, audio, and documents that shaped this response."',
          description: 'Descriptive text below the title.',
        },
      ],
      notes: [
        'Use status "processing" to indicate an in-progress upload and "failed" to show the retry button.',
        'The metadata array on each attachment renders as label-value pairs below the description.',
      ],
      sourceFile: 'components/media/multi-modal-preview.tsx',
    },
    {
      name: 'ExportDialog',
      description:
        'A dialog component for exporting chat conversations, projects, or knowledge bases in multiple formats (PDF, Word, Markdown, JSON, HTML). Includes format selection, export options toggles, an animated progress bar, and optional date range filtering for chats.',
      importPath: '@clarity-chat/react',
      importName: 'ExportDialog',
      usageCode: `import { ExportDialog } from '@clarity-chat/react'

const [open, setOpen] = useState(false)

<ExportDialog
  open={open}
  onOpenChange={setOpen}
  onExport={async (options) => {
    await exportResource(options)
  }}
  resourceType="chat"
  resourceName="Project Discussion"
/>`,
      props: [
        {
          name: 'open',
          type: 'boolean',
          required: true,
          description: 'Controls whether the dialog is open.',
          commonlyUsed: true,
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          required: true,
          description:
            'Callback when the dialog open state changes. Use this to sync controlled dialog state.',
          commonlyUsed: true,
        },
        {
          name: 'onExport',
          type: '(options: ExportOptions) => Promise<void>',
          required: true,
          description:
            'Async callback invoked when the user clicks the export button. Receives the selected format and option flags (includeMetadata, includeImages, includeAttachments).',
          commonlyUsed: true,
        },
        {
          name: 'resourceType',
          type: "'chat' | 'project' | 'knowledge-base'",
          required: true,
          description:
            'The type of resource being exported. Affects the dialog title and conditionally shows the date range picker for "chat" type.',
          commonlyUsed: true,
        },
        {
          name: 'resourceName',
          type: 'string',
          required: true,
          description:
            'Display name of the resource being exported. Shown in the dialog description and file preview.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names applied to the DialogContent element.',
        },
      ],
      notes: [
        'Supported export formats: PDF, Word (DOCX), Markdown, JSON, HTML.',
        'The dialog auto-closes with a brief delay after a successful export to show the 100% completion state.',
        'Date range inputs are only shown when resourceType is "chat".',
        'Respects prefers-reduced-motion and falls back to non-animated elements when enabled.',
      ],
      sourceFile: 'components/clarity/confirmation-dialog.tsx',
    },
  ],

  // ===========================================================================
  // Audio Player
  // ===========================================================================
  'Audio Player': {
    name: 'MultiModalPreview',
    description:
      'Displays audio attachment previews with playback duration, status indicators, and action buttons. Each audio item shows an emerald-colored microphone icon, formatted duration from durationMs, and size information.',
    importPath: '@clarity-chat/react',
    importName: 'MultiModalPreview',
    usageCode: `import { MultiModalPreview } from '@clarity-chat/react'
<MultiModalPreview
  attachments={[
    {
      id: '1',
      type: 'audio',
      title: 'voice-message.mp3',
      status: 'ready',
      durationMs: 225000, // 3:45
      sizeLabel: '1.2 MB',
      metadata: [
        { label: 'Format', value: 'MP3' },
        { label: 'Bitrate', value: '128 kbps' },
      ],
    },
    {
      id: '2',
      type: 'audio',
      title: 'recording.wav',
      status: 'processing',
      durationMs: 180000,
      sizeLabel: '4.8 MB',
    },
  ]}
  title="Audio Files"
  subtitle="Playback controls for audio files"
  onOpen={(audio) => playAudio(audio)}
  onRemove={(audio) => removeAudio(audio)}
/>`,
    props: [
      {
        name: 'attachments',
        type: 'AttachmentPreview[]',
        required: true,
        description:
          'Array of attachment objects. For audio items, set type to "audio". Use durationMs (milliseconds) for playback duration display, and sizeLabel for file size.',
        commonlyUsed: true,
      },
      {
        name: 'onOpen',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback when the "Open" button is clicked. For audio items, typically used to trigger playback in a dedicated player.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback for retrying failed audio processing. Only shown when status is "failed".',
      },
      {
        name: 'onRemove',
        type: '(attachment: AttachmentPreview) => void',
        description:
          'Callback when the "Remove" button is clicked on an audio attachment.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the outer Card element.',
      },
      {
        name: 'title',
        type: 'string',
        default: '"Multimodal context"',
        description: 'The heading text displayed in the card header.',
        commonlyUsed: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        default:
          '"Surface the supporting images, audio, and documents that shaped this response."',
        description: 'Descriptive text displayed below the title.',
      },
    ],
    notes: [
      'The durationMs field is automatically formatted to "M:SS" display (e.g., 225000ms becomes "3:45").',
      'Audio attachments display an emerald-colored microphone icon to distinguish them from other media types.',
      'Combine with a custom audio player implementation in the onOpen callback for full playback functionality.',
    ],
    sourceFile: 'components/media/multi-modal-preview.tsx',
  },

  // ===========================================================================
  // File Viewer
  // ===========================================================================
  'File Viewer': {
    name: 'DocumentViewer',
    description:
      'A structured document preview component that displays a document header with name, type, source link, and tags, followed by an optional summary section, scrollable content area with text search highlighting, and a metadata grid. Shows a placeholder empty state when no document is provided.',
    importPath: '@clarity-chat/react',
    importName: 'DocumentViewer',
    usageCode: `import { DocumentViewer } from '@clarity-chat/react'
<DocumentViewer
  document={{
    id: 'doc-1',
    name: 'Technical Specification',
    type: 'PDF',
    content:
      'This document describes the system architecture...',
    summary:
      'A comprehensive overview of the platform architecture and design decisions.',
    sourceUrl: 'https://docs.example.com/spec',
    tags: ['Architecture', 'Engineering'],
    metadata: {
      author: 'Jane Smith',
      pageCount: 12,
      fileSize: '2.4 MB',
      lastModified: '2026-01-15',
    },
  }}
  highlightQuery="architecture"
/>`,
    props: [
      {
        name: 'document',
        type: '{ id: string name?: string type?: string content?: string summary?: string metadata?: Record<string, any> sourceUrl?: string tags?: string[] }',
        required: true,
        description:
          'The document object to display. Only id is strictly required; all other fields are optional and conditionally render their respective sections. The content field is displayed in the main body area, summary in a separate section above, and metadata as a key-value grid.',
        commonlyUsed: true,
      },
      {
        name: 'highlightQuery',
        type: 'string',
        description:
          'Search query string to highlight within the document content. Matches are wrapped in yellow <mark> elements. Queries shorter than 2 characters are ignored.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the root container. Applied to both the document view and the empty state.',
        commonlyUsed: true,
      },
      {
        name: 'emptyState',
        type: 'React.ReactNode',
        default: '"No document selected."',
        description:
          'Custom content to render when the document prop is null or undefined. Replaces the default "No document selected." text.',
      },
    ],
    notes: [
      'The document.sourceUrl renders as an external link ("View Source") that opens in a new tab with noopener noreferrer.',
      'Tags are displayed as pill badges in the document header, styled with primary color.',
      'Metadata keys are automatically formatted from camelCase to Title Case (e.g., "pageCount" becomes "Page Count").',
      'Non-string metadata values are serialized with JSON.stringify for display.',
      'The content area uses scrollbar-hide for a clean scrollable view on long documents.',
    ],
    sourceFile: 'components/media/DocumentViewer.tsx',
  },
}
