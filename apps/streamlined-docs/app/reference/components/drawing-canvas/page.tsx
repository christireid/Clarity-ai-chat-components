'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Download,
  Palette,
  Layers,
  RotateCcw,
  Save,
  Image as ImageIcon,
  MousePointer2,
  Accessibility,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'

const features = [
  {
    icon: Pencil,
    label: 'Drawing Tools',
    description: 'Pen, shapes, text, eraser',
  },
  {
    icon: Layers,
    label: 'Layers',
    description: 'Multi-layer drawing support',
  },
  {
    icon: Download,
    label: 'Export',
    description: 'PNG, SVG, PDF export',
  },
  {
    icon: MousePointer2,
    label: 'Touch Support',
    description: 'Stylus and finger drawing',
  },
]

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'props', title: 'Props', level: 2 },
  { id: 'tools-table', title: 'Drawing Tools', level: 2 },
  { id: 'layers', title: 'Layer Management', level: 2 },
  { id: 'export-options', title: 'Export Options', level: 2 },
  { id: 'examples', title: 'Examples', level: 2 },
  { id: 'performance', title: 'Performance', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related', level: 2 },
]

const relatedAPIs = [
  {
    name: 'ImageEditor',
    type: 'component' as const,
    description: 'Advanced image editing component with filters and transformations',
    href: '/reference/components/image-editor',
  },
  {
    name: 'ColorPicker',
    type: 'component' as const,
    description: 'Color selection component for drawing tools',
    href: '/reference/components/color-picker',
  },
  {
    name: 'useCanvas',
    type: 'hook' as const,
    description: 'Hook for managing canvas state and operations',
    href: '/reference/hooks/use-canvas',
  },
]

const footerNavigation = [
  {
    label: 'FileUpload',
    href: '/reference/components/file-upload',
    direction: 'previous' as const,
  },
  {
    label: 'ImageEditor',
    href: '/reference/components/image-editor',
    direction: 'next' as const,
  },
]

const props: PropDefinition[] = [
  {
    name: 'width',
    type: 'number',
    default: '800',
    description: 'Canvas width in pixels.',
  },
  {
    name: 'height',
    type: 'number',
    default: '600',
    description: 'Canvas height in pixels.',
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Initial canvas background color (hex, rgb, or named color).',
  },
  {
    name: 'defaultTool',
    type: 'DrawingTool',
    default: '"pen"',
    description: 'Default drawing tool on mount. Options: pen, eraser, line, rectangle, circle, ellipse, triangle, arrow, text, select.',
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: '"#000000"',
    description: 'Default stroke color for drawing tools.',
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '2',
    description: 'Default stroke width in pixels (1-50).',
  },
  {
    name: 'fillColor',
    type: 'string',
    default: '"transparent"',
    description: 'Default fill color for shapes.',
  },
  {
    name: 'enableLayers',
    type: 'boolean',
    default: 'true',
    description: 'Enable multi-layer support for organizing drawings.',
  },
  {
    name: 'maxLayers',
    type: 'number',
    default: '10',
    description: 'Maximum number of layers allowed.',
  },
  {
    name: 'enableHistory',
    type: 'boolean',
    default: 'true',
    description: 'Enable undo/redo history (stores up to 50 actions).',
  },
  {
    name: 'historySize',
    type: 'number',
    default: '50',
    description: 'Maximum number of history entries to store.',
  },
  {
    name: 'enableGrid',
    type: 'boolean',
    default: 'false',
    description: 'Show alignment grid overlay.',
  },
  {
    name: 'gridSize',
    type: 'number',
    default: '20',
    description: 'Grid cell size in pixels when grid is enabled.',
  },
  {
    name: 'enableSnapping',
    type: 'boolean',
    default: 'false',
    description: 'Snap shapes to grid when enabled.',
  },
  {
    name: 'touchEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable touch and stylus input for mobile devices.',
  },
  {
    name: 'pressureSensitivity',
    type: 'boolean',
    default: 'false',
    description: 'Enable pressure sensitivity for stylus input (requires compatible device).',
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.5',
    description: 'Stroke smoothing factor (0-1). Higher values produce smoother lines.',
  },
  {
    name: 'exportQuality',
    type: 'number',
    default: '0.92',
    description: 'JPEG export quality (0-1). Higher values produce better quality.',
  },
  {
    name: 'exportFormat',
    type: '"png" | "jpeg" | "svg" | "pdf"',
    default: '"png"',
    description: 'Default export format.',
  },
  {
    name: 'exportScale',
    type: 'number',
    default: '1',
    description: 'Export resolution scale factor (1-4). Higher values increase image resolution.',
  },
  {
    name: 'onDraw',
    type: '(event: DrawingEvent) => void',
    description: 'Callback fired on each drawing action with event details.',
  },
  {
    name: 'onChange',
    type: '(canvas: CanvasState) => void',
    description: 'Callback fired when canvas state changes (drawing, layer changes, etc.).',
  },
  {
    name: 'onExport',
    type: '(data: ExportData) => void',
    description: 'Callback fired when export is completed with exported data.',
  },
  {
    name: 'onUndo',
    type: '() => void',
    description: 'Callback fired when undo action is performed.',
  },
  {
    name: 'onRedo',
    type: '() => void',
    description: 'Callback fired when redo action is performed.',
  },
  {
    name: 'onToolChange',
    type: '(tool: DrawingTool) => void',
    description: 'Callback fired when the active drawing tool changes.',
  },
  {
    name: 'onLayerChange',
    type: '(layerId: string) => void',
    description: 'Callback fired when the active layer changes.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the canvas container.',
  },
  {
    name: 'style',
    type: 'React.CSSProperties',
    description: 'Inline styles for the canvas container.',
  },
]

