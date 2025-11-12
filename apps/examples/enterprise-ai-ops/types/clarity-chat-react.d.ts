declare module '@clarity-chat/react' {
  import type { ComponentType } from 'react'

  export const ThemeProvider: ComponentType<{ theme?: any; children?: React.ReactNode }>
  export const themes: Record<string, any>

  export const EvaluationDashboard: ComponentType<any>
  export const SafetyReviewConsole: ComponentType<any>
  export const PromptTestHarness: ComponentType<any>
  export const TokenOptimizationDashboard: ComponentType<any>
  export const PerformanceDashboard: ComponentType<any>
  export const SafetyStatusCard: ComponentType<any>
  export const ResponseQualityMeter: ComponentType<any>

  export function useTokenOptimization(options?: any): any
}
