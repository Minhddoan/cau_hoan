import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Hài Hòa",
    titleAccent: "Năng Lượng",
    subtitle: "Khám phá nghệ thuật cân bằng không gian sống theo triết lý Phương Đông",
    image:
      "https://images.unsplash.com/photo-1713346643485-ecca3aeafc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZSUyMHJlZCUyMGdvbGQlMjBuaWdodHxlbnwxfHx8fDE3NzU3Mjk3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Phong Thủy",
  },
  {
    id: 2,
    title: "Thiền Định",
    titleAccent: "Không Gian",
    subtitle: "Tạo dựng sự tĩnh lặng và bình an giữa lòng thành phố nhộn nhịp",
    image:
      "https://images.unsplash.com/photo-1707323747791-407f6fc030a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZW4lMjBnYXJkZW4lMjB3YXRlciUyMHJvY2tzJTIwZmVuZyUyMHNodWl8ZW58MXx8fHwxNzc1NzI5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Thiền Garden",
  },
  {
    id: 3,
    title: "Vật Phẩm",
    titleAccent: "Khởi Tâm",
    subtitle: "Mỗi vật phẩm là một câu chuyện, một lời chúc bình an và thịnh vượng",
    image:
      "https://images.unsplash.com/photo-1684928365243-be7d3d9669a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5nJTIwc2h1aSUyMGNvbXBhc3MlMjBsdW9wYW4lMjBsdXh1cnklMjBtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NTcyOTcxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Phúc Khí",
  },
  {
    id: 4,
    title: "Tài Lộc",
    titleAccent: "Thịnh Vượng",
    subtitle: "Kích hoạt dòng chảy tài lộc, mang lại sự sung túc và cát tường cho gia chủ",
    image:
      "https://images.unsplash.com/photo-1563758389019-3f59ff5d8c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxqYXBhbmVzZSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZSUyMHJlZHxlbnwxfHx8fDE3NzU2NjQxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Cát Tường",
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(slideNext, 6000);
    return () => clearInterval(timer);
  }, [slideNext]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.08,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.6 },
        scale: { duration: 1.2, ease: "easeOut" },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.08,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover brightness-[0.28]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-4xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-px bg-gold" />
                  <span className="border border-gold px-5 py-2 tracking-[0.3em] uppercase text-gold text-sm" style={{ fontWeight: 700 }}>
                    {slides[currentIndex].badge}
                  </span>
                  <div className="w-8 h-px bg-gold" />
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mb-8 leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 800 }}
              >
                {slides[currentIndex].title}
                <br />
                <span style={{ color: "#c41e3a" }}>{slides[currentIndex].titleAccent}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/65 mb-12 max-w-2xl leading-relaxed"
              >
                {slides[currentIndex].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-primary text-white px-12 py-4 hover:bg-primary/90 transition-colors shadow-2xl shadow-primary/30"
                  style={{ fontWeight: 700 }}
                >
                  Tư Vấn Ngay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(212, 175, 55, 0.08)" }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-gold text-gold px-12 py-4 transition-all"
                  style={{ fontWeight: 700 }}
                >
                  Xem Vật Phẩm
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 px-4 md:px-8 flex justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          onClick={slidePrev}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gold/25 bg-black/20 backdrop-blur-sm flex items-center justify-center text-gold pointer-events-auto transition-all"
          aria-label="Slide trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          onClick={slideNext}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gold/25 bg-black/20 backdrop-blur-sm flex items-center justify-center text-gold pointer-events-auto transition-all"
          aria-label="Slide tiếp"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className="group p-1.5"
            aria-label={`Slide ${index + 1}`}
          >
            <motion.div
              animate={{
                width: index === currentIndex ? 28 : 8,
                backgroundColor: index === currentIndex ? "#D4AF37" : "rgba(255,255,255,0.25)",
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 rotate-90 origin-center">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-gold/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
