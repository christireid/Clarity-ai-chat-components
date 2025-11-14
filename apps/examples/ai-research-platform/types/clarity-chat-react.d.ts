declare module '@clarity-chat/react' {
  import type { ComponentType } from 'react'

  export const ChatWindow: ComponentType<any>
  export const ThemeProvider: ComponentType<{ theme?: any; children?: React.ReactNode }>
  export const themes: Record<string, any>

  export const TokenOptimizationDashboard: ComponentType<any>
  export const AgentRunFeed: ComponentType<any>
  export const ContextVisualizer: ComponentType<any>
  export const KnowledgeBaseViewer: ComponentType<any>
  export const CitationCard: ComponentType<any>
  export const ConversationTimeline: ComponentType<any>
  export const MemoryInspector: ComponentType<any>
  export const SessionSummaryCard: ComponentType<any>
  export const AdvancedChatInput: ComponentType<any>
  export const CommandPalette: ComponentType<any>

  export function useMessageOperations(): any
  export function useTokenOptimization(options?: any): any
  export function useStreamingSSE(options?: any): { streamMessage: (input: any) => Promise<void>; isStreaming: boolean }
}
