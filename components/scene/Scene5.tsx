"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

export default function Scene5() {
  const correctOrder = Array.from({ length: 16 }, (_, i) => i)
  
  const [pieces, setPieces] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isSolved, setIsSolved] = useState(false)

  const containerRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)

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
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handlePieceClick = (index) => {
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

  const getBackgroundStyle = (pieceId) => {
    const row = Math.floor(pieceId / 4)
    const col = pieceId % 4
    return {
      backgroundImage: `url('/images/mine/puzzle.jpeg')`, // Pastikan foto ada di folder public
      backgroundSize: '400% 400%',
      backgroundPosition: `${(col * 100) / 3}% ${(row * 100) / 3}%`,
    }
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6f0] px-6 py-12 overflow-hidden"
    >
      <h2 className="animate-title text-3xl md:text-5xl font-bold text-pink-500 mb-12 drop-shadow-sm text-center">
        Our Symphony 🎶
      </h2>

      {/* Grid Layout 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full items-center">
        
        {/* Kolom Kiri: YouTube & Deskripsi */}
        <div ref={leftColRef} className="flex flex-col gap-6">
          <div className="bg-[#efe7de] p-6 rounded-[2.5rem] shadow-xl border-4 border-white">
            <p className="text-gray-700 text-lg font-medium mb-4 leading-relaxed">
              "Awalnya kita dengerin lagu ini... sambil pasang puzzle memori kita. Coba susun fotonya yuk sambil dengerin lagunya!" ✨
            </p>
            
            {/* YouTube Embed yang Responsive */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-pink-200">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/V6cQ4LyvOgg?rel=0" // rel=0 agar rekomendasi di akhir video lebih sedikit
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Puzzle */}
        <div ref={rightColRef} className="flex flex-col items-center justify-center relative">
          <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 relative">
            <div 
              className={`grid grid-cols-4 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] ${
                isSolved ? "gap-0" : "gap-1"
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
    </section>
  )
}