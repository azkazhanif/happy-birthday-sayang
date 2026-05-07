"use client"

import { useEffect, useRef } from 'react'
import { meowScript } from '@/lib/font'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HEART_COUNT = 12
const INTRO_TEXT = 'Kamu ulang tahun ya!!'
const COLORS = ['#ff6b9d', '#c44dff', '#ff4d6d', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa']

const Scene1 = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const introOverlayRef = useRef<HTMLDivElement>(null)
  const introTextRef = useRef<HTMLDivElement>(null)
  const introSparklesRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLImageElement>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const leftHeartsRef = useRef<(HTMLSpanElement | null)[]>([])
  const rightHeartsRef = useRef<(HTMLSpanElement | null)[]>([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const introChars = introTextRef.current ? Array.from(introTextRef.current.querySelectorAll('.intro-char')) : []
    const chars1 = text1Ref.current ? Array.from(text1Ref.current.querySelectorAll('.char')) : []
    const chars2 = text2Ref.current ? Array.from(text2Ref.current.querySelectorAll('.char')) : []
    const sparkles = introSparklesRef.current ? Array.from(introSparklesRef.current.querySelectorAll('.sparkle')) : []

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Initial states
    gsap.set(introOverlayRef.current, { opacity: 1 })
    gsap.set(introChars, { opacity: 0, y: 40, scale: 0.3, rotation: () => (Math.random() - 0.5) * 60 })
    gsap.set(sparkles, { opacity: 0, scale: 0 })
    gsap.set(heartRef.current, { y: 80, opacity: 0, scale: 0.5 })
    gsap.set(chars1, { y: 60, opacity: 0 })
    gsap.set(chars2, { y: 60, opacity: 0 })
    gsap.set(scrollRef.current, { opacity: 0 })

    gsap.set(leftHeartsRef.current.filter(Boolean), { opacity: 0, scale: 0, y: 0 })
    gsap.set(rightHeartsRef.current.filter(Boolean), { opacity: 0, scale: 0, y: 0 })

    // 1. Intro text - characters pop in one by one with bounce from random positions
    tl.to(introChars, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      stagger: {
        each: 0.08,
        from: 'random',
      },
      duration: 0.5,
      ease: 'back.out(2.5)',
    }, 0.3)

    // 2. Sparkle particles burst around text as it appears
    tl.to(sparkles, {
      opacity: 1,
      scale: () => 0.5 + Math.random() * 1,
      stagger: 0.03,
      duration: 0.4,
      ease: 'back.out(3)',
    }, '-=1.2')

    // 3. Each character gets a rainbow color wave
    introChars?.forEach((char, i) => {
      tl.to(char, {
        color: COLORS[i % COLORS.length],
        textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
        duration: 0.3,
        ease: 'power2.out',
      }, 0.8 + i * 0.06)
    })

    // 4. Text pulses / breathes
    tl.to(introTextRef.current, {
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1,
    }, '-=0.3')

    // 5. Dramatic explosion - text flies apart in random directions
    introChars?.forEach((char) => {
      tl.to(char, {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        rotation: (Math.random() - 0.5) * 360,
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
      }, '<+=0.02')
    })

    // Sparkles explode outward
    tl.to(sparkles, {
      x: () => (Math.random() - 0.5) * 1200,
      y: () => (Math.random() - 0.5) * 800,
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
    }, '<')

    // 6. Intro overlay fades out
    tl.to(introOverlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    }, '-=0.2')

    // 7. Heart slides up
    tl.to(heartRef.current, {
      y: 0,
      opacity: 0.6,
      scale: 1,
      duration: 1.0,
      ease: 'back.out(1.2)',
    }, '-=0.3')

    // 8. Heart wiggle loop
    tl.to(heartRef.current, {
      rotation: 8,
      duration: 0.6,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    // 9. Text 1 - slide up per character
    tl.to(chars1, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.6,
      ease: 'back.out(1.4)',
    }, '-=0.8')

    // 10. Text 2 - slide up per character
    tl.to(chars2, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.6,
      ease: 'back.out(1.4)',
    })

    // 11. Floating heart particles - left side
    leftHeartsRef.current.filter(Boolean).forEach((el, i) => {
      const delay = 1.0 + i * 0.3
      gsap.to(el, {
        opacity: 0.7,
        scale: 1,
        duration: 0.6,
        delay,
        ease: 'back.out(2)',
      })
      gsap.to(el, {
        y: -(200 + Math.random() * 300),
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: 4 + Math.random() * 3,
        delay: delay + 0.5,
        ease: 'power1.out',
        repeat: -1,
        repeatDelay: 0.5,
        onRepeat() {
          gsap.set(el, { y: 0, x: 0, opacity: 0.7, scale: 1 })
        },
      })
      gsap.to(el, {
        rotation: (Math.random() - 0.5) * 40,
        duration: 3,
        delay,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    // 12. Floating heart particles - right side
    rightHeartsRef.current.filter(Boolean).forEach((el, i) => {
      const delay = 1.2 + i * 0.3
      gsap.to(el, {
        opacity: 0.7,
        scale: 1,
        duration: 0.6,
        delay,
        ease: 'back.out(2)',
      })
      gsap.to(el, {
        y: -(200 + Math.random() * 300),
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: 4 + Math.random() * 3,
        delay: delay + 0.5,
        ease: 'power1.out',
        repeat: -1,
        repeatDelay: 0.5,
        onRepeat() {
          gsap.set(el, { y: 0, x: 0, opacity: 0.7, scale: 1 })
        },
      })
      gsap.to(el, {
        rotation: (Math.random() - 0.5) * 40,
        duration: 3,
        delay,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    // 13. Scroll indicator fades in
    tl.to(scrollRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.2')

    // 14. Parallax scroll effect
    tl.call(() => {
      gsap.to(heartRef.current, {
        y: -window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(contentRef.current, {
        y: -window.innerHeight * 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(scrollRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '10% top',
          scrub: true,
        },
      })
    }, [], '-=0.1')

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const splitChars = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}>
        {char}
      </span>
    ))

  const heartParticles = (
    side: 'left' | 'right',
    refArr: React.MutableRefObject<(HTMLSpanElement | null)[]>
  ) => {
    const hearts = Array.from({ length: HEART_COUNT })
    const sizes = [16, 20, 14, 18, 22, 12, 16, 20, 14, 18, 12, 22]

    return hearts.map((_, i) => {
      const yBase = 20 + (i / HEART_COUNT) * 80
      const xBase = side === 'left'
        ? 3 + Math.random() * 8
        : 89 + Math.random() * 8

      return (
        <span
          key={`${side}-${i}`}
          ref={(el) => { refArr.current[i] = el }}
          className="absolute text-pink-400 pointer-events-none select-none"
          style={{
            left: `${xBase}%`,
            top: `${yBase}%`,
            fontSize: `${sizes[i]}px`,
          }}
        >
          &#10084;
        </span>
      )
    })
  }

  const introSplitChars = INTRO_TEXT.split('').map((char, i) => (
    <span
      key={i}
      className="intro-char inline-block"
      style={{
        whiteSpace: char === ' ' ? 'pre' : undefined,
        color: '#fff',
      }}
    >
      {char}
    </span>
  ))

  const sparklePositions = Array.from({ length: 20 }).map((_, i) => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 4 + Math.random() * 12,
  }))

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center relative bg-radial from-white from-40% to-pink-200 overflow-hidden">

      {/* Intro overlay */}
      <div ref={introOverlayRef} className="fixed inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 z-50 pointer-events-none flex items-center justify-center">
        <div ref={introTextRef} className={`text-5xl md:text-8xl font-bold ${meowScript.className} relative`}>
          {introSplitChars}
        </div>

        {/* Sparkle particles */}
        <div ref={introSparklesRef} className="absolute inset-0 pointer-events-none">
          {sparklePositions.map((s, i) => (
            <span
              key={i}
              className="sparkle absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: COLORS[i % COLORS.length],
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Heart particles - left */}
      {heartParticles('left', leftHeartsRef)}

      {/* Heart particles - right */}
      {heartParticles('right', rightHeartsRef)}

      {/* Heart image */}
      <Image
        ref={heartRef}
        src="/images/heart.png"
        alt="heart"
        width={600}
        height={600}
        className='absolute inset-0 m-auto z-10 will-change-transform'
      />

      {/* Text */}
      <div ref={contentRef} className="max-w-6xl relative h-full w-full text-pink-600 z-20 will-change-transform">
        <h1 className={`text-6xl md:text-9xl font-bold mb-4 relative z-20 ${meowScript.className}`}>
          <div ref={text1Ref}>{splitChars('Happy Birthday')}</div>
        </h1>

        <h1 className={`text-6xl md:text-9xl text-right relative z-20 ${meowScript.className}`}>
          <div ref={text2Ref}>{splitChars('My Lovely Girl')}</div>
        </h1>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 flex flex-col items-center text-pink-400 z-30">
        <span className="text-sm mb-2 tracking-wide">
          Scroll to celebrate your birthday
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default Scene1