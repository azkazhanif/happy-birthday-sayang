"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

export default function Scene4() {
  // State untuk masing-masing bagian tanggal
  const [datePart, setDatePart] = useState({ dd: "", mm: "", yyyy: "" })
  const [status, setStatus] = useState("idle") // 'idle' | 'error' | 'success'
  
  const containerRef = useRef(null)
  const chatRef = useRef(null)
  const inputCardRef = useRef(null)
  
  // Refs untuk auto-focus input
  const mmRef = useRef(null)
  const yyyyRef = useRef(null)

  const correctDate = { dd: "12", mm: "08", yyyy: "2022" }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi masuk barengan tapi beda arah
      gsap.from(".animate-title", { y: -30, opacity: 0, duration: 1, ease: "back.out" })
      
      gsap.from(chatRef.current, { 
        x: -100, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" 
      })
      
      gsap.from(inputCardRef.current, { 
        x: 100, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" 
      })

      gsap.from(".chat-bubble", {
        opacity: 0, scale: 0.5, x: -20, stagger: 0.3, delay: 0.8, ease: "back.out"
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "dd" | "mm" | "yyyy",
    nextRef: React.RefObject<HTMLInputElement> | null
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Hanya angka
    const maxLength = part === "yyyy" ? 4 : 2
    if (value.length <= maxLength) {
      setDatePart({ ...datePart, [part]: value })
      // Auto focus ke kolom berikutnya jika sudah penuh
      if (value.length === maxLength && nextRef) {
        nextRef.current?.focus()
      }
    }
  }

  const handleSubmit = () => {
    if (
      datePart.dd === correctDate.dd && 
      datePart.mm === correctDate.mm && 
      datePart.yyyy === correctDate.yyyy
    ) {
      setStatus("success")
      gsap.to(".confetti-dummy", { opacity: 1, scale: 1.2, duration: 0.5 })
    } else {
      setStatus("error")
      gsap.to(inputCardRef.current, {
        keyframes: [
          { x: -10 },
          { x: 10 },
          { x: -10 },
          { x: 10 },
          { x: 0 },
        ],
        duration: 0.4,
      })
    }
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6f0] px-6 py-12"
    >
      <h2 className="animate-title text-3xl md:text-5xl font-bold text-pink-500 mb-12">
        Our Special Moment ✨
      </h2>

      {/* Grid Cols 2 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full items-center">
        
        {/* Kolom Kiri: Chat Card */}
        <div ref={chatRef} className="bg-[#efe7de] p-6 rounded-[2.5rem] shadow-2xl border-4 border-white relative">
          <div className="bg-[#d9c7b5] rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white shadow-md">
              👧🏻
            </div>
            <span className="font-bold text-gray-800">My Lovely Girl</span>
          </div>

          <div className="space-y-4">
            <div className="chat-bubble bg-white p-3 rounded-2xl rounded-tl-none w-fit shadow-sm text-gray-700">
              "Hai, inget gak kita pertama chat kapan?" 💌
            </div>
            <div className="chat-bubble bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-none w-fit ml-auto shadow-sm text-gray-800">
              "Hmm, tanggal berapa yaaa..." 🤔
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Input Card */}
        <div 
          ref={inputCardRef}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-pink-100 flex flex-col items-center"
        >
          <p className="text-xl font-medium text-gray-600 mb-8">Masukkan Tanggal Jadian Kita:</p>
          
          {/* Input 2 Digit 2 Digit */}
          <div className="flex items-center gap-3 mb-8">
            <input
              type="text"
              placeholder="DD"
              value={datePart.dd}
              onChange={(e) => handleChange(e, "dd", mmRef)}
              className="w-16 h-16 text-2xl font-bold text-center border-3 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
            <span className="text-2xl text-pink-300 font-bold">/</span>
            <input
              ref={mmRef}
              type="text"
              placeholder="MM"
              value={datePart.mm}
              onChange={(e) => handleChange(e, "mm", yyyyRef)}
              className="w-16 h-16 text-2xl font-bold text-center border-3 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
            <span className="text-2xl text-pink-300 font-bold">/</span>
            <input
              ref={yyyyRef}
              type="text"
              placeholder="YYYY"
              value={datePart.yyyy}
              onChange={(e) => handleChange(e, "yyyy", null)}
              className="w-28 h-16 text-2xl font-bold text-center border-3 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all text-lg"
          >
            Check Memory 💖
          </button>

          {status === "error" && (
            <p className="text-red-500 mt-4 font-semibold animate-bounce">
              Oops! Salah dikit, coba inget lagi... 😋
            </p>
          )}

          {status === "success" && (
            <div className="mt-6 text-center animate-pulse">
              <p className="text-green-500 text-2xl font-bold">PINTERRR! 🥰🎉</p>
              <p className="text-gray-500 text-sm mt-1">Kamu emang yang terbaik!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}