/**
 * Document Loaders
 *
 * Flexible, optional utilities for loading and chunking documents.
 * Use what you need, extend with custom loaders.
 *
 * @example
 * ```tsx
 * // Load a document
 * const loader = new TextLoader()
 * const docs = await loader.load(file)
 *
 * // Split into chunks
 * const splitter = new RecursiveTextSplitter()
 * const chunks = splitter.splitDocuments(docs, {
 *   chunkSize: 1000,
 *   chunkOverlap: 200,
 * })
 *
 * // Use registry for automatic loader selection
 * const registry = new LoaderRegistry()
 * const docs = await registry.load(file) // Automatically picks loader
 *
 * // Custom loader
 * class PDFLoader implements DocumentLoader {
 *   name = 'pdf'
 *   supportedTypes = ['application/pdf']
 *
 *   async load(source: File) {
 *     // Use pdf.js or similar
 *     return [{ content: '...', metadata: {} }]
 *   }
 *
 *   supports(type: string) {
 *     return type === 'application/pdf'
 *   }
 * }
 *
 * registry.register(new PDFLoader())
 * ```
 */
export * from './types';
export * from './text-splitter';
export * from './loaders';
//# sourceMappingURL=index.d.ts.map