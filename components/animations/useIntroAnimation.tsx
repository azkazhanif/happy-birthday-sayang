"use client"

import { useEffect } from "react"
import gsap from "gsap"

export default function useIntroAnimation(ref: any) {
  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // ⭐ STAR JATUH + ROTATE
      tl.to(".star", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotate: 360,
        duration: 1.2,
        ease: "power2.out",
      })

      // ⭐ ZOOM IN JADI FULL SCREEN
      tl.to(".star", {
        scale: 50,
        duration: 1.5,
        ease: "power2.inOut",
      })

      // ❤️ HEART MUNCUL + FLOAT
      tl.to(".heart", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
      }, "-=0.5")

      // ❤️ FLOATING WAVY LOOP
      gsap.to(".heart", {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // 📝 TEXT SLIDE UP
      tl.to(".title", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      })

      // 🖱 SCROLL INDICATOR
      tl.to(".scroll-indicator", {
        opacity: 1,
        y: 0,
        duration: 1,
      })
    }, ref)

    return () => ctx.revert()
  }, [ref])
}