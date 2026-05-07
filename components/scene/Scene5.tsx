"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

const BACKGROUND_ITEMS = ["🎶", "🎵", "✨", "💕", "💖", "🎹"]

export default function Scene5() {
  const correctOrder = Array.from({ length: 16 }, (_, i) => i)

  const [pieces, setPieces] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isSolved, setIsSolved] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const puzzleWrapperRef = useRef<HTMLDivElement>(null)
  const bgItemsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    // Acak puzzle saat pertama kali dimuat
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5)
    setPieces(shuffled)

    const ctx = gsap.context(() => {
      // Animasi Judul
      gsap.from(".animate-title", { y: -30, opacity: 0, duration: 1, ease: "back.out" })

      // Animasi Kolom Kiri (YouTube) masuk dari kiri
      gsap.from(leftColRef.current, {
        x: -100, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out"
      })

      // Animasi Kolom Kanan (Puzzle) masuk dari kanan
      gsap.from(rightColRef.current, {
        x: 100, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out"
      })

      // 2D Background Animation Floating Items
      bgItemsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.to(el, {
          y: "-=100",
          x: (Math.random() - 0.5) * 50,
          rotation: (Math.random() - 0.5) * 100,
          duration: 3 + Math.random() * 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Cursor Love Trail Effect
  useEffect(() => {
    let lastTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < 40) return // Throttle
      lastTime = now

      const heart = document.createElement("span")
      const isLove = Math.random() > 0.5
      heart.innerText = isLove ? "💕" : "💖"
      heart.style.position = "fixed"
      heart.style.left = `${e.clientX - 10}px`
      heart.style.top = `${e.clientY - 10}px`
      heart.style.fontSize = `${Math.random() * 10 + 15}px`
      heart.style.pointerEvents = "none"
      heart.style.zIndex = "50"
      document.body.appendChild(heart)

      gsap.to(heart, {
        y: "-=60",
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 1.5,
        rotation: (Math.random() - 0.5) * 60,
        duration: 1 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => {
          heart.remove()
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Efek 3D Tilt saat puzzle di-hover
  const handlePuzzleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!puzzleWrapperRef.current) return
    const rect = puzzleWrapperRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(puzzleWrapperRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.4,
      ease: "power2.out"
    })
  }

  const handlePuzzleMouseLeave = () => {
    if (!puzzleWrapperRef.current) return
    gsap.to(puzzleWrapperRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)"
    })
  }

  const handlePieceClick = (index: number) => {
    if (isSolved) return

    if (selectedIndex === null) {
      setSelectedIndex(index)
    } else {
      const newPieces = [...pieces]
      const temp = newPieces[selectedIndex]
      newPieces[selectedIndex] = newPieces[index]
      newPieces[index] = temp

      setPieces(newPieces)
      setSelectedIndex(null)

      // Cek apakah sudah selesai
      if (newPieces.every((val, i) => val === correctOrder[i])) {
        setIsSolved(true)
        gsap.to(".puzzle-piece", {
          scale: 1, borderRadius: "0px", duration: 0.5, stagger: 0.05, ease: "power2.out"
        })
        gsap.fromTo(".success-message",
          { scale: 0, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, delay: 1, ease: "elastic.out(1, 0.5)" }
        )
      }
    }
  }

  const getBackgroundStyle = (pieceId: number) => {
    const row = Math.floor(pieceId / 4)
    const col = pieceId % 4
    return {
      backgroundImage: `url('/images/mine/puzzle.jpeg')`,
      backgroundSize: '400% 400%',
      backgroundPosition: `${(col * 100) / 3}% ${(row * 100) / 3}%`,
    }
  }

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6f0] px-6 py-12 overflow-hidden relative"
    >
      {/* 2D Background Animations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={`bg-${i}`}
            ref={(el) => { bgItemsRef.current[i] = el }}
            className="absolute text-pink-300/40 opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
            }}
          >
            {BACKGROUND_ITEMS[i % BACKGROUND_ITEMS.length]}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="animate-title text-3xl md:text-5xl font-bold text-pink-500 mb-12 drop-shadow-sm text-center">
          Our Symphony 🎶
        </h2>

        {/* Grid Layout 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full items-center">

          {/* Kolom Kiri: YouTube & Deskripsi */}
          <div ref={leftColRef} className="flex flex-col gap-6">
            <div className="bg-[#efe7de]/90 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl border-4 border-white transition-all hover:shadow-2xl">
              <p className="text-gray-700 text-lg font-medium mb-4 leading-relaxed">
                "Awalnya kamu kasih tau tentang lagu ini, eh kok enak jadi lagu favoritku juga lagi. Coba susun fotonya yuk sambil dengerin lagunya!" ✨
              </p>

              {/* YouTube Embed yang Responsive */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-pink-200">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/V6cQ4LyvOgg?rel=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Puzzle */}
          <div ref={rightColRef} className="flex flex-col items-center justify-center relative" style={{ perspective: "1000px" }}>
            <div
              ref={puzzleWrapperRef}
              onMouseMove={handlePuzzleMouseMove}
              onMouseLeave={handlePuzzleMouseLeave}
              className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`grid grid-cols-4 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] ${isSolved ? "gap-0" : "gap-1"
                  } transition-all duration-500`}
              >
                {pieces.map((pieceId, index) => (
                  <div
                    key={index}
                    onClick={() => handlePieceClick(index)}
                    style={getBackgroundStyle(pieceId)}
                    className={`
                      puzzle-piece w-full h-full cursor-pointer transition-all duration-300
                      ${isSolved ? "rounded-none border-none" : "rounded-lg border border-white/50 shadow-xs hover:scale-95"}
                      ${selectedIndex === index ? "ring-4 ring-pink-400 scale-90 opacity-80 z-10" : ""}
                    `}
                  />
                ))}
              </div>

              {/* Pesan Sukses - Muncul menimpa puzzle saat selesai */}
              {isSolved && (
                <div className="success-message absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-[2.5rem] z-20">
                  <div className="bg-white px-8 py-5 rounded-3xl shadow-2xl border-2 border-pink-200 text-center transform rotate-2">
                    <p className="text-pink-500 font-bold text-2xl mb-1">Perfect! 🥰</p>
                    <p className="text-gray-600 font-medium">You put the pieces together.</p>
                  </div>
                </div>
              )}
            </div>

            {!isSolved && (
              <p className="text-gray-500 text-sm mt-6 font-medium animate-pulse">
                *Klik kepingan pertama, lalu klik kepingan kedua untuk menukar posisi
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}