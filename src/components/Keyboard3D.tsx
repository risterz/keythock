import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Colorway, KeyboardLayoutConfig, KeyData, RgbMode, ArtisanEsc } from '../data/keyboardConfig'
import { PlateMaterial, PLATE_MATERIALS } from '../audio/soundEngine'

interface Keyboard3DProps {
  colorway: Colorway
  activeKeys: Set<string>
  onKeyPress: (key: KeyData) => void
  explodeAmount: number // 0.0 (assembled) to 1.0 (fully exploded)
  rgbMode: RgbMode
  artisanEsc: ArtisanEsc
  lastPressedKeyPos: { x: number; z: number; time: number } | null
  layoutConfig: KeyboardLayoutConfig
  plateMaterial: PlateMaterial
}

export default function Keyboard3D({
  colorway,
  activeKeys,
  onKeyPress,
  explodeAmount,
  rgbMode,
  artisanEsc,
  lastPressedKeyPos,
  layoutConfig,
  plateMaterial
}: Keyboard3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        key={'canvas-' + layoutConfig.id}
        camera={{ position: [0, 11, layoutConfig.cameraZ || 13], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#06080d']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 14, 8]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        <Float speed={explodeAmount > 0.1 ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.2}>
          <KeyboardBody
            key={'body-' + layoutConfig.id}
            colorway={colorway}
            activeKeys={activeKeys}
            onKeyPress={onKeyPress}
            explodeAmount={explodeAmount}
            rgbMode={rgbMode}
            artisanEsc={artisanEsc}
            lastPressedKeyPos={lastPressedKeyPos}
            layoutConfig={layoutConfig}
            plateMaterial={plateMaterial}
          />
        </Float>

        {/* Floor Shadow */}
        <mesh position={[0, -3.2, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.45} />
        </mesh>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.1}
        />
      </Canvas>
    </div>
  )
}

function KeyboardBody({
  colorway,
  activeKeys,
  onKeyPress,
  explodeAmount,
  rgbMode,
  artisanEsc,
  lastPressedKeyPos,
  layoutConfig,
  plateMaterial
}: Keyboard3DProps) {
  const keyPositions = layoutConfig.positions
  const { caseWidth, caseDepth } = layoutConfig
  const labelX = -caseWidth / 2 - 1.2
  const currentPlate = PLATE_MATERIALS[plateMaterial] || PLATE_MATERIALS['fr4']

  // Interpolated heights for exploded teardown
  const keycapsY = explodeAmount * 2.6
  const switchesY = explodeAmount * 1.6
  const plateY = explodeAmount * 0.8
  const pcbY = 0
  const foamY = -explodeAmount * 0.9
  const caseY = -0.4 - explodeAmount * 1.8

  return (
    <group position={[0, 0, 0]} rotation={[0.15, 0, 0]}>
      {/* 1. CNC ALUMINUM CASE (Bottom Layer) */}
      <group position={[0, caseY, 0]}>
        <mesh receiveShadow castShadow key={'mesh-case-' + layoutConfig.id}>
          <boxGeometry key={'geom-case-' + layoutConfig.id} args={[caseWidth, 0.7, caseDepth]} />
          <meshStandardMaterial
            color={colorway.caseColor}
            metalness={colorway.caseMaterial === 'metal' ? 0.85 : 0.25}
            roughness={colorway.caseMaterial === 'metal' ? 0.25 : 0.55}
          />
        </mesh>
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#00f5ff">
            CNC CASE
          </Text>
        )}
      </group>

      {/* 2. PORON SOUND DAMPENING FOAM */}
      <group position={[0, foamY, 0]}>
        <mesh key={'mesh-foam-' + layoutConfig.id}>
          <boxGeometry key={'geom-foam-' + layoutConfig.id} args={[caseWidth - 0.6, 0.1, caseDepth - 0.6]} />
          <meshStandardMaterial color="#1a1c23" roughness={0.9} />
        </mesh>
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#a855f7">
            PORON FOAM
          </Text>
        )}
      </group>

      {/* 3. MULTI-LAYER PCB WITH TRACES */}
      <group position={[0, pcbY, 0]}>
        <mesh key={'mesh-pcb-' + layoutConfig.id}>
          <boxGeometry key={'geom-pcb-' + layoutConfig.id} args={[caseWidth - 0.5, 0.08, caseDepth - 0.5]} />
          <meshStandardMaterial color="#0c1813" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Underglow LED strip glow */}
        {rgbMode !== 'off' && (
          <mesh position={[0, -0.05, 0]} key={'mesh-underglow-' + layoutConfig.id}>
            <boxGeometry key={'geom-underglow-' + layoutConfig.id} args={[caseWidth - 0.3, 0.05, caseDepth - 0.3]} />
            <meshStandardMaterial
              color={colorway.underglowColor}
              emissive={colorway.underglowColor}
              emissiveIntensity={1.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#10b981">
            PCB
          </Text>
        )}
      </group>

      {/* 4. SWITCH PLATE (Dynamic Material) */}
      <group position={[0, plateY, 0]}>
        <mesh key={'mesh-plate-' + layoutConfig.id + '-' + plateMaterial}>
          <boxGeometry key={'geom-plate-' + layoutConfig.id} args={[caseWidth - 0.6, 0.05, caseDepth - 0.6]} />
          <meshStandardMaterial
            color={currentPlate.color}
            metalness={currentPlate.metalness}
            roughness={currentPlate.roughness}
            transparent={!!currentPlate.transparent}
            opacity={currentPlate.opacity ?? 1}
          />
        </mesh>
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#f59e0b">
            {currentPlate.shortLabel.toUpperCase()} PLATE
          </Text>
        )}
      </group>

      {/* 5. INDIVIDUAL SWITCH HOUSINGS */}
      <group position={[0, switchesY, 0]}>
        {keyPositions.map(({ key, x, z }) => (
          <mesh key={'sw-' + key.id + '-' + layoutConfig.id} position={[x, 0.05, z]}>
            <boxGeometry args={[0.75, 0.35, 0.75]} />
            <meshStandardMaterial color="#2d2d38" roughness={0.5} />
          </mesh>
        ))}
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#ec4899">
            SWITCHES
          </Text>
        )}
      </group>

      {/* 6. KEYCAPS (Top Layer) */}
      <group position={[0, keycapsY, 0]}>
        {keyPositions.map(({ key, x, z, width }) => (
          <KeycapMesh
            key={'kc-' + key.id + '-' + layoutConfig.id}
            keyData={key}
            x={x}
            z={z}
            width={width}
            colorway={colorway}
            isPressed={activeKeys.has(key.code) || activeKeys.has(key.id)}
            onClick={() => onKeyPress(key)}
            rgbMode={rgbMode}
            artisanEsc={artisanEsc}
            lastPressedKeyPos={lastPressedKeyPos}
          />
        ))}
        {explodeAmount > 0.4 && (
          <Text position={[labelX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#38bdf8">
            KEYCAPS
          </Text>
        )}
      </group>
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
  rgbMode: RgbMode
  artisanEsc: ArtisanEsc
  lastPressedKeyPos: { x: number; z: number; time: number } | null
}

function KeycapMesh({
  keyData,
  x,
  z,
  width,
  colorway,
  isPressed,
  onClick,
  rgbMode,
  artisanEsc,
  lastPressedKeyPos
}: KeycapMeshProps) {
  const meshRef = useRef<THREE.Group>(null)
  const rgbLightRef = useRef<THREE.PointLight>(null)
  const keyMatRef = useRef<THREE.MeshStandardMaterial>(null)

  const isEsc = keyData.id === 'Escape'
  const isArtisan = isEsc && artisanEsc === 'gemstone'

  // Determine standard colors based on key type
  const { bg, text } = useMemo(() => {
    if (keyData.isSpecial) {
      return { bg: colorway.accentBg, text: colorway.accentText }
    }
    if (keyData.isModifier) {
      return { bg: colorway.modBg, text: colorway.modText }
    }
    return { bg: colorway.alphaBg, text: colorway.alphaText }
  }, [keyData, colorway])

  // Real-time RGB & Dynamic Lighting Calculation
  useFrame(({ clock }) => {
    // 1. Spring actuation
    if (meshRef.current) {
      const targetY = isPressed ? -0.22 : 0
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        isPressed ? 0.45 : 0.25
      )
    }

    // 2. RGB lighting computation
    if (rgbLightRef.current) {
      const time = clock.elapsedTime

      if (rgbMode === 'off') {
        rgbLightRef.current.intensity = 0
        if (keyMatRef.current) {
          keyMatRef.current.emissiveIntensity = 0
        }
      } else if (rgbMode === 'rainbow') {
        const hue = ((x + 7.5) / 15 + time * 0.3) % 1
        rgbLightRef.current.color.setHSL(hue, 1, 0.5)
        rgbLightRef.current.intensity = isPressed ? 3.5 : 1.2
        if (keyMatRef.current) {
          keyMatRef.current.emissive.setHSL(hue, 1, 0.45)
          keyMatRef.current.emissiveIntensity = isPressed ? 0.7 : 0.15
        }
      } else if (rgbMode === 'ripple') {
        if (lastPressedKeyPos) {
          const dx = x - lastPressedKeyPos.x
          const dz = z - lastPressedKeyPos.z
          const dist = Math.sqrt(dx * dx + dz * dz)
          const elapsed = (Date.now() - lastPressedKeyPos.time) / 1000
          const waveRadius = elapsed * 12 // speed of ripple

          const waveDiff = Math.abs(dist - waveRadius)
          if (waveDiff < 1.6 && elapsed < 1.2) {
            const intensity = Math.max(0, (1.6 - waveDiff) * (1.2 - elapsed) * 2.8)
            rgbLightRef.current.intensity = Math.max(0.4, intensity * 2.5)
            rgbLightRef.current.color.set(colorway.underglowColor)
            if (keyMatRef.current) {
              keyMatRef.current.emissive.set(colorway.underglowColor)
              keyMatRef.current.emissiveIntensity = intensity * 0.5
            }
          } else if (isPressed) {
            rgbLightRef.current.intensity = 3.5
            rgbLightRef.current.color.set(colorway.underglowColor)
            if (keyMatRef.current) {
              keyMatRef.current.emissive.set(colorway.underglowColor)
              keyMatRef.current.emissiveIntensity = 0.8
            }
          } else {
            rgbLightRef.current.intensity = 0.2
            if (keyMatRef.current) {
              keyMatRef.current.emissiveIntensity = 0
            }
          }
        } else if (isPressed) {
          rgbLightRef.current.intensity = 3.5
          rgbLightRef.current.color.set(colorway.underglowColor)
          if (keyMatRef.current) {
            keyMatRef.current.emissive.set(colorway.underglowColor)
            keyMatRef.current.emissiveIntensity = 0.8
          }
        } else {
          rgbLightRef.current.intensity = 0.2
          if (keyMatRef.current) {
            keyMatRef.current.emissiveIntensity = 0
          }
        }
      } else if (rgbMode === 'breathing') {
        const pulse = (Math.sin(time * 2.5) + 1) / 2
        rgbLightRef.current.intensity = (isPressed ? 3.5 : 0.3) + pulse * 1.5
        rgbLightRef.current.color.set(colorway.underglowColor)
        if (keyMatRef.current) {
          keyMatRef.current.emissive.set(colorway.underglowColor)
          keyMatRef.current.emissiveIntensity = isPressed ? 0.7 : 0.1 + pulse * 0.25
        }
      } else {
        // static
        rgbLightRef.current.intensity = isPressed ? 3.5 : 0.8
        rgbLightRef.current.color.set(colorway.underglowColor)
        if (keyMatRef.current) {
          keyMatRef.current.emissive.set(colorway.underglowColor)
          keyMatRef.current.emissiveIntensity = isPressed ? 0.7 : 0.12
        }
      }
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
      {/* Individual Switch LED Light Under Keycap */}
      <pointLight ref={rgbLightRef} position={[0, 0.1, 0]} distance={1.8} intensity={0.5} />

      {/* Artisan Crystal Sculpt on ESC Key */}
      {isArtisan ? (
        <group position={[0, 0.32, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.38, 0]} />
            <meshPhysicalMaterial
              color="#00f5ff"
              emissive="#ff007f"
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.1}
              transmission={0.8}
              thickness={0.5}
            />
          </mesh>
          <Text
            position={[0, 0.42, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ESC
          </Text>
        </group>
      ) : (
        /* Standard Keycap Body */
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[width, 0.45, 0.92]} />
          <meshStandardMaterial
            ref={keyMatRef}
            color={isPressed ? '#ffffff' : bg}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Keycap Legend Text */}
      {!isArtisan && keyData.label && (
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
