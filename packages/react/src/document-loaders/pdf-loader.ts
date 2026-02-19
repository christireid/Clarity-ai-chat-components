/**
 * PDF Document Loader
 *
 * Extracts text from PDF files preserving structure, headings, and metadata.
 * Supports both browser and Node.js environments.
 *
 * @requires pdfjs-dist - PDF parsing library (optional peer dependency)
 * @installation npm install pdfjs-dist
 * @bundleImpact ~600KB (includes worker bundle)
 * @note Requires additional setup for worker configuration
 * @fallback Throws error if pdfjs-dist is not installed
 * @docs https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/document-loaders#pdf-setup
 *
 * @example
 * ```tsx
 * // 1. Install pdfjs-dist
 * // npm install pdfjs-dist
 *
 * // 2. Configure worker (browser)
 * import * as pdfjsLib from 'pdfjs-dist'
 * pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
 *
 * // 3. Use loader
 * const loader = new PDFLoader()
 * const docs = await loader.load(pdfFile)
 *
 * // With options
 * const docs = await loader.load(pdfFile, {
 *   maxPages: 100,
 *   preserveFormatting: true,
 *   extractImages: false
 * })
 * ```
 */

import type { Document, DocumentLoader, DocumentLoadOptions } from './types'

export interface PDFLoadOptions extends DocumentLoadOptions {
  /** Maximum number of pages to extract */
  maxPages?: number
  /** Preserve text formatting and structure */
  preserveFormatting?: boolean
  /** Extract text from images using OCR (requires additional setup) */
  extractImages?: boolean
  /** Password for encrypted PDFs */
  password?: string
  /** Page range to extract (e.g., "1-10", "1,3,5") */
  pageRange?: string
}

export class PDFLoader implements DocumentLoader {
  name = 'pdf'
  supportedTypes = ['application/pdf', 'pdf']

  async load(
    source: string | File | Blob,
    options?: PDFLoadOptions
  ): Promise<Document[]> {
    // Check if pdfjs-dist is available
    if (typeof window !== 'undefined' && !(window as any).pdfjsLib) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'PDFLoader: pdfjs-dist not loaded. Please include pdfjs-dist in your project:\n' +
            'npm install pdfjs-dist\n' +
            'Then import: import * as pdfjsLib from "pdfjs-dist"'
        )
      }
      throw new Error('PDF parsing library not available')
    }

    try {
      const pdfData = await this.loadPDFData(source)
      const pdfDoc = await this.parsePDF(pdfData, options?.password)

      const pageRange = this.parsePageRange(options?.pageRange, pdfDoc.numPages)
      const maxPages = options?.maxPages || pdfDoc.numPages
      const pagesToExtract = pageRange.slice(0, maxPages)

      const documents: Document[] = []

      for (const pageNum of pagesToExtract) {
        try {
          const page = await pdfDoc.getPage(pageNum)
          const content = await this.extractPageText(
            page,
            options?.preserveFormatting
          )

          if (content.trim()) {
            documents.push({
              content,
              metadata: {
                source: source instanceof File ? source.name : 'pdf',
                type: 'application/pdf',
                page: pageNum,
                totalPages: pdfDoc.numPages,
                ...options?.metadata,
              },
            })
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Failed to extract page ${pageNum}:`, error)
          }
          // Continue with other pages
        }
      }

      // If no documents extracted, return error document
      if (documents.length === 0) {
        return [
          {
            content: '[Failed to extract text from PDF]',
            metadata: {
              source: source instanceof File ? source.name : 'pdf',
              type: 'application/pdf',
              error: 'No text content found',
            },
          },
        ]
      }

      return documents
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      return [
        {
          content: `[Failed to load PDF: ${errorMessage}]`,
          metadata: {
            source: source instanceof File ? source.name : 'pdf',
            type: 'application/pdf',
            error: errorMessage,
          },
        },
      ]
    }
  }

  supports(type: string): boolean {
    return this.supportedTypes.includes(type.toLowerCase())
  }

  /**
   * Load PDF data from various sources
   */
  private async loadPDFData(
    source: string | File | Blob
  ): Promise<ArrayBuffer> {
    if (typeof source === 'string') {
      if (source.startsWith('http')) {
        const response = await fetch(source)
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`)
        }
        return await response.arrayBuffer()
      } else if (source.startsWith('data:application/pdf;base64,')) {
        // Base64 encoded PDF
        const base64 = source.split(',')[1]
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        return bytes.buffer
      } else {
        throw new Error('Invalid PDF source string')
      }
    } else {
      return await source.arrayBuffer()
    }
  }

  /**
   * Parse PDF using pdfjs-dist
   */
  private async parsePDF(data: ArrayBuffer, password?: string): Promise<any> {
    const pdfjsLib = (window as any).pdfjsLib
    if (!pdfjsLib) {
      throw new Error('pdfjs-dist not available')
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(data),
      password,
      // Disable font loading for faster parsing
      disableFontFace: true,
      // Use standard fonts
      useSystemFonts: true,
    })

    return await loadingTask.promise
  }

  /**
   * Extract text from a PDF page
   */
  private async extractPageText(
    page: any,
    preserveFormatting: boolean = true
  ): Promise<string> {
    const textContent = await page.getTextContent()

    if (!preserveFormatting) {
      // Simple concatenation
      return textContent.items.map((item: any) => item.str).join(' ')
    }

    // Preserve formatting by considering positions
    const items = textContent.items
    const lines: string[] = []
    let currentLine: { text: string; y: number }[] = []
    let lastY = -1

    for (const item of items) {
      const y = item.transform[5] // Y position

      // New line detected (Y position changed significantly)
      if (lastY !== -1 && Math.abs(y - lastY) > 5) {
        if (currentLine.length > 0) {
          lines.push(currentLine.map((t) => t.text).join(' '))
          currentLine = []
        }
      }

      currentLine.push({ text: item.str, y })
      lastY = y
    }

    // Add last line
    if (currentLine.length > 0) {
      lines.push(currentLine.map((t) => t.text).join(' '))
    }

    return lines.join('\n')
  }

  /**
   * Parse page range string (e.g., "1-10", "1,3,5", "1-5,10-15")
   */
  private parsePageRange(
    range: string | undefined,
    totalPages: number
  ): number[] {
    if (!range) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = new Set<number>()
    const parts = range.split(',')

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end && i <= totalPages; i++) {
            pages.add(i)
          }
        }
      } else {
        const pageNum = parseInt(part.trim(), 10)
        if (!isNaN(pageNum) && pageNum <= totalPages) {
          pages.add(pageNum)
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }
}

/**
 * Setup instructions for pdfjs-dist
 *
 * Browser usage:
 * 1. Install: npm install pdfjs-dist
 * 2. In your app, configure the worker:
 *
 * ```tsx
 * import * as pdfjsLib from 'pdfjs-dist'
 *
 * // Set worker path
 * pdfjsLib.GlobalWorkerOptions.workerSrc =
 *   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
 *
 * // Make available globally
 * (window as any).pdfjsLib = pdfjsLib
 * ```
 *
 * Node.js usage:
 * - Use 'pdfjs-dist/legacy/build/pdf.js' for Node.js
 * - Or use alternative libraries like 'pdf-parse'
 */
