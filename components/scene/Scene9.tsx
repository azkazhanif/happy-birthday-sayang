"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

// Register plugin untuk efek ngetik
gsap.registerPlugin(TextPlugin)

export default function Scene9() {
  const containerRef = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline GSAP biar animasinya jalan berurutan
      const tl = gsap.timeline()

      // 1. Teks Eyang Habibie muncul pelan-pelan (Fade in + slide up)
      tl.from(text1Ref.current, {
        opacity: 0,
        y: 20,
        duration: 2,
        ease: "power2.out",
        delay: 0.5
      })

      // 2. Efek ngetik (Typewriter) untuk kalimat bersyukur
      tl.to(text2Ref.current, {
        text: "Tapi yang pasti... aku bersyukur banget punya kamu. Doain aja kita bisa ketemu secepatnya ya, sayanggg. Aku sangat sayang kamu.",
        duration: 5, // Durasi ngetik (dibikin agak lambat biar dibaca pelan-pelan)
        ease: "none",
      }, "+=1") // Jeda 1 detik setelah teks pertama muncul

      // 3. Kalimat penutup muncul (Fade in)
      tl.fromTo(text3Ref.current, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        "+=1" // Jeda 1 detik setelah efek ngetik selesai
      )
      
      // 4. Background Bintang/Partikel animasi melayang
      gsap.to(".particle", {
        y: "-=100",
        opacity: 0,
        duration: "random(2, 5)",
        repeat: -1,
        yoyo: false,
        stagger: { amount: 2, from: "random" },
        ease: "power1.inOut"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Bikin array untuk partikel bintang di background
  const particles = Array.from({ length: 30 })

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-6 py-20 relative overflow-hidden"
    >
      {/* Background Particles (Bintang-bintang) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-pink-200/40"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="z-10 max-w-2xl w-full text-center flex flex-col items-center gap-10">
        
        {/* Teks 1: Quotes Habibie */}
        <div ref={text1Ref} className="opacity-0">
          <p className="text-gray-400 font-medium text-lg md:text-xl italic font-serif leading-relaxed px-4">
            "Alasan aku sayang kamu? Kata Eyang Habibie, cinta itu nggak harus ada alasan..."
          </p>
        </div>

        {/* Teks 2: Ketik Otomatis */}
        <div className="min-h-25 md:min-h-20"> {/* Min-height biar layout ga lompat pas ngetik */}
          <p ref={text2Ref} className="text-pink-100 font-medium text-xl md:text-2xl leading-relaxed">
            {/* Teks akan diisi oleh GSAP TextPlugin */}
          </p>
        </div>

        {/* Teks 3: Penutup & Harapan */}
        <div ref={text3Ref} className="opacity-0 mt-8 p-6 md:p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl">
          <p className="text-pink-400 font-bold text-2xl md:text-3xl font-handwriting mb-4">
            Please, still be my girlfriend...
          </p>
          <p className="text-gray-300 font-medium text-lg">
            ...for me to survive with our shit world yaa. 🌍❤️
          </p>
        </div>

      </div>
    </section>
  )
}