const toolsTableData = [
  {
    tool: 'Pen',
    description: 'Freehand drawing with customizable stroke',
    shortcut: 'P',
    options: 'Color, width, smoothing, opacity',
  },
  {
    tool: 'Eraser',
    description: 'Remove drawn content',
    shortcut: 'E',
    options: 'Size, opacity',
  },
  {
    tool: 'Line',
    description: 'Draw straight lines',
    shortcut: 'L',
    options: 'Color, width, dash pattern',
  },
  {
    tool: 'Rectangle',
    description: 'Draw rectangles and squares',
    shortcut: 'R',
    options: 'Color, fill, stroke width, corner radius',
  },
  {
    tool: 'Circle',
    description: 'Draw circles and ellipses',
    shortcut: 'C',
    options: 'Color, fill, stroke width',
  },
  {
    tool: 'Ellipse',
    description: 'Draw ellipses with custom ratios',
    shortcut: 'Shift+C',
    options: 'Color, fill, stroke width, rotation',
  },
  {
    tool: 'Triangle',
    description: 'Draw triangles',
    shortcut: 'T',
    options: 'Color, fill, stroke width, type',
  },
  {
    tool: 'Arrow',
    description: 'Draw directional arrows',
    shortcut: 'A',
    options: 'Color, width, head size, style',
  },
  {
    tool: 'Text',
    description: 'Add text annotations',
    shortcut: 'Shift+T',
    options: 'Font, size, color, alignment, style',
  },
  {
    tool: 'Select',
    description: 'Select and transform drawn objects',
    shortcut: 'V',
    options: 'Move, resize, rotate, delete',
  },
  {
    tool: 'Pan',
    description: 'Move the canvas view',
    shortcut: 'Space',
    options: 'Drag to pan, wheel to zoom',
  },
  {
    tool: 'Eyedropper',
    description: 'Pick colors from the canvas',
    shortcut: 'I',
    options: 'Click to sample color',
  },
]

