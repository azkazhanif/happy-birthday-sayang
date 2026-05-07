"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

const photos = [
  "/images/mine/2.jpeg",
  "/images/mine/3.jpeg",
  "/images/mine/4.jpeg",
  "/images/mine/5.jpeg",
  "/images/mine/6.jpeg",
  "/images/mine/7.jpeg",
]

const rotations = [-6, 4, -3, 6, -4, 3]

export default function Scene3() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const sparkleRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const animFrameRef = useRef<number>(0)

  // Sparkle particle system
  useEffect(() => {
    const canvas = sparkleRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener("resize", resize)

    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      fadeDir: number
      hue: number
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 0.8 - 0.2,
      opacity: Math.random(),
      fadeDir: Math.random() > 0.5 ? 0.005 : -0.005,
      hue: Math.random() * 60 + 330,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.fadeDir
        if (p.opacity <= 0 || p.opacity >= 1) p.fadeDir *= -1
        if (p.y < -10) p.y = canvas.height + 10
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        // Core sparkle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity * 0.6})`
        ctx.fill()

        // Glow ring
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity * 0.12})`
        ctx.fill()
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Scroll-triggered animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Each polaroid flies in from a random off-screen direction
      itemsRef.current.forEach((el, i) => {
        if (!el) return
        const baseAngle = rotations[i]
        const startX = (i % 2 === 0 ? -1 : 1) * (100 + i * 30)
        const startY = 100 + i * 40
        gsap.fromTo(el,
          { opacity: 0, y: startY, x: startX, rotation: baseAngle + (Math.random() - 0.5) * 30, scale: 0.5 },
          {
            opacity: 1, y: 0, x: 0, rotation: baseAngle, scale: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "top 20%",
              scrub: 1,
            },
            ease: "power2.out",
          }
        )
      })

      // Title dramatic entrance
      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.2, y: 60, rotation: -3 },
        {
          opacity: 1, scale: 1, y: 0, rotation: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "top 25%",
            scrub: 1,
          },
          ease: "back.out(1.7)",
        }
      )

      // Subtle parallax
      gsap.to(gridRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // 3D tilt on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const el = itemsRef.current[idx]
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 25,
      rotateX: -y * 25,
      scale: 1.08,
      duration: 0.4,
      ease: "power2.out",
    })
  }, [])

  const handleMouseLeave = useCallback((idx: number) => {
    const el = itemsRef.current[idx]
    if (!el) return
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      rotation: rotations[idx],
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    })
    setHoveredIdx(null)
  }, [])

  // Lightbox animation
  useEffect(() => {
    if (lightbox !== null) {
      gsap.fromTo(".lightbox-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(".lightbox-img", { scale: 0.5, rotation: -5, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" })
    }
  }, [lightbox])

  const polaroid = (photoIdx: number, itemIdx: number) => (
    <div
      ref={el => { itemsRef.current[itemIdx] = el }}
      className="bg-white p-3 pb-6 rounded-md shadow-xl cursor-pointer transition-shadow duration-300 hover:shadow-2xl hover:shadow-pink-300/50"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={e => handleMouseMove(e, itemIdx)}
      onMouseLeave={() => handleMouseLeave(itemIdx)}
      onMouseEnter={() => setHoveredIdx(itemIdx)}
      onClick={() => setLightbox(itemIdx)}
    >
      <Image src={photos[photoIdx]} alt={`memory-${photoIdx}`} width={400} height={400} className="rounded-sm w-full h-auto pointer-events-none" />
    </div>
  )

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-linear-to-b from-pink-100 via-[#f5e6dc] to-[#e8d5c4] relative overflow-hidden"
    >
      {/* Sparkle canvas */}
      <canvas ref={sparkleRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-rose-200/40 rounded-full blur-2xl animate-pulse delay-700" />

      <div ref={gridRef} className="relative w-full max-w-5xl mx-auto z-20" style={{ perspective: "1000px" }}>
        <div className="grid grid-cols-3 grid-rows-3 gap-8">
          {/* Row 1 */}
          {polaroid(0, 0)}
          {polaroid(1, 1)}
          {polaroid(2, 2)}
          {/* Row 2 */}
          {polaroid(3, 3)}
          {/* Title center */}
          <div className="flex items-center justify-center">
            <h2
              ref={titleRef}
              className="text-3xl md:text-5xl font-bold text-pink-500 drop-shadow-lg text-center"
              style={{
                textShadow: hoveredIdx !== null
                  ? "0 0 20px rgba(236,72,153,0.4), 0 0 40px rgba(236,72,153,0.2)"
                  : undefined,
                transition: "text-shadow 0.3s ease",
              }}
            >
              cantiknya cewekuuu
            </h2>
          </div>
          {polaroid(4, 4)}
          {/* Row 3 */}
          <div className="bg-transparent" />
          {polaroid(5, 5)}
          <div className="bg-transparent" />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors text-xl font-bold z-10"
            >
              &times;
            </button>
            <div className="lightbox-img bg-white p-4 pb-8 rounded-md shadow-2xl max-w-md md:max-w-lg">
              <Image
                src={photos[lightbox]}
                alt={`memory-${lightbox}`}
                width={800}
                height={800}
                className="rounded-sm w-full h-auto"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setLightbox(lightbox > 0 ? lightbox - 1 : photos.length - 1)}
                className="px-4 py-2 bg-white/90 rounded-full shadow text-pink-500 hover:bg-pink-50 transition-colors font-medium"
              >
                &larr; Prev
              </button>
              <button
                onClick={() => setLightbox(lightbox < photos.length - 1 ? lightbox + 1 : 0)}
                className="px-4 py-2 bg-white/90 rounded-full shadow text-pink-500 hover:bg-pink-50 transition-colors font-medium"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
