declare module 'react' {
  export = React
  export as namespace React
  
  namespace React {
    type ReactElement = any
    type ReactNode = any
    type ComponentType<P = {}> = any
    type FC<P = {}> = (props: P) => ReactElement | null
    type Component<P = {}, S = {}> = any
    
    function createElement(type: any, props?: any, ...children: any[]): ReactElement
  }
  
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T
  export function useMemo<T>(fn: () => T, deps: any[]): T
  
  export default React
}
