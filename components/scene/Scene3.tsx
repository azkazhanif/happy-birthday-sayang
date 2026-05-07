"use client"

import { useEffect, useRef } from "react"
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

export default function Scene3() {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.from(itemsRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 80,
      rotate: 10,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-linear-to-b from-pink-100 via-[#f5e6dc] to-[#e8d5c4] relative"
    >
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-3 grid-rows-3 gap-8">
          {/* Polaroid kiri atas */}
          <div
            ref={el => { itemsRef.current[0] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform -rotate-6 flex items-center justify-center"
          >
            <Image src={photos[0]} alt="memory-0" width={200} height={200} className="rounded-sm object-cover" />
          </div>
          {/* Polaroid atas tengah */}
          <div
            ref={el => { itemsRef.current[1] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform rotate-4 flex items-center justify-center"
          >
            <Image src={photos[1]} alt="memory-1" width={200} height={200} className="rounded-sm object-cover" />
          </div>
          {/* Polaroid kanan atas */}
          <div
            ref={el => { itemsRef.current[2] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform -rotate-3 flex items-center justify-center"
          >
            <Image src={photos[2]} alt="memory-2" width={200} height={200} className="rounded-sm object-cover" />
          </div>

          {/* Polaroid kiri tengah */}
          <div
            ref={el => { itemsRef.current[3] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform rotate-6 flex items-center justify-center"
          >
            <Image src={photos[3]} alt="memory-3" width={200} height={200} className="rounded-sm object-cover" />
          </div>

          {/* Teks di tengah */}
          <div className="flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-pink-500 drop-shadow-lg animate-fade-in text-center">cantiknya cewekuuu</h2>
          </div>

          {/* Polaroid kanan tengah */}
          <div
            ref={el => { itemsRef.current[4] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform -rotate-4 flex items-center justify-center"
          >
            <Image src={photos[4]} alt="memory-4" width={200} height={200} className="rounded-sm object-cover" />
          </div>

          {/* Polaroid kiri bawah */}
          <div className="bg-transparent" />
          {/* Polaroid bawah tengah */}
          <div
            ref={el => { itemsRef.current[5] = el }}
            className="bg-white p-3 pb-6 rounded-md shadow-xl transform rotate-3 flex items-center justify-center"
          >
            <Image src={photos[5]} alt="memory-5" width={200} height={200} className="rounded-sm object-cover" />
          </div>
          {/* Polaroid kanan bawah */}
          <div className="bg-transparent" />
        </div>
      </div>
    </section>
  )
}