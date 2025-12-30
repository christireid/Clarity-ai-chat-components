/**
 * Three.js JSX Type Declarations for @react-three/fiber
 *
 * Extends JSX.IntrinsicElements with Three.js components
 * Using generic object types to avoid complex type resolution issues
 */

declare namespace JSX {
  interface IntrinsicElements {
    // Geometry elements
    bufferGeometry: Record<string, unknown>
    bufferAttribute: Record<string, unknown>

    // Object3D elements
    points: Record<string, unknown>
    mesh: Record<string, unknown>
    group: Record<string, unknown>
    line: Record<string, unknown>

    // Material elements
    shaderMaterial: Record<string, unknown>
    meshBasicMaterial: Record<string, unknown>
    meshStandardMaterial: Record<string, unknown>
    pointsMaterial: Record<string, unknown>

    // Light elements
    ambientLight: Record<string, unknown>
    directionalLight: Record<string, unknown>
    pointLight: Record<string, unknown>

    // Camera elements
    perspectiveCamera: Record<string, unknown>
    orthographicCamera: Record<string, unknown>
  }
}
