'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Trash2,
  X,
  Image,
  Play,
  Pause,
  Volume2,
  Maximize,
  MoreHorizontal,
  Upload,
  Grid,
  List,
  Search,
} from 'lucide-react'

// ============================================================================
// FILE TREE DEMO
// ============================================================================
function FileTreeDemo() {
  const [expanded, setExpanded] = useState<string[]>(['src', 'components'])

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }

  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts'))
      return <FileCode className="h-4 w-4 text-blue-500" />
    if (name.endsWith('.css'))
      return <FileText className="h-4 w-4 text-purple-500" />
    if (name.endsWith('.json'))
      return <FileText className="h-4 w-4 text-yellow-500" />
    if (name.endsWith('.md'))
      return <FileText className="h-4 w-4 text-gray-500" />
    return <File className="h-4 w-4 text-muted-foreground" />
  }

  const tree = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.tsx', type: 'file' },
            { name: 'Card.tsx', type: 'file' },
            { name: 'Input.tsx', type: 'file' },
          ],
        },
        {
          name: 'hooks',
          type: 'folder',
          children: [
            { name: 'useChat.ts', type: 'file' },
            { name: 'useAuth.ts', type: 'file' },
          ],
        },
        { name: 'App.tsx', type: 'file' },
        { name: 'index.tsx', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]

  const renderTree = (items: any[], depth = 0): React.ReactNode => {
    return items.map((item, i) => (
      <div key={i}>
        <button
          className={cn(
            'w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted text-sm text-left',
            depth > 0 && 'ml-4'
          )}
          onClick={() => item.type === 'folder' && toggleExpand(item.name)}
        >
          {item.type === 'folder' ? (
            <>
              {expanded.includes(item.name) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {expanded.includes(item.name) ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              {getFileIcon(item.name)}
            </>
          )}
          <span>{item.name}</span>
        </button>
        {item.type === 'folder' &&
          expanded.includes(item.name) &&
          item.children &&
          renderTree(item.children, depth + 1)}
      </div>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Tree</CardTitle>
        <CardDescription>Hierarchical file browser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2 max-h-[400px] overflow-y-auto">
          {renderTree(tree)}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// IMAGE GALLERY DEMO
// ============================================================================
function ImageGalleryDemo() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const images = [
    { id: 1, name: 'screenshot-1.png', size: '2.4 MB', date: 'Today' },
    { id: 2, name: 'diagram.svg', size: '156 KB', date: 'Today' },
    { id: 3, name: 'photo.jpg', size: '3.2 MB', date: 'Yesterday' },
    { id: 4, name: 'chart.png', size: '890 KB', date: 'Yesterday' },
    { id: 5, name: 'mockup.png', size: '1.8 MB', date: '2 days ago' },
    { id: 6, name: 'logo.svg', size: '24 KB', date: '2 days ago' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Image Gallery</CardTitle>
            <CardDescription>Browse and manage images</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'grid' ? (
          <div className="grid grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{img.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {img.size} • {img.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ATTACHMENTS DEMO
// ============================================================================
function AttachmentsDemo() {
  const attachments = [
    {
      id: 1,
      name: 'report.pdf',
      type: 'pdf',
      size: '2.4 MB',
      status: 'complete',
    },
    {
      id: 2,
      name: 'data.xlsx',
      type: 'excel',
      size: '1.2 MB',
      status: 'complete',
    },
    {
      id: 3,
      name: 'presentation.pptx',
      type: 'ppt',
      size: '5.6 MB',
      status: 'uploading',
      progress: 65,
    },
    {
      id: 4,
      name: 'notes.txt',
      type: 'text',
      size: '24 KB',
      status: 'complete',
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'excel':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'ppt':
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attachments</CardTitle>
        <CardDescription>
          File attachment cards with upload progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                {getTypeIcon(file.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                {file.status === 'uploading' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {file.progress}%
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {file.status === 'uploading' ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}

          {/* Upload Button */}
          <button className="w-full p-4 border-2 border-dashed rounded-lg text-center hover:border-primary/50 hover:bg-primary/5 transition-colors">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drop files here or click to upload
            </p>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// AUDIO PLAYER DEMO
// ============================================================================
function AudioPlayerDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audio Player</CardTitle>
        <CardDescription>Playback controls for audio files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Compact Player */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">voice-message.mp3</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">1:23</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">3:45</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Waveform Style */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium">Audio Recording</p>
                <p className="text-xs text-muted-foreground">Duration: 3:45</p>
              </div>
            </div>
            {/* Waveform visualization */}
            <div className="flex items-center gap-0.5 h-12">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 rounded-full transition-all',
                    i < progress / 2 ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 20}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FILE VIEWER DEMO
// ============================================================================
function FileViewerDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Viewer</CardTitle>
        <CardDescription>Preview different file types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-muted border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">document.pdf</span>
              <Badge variant="secondary" className="text-xs">
                PDF
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="h-[300px] bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Document Preview</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view full document
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Open Document
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 bg-muted border-t text-xs text-muted-foreground">
            <span>Page 1 of 12</span>
            <span>2.4 MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function MediaFilesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Media & Files"
        description="File tree, image gallery, attachments, and media players"
      />

      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tree">File Tree</TabsTrigger>
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="audio">Audio Player</TabsTrigger>
          <TabsTrigger value="viewer">File Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="tree">
          <ComponentSection
            title="File Tree"
            description="Hierarchical file explorer"
          >
            <FileTreeDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="gallery">
          <ComponentSection
            title="Image Gallery"
            description="Grid and list image views"
          >
            <ImageGalleryDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="attachments">
          <ComponentSection
            title="Attachments"
            description="File cards with progress"
          >
            <AttachmentsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="audio">
          <ComponentSection
            title="Audio Player"
            description="Audio playback controls"
          >
            <AudioPlayerDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="viewer">
          <ComponentSection title="File Viewer" description="Document preview">
            <FileViewerDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
