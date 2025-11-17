declare module '@clarity-chat/react' {
  import type { ComponentType } from 'react'

  export const ChatWindow: ComponentType<any>
  export const ThemeProvider: ComponentType<{ theme?: any; children?: React.ReactNode }>
  export const themes: Record<string, any>

  export const AdvancedChatInput: ComponentType<any>
  export const CommandPalette: ComponentType<any>
  export const InteractiveCard: ComponentType<any>
  export const FollowUpSuggestions: ComponentType<any>

  export function useMessageOperations(): any
  export function useStreamingSSE(options?: any): { streamMessage: (input: any) => Promise<void>; isStreaming: boolean }
}
