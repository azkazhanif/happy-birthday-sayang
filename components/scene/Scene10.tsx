"use client"

import { useState, useRef, useEffect } from "react"
import confetti from "canvas-confetti"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Scene10() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [herWish, setHerWish] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const containerRef = useRef<HTMLElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Array 10 foto
  const photos = Array.from({ length: 10 }, (_, i) => `/images/mine/${i + 1}.jpeg`)

  // GSAP Animations with ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Animate title and description
      gsap.fromTo(".title-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      )

      // Animate polaroid photos
      gsap.fromTo(".photo-item",
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".photo-wrapper",
            start: "top 85%",
          }
        }
      )

      // Animate wishes block
      gsap.fromTo(".wishes-text",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".wishes-text",
            start: "top 85%",
          }
        }
      )

      // Animate apology text and button
      gsap.fromTo([".apology-text", ".wish-btn"],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".wish-btn",
            start: "top 90%",
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSubmitWish = async () => {
    if (herWish.trim() === "") return
    setIsSubmitting(true)
    
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "0e067c29-397a-42fc-8ecb-18a7c2f6027c", // This delivers straight to azkazhanif@gmail.com
          subject: "Harapan Baru dari Sayangku Tiara! 💌",
          from_name: "Tiara's Birthday Website",
          to_email: "azkazhanif@gmail.com",
          message: herWish,
        })
      })

      setIsSubmitted(true)
      
      // Confetti pop on submit!
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff99cc', '#ffb3d9', '#ffffff', '#ff66b2']
      })
    } catch (err) {
      // Fallback to prevent any error breaking her birthday mood
      setIsSubmitted(true)
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff99cc', '#ffb3d9', '#ffffff', '#ff66b2']
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#1a0b1c] to-[#3a1c3b] px-4 md:px-8 py-24 relative overflow-hidden text-center"
    >
      {/* Background Particles Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Title */}
        <h2 className="title-text text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-purple-400 mb-6 font-serif drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Our Precious Memories ✨
        </h2>
        <p className="title-text text-pink-200/80 mb-12 text-lg max-w-2xl">
          Setiap momen sama kamu adalah memori yang pengen aku simpan selamanya.
        </p>

        {/* Grid 10 Foto - Polaroid Style */}
        <div className="w-full max-w-6xl flex flex-wrap justify-center gap-4 md:gap-8 mb-20 perspective-1000">
          {photos.map((src, index) => (
            <div className="photo-wrapper" key={index}>
              <div 
                onClick={() => setSelectedPhoto(src)}
                className="photo-item w-36 h-44 md:w-48 md:h-56 bg-white p-2 pb-8 rounded-md shadow-2xl hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:z-30 transition-shadow duration-300 cursor-pointer border border-gray-200"
                style={{ transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 5 + 2)}deg)` }}
              >
                <div className="w-full h-full overflow-hidden bg-gray-200 relative group">
                  <img 
                    src={src} 
                    alt={`Memori ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x400?text=Foto+${index + 1}` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Wishes Text */}
        <div className="wishes-text max-w-3xl bg-black/40 backdrop-blur-xl border border-pink-500/30 p-8 md:p-12 rounded-[2.5rem] mb-12 shadow-[0_0_40px_rgba(236,72,153,0.15)] relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">💝</div>
          <h3 className="text-2xl md:text-3xl font-bold text-pink-300 mb-6 font-serif">
            Harapanku Buat Kita...
          </h3>
          <p className="text-gray-200 leading-relaxed text-lg md:text-xl font-medium">
            Semoga kita berdua selalu dikasih kesehatan, kesabaran, dan rezeki yang lancar. Aku berharap kita bisa terus tumbuh bareng, saling menopang di dunia yang kadang bikin capek ini. Dan semoga semesta secepatnya ngasih jalan buat kita ketemu. Amin. 🌍❤️
          </p>
        </div>

        {/* Apology Text */}
        <p className="apology-text text-pink-200/60 italic font-handwriting text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed">
          "Maaf yaa kalau kejutannya garing, aneh, atau nggak sesuai ekspektasi kamu... Aku cuma pengen bikin sesuatu yang spesial banget buat kamu di hari ultahmu." 🥺
        </p>

        {/* Button to Open Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="wish-btn relative group bg-linear-to-r from-pink-500 to-rose-400 text-white font-bold py-5 px-12 rounded-full overflow-hidden transform active:scale-95 transition-all text-xl md:text-2xl"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10 flex items-center gap-2 shadow-sm">
            Tulis Harapan Kamu Sayang 💌
          </span>
          <div className="absolute -inset-1 bg-linear-to-r from-pink-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity z-0"></div>
        </button>
      </div>

      {/* ================= LIGHTBOX FOTO ================= */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 text-white text-4xl hover:text-pink-400 transition-colors">✕</button>
          <img 
            src={selectedPhoto} 
            alt="Enlarged Memory" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-4 border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ================= MODAL MUNCHKIN (WISHES) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Overlay klik untuk tutup (kalau belum submit) */}
          <div 
            className="absolute inset-0" 
            onClick={() => !isSubmitted && setIsModalOpen(false)}
          ></div>

          <div 
            ref={modalRef}
            className="relative bg-linear-to-br from-[#fffdf9] to-[#fef5f8] w-full max-w-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_50px_rgba(236,72,153,0.3)] border-2 border-pink-200 z-10"
          >
            {/* Tombol Close */}
            {!isSubmitted && (
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-pink-500 text-3xl font-bold transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-50"
              >
                ✕
              </button>
            )}

            {!isSubmitted ? (
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4 animate-pulse">✨</div>
                <h3 className="text-3xl font-bold text-pink-500 mb-3 font-serif text-center">
                  Make a Wish
                </h3>
                <p className="text-gray-500 mb-8 text-center text-lg">
                  Coba ketik apa aja harapan kamu di umur yang baru ini sayang...
                </p>

                <textarea
                  value={herWish}
                  onChange={(e) => setHerWish(e.target.value)}
                  placeholder="Ketik harapan terindah kamu di sini ya cantikk..."
                  className="w-full h-48 p-5 border-2 border-pink-200 rounded-3xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 resize-none text-gray-700 bg-white shadow-inner transition-all text-lg leading-relaxed font-medium"
                />

                <button 
                  onClick={handleSubmitWish}
                  disabled={herWish.trim() === "" || isSubmitting}
                  className="w-full mt-8 bg-linear-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full shadow-lg transform active:scale-95 transition-all text-xl"
                >
                  {isSubmitting ? "Mengirim... 💌" : "Kirim Harapan 💖"}
                </button>
              </div>
            ) : (
              /* Success Message setelah dia nulis harapan */
              <div className="text-center py-8 flex flex-col items-center">
                <div className="text-7xl mb-6 animate-bounce">💌</div>
                <h3 className="text-3xl font-bold text-pink-500 mb-4 font-serif">
                  Harapan Disimpan!
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Semoga semua doa dan harapan baik kamu segera dikabulkan oleh Yang Maha Kuasa ya sayang. Makasih udah lahir ke dunia ini dan jadi alasan aku bahagia.<br/><br/>
                  <span className="text-2xl font-black text-pink-500 font-handwriting">I Love You So Much! ❤️</span>
                </p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-10 rounded-full transition-colors text-lg"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  )
}