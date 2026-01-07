"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ParticleFieldProps {
  count?: number
  mouse: { x: number; y: number }
}

function ParticleSystem({ count = 3000, mouse }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Generate random positions for particles
  const [positions, colors, originalPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)

    // Primary blue: hsl(217, 91%, 60%) = rgb(74, 144, 226)
    const primaryColor = new THREE.Color(0x4a90e2)
    // Secondary purple: hsl(265, 89%, 78%) = rgb(190, 149, 237)
    const secondaryColor = new THREE.Color(0xbe95ed)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Distribute particles in a spherical volume
      const radius = 15 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.5 - 2
      const z = radius * Math.cos(phi) * 0.3 - 5

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      originalPositions[i3] = x
      originalPositions[i3 + 1] = y
      originalPositions[i3 + 2] = z

      // Gradient color based on position
      const t = Math.random()
      const color = primaryColor.clone().lerp(secondaryColor, t)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return [positions, colors, originalPositions]
  }, [count])

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positionAttribute = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Get original position
      const origX = originalPositions[i3]
      const origY = originalPositions[i3 + 1]
      const origZ = originalPositions[i3 + 2]

      // Add gentle floating motion
      const floatX =
        Math.sin(time * 0.3 + origY * 0.1) * 0.5 +
        Math.cos(time * 0.2 + origZ * 0.1) * 0.3
      const floatY =
        Math.cos(time * 0.4 + origX * 0.1) * 0.4 +
        Math.sin(time * 0.3 + origZ * 0.1) * 0.2
      const floatZ = Math.sin(time * 0.2 + origX * 0.05) * 0.2

      // Mouse influence - particles are attracted/repelled by mouse
      const mouseX = (mouse.x * viewport.width) / 2
      const mouseY = (mouse.y * viewport.height) / 2

      const dx = mouseX - (origX + floatX)
      const dy = mouseY - (origY + floatY)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 8

      let mouseInfluenceX = 0
      let mouseInfluenceY = 0

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 2
        mouseInfluenceX = (dx / dist) * force * 0.5
        mouseInfluenceY = (dy / dist) * force * 0.5
      }

      positionAttribute.setXYZ(
        i,
        origX + floatX + mouseInfluenceX,
        origY + floatY + mouseInfluenceY,
        origZ + floatZ
      )
    }

    positionAttribute.needsUpdate = true

    // Slowly rotate the entire system
    pointsRef.current.rotation.y = time * 0.02
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1}
      />
    </Points>
  )
}

// Connection lines between nearby particles
function ConnectionLines({
  count = 500,
  mouse,
}: {
  count?: number
  mouse: { x: number; y: number }
}) {
  const linesRef = useRef<THREE.LineSegments>(null)
  const { viewport } = useThree()

  const [positions, indices] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const indices: number[] = []

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 12 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5 - 2
      positions[i3 + 2] = radius * Math.cos(phi) * 0.3 - 5
    }

    // Create connections between nearby points
    const maxDistance = 3
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count && indices.length < 2000; j++) {
        const i3 = i * 3
        const j3 = j * 3
        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < maxDistance && Math.random() > 0.7) {
          indices.push(i, j)
        }
      }
    }

    return [positions, new Uint16Array(indices)]
  }, [count])

  useFrame((state) => {
    if (!linesRef.current) return
    const time = state.clock.getElapsedTime()
    linesRef.current.rotation.y = time * 0.02
    linesRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="index"
          args={[indices, 1]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={0x4a90e2}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// Glowing orbs in the background
function GlowingOrbs() {
  const groupRef = useRef<THREE.Group>(null)

  const orbs = useMemo(() => {
    return [
      { position: [-8, 4, -15], color: 0x4a90e2, scale: 3 },
      { position: [10, -3, -20], color: 0xbe95ed, scale: 4 },
      { position: [0, -8, -18], color: 0x4a90e2, scale: 2.5 },
    ]
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y += Math.sin(time * 0.5 + i * 2) * 0.002
      mesh.position.x += Math.cos(time * 0.3 + i) * 0.001
    })
  })

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position as [number, number, number]}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

interface ParticleFieldCanvasProps {
  className?: string
}

export function ParticleFieldCanvas({ className }: ParticleFieldCanvasProps) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <ParticleSystem count={2500} mouse={mouseRef.current} />
        <ConnectionLines count={400} mouse={mouseRef.current} />
        <GlowingOrbs />
      </Canvas>
    </div>
  )
}

export default ParticleFieldCanvas
