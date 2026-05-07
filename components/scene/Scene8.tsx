"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Sparkles } from "@react-three/drei"
import gsap from "gsap"
import * as THREE from "three"
import { ThreeEvent } from "@react-three/fiber"

// --- Komponen 3D Kue & Teka-teki Lilin ---
function CakeAndCandle({ onCandleExtinguished }: { onCandleExtinguished: () => void }) {
  const flameRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const magicWindRef = useRef<THREE.Mesh>(null)

  const [isLit, setIsLit] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleBlowCandle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!isLit || isAnimating) return
    setIsAnimating(true)

    // Animasi: Bola Angin Ajaib terbang mendekati lilin
    if (magicWindRef.current && flameRef.current && lightRef.current) {
      gsap.to(magicWindRef.current.position, {
        x: 0,
        y: 1.5,
        z: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Matikan Api & Lampu Lilin
          setIsLit(false)
          gsap.to(flameRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.3 })
          gsap.to(lightRef.current, { intensity: 0, duration: 0.3 })

          // Hilangkan Bola Angin Ajaibnya
          gsap.to(magicWindRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.3 })

          // Beri tahu parent component (Scene 8) kalau lilin udah mati setelah delay dikit
          setTimeout(() => {
            onCandleExtinguished()
          }, 1000)
        }
      })
    }
  }

  return (
    <group position={[0, -1, 0]}>
      {/* --- KUE --- */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.8} /> {/* Warna Pink Kue */}
      </mesh>
      {/* Icing / Krim atas kue */}
      <mesh position={[0, 1.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.52, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* --- LILIN --- */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#fcd34d" /> {/* Lilin Kuning */}
      </mesh>

      {/* Api Lilin & Cahayanya */}
      <group position={[0, 1.8, 0]}>
        <mesh ref={flameRef}>
          <coneGeometry args={[0.1, 0.3, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        <pointLight ref={lightRef} color="#fbbf24" intensity={2} distance={5} castShadow />
      </group>

      {/* --- OBJEK TEKA-TEKI: BOLA ANGIN AJAIB --- */}
      {/* Disembunyikan di belakang kue (z: -3) */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh
          ref={magicWindRef}
          position={[0, 1, -3]}
          onClick={handleBlowCandle}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={2} />
          <Sparkles count={20} scale={1} size={2} color="#bae6fd" />
        </mesh>
      </Float>
    </group>
  )
}

// --- Main Scene 8 Component ---
export default function Scene8() {
  const [candleOff, setCandleOff] = useState(false)
  const polaroidContainerRef = useRef(null)

  // Animasi Polaroid saat lilin mati
  useEffect(() => {
    if (candleOff) {
      const ctx = gsap.context(() => {
        // Polaroid masuk dari luar layar secara random
        gsap.from(".polaroid-final", {
          opacity: 0,
          scale: 0,
          rotation: () => gsap.utils.random(-45, 45),
          x: () => gsap.utils.random(-300, 300),
          y: () => gsap.utils.random(-300, 300),
          duration: 1.5,
          stagger: 0.3,
          ease: "back.out(1.5)"
        })

        // Teks Ucapan Akhir muncul
        gsap.fromTo(".final-text",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
        )
      }, polaroidContainerRef)
      return () => ctx.revert()
    }
  }, [candleOff])

  return (
    <section className="min-h-screen w-full relative bg-[#111827] overflow-hidden transition-colors duration-1000">

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
          {/* Kalau lilin mati, lampu ruangan (ambient) ikut meredup biar romantis */}
          <ambientLight intensity={candleOff ? 0.2 : 0.6} />
          <Environment preset={candleOff ? "night" : "sunset"} />

          <CakeAndCandle onCandleExtinguished={() => setCandleOff(true)} />

          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2} // Ga bisa lihat dari bawah lantai
            minPolarAngle={0}
          />
        </Canvas>
      </div>

      {/* UI Petunjuk (Hilang kalau lilin udah mati) */}
      {!candleOff && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none w-full px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-pink-400 mb-4 drop-shadow-lg animate-pulse">
            Make a Wish! 🎂
          </h2>
          <p className="text-white bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm inline-block font-medium">
            Teka-teki: teken kue dan puter puter puter lalu cari "Angin Ajaib" untuk matiin lilinnya! 🔍
          </p>
        </div>
      )}

      {/* Overlay Polaroid & Teks Akhir (Muncul pas lilin mati) */}
      {candleOff && (
        <div ref={polaroidContainerRef} className="absolute inset-0 z-20 pointer-events-none flex flex-col md:flex-row items-center justify-center p-4 overflow-y-auto">

          {/* Desktop Absolute Polaroids */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="polaroid-final absolute top-20 left-32 bg-white p-3 pb-10 shadow-2xl rotate-[-15deg] w-56">
              <img src="/images/mine/14.jpg" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 1" />
              <p className="text-center font-handwriting text-gray-600 mt-2">Cantikkuuu</p>
            </div>

            <div className="polaroid-final absolute bottom-32 left-40 bg-white p-3 pb-10 shadow-2xl rotate-[10deg] w-56">
              <img src="/images/mine/15.jpg" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 2" />
              <p className="text-center font-handwriting text-gray-600 mt-2">Sayangku 🥰</p>
            </div>

            <div className="polaroid-final absolute top-24 right-32 bg-white p-3 pb-10 shadow-2xl rotate-[20deg] w-56">
              <img src="/images/mine/16.jpg" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 3" />
              <p className="text-center font-handwriting text-gray-600 mt-2">Miss you</p>
            </div>

            <div className="polaroid-final absolute bottom-28 right-40 bg-white p-3 pb-10 shadow-2xl rotate-[-12deg] w-56">
              <img src="/images/mine/13.jpeg" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 4" />
              <p className="text-center font-handwriting text-gray-600 mt-2">Always You</p>
            </div>
          </div>

          {/* Teks Ucapan Utama di Tengah */}
          <div className="final-text bg-black/60 backdrop-blur-md px-6 py-6 md:px-10 md:py-8 rounded-3xl text-center border border-white/20 shadow-[0_0_50px_rgba(244,114,182,0.3)] max-w-sm md:max-w-lg pointer-events-auto z-10 my-4">
            <h2 className="text-3xl md:text-6xl font-bold text-pink-400 mb-4 font-handwriting">
              Happy Birthday!
            </h2>
            <p className="text-gray-200 text-sm md:text-xl max-w-lg mx-auto">
              Semoga semua harapan (wish) yang kamu panjatkan tadi bisa terkabul. Terima kasih sudah jadi bagian terindah di hidup aku. I love you! ❤️
            </p>
          </div>

          {/* Mobile Polaroids (Stacked horizontally under the card or scrollable) */}
          <div className="flex md:hidden gap-3 overflow-x-auto w-full max-w-sm py-2 px-4 pointer-events-auto z-10 snap-x">
            <div className="polaroid-final shrink-0 bg-white p-2 pb-6 shadow-xl rotate-[-5deg] w-28 snap-center">
              <img src="/images/mine/11.WEBP" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 1" />
              <p className="text-center text-xs font-handwriting text-gray-600 mt-1">Our First Date</p>
            </div>
            <div className="polaroid-final shrink-0 bg-white p-2 pb-6 shadow-xl rotate-[4deg] w-28 snap-center">
              <img src="/images/mine/12.WEBP" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 2" />
              <p className="text-center text-xs font-handwriting text-gray-600 mt-1">Sayangku 🥰</p>
            </div>
            <div className="polaroid-final shrink-0 bg-white p-2 pb-6 shadow-xl rotate-[-3deg] w-28 snap-center">
              <img src="/images/mine/13.WEBP" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 3" />
              <p className="text-center text-xs font-handwriting text-gray-600 mt-1">Miss you</p>
            </div>
            <div className="polaroid-final shrink-0 bg-white p-2 pb-6 shadow-xl rotate-[6deg] w-28 snap-center">
              <img src="/images/mine/14.HEIC" className="w-full aspect-square object-cover bg-gray-200" alt="Memori 4" />
              <p className="text-center text-xs font-handwriting text-gray-600 mt-1">Always You</p>
            </div>
          </div>

        </div>
      )}

    </section>
  )
}