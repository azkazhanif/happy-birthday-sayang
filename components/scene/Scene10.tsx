"use client"

import { useState, useRef, useEffect } from "react"
import gsap from "gsap"

export default function Scene10() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [herWish, setHerWish] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const containerRef = useRef(null)
  const modalRef = useRef(null)

  // Array 10 foto (Pastikan file foto1.jpg sampai foto10.jpg ada di folder public)
  const photos = Array.from({ length: 10 }, (_, i) => `/images/mine/${i + 1}.jpeg`)

  // Animasi Masuk (Entry Animation)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Animasi Judul
      tl.from(".title-text", { y: -30, opacity: 0, duration: 1, ease: "power3.out" })

      // Animasi Grid 10 Foto (Stagger muncul satu-satu)
      tl.from(".photo-item", {
        scale: 0,
        opacity: 0,
        rotation: () => gsap.utils.random(-15, 15),
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)"
      }, "-=0.5")

      // Animasi Teks Harapan & Apology
      tl.from(".wishes-text", { y: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.2")
      tl.from(".apology-text", { opacity: 0, duration: 1, delay: 0.5 })
      tl.from(".wish-btn", { scale: 0, opacity: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "-=0.5")

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Animasi Pop-up Modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
      )
    }
  }, [isModalOpen])

  const handleSubmitWish = () => {
    if (herWish.trim() === "") return
    setIsSubmitted(true)
    // Disini kamu bisa tambahin fungsi buat kirim harapannya ke database/email kalau mau
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#0a0a0a] to-[#2d1b2e] px-6 py-20 relative overflow-hidden text-center"
    >
      
      {/* Title */}
      <h2 className="title-text text-3xl md:text-5xl font-bold text-pink-400 mb-10 font-serif drop-shadow-lg">
        Our Memories & My Wishes ✨
      </h2>

      {/* Grid 10 Foto */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
        {photos.map((src, index) => (
          <div 
            key={index} 
            className="photo-item w-full aspect-square bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl hover:scale-105 hover:z-10 hover:border-pink-400 transition-all duration-300 cursor-pointer"
          >
            {/* Fallback bg-gray kalau foto belum di-load/belum ada */}
            <img 
              src={src} 
              alt={`Memori ${index + 1}`} 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Foto+" + (index + 1) }} // Placeholder kalau foto blm ada
            />
          </div>
        ))}
      </div>

      {/* My Wishes Text */}
      <div className="wishes-text max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl mb-8 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-semibold text-pink-300 mb-4">
          Harapanku di tahun ini...
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg mb-4">
          Semoga kita berdua selalu dikasih kesehatan, kesabaran, dan rezeki yang lancar. Aku berharap kita bisa terus tumbuh bareng, saling *support* di dunia yang lagi kacau ini, dan semoga semesta secepatnya ngasih jalan buat kita ketemu. Amin. 🌍❤️
        </p>
      </div>

      {/* Apology Text */}
      <p className="apology-text text-gray-400 italic font-handwriting text-lg md:text-xl mb-10 max-w-md">
        "Maaf yaa kalau kejutannya garing, aneh, atau nggak sesuai ekspektasi kamu... Aku cuma pengen bikin sesuatu yang spesial buat kamu." 🥺
      </p>

      {/* Button to Open Modal */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="wish-btn bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] transform active:scale-95 transition-all text-xl"
      >
        Tulis Harapan Kamu Sayang 💌
      </button>

      {/* ================= MODAL MUNCHKIN (WISHES) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* Overlay klik untuk tutup (kalau belum submit) */}
          <div 
            className="absolute inset-0" 
            onClick={() => !isSubmitted && setIsModalOpen(false)}
          ></div>

          <div 
            ref={modalRef}
            className="relative bg-[#fffdf9] w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-pink-200 z-10"
          >
            {/* Tombol Close */}
            {!isSubmitted && (
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-6 text-gray-400 hover:text-pink-500 text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            )}

            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-pink-500 mb-2 font-serif text-center">
                  Make a Wish ✨
                </h3>
                <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
                  Coba ketik apa harapan kamu di tahun ini sayang...
                </p>

                <textarea
                  value={herWish}
                  onChange={(e) => setHerWish(e.target.value)}
                  placeholder="Ketik harapan kamu di sini ya cantikk..."
                  className="w-full h-40 p-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none text-gray-700 bg-white shadow-inner transition-all"
                />

                <button 
                  onClick={handleSubmitWish}
                  className="w-full mt-6 bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-2xl shadow-lg transform active:scale-95 transition-all text-lg"
                >
                  Kirim Harapan 💖
                </button>
              </>
            ) : (
              /* Success Message setelah dia nulis harapan */
              <div className="text-center py-6">
                <div className="text-6xl mb-4 animate-bounce">💌</div>
                <h3 className="text-2xl font-bold text-pink-500 mb-3">
                  Harapan Disimpan!
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Semoga semua doa dan harapan baik kamu dikabulkan ya sayang. Makasih udah jadi alasan aku bahagia.<br/><br/>
                  <strong>I Love You So Much! ❤️</strong>
                </p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-xl transition-colors"
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