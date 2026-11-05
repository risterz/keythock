import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Colorway, KEYBOARD_LAYOUT, KeyData } from '../data/keyboardConfig'

interface Keyboard3DProps {
  colorway: Colorway
  activeKeys: Set<string>
  onKeyPress: (key: KeyData) => void
}

export default function Keyboard3D({ colorway, activeKeys, onKeyPress }: Keyboard3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 10, 12], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#07090e']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 12, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <pointLight
          position={[0, 4, 0]}
          color={colorway.underglowColor}
          intensity={2.5}
          distance={15}
        />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
          <KeyboardBody
            colorway={colorway}
            activeKeys={activeKeys}
            onKeyPress={onKeyPress}
          />
        </Float>

        {/* Studio Floor Shadow */}
        <mesh position={[0, -2.5, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.4} />
        </mesh>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.2}
        />
      </Canvas>
    </div>
  )
}

function KeyboardBody({ colorway, activeKeys, onKeyPress }: Keyboard3DProps) {
  // Compute positions of each key in standard 60% matrix
  // Total width of standard 60% keyboard is 15u (1u = 0.95 unit)
  const unitSize = 0.92
  const gap = 0.06

  const keyPositions = useMemo(() => {
    const positions: { key: KeyData; x: number; z: number; width: number }[] = []
    
    // Group keys by row
    const rows = [0, 1, 2, 3, 4]
    const rowZOffsets = [-2.1, -1.05, 0, 1.05, 2.1]

    rows.forEach(r => {
      const keysInRow = KEYBOARD_LAYOUT.filter(k => k.row === r)
      let currentX = -7.0

      keysInRow.forEach(k => {
        const keyWidth = k.width * unitSize + (k.width - 1) * gap
        const posX = currentX + keyWidth / 2
        positions.push({
          key: k,
          x: posX,
          z: rowZOffsets[r],
          width: keyWidth
        })
        currentX += keyWidth + gap
      })
    })

    return positions
  }, [unitSize, gap])

  return (
    <group position={[0, 0, 0]} rotation={[0.15, 0, 0]}>
      {/* CNC Milled Keyboard Base / Chassis */}
      <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[15.2, 0.7, 5.8]} />
        <meshStandardMaterial
          color={colorway.caseColor}
          metalness={colorway.caseMaterial === 'metal' ? 0.85 : 0.2}
          roughness={colorway.caseMaterial === 'metal' ? 0.25 : 0.6}
        />
      </mesh>

      {/* Brass / Aluminum Internal Switch Mounting Plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[14.6, 0.05, 5.2]} />
        <meshStandardMaterial color="#c59b27" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Dynamic RGB Underglow Light Strip Bar */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[14.8, 0.08, 5.4]} />
        <meshStandardMaterial
          color={colorway.underglowColor}
          emissive={colorway.underglowColor}
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Individual 3D Keys */}
      {keyPositions.map(({ key, x, z, width }) => (
        <KeycapMesh
          key={key.id}
          keyData={key}
          x={x}
          z={z}
          width={width}
          colorway={colorway}
          isPressed={activeKeys.has(key.code) || activeKeys.has(key.id)}
          onClick={() => onKeyPress(key)}
        />
      ))}
    </group>
  )
}

interface KeycapMeshProps {
  keyData: KeyData
  x: number
  z: number
  width: number
  colorway: Colorway
  isPressed: boolean
  onClick: () => void
}

function KeycapMesh({ keyData, x, z, width, colorway, isPressed, onClick }: KeycapMeshProps) {
  const meshRef = useRef<THREE.Group>(null)

  // Determine colors based on key type
  const { bg, text } = useMemo(() => {
    if (keyData.isSpecial) {
      return { bg: colorway.accentBg, text: colorway.accentText }
    }
    if (keyData.isModifier) {
      return { bg: colorway.modBg, text: colorway.modText }
    }
    return { bg: colorway.alphaBg, text: colorway.alphaText }
  }, [keyData, colorway])

  // Smooth spring actuation animation
  useFrame(() => {
    if (meshRef.current) {
      const targetY = isPressed ? -0.22 : 0
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        isPressed ? 0.45 : 0.25
      )
    }
  })

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'default'
      }}
    >
      {/* Keycap Body */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[width, 0.45, 0.92]} />
        <meshStandardMaterial
          color={isPressed ? '#ffffff' : bg}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Keycap Legend Text */}
      {keyData.label && (
        <Text
          position={[0, 0.43, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={keyData.label.length > 2 ? 0.22 : 0.32}
          color={isPressed ? '#000000' : text}
          anchorX="center"
          anchorY="middle"
        >
          {keyData.label}
        </Text>
      )}
    </group>
  )
}
