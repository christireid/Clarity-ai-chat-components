/**
 * Documentation Bot Template
 *
 * Interactive documentation assistant for helping users navigate and search documentation.
 *
 * **Status:** Template/Placeholder (Not Fully Implemented)
 * **Use Instead:** Use CustomerSupportTemplate with documentation-specific configuration
 * **Roadmap:** Full implementation planned for v2.1
 *
 * @example
 * ```tsx
 * import { DocumentationBotTemplate } from '@clarity-chat/react'
 *
 * function MyDocBot() {
 *   return (
 *     <DocumentationBotTemplate
 *       title="Documentation Assistant"
 *       welcomeMessage="Hi! I can help you find information in our docs."
 *       // ... other props
 *     />
 *   )
 * }
 * ```
 */
export { CustomerSupportTemplate as DocumentationBotTemplate } from './customer-support';
/**
 * Create a documentation-specific bot configuration
 *
 * **Note:** This is an extensibility point for custom implementations.
 * Currently returns null as features are better handled by composing
 * existing components (ChatWindow + RAG + ContextManager).
 *
 * @param _config - Documentation bot configuration
 * @returns null (placeholder for extensibility)
 *
 * @example Recommended Implementation Pattern
 * ```tsx
 * import { ChatWindow, useRAG, ContextManager } from '@clarity-chat/react'
 *
 * function CustomDocBot({ docsSite }: { docsSite: string }) {
 *   const { search } = useRAG({
 *     vectorStore: 'pinecone',
 *     sources: [docsSite]
 *   })
 *
 *   const handleMessage = async (query: string) => {
 *     const relevantDocs = await search(query)
 *     // Use relevantDocs to enhance AI response with context
 *     return generateResponse(query, relevantDocs)
 *   }
 *
 *   return <ChatWindow onSendMessage={handleMessage} />
 * }
 * ```
 *
 * @see {@link ChatWindow} for base chat functionality
 * @see {@link useRAG} for documentation search and retrieval
 * @see {@link ContextManager} for managing documentation context
 */
export declare function createDocumentationBot(_config: {
    /** URL of the documentation site to index */
    docsSite: string;
    /** Optional custom search endpoint */
    searchEndpoint?: string;
    /** Documentation categories for filtering */
    categories?: string[];
}): null;
//# sourceMappingURL=documentation-bot.d.ts.map