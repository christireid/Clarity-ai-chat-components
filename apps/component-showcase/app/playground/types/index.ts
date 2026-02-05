export type PropValue = string | number | boolean | object | undefined

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'json'
  | 'function'

export interface PropDefinition {
  name: string
  type: PropType
  default: PropValue
  description: string
  required?: boolean
  options?: Array<{ label: string; value: PropValue }>
  min?: number
  max?: number
  step?: number
}

export interface ComponentDefinition {
  id: string
  name: string
  category: string
  description: string
  importPath: string
  props: PropDefinition[]
  examples?: Array<{
    name: string
    description: string
    props: Record<string, PropValue>
  }>
}

export interface CodeTemplate {
  imports: string[]
  component: string
  wrapper?: string
}
