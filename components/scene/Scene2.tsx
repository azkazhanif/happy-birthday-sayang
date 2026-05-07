"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSceneContext } from "@/contexts/SceneContext"
import { meowScript, poppins } from "@/lib/font"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FLOATING_HEARTS = 8

const Scene2 = () => {
  const { unlockScene, isSceneUnlocked } = useSceneContext()
  const [showModal, setShowModal] = useState(false)
  const [input, setInput] = useState("")
  const [attempt, setAttempt] = useState(0)
  const [feedback, setFeedback] = useState({ emoji: "😊", text: "" })
  const [isUnlocked, setIsUnlocked] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const photoMainRef = useRef<HTMLDivElement>(null)
  const photoStack1Ref = useRef<HTMLDivElement>(null)
  const photoStack2Ref = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const letterRef = useRef<HTMLParagraphElement>(null)
  const giftBtnRef = useRef<HTMLButtonElement>(null)
  const lockIndicatorRef = useRef<HTMLDivElement>(null)
  const unlockIndicatorRef = useRef<HTMLDivElement>(null)
  const floatingHeartsRef = useRef<(HTMLSpanElement | null)[]>([])
  const modalRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const modalAnimRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (isSceneUnlocked(2)) {
      setIsUnlocked(true)
    }
  }, [isSceneUnlocked])

  useEffect(() => {
    if (!isUnlocked) return

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      const scene = containerRef.current
      if (!scene) return
      const rect = scene.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      if (isInView) {
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", handleScroll, { passive: false })
    window.addEventListener("touchmove", handleScroll, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("touchmove", handleScroll)
    }
  }, [isUnlocked])

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      })

      // Initial hidden states
      gsap.set(photoMainRef.current, { y: 60, opacity: 0, rotation: -2, scale: 0.9 })
      gsap.set(photoStack1Ref.current, { y: -20, opacity: 0, scale: 0.8 })
      gsap.set(photoStack2Ref.current, { y: -20, opacity: 0, scale: 0.8 })

      if (headingRef.current) {
        gsap.set(headingRef.current.querySelectorAll(".heading-char"), { y: 40, opacity: 0, rotation: () => (Math.random() - 0.5) * 30 })
      }
      gsap.set(letterRef.current, { y: 40, opacity: 0 })
      gsap.set(giftBtnRef.current, { y: 20, opacity: 0, scale: 0.8 })
      gsap.set(floatingHeartsRef.current.filter(Boolean), { opacity: 0, scale: 0, y: 0 })
      gsap.set(lockIndicatorRef.current, { opacity: 0, y: 10 })
      gsap.set(unlockIndicatorRef.current, { opacity: 0, y: 10 })

      // 1. Main photo rises up
      tl.to(photoMainRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: -2,
        duration: 0.8,
        ease: "back.out(1.4)",
      }, 0)

      // 2. Stacked photos fly in
      tl.to(photoStack1Ref.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      }, 0.3)

      tl.to(photoStack2Ref.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      }, 0.5)

      // 3. Heading characters bounce in
      if (headingRef.current) {
        tl.to(headingRef.current.querySelectorAll(".heading-char"), {
          y: 0,
          opacity: 1,
          rotation: 0,
          stagger: { each: 0.04, from: "start" },
          duration: 0.5,
          ease: "back.out(2.5)",
        }, 0.4)
      }

      // 4. Letter fades up
      tl.to(letterRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      }, 0.7)

      // 5. Gift button pops in
      tl.to(giftBtnRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(3)",
      }, 0.9)

      // 6. Lock/unlock indicator
      const indicator = isUnlocked ? unlockIndicatorRef.current : lockIndicatorRef.current
      tl.to(indicator, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 1.1)

      // 7. Floating hearts continuous animation
      floatingHeartsRef.current.filter(Boolean).forEach((el, i) => {
        const delay = 1.0 + i * 0.2
        gsap.to(el, {
          opacity: 0.6,
          scale: 1,
          duration: 0.5,
          delay,
          ease: "back.out(2)",
        })
        gsap.to(el, {
          y: -(150 + Math.random() * 200),
          x: (Math.random() - 0.5) * 80,
          opacity: 0,
          duration: 3 + Math.random() * 2,
          delay: delay + 0.3,
          ease: "power1.out",
          repeat: -1,
          repeatDelay: 0.3,
          onRepeat() {
            gsap.set(el, { y: 0, x: 0, opacity: 0.6, scale: 1 })
          },
        })
        gsap.to(el, {
          rotation: (Math.random() - 0.5) * 50,
          duration: 2.5,
          delay,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      })

      // 8. Gift button pulse loop
      gsap.to(giftBtnRef.current, {
        scale: 1.06,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      })

      // 9. Parallax on scroll
      gsap.to(photoMainRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isUnlocked])

  const openModal = useCallback(() => {
    setShowModal(true)
    setInput("")
    setAttempt(0)
    setFeedback({ emoji: "😊", text: "" })
  }, [])

  useEffect(() => {
    if (!showModal) return

    // Animate modal in with GSAP
    const overlay = document.querySelector(".modal-overlay")
    const content = modalContentRef.current

    if (overlay && content) {
      gsap.set(overlay, { opacity: 0 })
      gsap.set(content, { scale: 0.7, opacity: 0, y: 30 })

      const tl = gsap.timeline()
      tl.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
      tl.to(content, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.15")

      modalAnimRef.current = tl
    }

    return () => {
      modalAnimRef.current?.kill()
    }
  }, [showModal])

  const closeModal = useCallback(() => {
    const overlay = document.querySelector(".modal-overlay")
    const content = modalContentRef.current

    if (overlay && content) {
      const tl = gsap.timeline({
        onComplete: () => setShowModal(false),
      })
      tl.to(content, { scale: 0.8, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      tl.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.15")

      modalAnimRef.current = tl
    } else {
      setShowModal(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim().toLowerCase() === "azka zufar hanif") {
      setFeedback({ emoji: "😍", text: "Benar! Ini dari Azka 💖" })
      setIsUnlocked(true)
      unlockScene(2)

      // Celebration burst animation
      if (modalContentRef.current) {
        gsap.to(modalContentRef.current, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        })
      }
    } else {
      const feedbacks = [
        { emoji: "🙂", text: "Salah, coba lagi ya!" },
        { emoji: "😠", text: "Yah, salah lagi..." },
        { emoji: "😡", text: "Sayang masa lupa aku 😡\nah udahlah kamu lupa nama lengkap aku" },
      ]
      setFeedback(feedbacks[Math.min(attempt, 2)])
      setAttempt(attempt + 1)

      // Shake animation on wrong answer
      if (modalContentRef.current) {
        gsap.to(modalContentRef.current, {
          x: [-8, 8, -6, 6, -3, 3, 0],
          duration: 0.5,
          ease: "power2.out",
        })
      }
    }
  }

  const splitHeadingChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="heading-char inline-block"
        style={{ whiteSpace: char === " " ? "pre" : undefined }}
      >
        {char}
      </span>
    ))

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        background:
          "linear-gradient(160deg, #fff5f7 0%, #fce7f3 30%, #fbcfe8 60%, #f9a8d4 100%)",
      }}
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: FLOATING_HEARTS }).map((_, i) => {
          const xBase = 5 + Math.random() * 90
          const yBase = 60 + Math.random() * 30
          const size = 14 + Math.random() * 12
          return (
            <span
              key={`fh-${i}`}
              ref={(el) => { floatingHeartsRef.current[i] = el }}
              className="absolute text-pink-300/60 pointer-events-none select-none"
              style={{
                left: `${xBase}%`,
                top: `${yBase}%`,
                fontSize: `${size}px`,
              }}
            >
              &#10084;
            </span>
          )
        })}
      </div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Photo section */}
        <div className="relative flex-shrink-0">
          {/* Main photo */}
          <div ref={photoMainRef} className="relative z-10" style={{ opacity: 0 }}>
            <div className="bg-white p-2.5 rounded-xl shadow-2xl hover:shadow-pink-200/60 transition-shadow duration-300">
              <Image
                src="/images/mine/1.jpeg"
                alt="ours"
                width={320}
                height={320}
                className="rounded-lg object-cover"
              />
            </div>
          </div>

          {/* Stacked photo 1 */}
          <div
            ref={photoStack1Ref}
            className="absolute -bottom-10 -left-12 z-20"
            style={{ opacity: 0, transform: "rotate(6deg)" }}
          >
            <div className="bg-white p-1.5 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1">
              <Image
                src="/images/mine/2.jpeg"
                alt="ours"
                width={120}
                height={120}
                className="rounded object-cover"
              />
            </div>
          </div>

          {/* Stacked photo 2 */}
          <div
            ref={photoStack2Ref}
            className="absolute -bottom-8 -right-10 z-20"
            style={{ opacity: 0, transform: "rotate(-8deg)" }}
          >
            <div className="bg-white p-1.5 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1">
              <Image
                src="/images/mine/3.jpeg"
                alt="ours"
                width={120}
                height={120}
                className="rounded object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text section */}
        <div className="flex flex-col items-start">
          <h2
            ref={headingRef}
            className={`text-3xl md:text-4xl font-bold text-pink-600 mb-4 ${meowScript.className}`}
          >
            {splitHeadingChars("Dear Sayangku,")}
          </h2>
          <p
            ref={letterRef}
            className={`text-pink-700 leading-relaxed text-base md:text-lg ${poppins.className}`}
            style={{ opacity: 0 }}
          >
            Cieeee ulang tahun!!! Barakallah fii umrik sayang gak kerasa ya udah
            24 tahun kamu... Apa doamu tahun ini? Doa dari aku semoga semua
            impianmu tercapai dan selalu bahagia. Jangan lupa berbakti selalu
            kepada orang tua dan selalu tetap bahagia apapun keadaannya karena
            masih banyak alasan yang patut kamu syukuri seperti orang-orang yang
            mencintaimu, aku salah satunya. Semogaaa tahun ini jadi salah satu
            tahun terbaikmu. 💕
          </p>

          <button
            ref={giftBtnRef}
            className={`mt-8 px-7 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full shadow-lg hover:shadow-pink-300/50 transition-shadow font-semibold text-base cursor-pointer ${poppins.className}`}
            style={{ opacity: 0 }}
            onClick={openModal}
          >
            🎁 Coba klik aku!
          </button>
        </div>
      </div>

      {/* Lock indicator */}
      {!isUnlocked && (
        <div
          ref={lockIndicatorRef}
          className="mt-12 flex items-center gap-2 text-pink-400/70 text-sm"
          style={{ opacity: 0 }}
        >
          <span>🔒</span>
          <span className={poppins.className}>Selesaikan dulu ya sayang, baru bisa lanjut~</span>
        </div>
      )}

      {/* Unlock success indicator */}
      {isUnlocked && (
        <div
          ref={unlockIndicatorRef}
          className="mt-12 flex items-center gap-2 text-pink-500 text-sm font-medium"
          style={{ opacity: 0 }}
        >
          <span>🔓</span>
          <span className={poppins.className}>Silahkan scroll ke bawah sayang~ 💕</span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalContentRef}
            className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center min-w-[320px] max-w-[400px] relative"
            style={{
              background: "linear-gradient(180deg, #fff 0%, #fff5f7 100%)",
            }}
          >
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer"
              onClick={closeModal}
              aria-label="Tutup"
            >
              ×
            </button>

            <div className="text-6xl mb-3">{feedback.emoji}</div>
            <div className={`mb-5 text-pink-600 font-semibold text-center min-h-6 whitespace-pre-line ${poppins.className}`}>
              {feedback.text}
            </div>

            {feedback.emoji !== "😍" ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-3 w-full"
              >
                <label htmlFor="nama" className={`text-gray-600 text-sm ${poppins.className}`}>
                  Kamu tau kan ini dari siapa? 🤔
                </label>
                <input
                  id="nama"
                  type="text"
                  placeholder="Ketik nama lengkap ya..."
                  className={`border-2 border-pink-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition text-center ${poppins.className}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className={`mt-1 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:shadow-lg transition-shadow font-medium cursor-pointer ${poppins.className}`}
                >
                  Jawab ✨
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className={`text-pink-500 text-sm mt-2 ${poppins.className}`}>
                  Sekarang kamu bisa scroll ke bawah~ 💕
                </p>
                <button
                  onClick={closeModal}
                  className={`mt-4 px-6 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition text-sm font-medium cursor-pointer ${poppins.className}`}
                >
                  Lanjut~ 🥰
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Scene2
