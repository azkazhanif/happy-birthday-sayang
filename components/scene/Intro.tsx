"use client"

import { useRef } from "react"
import useIntroAnimation from "../animations/useIntroAnimation"

export default function Scene1Intro() {
  const containerRef = useRef<HTMLDivElement>(null)

  useIntroAnimation(containerRef)

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center"
    >
      {/* ⭐ STAR */}
      <img
        src="/icons/star.svg"
        className="star absolute w-32 h-32 -top-25"
        alt="star"
      />

      {/* ❤️ HEART */}
      <img
        src="/images/heart.jpeg"
        className="heart absolute w-3xl h-3xl opacity-0"
        alt="heart"
      />

      {/* TEXT */}
      <div className="text-center z-10">
        <h1 className="title text-4xl md:text-6xl font-bold opacity-0 text-pink-400">
          Happy ur day my girl ❤️
        </h1>

        <div className="mt-6 flex flex-col items-center opacity-0 scroll-indicator">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
          <p className="text-sm mt-2">Scroll for your experience</p>
        </div>
      </div>
    </section>
  )
}