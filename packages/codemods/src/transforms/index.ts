/**
 * Available transforms registry
 */

export interface TransformInfo {
  name: string
  description: string
  from: string
  to: string
}

export const availableTransforms: TransformInfo[] = [
  {
    name: 'v1-to-v2',
    description: 'Migrate from v1 to v2 API',
    from: 'v1',
    to: 'v2',
  },
  // Add more transforms as versions evolve
]
