"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

// --- Data Pertanyaan Kuis ---
const questions = [
  {
    question: "Kita pertemu pertama kali dimana? 🤭",
    optionA: "IG",
    optionB: "Komunitas sange XD",
    correct: "B",
    feedbackRight: "Betul! Komunitas sange wkwkwk nakal ya kita 🙈",
    feedbackWrong: "Hayo loh masa lupa aslinya dari mana? Wkwkwk 😜"
  },
  {
    question: "Kalo orang lain nanya kita ketemu dimana jawab apaa? 🤫",
    optionA: "IG",
    optionB: "Twitter",
    correct: "A",
    feedbackRight: "Betul: IG wkwk yakali bongkar aib 😂",
    feedbackWrong: "Masa mau jujur ke orang-orang sih? Malu woyyy 😭"
  },
  {
    question: "Makanan/Minuman favorit kamuuu? 🍵",
    optionA: "Matcha",
    optionB: "Aku",
    correct: "A",
    feedbackRight: "Betul Matcha! (Walaupun jawaban 'Aku' pengen disalahin rasanya 😌)",
    feedbackWrong: "Maunya sih jawab 'Aku', tapi aslinya Matcha kan! 😋"
  },
  {
    question: "Kopi favorit aku? ☕",
    optionA: "Calfffff",
    optionB: "Nescafe",
    correct: "A",
    feedbackRight: "Betul calf laaa ☕✨",
    feedbackWrong: "Yahh salah, Calf garis keras nih bos! 😤"
  }
]

