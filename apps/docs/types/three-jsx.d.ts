/**
 * Three.js JSX Type Declarations for @react-three/fiber
 *
 * Extends JSX.IntrinsicElements with Three.js components
 * Note: These augment the types from @react-three/fiber
 */

// Import React to enable module augmentation
import type { RefObject } from 'react'

// Type for Three.js elements - allows any props and ref types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThreeElementProps = { ref?: RefObject<any>; [key: string]: unknown }

// Augment the React module's JSX namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // Geometry elements
      bufferGeometry: ThreeElementProps
      bufferAttribute: ThreeElementProps

      // Object3D elements
      points: ThreeElementProps

      // Shader material
      shaderMaterial: ThreeElementProps
    }
  }
}