// Simple demo component
function SimpleDrawingDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#000000')
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPos({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? 10 : 2
    ctx.lineCap = 'round'
    ctx.stroke()

    setLastPos({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPos(null)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border/50 rounded-lg">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-brand-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
          aria-label="Pen tool"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-brand-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
          aria-label="Eraser tool"
        >
          <Eraser className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border/50 mx-2" />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          aria-label="Choose color"
        />
        <div className="w-px h-6 bg-border/50 mx-2" />
        <button
          onClick={clearCanvas}
          className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded"
        >
          Clear
        </button>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Try drawing on the canvas! This is a simplified demo. The full DrawingCanvas component includes layers, shapes, export, and more.
      </p>
    </div>
  )
}

export default function DrawingCanvasPage() {
  return (
    <DocumentationPage
      title="DrawingCanvas"
      description="HTML5 canvas-based drawing tool with pen, shapes, colors, and image export for visual communication"
      icon={Pencil}
      badges={[{ label: 'Beta', variant: 'beta' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-muted-foreground leading-relaxed mb-4">
          The <code className="text-sm">DrawingCanvas</code> component provides a powerful, HTML5
          canvas-based drawing interface for creating and editing visual content within your chat
          application. It supports multiple drawing tools, layers, and export formats.
        </p>

        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Use Cases</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Annotating screenshots and images</li>
            <li>• Creating diagrams and flowcharts</li>
            <li>• Whiteboard collaboration</li>
            <li>• Sketching ideas and concepts</li>
            <li>• Visual bug reports</li>
            <li>• Teaching and presentations</li>
            <li>• Design mockups and wireframes</li>
          </ul>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Responsive Design</h4>
          <p className="text-sm text-muted-foreground">
            DrawingCanvas automatically adapts to different screen sizes with touch support for
            mobile devices, stylus pressure sensitivity, and responsive toolbar layouts. The canvas
            scales appropriately while maintaining drawing quality.
          </p>
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
          code={`import { DrawingCanvas } from '@clarity-chat/react'
import type { CanvasState, ExportData } from '@clarity-chat/react'

function DrawingExample() {
  const handleExport = (data: ExportData) => {
    // Download or upload the exported image
    const link = document.createElement('a')
    link.href = data.dataUrl
    link.download = \`drawing-\${Date.now()}.\${data.format}\`
    link.click()
  }

  const handleChange = (canvas: CanvasState) => {
    console.log('Canvas changed:', canvas)
  }

  return (
    <DrawingCanvas
      width={800}
      height={600}
      defaultTool="pen"
      strokeColor="#000000"
      strokeWidth={2}
      enableLayers
      enableHistory
      onExport={handleExport}
      onChange={handleChange}
    />
  )
}`}
        />
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-4">
          Try the basic drawing demo below. The full component includes additional tools, layers,
          and export options.
        </p>
        <SimpleDrawingDemo />
      </Section>

      {/* Props */}
      <Section id="props" title="Props">
        <p className="text-muted-foreground mb-4">
          The DrawingCanvas component accepts 20+ props for complete customization:
        </p>
        <PropsTable props={props} />
      </Section>

      {/* Drawing Tools Table */}
      <Section id="tools-table" title="Drawing Tools">
        <p className="text-muted-foreground mb-4">
          DrawingCanvas includes 12 built-in drawing tools with keyboard shortcuts:
        </p>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Tool</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Shortcut</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Options</th>
              </tr>
            </thead>
            <tbody>
              {toolsTableData.map((row, index) => (
                <tr
                  key={row.tool}
                  className={`border-b border-border/30 last:border-b-0 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                    {row.tool}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.description}</td>
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">
                      {row.shortcut}
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.options}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Layer Management */}
      <Section id="layers" title="Layer Management">
        <p className="text-muted-foreground mb-4">
          Organize your drawings with multiple layers, similar to professional design tools:
        </p>

        <CodeBlock
          language="tsx"
          code={`import { DrawingCanvas } from '@clarity-chat/react'
import { useState } from 'react'

function LayeredDrawing() {
  const [activeLayer, setActiveLayer] = useState<string>('layer-1')

  return (
    <DrawingCanvas
      enableLayers
      maxLayers={10}
      onLayerChange={(layerId) => {
        setActiveLayer(layerId)
        console.log('Active layer:', layerId)
      }}
      // Control layer visibility, order, and opacity
    />
  )
}`}
        />

        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm">Layer Features:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Create, delete, and rename layers</li>
            <li>• Reorder layers with drag and drop</li>
            <li>• Toggle layer visibility</li>
            <li>• Adjust layer opacity (0-100%)</li>
            <li>• Lock layers to prevent editing</li>
            <li>• Merge layers</li>
            <li>• Duplicate layers</li>
          </ul>
        </div>
      </Section>

      {/* Export Options */}
      <Section id="export-options" title="Export Options">
        <p className="text-muted-foreground mb-4">
          Export your drawings in multiple formats with customizable quality and resolution:
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">PNG Export (Default)</h4>
            <CodeBlock
              language="tsx"
              code={`<DrawingCanvas
  exportFormat="png"
  exportScale={2} // 2x resolution
  onExport={(data) => {
    // data.dataUrl contains the PNG data URL
    // data.blob contains the file blob
    // data.width and data.height contain dimensions
    downloadImage(data.dataUrl, 'drawing.png')
  }}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">JPEG Export</h4>
            <CodeBlock
              language="tsx"
              code={`<DrawingCanvas
  exportFormat="jpeg"
  exportQuality={0.95} // 95% quality
  backgroundColor="#ffffff" // Background for transparency
  onExport={(data) => {
    downloadImage(data.dataUrl, 'drawing.jpg')
  }}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">SVG Export (Vector)</h4>
            <CodeBlock
              language="tsx"
              code={`<DrawingCanvas
  exportFormat="svg"
  onExport={(data) => {
    // SVG export preserves vector quality
    // data.svg contains the SVG XML string
    downloadSVG(data.svg, 'drawing.svg')
  }}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">PDF Export</h4>
            <CodeBlock
              language="tsx"
              code={`<DrawingCanvas
  exportFormat="pdf"
  onExport={(data) => {
    // PDF export suitable for printing
    downloadPDF(data.blob, 'drawing.pdf')
  }}
/>`}
            />
          </div>
        </div>
      </Section>

      {/* Examples */}
      <Section id="examples" title="Examples">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Basic Drawing with Colors</h4>
            <CodeBlock
              language="tsx"
              code={`import { DrawingCanvas } from '@clarity-chat/react'
import { useState } from 'react'

function ColorfulDrawing() {
  const [strokeColor, setStrokeColor] = useState('#000000')

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map((color) => (
          <button
            key={color}
            onClick={() => setStrokeColor(color)}
            className="w-8 h-8 rounded border-2"
            style={{ backgroundColor: color }}
            aria-label={\`Select \${color}\`}
          />
        ))}
      </div>

      <DrawingCanvas
        width={800}
        height={600}
        strokeColor={strokeColor}
        strokeWidth={3}
        defaultTool="pen"
      />
    </div>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">With Layers and Export</h4>
            <CodeBlock
              language="tsx"
              code={`import { DrawingCanvas } from '@clarity-chat/react'
import type { ExportData } from '@clarity-chat/react'

function AdvancedDrawing() {
  const handleExport = async (data: ExportData) => {
    // Upload to server
    const formData = new FormData()
    formData.append('image', data.blob, \`drawing.\${data.format}\`)

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  }

  return (
    <DrawingCanvas
      width={1024}
      height={768}
      enableLayers
      maxLayers={5}
      enableHistory
      historySize={100}
      defaultTool="pen"
      strokeWidth={2}
      exportFormat="png"
      exportScale={2}
      onExport={handleExport}
    />
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Touch-Enabled for Mobile</h4>
            <CodeBlock
              language="tsx"
              code={`import { DrawingCanvas } from '@clarity-chat/react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function ResponsiveCanvas() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <DrawingCanvas
      width={isMobile ? 375 : 800}
      height={isMobile ? 500 : 600}
      touchEnabled
      pressureSensitivity={!isMobile} // Only on desktop with stylus
      smoothing={0.7}
      strokeWidth={isMobile ? 3 : 2} // Thicker strokes on mobile
      className={isMobile ? 'w-full' : ''}
    />
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">With Grid and Snapping</h4>
            <CodeBlock
              language="tsx"
              code={`import { DrawingCanvas } from '@clarity-chat/react'

function PrecisionDrawing() {
  return (
    <DrawingCanvas
      width={800}
      height={600}
      enableGrid
      gridSize={25}
      enableSnapping
      defaultTool="rectangle"
      strokeColor="#333333"
      strokeWidth={1}
      fillColor="transparent"
    />
  )
}`}
            />
          </div>
        </div>
      </Section>

      {/* Performance */}
      <Section id="performance" title="Performance">
        <p className="text-muted-foreground mb-4">
          DrawingCanvas is optimized for smooth performance even with complex drawings:
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              Canvas Optimization Techniques
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Layer Caching:</strong> Inactive layers are cached as images</li>
              <li>• <strong>Debounced Updates:</strong> State updates are batched</li>
              <li>• <strong>RequestAnimationFrame:</strong> Smooth drawing at 60fps</li>
              <li>• <strong>Web Workers:</strong> Export operations run off main thread</li>
              <li>• <strong>Memory Management:</strong> Automatic cleanup of unused resources</li>
              <li>• <strong>Stroke Simplification:</strong> Reduces points for complex paths</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Performance Tips</h4>
            <CodeBlock
              language="tsx"
              code={`// 1. Limit history size for memory efficiency
<DrawingCanvas historySize={50} /> // Default is 50

// 2. Reduce smoothing for faster rendering
<DrawingCanvas smoothing={0.3} /> // 0 = no smoothing, 1 = max

// 3. Limit layers for better performance
<DrawingCanvas maxLayers={5} /> // Default is 10

// 4. Use appropriate export scale
<DrawingCanvas exportScale={1} /> // 1x for web, 2x for print

// 5. Disable features you don't need
<DrawingCanvas
  enableGrid={false}
  enableSnapping={false}
  pressureSensitivity={false}
/>`}
            />
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              Large Canvas Warning
            </h4>
            <p className="text-sm text-muted-foreground">
              Canvas dimensions above 4096×4096 pixels may cause performance issues or fail on some
              devices due to browser limitations. For very large drawings, consider tiling or
              chunking the canvas.
            </p>
          </div>
        </div>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="text-left py-2 px-4 font-semibold">Shortcut</th>
                    <th className="text-left py-2 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/Cmd + Z</kbd>
                    </td>
                    <td className="py-2 px-4">Undo last action</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/Cmd + Shift + Z</kbd>
                    </td>
                    <td className="py-2 px-4">Redo last undone action</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/Cmd + S</kbd>
                    </td>
                    <td className="py-2 px-4">Export drawing</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete/Backspace</kbd>
                    </td>
                    <td className="py-2 px-4">Delete selected object</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">P, E, L, R, C...</kbd>
                    </td>
                    <td className="py-2 px-4">Switch tools (see tools table above)</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/Cmd + Wheel</kbd>
                    </td>
                    <td className="py-2 px-4">Zoom in/out</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Space + Drag</kbd>
                    </td>
                    <td className="py-2 px-4">Pan canvas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Alt Text for Drawings</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Always provide descriptive alt text when sharing drawings with screen reader users:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { DrawingCanvas } from '@clarity-chat/react'

function AccessibleDrawing() {
  const [altText, setAltText] = useState('')

  const handleExport = (data: ExportData) => {
    // Include alt text in export metadata
    const exportData = {
      ...data,
      altText,
      description: altText,
    }

    // Send to server or download with metadata
    uploadDrawing(exportData)
  }

  return (
    <div>
      <label htmlFor="alt-text" className="block mb-2 font-semibold">
        Drawing Description (for accessibility)
      </label>
      <textarea
        id="alt-text"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        placeholder="Describe what you're drawing..."
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <DrawingCanvas
        onExport={handleExport}
        // Canvas automatically has role="img" and uses alt text
      />
    </div>
  )
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">WCAG 2.1 AA Compliance</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ All toolbar buttons have accessible labels</li>
              <li>✓ Focus indicators on all interactive elements</li>
              <li>✓ Color contrast meets 4.5:1 minimum ratio</li>
              <li>✓ Keyboard navigation for all features</li>
              <li>✓ Screen reader announcements for tool changes</li>
              <li>✓ Respects prefers-reduced-motion</li>
              <li>✓ Touch targets are at least 44×44 pixels</li>
            </ul>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