export default function Scene6() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gameState, setGameState] = useState("start") // start, playing, feedback, finished
  const [timeLeft, setTimeLeft] = useState(10)
  const [feedbackMsg, setFeedbackMsg] = useState("")
  const [isRight, setIsRight] = useState(false)

  const containerRef = useRef(null)
  const timerBarRef = useRef(null)
  const qCardRef = useRef(null)

  // Timer Logic
  useEffect(() => {
    let timer
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (gameState === "playing" && timeLeft === 0) {
      handleAnswer("TIMEOUT")
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  // Animasi Timer Bar
  useEffect(() => {
    if (gameState === "playing") {
      gsap.fromTo(
        timerBarRef.current,
        { width: "100%", backgroundColor: "#f472b6" },
        { width: "0%", backgroundColor: "#f87171", duration: 10, ease: "none" }
      )
    }
  }, [gameState, currentIndex])

  // Animasi Polaroid Melayang (Floating)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bikin polaroid masuk dari luar layar
      gsap.from(".polaroid-card", {
        opacity: 0,
        scale: 0.5,
        rotation: () => gsap.utils.random(-30, 30),
        y: gsap.utils.random(50, 100),
        duration: 1.5,
        stagger: 0.2,
        ease: "back.out(1.2)"
      })

      // Bikin polaroid melayang-layang terus
      gsap.to(".polaroid-card", {
        y: "+=15",
        rotation: "+=2",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: { amount: 1.5, from: "random" }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(10)
  }

  const handleAnswer = (selectedOption) => {
    setGameState("feedback")
    gsap.killTweensOf(timerBarRef.current) 

    const currentQ = questions[currentIndex]
    
    if (selectedOption === currentQ.correct) {
      setIsRight(true)
      setFeedbackMsg(currentQ.feedbackRight)
    } else {
      setIsRight(false)
      setFeedbackMsg(selectedOption === "TIMEOUT" ? "Waktu habiiis! Kelamaan mikir nih 😝" : currentQ.feedbackWrong)
    }

    gsap.fromTo(".feedback-popup", 
      { scale: 0.5, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
    )

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setTimeLeft(10)
        setGameState("playing")
        
        gsap.fromTo(qCardRef.current, 
          { x: 100, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        )
      } else {
        setGameState("finished")
      }
    }, 3000)
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6f0] px-6 py-12 relative overflow-hidden"
    >
      {/* ================= BACKGROUND POLAROIDS ================= */}
      {/* Tersembunyi di HP (hidden md:block) biar gak nutupin game */}
      
      {/* Polaroid Kiri Atas */}
      <div className="polaroid-card hidden md:block absolute top-16 left-10 lg:left-20 bg-white p-3 pb-10 shadow-xl border border-gray-200 -rotate-6 w-40 lg:w-48 z-0">
        <div className="w-full aspect-square bg-gray-200 overflow-hidden">
          {/* Ganti src dengan nama file fotomu */}
          <img src="/foto1.jpg" alt="Foto 1" className="w-full h-full object-cover" /> 
        </div>
        <p className="text-center text-gray-500 font-handwriting mt-3 text-sm">Cute bgt! 💕</p>
      </div>

      {/* Polaroid Kiri Bawah */}
      <div className="polaroid-card hidden md:block absolute bottom-20 left-16 lg:left-32 bg-white p-3 pb-10 shadow-xl border border-gray-200 rotate-12 w-40 lg:w-48 z-0">
        <div className="w-full aspect-square bg-gray-200 overflow-hidden">
          <img src="/foto2.jpg" alt="Foto 2" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Polaroid Kanan Atas */}
      <div className="polaroid-card hidden md:block absolute top-24 right-12 lg:right-24 bg-white p-3 pb-10 shadow-xl border border-gray-200 rotate-6 w-40 lg:w-48 z-0">
        <div className="w-full aspect-square bg-gray-200 overflow-hidden">
          <img src="/foto3.jpg" alt="Foto 3" className="w-full h-full object-cover" />
        </div>
        <p className="text-center text-gray-500 font-handwriting mt-3 text-sm">My fav! 🥰</p>
      </div>

      {/* Polaroid Kanan Bawah */}
      <div className="polaroid-card hidden md:block absolute bottom-24 right-10 lg:right-20 bg-white p-3 pb-10 shadow-xl border border-gray-200 -rotate-12 w-40 lg:w-48 z-0">
        <div className="w-full aspect-square bg-gray-200 overflow-hidden">
          <img src="/foto4.jpg" alt="Foto 4" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* ========================================================= */}


      {/* Main Game Container */}
      <div className="z-10 w-full max-w-3xl flex flex-col items-center">
        {gameState === "start" && (
          <div className="text-center animate-fade-in bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white">
            <h2 className="text-4xl md:text-5xl font-bold text-pink-500 mb-6 drop-shadow-sm">
              This or That? 🤔
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Biar makin seru, kita main game bentar yuk! Coba tes ingatan dan kejujuran kamu (waktunya cuma 10 detik per soal loh!)
            </p>
            <button 
              onClick={startGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform active:scale-95 transition-all text-xl"
            >
              Mulai Game! 🔥
            </button>
          </div>
        )}

        {(gameState === "playing" || gameState === "feedback") && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between text-pink-500 font-bold mb-4 px-4 bg-white/70 backdrop-blur-md rounded-full py-2 shadow-sm">
              <span>Pertanyaan {currentIndex + 1}/{questions.length}</span>
              <span>{timeLeft}s</span>
            </div>

            <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden mb-10 shadow-inner">
              <div ref={timerBarRef} className="h-full bg-pink-500 rounded-full" />
            </div>

            <div ref={qCardRef} className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 w-full text-center relative">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 leading-relaxed">
                {questions[currentIndex].question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <button 
                  onClick={() => handleAnswer("A")}
                  disabled={gameState === "feedback"}
                  className="bg-[#efe7de] hover:bg-[#e2d3c3] text-gray-800 font-bold py-6 px-4 rounded-3xl text-xl shadow-md transition-all active:scale-95 border-2 border-[#d9c7b5]"
                >
                  {questions[currentIndex].optionA}
                </button>
                <button 
                  onClick={() => handleAnswer("B")}
                  disabled={gameState === "feedback"}
                  className="bg-[#efe7de] hover:bg-[#e2d3c3] text-gray-800 font-bold py-6 px-4 rounded-3xl text-xl shadow-md transition-all active:scale-95 border-2 border-[#d9c7b5]"
                >
                  {questions[currentIndex].optionB}
                </button>
              </div>

              {gameState === "feedback" && (
                <div className="feedback-popup absolute inset-0 bg-white/95 backdrop-blur-md rounded-[2.2rem] flex flex-col items-center justify-center p-6 z-20 shadow-2xl">
                  <div className={`text-6xl mb-4 ${isRight ? "animate-bounce" : "animate-pulse"}`}>
                    {isRight ? "🎉" : "🤡"}
                  </div>
                  <h4 className={`text-2xl font-bold mb-2 ${isRight ? "text-green-500" : "text-red-500"}`}>
                    {isRight ? "BENAAAARR!" : "SALAH WEEEEY!"}
                  </h4>
                  <p className="text-gray-700 text-lg font-medium text-center">
                    {feedbackMsg}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white">
            <h2 className="text-4xl font-bold text-pink-500 mb-4 drop-shadow-sm">
              Game Selesai! 🎉
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Makasih ya udah main This or That! Ketahuan deh isi otaknya wkwkwk 😂
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform active:scale-95 transition-all">
              Lanjut dong sayang 🥰
            </button>
          </div>
        )}
      </div>

    </section>
  )
}