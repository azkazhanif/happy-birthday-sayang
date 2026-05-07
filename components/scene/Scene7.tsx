"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import gsap from "gsap"
import * as THREE from "three"

// --- Komponen 3D Gift Box ---
function GiftBox3D({ onOpenLetter }) {
  const lidRef = useRef()
  const letterRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenBox = () => {
    if (isOpen) return
    setIsOpen(true)

    // Animasi GSAP untuk membuka tutup kotak kado
    gsap.to(lidRef.current.position, { y: 2.5, x: 1, duration: 1, ease: "power3.out" })
    gsap.to(lidRef.current.rotation, { z: 0.5, x: 0.2, duration: 1, ease: "power3.out" })

    // Animasi Surat melayang keluar dari dalam kotak
    gsap.to(letterRef.current.position, { y: 1.2, duration: 1.5, delay: 0.5, ease: "back.out(1.2)" })
    gsap.to(letterRef.current.rotation, { y: Math.PI * 2, duration: 2, delay: 0.5, ease: "power2.out" })
  }

  return (
    <group position={[0, -1, 0]}>
      {/* Kotak Bagian Bawah */}
      <mesh castShadow receiveShadow onClick={handleOpenBox} className="cursor-pointer">
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Pita di Kotak */}
      <mesh position={[0, 0, 1.01]}>
        <planeGeometry args={[0.3, 2]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0, 0, -1.01]}>
        <planeGeometry args={[0.3, 2]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Tutup Kotak */}
      <mesh ref={lidRef} position={[0, 1.1, 0]} castShadow onClick={handleOpenBox}>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.1} />
        {/* Pita di Tutup */}
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.3, 2.2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </mesh>

      {/* Kertas Surat (Awalnya tersembunyi di dalam kotak, y: 0) */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          ref={letterRef} 
          position={[0, 0, 0]} 
          onClick={(e) => {
            e.stopPropagation() // Biar kliknya gak tembus ke kotak
            if (isOpen) onOpenLetter()
          }}
        >
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#fffcf2" side={THREE.DoubleSide} />
          {/* Teks 3D di Kertas (Pake HTML Drei biar gampang) */}
          <Html position={[0, 0, 0.01]} transform distanceFactor={1.2}>
            <div className="w-[150px] text-center font-handwriting text-pink-500 font-bold text-sm cursor-pointer hover:scale-105 transition-transform">
              Click Me 💌
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  )
}

// --- Main Scene 7 Component ---
export default function Scene7() {
  const [showGreeting, setShowGreeting] = useState(false)
  const greetingRef = useRef(null)

  useEffect(() => {
    if (showGreeting) {
      gsap.fromTo(
        greetingRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
      )
    }
  }, [showGreeting])

  return (
    <section className="min-h-screen w-full relative bg-linear-to-b from-[#fdf6f0] to-[#f4dbe0] overflow-hidden">
      
      {/* 3D Canvas Fullscreen */}
      <div className="absolute inset-0 z-0 cursor-pointer">
        <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <Environment preset="city" /> {/* Bikin pencahayaannya estetik */}
          
          <GiftBox3D onOpenLetter={() => setShowGreeting(true)} />
          
          {/* Bisa diputar-putar pakai mouse/touch */}
          <OrbitControls 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2 + 0.1} 
            minPolarAngle={Math.PI / 4} 
          />
        </Canvas>
      </div>

      {/* Petunjuk UI (Hilang kalau surat udah dibuka) */}
      {!showGreeting && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
          <h2 className="text-3xl font-bold text-pink-500 mb-2 drop-shadow-md animate-bounce">
            I have a present for you 🎁
          </h2>
          <p className="text-gray-600 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
            Putar layarnya dan klik kotaknya!
          </p>
        </div>
      )}

      {/* UI Surat Ucapan HTML (Muncul menimpa 3D saat kertas diklik) */}
      {showGreeting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
          <div 
            ref={greetingRef}
            className="bg-[#fffdf9] p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full border border-[#e2d3c3] relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
          >
            {/* Tombol Close */}
            <button 
              onClick={() => setShowGreeting(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-3xl font-bold text-pink-500 mb-6 font-handwriting text-center">
              Happy Anniversary / Birthday! 🎉
            </h3>
            
            <div className="space-y-4 text-gray-700 font-medium leading-relaxed">
              <p>
                Hai sayangku,
              </p>
              <p>
                Makasih ya udah main game kecil-kecilan ini. Semoga kamu suka sama kejutannya. Perjalanan kita dari awal ketemu sampai sekarang itu luar biasa banget.
              </p>
              <p>
                Maaf ya kalau aku kadang ngeselin, tapi ketahuilah kalau kamu itu salah satu hal terbaik yang pernah terjadi di hidup aku.
              </p>
              <p>
                I love you more than words can say. 🥰
              </p>
            </div>

            <div className="mt-8 text-right text-pink-400 font-bold font-handwriting text-xl">
              - Cowokmu yang paling ganteng
            </div>
          </div>
        </div>
      )}

    </section>
  )
}