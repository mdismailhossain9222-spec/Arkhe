import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  A rotating material sample — a chamfered slab the visitor can      */
/*  switch between the studio's five core materials.                   */
/* ------------------------------------------------------------------ */

export const MATERIALS = {
  travertine: {
    label: 'Roman Travertine',
    origin: 'Tivoli, Italy',
    note: 'Cut cross-grain, honed. Used for floors and bathing rooms.',
    swatch: '#d9cdb8',
    params: { color: '#ddd2bd', roughness: 0.78, metalness: 0.0 },
  },
  concrete: {
    label: 'Board-formed Concrete',
    origin: 'Cast in situ',
    note: 'Douglas fir formwork, 140 mm boards. Left raw and sealed.',
    swatch: '#a8a49b',
    params: { color: '#aca79d', roughness: 0.93, metalness: 0.02 },
  },
  oak: {
    label: 'Smoked Oak',
    origin: 'Jutland, Denmark',
    note: 'Fumed with ammonia, oiled. Joinery, stairs and linings.',
    swatch: '#8a6134',
    params: { color: '#8f6637', roughness: 0.62, metalness: 0.03 },
  },
  brass: {
    label: 'Unlacquered Brass',
    origin: 'Birmingham, UK',
    note: 'Left to patina. Ironmongery, reveals and shadow gaps.',
    swatch: '#a8834a',
    params: { color: '#c39a52', roughness: 0.28, metalness: 0.95 },
  },
  lime: {
    label: 'Lime Plaster',
    origin: 'Hand-applied',
    note: 'Three coats, burnished. Breathable, softens every edge.',
    swatch: '#e8e2d5',
    params: { color: '#ece6da', roughness: 0.95, metalness: 0.0 },
  },
} as const

export type MaterialId = keyof typeof MATERIALS

function Slab({ material }: { material: MaterialId }) {
  const mesh = useRef<THREE.Mesh>(null)
  const target = useRef(new THREE.Color(MATERIALS[material].params.color))

  const mat = useMemo(() => {
    const p = MATERIALS[material].params
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.color),
      roughness: p.roughness,
      metalness: p.metalness,
    })
  }, [])

  useFrame((state, dt) => {
    const p = MATERIALS[material].params
    target.current.set(p.color)
    mat.color.lerp(target.current, 1 - Math.pow(0.001, dt))
    mat.roughness = THREE.MathUtils.damp(mat.roughness, p.roughness, 4, dt)
    mat.metalness = THREE.MathUtils.damp(mat.metalness, p.metalness, 4, dt)

    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.y = t * 0.3
    mesh.current.rotation.x = Math.sin(t * 0.45) * 0.12
    mesh.current.position.y = Math.sin(t * 0.7) * 0.06
  })

  return (
    <mesh ref={mesh} material={mat} castShadow receiveShadow>
      <cylinderGeometry args={[1.25, 1.25, 0.34, 6]} />
    </mesh>
  )
}

export default function MaterialStudy({
  material,
  className,
}: {
  material: MaterialId
  className?: string
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.5, 4.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 6, 3]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
          <Environment resolution={192}>
            <Lightformer intensity={1.8} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#ffffff" />
            <Lightformer intensity={0.9} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#efe6d6" />
            <Lightformer intensity={0.7} position={[5, 2, -1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color="#c9bda9" />
          </Environment>

          <Slab material={material} />
          <ContactShadows position={[0, -0.9, 0]} opacity={0.35} scale={8} blur={2.4} far={4} color="#4a4438" />
        </Suspense>
      </Canvas>
    </div>
  )
}
