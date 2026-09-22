import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  A procedural architectural massing model — stacked volumes,        */
/*  a core, slab fins and a plinth. Reads as a study model in clay.    */
/* ------------------------------------------------------------------ */

type Block = {
  pos: [number, number, number]
  size: [number, number, number]
  tone: 'stone' | 'clay' | 'glass' | 'timber'
}

const BLOCKS: Block[] = [
  { pos: [0, 0.19, 0], size: [3.6, 0.38, 2.6], tone: 'stone' },        // plinth (bottom clear of ground)
  { pos: [-0.5, 0.95, 0], size: [2.2, 1.2, 2.0], tone: 'stone' },      // main mass
  { pos: [0.95, 1.5, 0.25], size: [1.3, 2.3, 1.5], tone: 'clay' },     // tower
  { pos: [-0.35, 1.95, -0.3], size: [1.5, 0.8, 1.2], tone: 'timber' }, // upper box
  { pos: [-1.35, 0.8, 0.55], size: [0.9, 0.9, 0.9], tone: 'glass' },   // glass pavilion
  { pos: [0.95, 2.95, 0.25], size: [1.45, 0.12, 1.65], tone: 'stone' },// roof slab
]

/* tower front face = z 0.25 + 1.5/2 = 1.0 → fins are pushed fully clear */
const FINS = Array.from({ length: 5 }, (_, i) => i)

function Model({ explode, spin }: { explode: number; spin: boolean }) {
  const root = useRef<THREE.Group>(null)   // scale + rotation (fixed position)
  const bobbing = useRef<THREE.Group>(null) // buildings only — ground never bobs
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const mats = useMemo(
    () => ({
      stone: new THREE.MeshStandardMaterial({ color: '#e6e1d6', roughness: 0.92, metalness: 0.02 }),
      clay: new THREE.MeshStandardMaterial({ color: '#b9714a', roughness: 0.85, metalness: 0.02 }),
      timber: new THREE.MeshStandardMaterial({ color: '#c08f55', roughness: 0.7, metalness: 0.05 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#cfd8d6',
        roughness: 0.08,
        metalness: 0,
        transmission: 0.85,
        thickness: 0.5,
        transparent: true,
        opacity: 0.55,
      }),
      ground: new THREE.MeshStandardMaterial({ color: '#ece7de', roughness: 1, metalness: 0 }),
    }),
    []
  )

  const matFor = (tone: Block['tone']) =>
    tone === 'stone' ? mats.stone : tone === 'clay' ? mats.clay : tone === 'timber' ? mats.timber : mats.glass

  useFrame((state, dt) => {
    if (!root.current) return
    const t = state.clock.elapsedTime

    if (spin) root.current.rotation.y += dt * 0.16
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, mouse.current.y * 0.1, 3, dt)

    if (bobbing.current) bobbing.current.position.y = Math.sin(t * 0.5) * 0.045

    const target = THREE.MathUtils.clamp(viewport.width / 9, 0.6, 1.15)
    const s = THREE.MathUtils.damp(root.current.scale.x, target, 4, dt)
    root.current.scale.setScalar(s)
  })

  return (
    <group ref={root} position={[0, -0.62, 0]}>
      {/* static study base — never bobs, slightly below the plinth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow material={mats.ground}>
        <circleGeometry args={[4.4, 72]} />
      </mesh>
      {/* thin drawn edge around the base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[4.39, 4.42, 72]} />
        <meshBasicMaterial color="#a9552f" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      <group ref={bobbing}>
        {BLOCKS.map((b, i) => (
          <mesh
            key={i}
            castShadow
            receiveShadow
            position={[b.pos[0], b.pos[1] + explode * i * 0.22, b.pos[2]]}
            material={matFor(b.tone)}
          >
            <boxGeometry args={b.size} />
          </mesh>
        ))}

        {/* vertical fins — offset fully clear of the tower face */}
        {FINS.map((i) => (
          <mesh
            key={`fin-${i}`}
            castShadow
            position={[0.34 + i * 0.3, 1.5 + explode * 0.5, 1.055]}
            material={mats.timber}
          >
            <boxGeometry args={[0.05, 2.2, 0.05]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function Massing({
  interactive = false,
  className,
}: {
  interactive?: boolean
  className?: string
}) {
  const [explode, setExplode] = useState(0)
  const [spin, setSpin] = useState(true)

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [4.4, 2.9, 5.4], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight
            position={[5, 7, 4]}
            intensity={2.3}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={26}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-bias={-0.0004}
            shadow-normalBias={0.03}
          />
          <hemisphereLight args={['#ffffff', '#d8d0c2', 0.5]} />
          <Environment resolution={192}>
            <Lightformer intensity={1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} color="#ffffff" />
            <Lightformer intensity={0.8} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#e8dfd0" />
            <Lightformer intensity={0.6} position={[6, 1, -2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#cdbfae" />
          </Environment>

          <Model explode={explode} spin={spin} />
          {/* kept just above the static base disc to avoid coplanar flicker */}
          {interactive && (
            <ContactShadows position={[0, -0.56, 0]} opacity={0.32} scale={12} blur={2.8} far={6} color="#4a4438" />
          )}

          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI * 0.2}
              maxPolarAngle={Math.PI * 0.49}
            />
          )}
        </Suspense>
      </Canvas>

      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-ink/12 bg-chalk/70 px-5 py-4 backdrop-blur-sm md:px-7">
          <label className="flex min-w-52 flex-1 items-center gap-4 md:max-w-xs" data-hover>
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.26em] text-graphite">
              Separate
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={explode * 100}
              onChange={(e) => setExplode(Number(e.target.value) / 100)}
              className="h-px w-full cursor-pointer appearance-none bg-ink/25 accent-clay"
              aria-label="Separate volumes"
            />
            <span className="w-9 text-right font-display text-base text-clay">
              {Math.round(explode * 100)}
            </span>
          </label>
          <button
            onClick={() => setSpin((s) => !s)}
            className={`border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] transition-colors ${
              spin ? 'border-clay text-clay' : 'border-ink/20 text-graphite hover:text-ink'
            }`}
          >
            {spin ? 'Rotating' : 'Paused'}
          </button>
        </div>
      )}
    </div>
  )
}
