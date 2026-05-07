"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useSceneContext } from "@/contexts/SceneContext"
import { poppins } from "@/lib/font"

export default function Scene4() {
  // State untuk masing-masing bagian tanggal
  const [datePart, setDatePart] = useState({ dd: "", mm: "", yyyy: "" })
  const [status, setStatus] = useState("idle") // 'idle' | 'error' | 'success'
  const [errorMessage, setErrorMessage] = useState("")
  const [showModal, setShowModal] = useState(false)

  const { unlockScene, isSceneUnlocked } = useSceneContext()
  const [isUnlocked, setIsUnlocked] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const inputCardRef = useRef<HTMLDivElement>(null)
  const lockIndicatorRef = useRef<HTMLDivElement>(null)
  const unlockIndicatorRef = useRef<HTMLDivElement>(null)

  // Refs untuk auto-focus input
  const mmRef = useRef<HTMLInputElement>(null)
  const yyyyRef = useRef<HTMLInputElement>(null)

  const correctDate = { dd: "08", mm: "09", yyyy: "2024" }

  useEffect(() => {
    if (isSceneUnlocked(4)) {
      setIsUnlocked(true)
      setStatus("success")
    }
  }, [isSceneUnlocked])

  useEffect(() => {
    if (isUnlocked) return

    const handleWheel = (e: WheelEvent) => {
      const scene = containerRef.current
      if (!scene) return
      const rect = scene.getBoundingClientRect()

      if (rect.bottom <= window.innerHeight + 10 && e.deltaY > 0) {
        e.preventDefault()
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const scene = containerRef.current
      if (!scene) return
      const rect = scene.getBoundingClientRect()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY

      if (rect.bottom <= window.innerHeight + 10 && deltaY > 0) {
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isUnlocked])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        }
      })

      tl.from(".animate-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)"
      })

      tl.from(imageWrapperRef.current, {
        x: -100,
        rotation: -10,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.6")

      tl.from(inputCardRef.current, {
        x: 100,
        rotation: 10,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1")

      gsap.to(".parallax-img", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "dd" | "mm" | "yyyy",
    nextRef: React.RefObject<HTMLInputElement | null> | null
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
    if (!datePart.dd || !datePart.mm || !datePart.yyyy || datePart.yyyy.length < 4) {
      setErrorMessage("Lengkapin dulu dong tanggalnya sayang... 🥺")
      setStatus("error")
      gsap.to(inputCardRef.current, {
        keyframes: [{ x: -10 }, { x: 10 }, { x: -10 }, { x: 10 }, { x: 0 }],
        duration: 0.4,
      })
      return
    }

    if (
      datePart.dd === correctDate.dd &&
      datePart.mm === correctDate.mm &&
      datePart.yyyy === correctDate.yyyy
    ) {
      setStatus("success")
      setIsUnlocked(true)
      setShowModal(true)
      unlockScene(4)
      gsap.to(".confetti-dummy", { opacity: 1, scale: 1.2, duration: 0.5 })
      gsap.fromTo(unlockIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" }
      )
    } else {
      setStatus("error")
      
      const inputDateStr = `${datePart.yyyy}-${datePart.mm}-${datePart.dd}`
      const correctDateStr = `${correctDate.yyyy}-${correctDate.mm}-${correctDate.dd}`
      const inputDate = new Date(inputDateStr)
      const targetDate = new Date(correctDateStr)

      if (isNaN(inputDate.getTime())) {
        setErrorMessage("Format tanggalnya ada yang salah nih sayang 🥺")
      } else if (inputDate < targetDate) {
        setErrorMessage("Ketuaan sayang tanggalnya, kejadiannya lebih baru dari itu loh. Masa kamu lupa sih 🥺")
      } else if (inputDate > targetDate) {
        setErrorMessage("Kecepetan sayang tanggalnya, kejadiannya lebih lama dari itu loh. Masa kamu lupa sih 🥺")
      } else {
        setErrorMessage("Masa kamu lupa sih sayang 🥺")
      }

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

        {/* Kolom Kiri: Image */}
        <div ref={imageWrapperRef} className="relative z-10 p-4 bg-white rounded-2xl shadow-xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
          <div className="overflow-hidden rounded-xl bg-gray-200 aspect-[4/5] relative">
            <Image
              src="/images/chat.jpeg"
              alt="Our moment"
              fill
              className="object-cover parallax-img scale-110"
            />
          </div>
          <div className={`text-center mt-4 text-pink-500 font-medium ${poppins.className}`}>
            Do you remember? 💕
          </div>
        </div>

        {/* Kolom Kanan: Input Card */}
        <div
          ref={inputCardRef}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-pink-100 flex flex-col items-center"
        >
          <p className="text-xl font-medium text-gray-600 text-center mb-8">Masukkan Tanggal Pertama Kita Chat WA:</p>

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
            <p className="text-red-500 mt-4 font-semibold animate-bounce text-center">
              {errorMessage}
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

      {/* Lock indicator */}
      {!isUnlocked && (
        <div
          ref={lockIndicatorRef}
          className="mt-12 flex items-center gap-2 text-pink-400/70 text-sm"
        >
          <span>🔒</span>
          <span className={poppins.className}>Inget-inget dulu ya sayang, baru bisa lanjut~</span>
        </div>
      )}

      {/* Unlock success indicator */}
      {isUnlocked && (
        <div
          ref={unlockIndicatorRef}
          className="mt-12 flex items-center gap-2 text-pink-500 text-sm font-medium"
        >
          <span>🔓</span>
          <span className={poppins.className}>Silahkan scroll ke bawah sayang~ 💕</span>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center relative transform scale-100 transition-transform">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-50"
            >
              ✕
            </button>
            <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden mb-6 mt-2 bg-gray-200">
              <Image 
                src="/images/mine/17.jpeg" 
                alt="Correct memory" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-pink-500 mb-2">PINTERRR! 🥰🎉</h3>
            <p className="text-gray-600 text-center mb-6">Kamu emang yang terbaik! Lanjut scroll ke bawah ya sayang~ 💕</p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
            >
              Lanjut 💕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}