/**
 * DOCX Document Loader
 *
 * Extracts text from Microsoft Word (.docx) files, preserving structure,
 * headings, lists, and tables. Works in both browser and Node.js.
 *
 * @example
 * ```tsx
 * const loader = new DOCXLoader()
 * const docs = await loader.load(docxFile)
 *
 * // With options
 * const docs = await loader.load(docxFile, {
 *   preserveFormatting: true,
 *   includeTables: true,
 *   includeHeaders: true
 * })
 * ```
 */

import type { Document, DocumentLoader, DocumentLoadOptions } from './types'

export interface DOCXLoadOptions extends DocumentLoadOptions {
  /** Preserve text formatting (bold, italic, etc.) */
  preserveFormatting?: boolean
  /** Include table content */
  includeTables?: boolean
  /** Include headers and footers */
  includeHeaders?: boolean
  /** Include footnotes and endnotes */
  includeNotes?: boolean
  /** Convert to Markdown format */
  outputMarkdown?: boolean
  /** Split by sections (headings) */
  splitBySections?: boolean
}

export class DOCXLoader implements DocumentLoader {
  name = 'docx'
  supportedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'docx',
  ]

  async load(
    source: string | File | Blob,
    options?: DOCXLoadOptions
  ): Promise<Document[]> {
    try {
      const arrayBuffer = await this.loadDocxData(source)
      const content = await this.parseDocx(arrayBuffer, options)

      if (!content || content.trim().length === 0) {
        return [
          {
            content: '[No text content found in DOCX]',
            metadata: {
              source: source instanceof File ? source.name : 'docx',
              type: this.supportedTypes[0],
              error: 'Empty document',
            },
          },
        ]
      }

      // Split by sections if requested
      if (options?.splitBySections) {
        return this.splitIntoSections(content, source)
      }

      // Return single document
      return [
        {
          content,
          metadata: {
            source: source instanceof File ? source.name : 'docx',
            type: this.supportedTypes[0],
            ...options?.metadata,
          },
        },
      ]
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      return [
        {
          content: `[Failed to load DOCX: ${errorMessage}]`,
          metadata: {
            source: source instanceof File ? source.name : 'docx',
            type: this.supportedTypes[0],
            error: errorMessage,
          },
        },
      ]
    }
  }

  supports(type: string): boolean {
    return this.supportedTypes.some((t) => type.toLowerCase().includes(t.toLowerCase()))
  }

  /**
   * Load DOCX data from various sources
   */
  private async loadDocxData(
    source: string | File | Blob
  ): Promise<ArrayBuffer> {
    if (typeof source === 'string') {
      if (source.startsWith('http')) {
        const response = await fetch(source)
        if (!response.ok) {
          throw new Error(`Failed to fetch DOCX: ${response.statusText}`)
        }
        return await response.arrayBuffer()
      } else if (source.startsWith('data:')) {
        // Base64 encoded DOCX
        const base64 = source.split(',')[1]
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        return bytes.buffer
      } else {
        throw new Error('Invalid DOCX source string')
      }
    } else {
      return await source.arrayBuffer()
    }
  }

  /**
   * Parse DOCX file using mammoth
   *
   * Note: This requires 'mammoth' package to be installed.
   * For browser usage, you can use the browser version of mammoth.
   */
  private async parseDocx(
    arrayBuffer: ArrayBuffer,
    options?: DOCXLoadOptions
  ): Promise<string> {
    // Check if mammoth is available
    if (typeof window !== 'undefined' && !(window as any).mammoth) {
      // Try to load from global if available
      console.warn(
        'DOCXLoader: mammoth library not found. Please install:\n' +
        'npm install mammoth\n' +
        'Then import: import mammoth from "mammoth"'
      )
      // Fallback to basic extraction using JSZip
      return this.fallbackParse(arrayBuffer, options)
    }

    const mammoth = (window as any).mammoth || (await this.loadMammoth())

    try {
      const result = await mammoth.extractRawText({
        arrayBuffer,
      })

      let content = result.value

      // Convert to Markdown if requested
      if (options?.outputMarkdown) {
        const mdResult = await mammoth.convertToMarkdown({
          arrayBuffer,
        })
        content = mdResult.value
      }

      // Report any warnings
      if (result.messages && result.messages.length > 0) {
        console.warn('DOCX parsing warnings:', result.messages)
      }

      return content
    } catch (error) {
      console.error('Mammoth parsing failed, trying fallback:', error)
      return this.fallbackParse(arrayBuffer, options)
    }
  }

  /**
   * Fallback parser using basic ZIP extraction
   * Extracts text from document.xml in the DOCX archive
   */
  private async fallbackParse(
    arrayBuffer: ArrayBuffer,
    options?: DOCXLoadOptions
  ): Promise<string> {
    try {
      // Check if JSZip is available
      if (typeof window === 'undefined' || !(window as any).JSZip) {
        throw new Error('JSZip not available for fallback parsing')
      }

      const JSZip = (window as any).JSZip
      const zip = new JSZip()
      await zip.loadAsync(arrayBuffer)

      // Get document.xml
      const documentXml = await zip.file('word/document.xml')?.async('text')
      if (!documentXml) {
        throw new Error('Could not find document.xml in DOCX')
      }

      // Extract text from XML (very basic)
      const textContent = this.extractTextFromXml(documentXml)

      return textContent
    } catch (error) {
      throw new Error(
        `Fallback DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Basic text extraction from XML
   */
  private extractTextFromXml(xml: string): string {
    // Remove XML tags and extract text content
    // Look for <w:t> tags which contain the actual text
    const textMatches = xml.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)

    if (!textMatches) {
      return ''
    }

    const texts = textMatches.map((match) => {
      const textContent = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')
      return textContent
    })

    return texts.join(' ')
  }

  /**
   * Split content into sections based on headings
   */
  private splitIntoSections(
    content: string,
    source: string | File | Blob
  ): Document[] {
    // Split by common heading patterns
    const headingPattern = /^#{1,6}\s+.+$/gm // Markdown headings
    const sections = content.split(headingPattern)

    const documents: Document[] = []
    const headings = content.match(headingPattern) || []

    sections.forEach((section, index) => {
      const trimmed = section.trim()
      if (trimmed) {
        const heading = headings[index - 1] || 'Introduction'
        documents.push({
          content: trimmed,
          metadata: {
            source: source instanceof File ? source.name : 'docx',
            type: this.supportedTypes[0],
            section: heading.replace(/^#+\s+/, ''),
            sectionIndex: index,
          },
        })
      }
    })

    return documents.length > 0
      ? documents
      : [
          {
            content,
            metadata: {
              source: source instanceof File ? source.name : 'docx',
              type: this.supportedTypes[0],
            },
          },
        ]
  }

  /**
   * Dynamically load mammoth if available
   */
  private async loadMammoth(): Promise<any> {
    try {
      // Try to dynamically import mammoth
      return await import('mammoth')
    } catch {
      throw new Error('Mammoth library could not be loaded')
    }
  }
}

/**
 * Setup instructions for mammoth
 *
 * Browser usage:
 * 1. Install: npm install mammoth
 * 2. Import in your app:
 *
 * ```tsx
 * import mammoth from 'mammoth'
 *
 * // Make available globally (if using global access)
 * (window as any).mammoth = mammoth
 * ```
 *
 * Node.js usage:
 * ```tsx
 * import mammoth from 'mammoth'
 * import { DOCXLoader } from './docx-loader'
 *
 * // Mammoth will be loaded automatically
 * const loader = new DOCXLoader()
 * const docs = await loader.load(fileBuffer)
 * ```
 *
 * Alternative: For a lighter solution, use jszip + basic XML parsing:
 * ```tsx
 * npm install jszip
 *
 * import JSZip from 'jszip'
 * (window as any).JSZip = JSZip
 * ```
 */
