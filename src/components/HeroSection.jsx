import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section
      ref={ref}
      className="relative h-[100vh] overflow-hidden transition-all duration-700 ease-in-out font-body text-softIvory dark:bg-smoky bg-pink-50"
    >
      {/* 🌌 Background: dreamy gradient for light mode, cinematic for dark */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 transition-all duration-700 ease-in-out
          dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-smoky
          bg-gradient-to-br from-pink-100 via-rose-200 to-pink-50 opacity-30"
      />

      {/* 🎬 Foreground Content */}
      <motion.div
        style={{ y: yText }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* ✨ Cinematic Glowing Title */}
        <h1
          className="text-5xl sm:text-6xl font-title mb-6
          dark:text-vintageMaroon text-pink-700
          drop-shadow-[0_0_20px_rgba(123,45,38,0.6)] dark:drop-shadow-[0_0_20px_rgba(123,45,38,0.5)] transition-all duration-500"
        >
           The Screening Room
        </h1>

        {/* 💫 Soft Intro Text */}
        <p
          className="text-lg sm:text-xl max-w-2xl font-medium
          dark:text-dustyTaupe text-rose-800
          italic leading-relaxed drop-shadow-sm transition-all duration-500"
        >
          Discover movies by mood — curated with emotion & elegance.
          Scroll to dive into your next cinematic obsession 🎞️
        </p>

        {/* 🎟️ Explore Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }
          className="mt-8 px-7 py-3 rounded-full font-semibold shadow-xl transition duration-500 ease-in-out
          dark:bg-vintageMaroon bg-pink-500
          dark:text-softIvory text-white
          hover:dark:bg-sepiaAccent hover:bg-rose-400"
        >
          Start Exploring
        </motion.button>

        {/* 🔻 Glowy Arrow */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-10 text-4xl transition-all
            dark:text-fadedGold text-pink-600"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
