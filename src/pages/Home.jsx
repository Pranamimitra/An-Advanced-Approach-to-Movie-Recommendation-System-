import { motion } from 'framer-motion';
import MoodFilter from '../components/MoodFilter';
import FeatureHighlight from '../components/FeatureHighlight';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';

export default function Home() {
  return (
    <div
      className="
        min-h-screen px-6 sm:px-10 py-10 
        bg-gradient-to-b 
          from-lightPink1 via-lightPink2 to-lightPink3 
          dark:bg-smoky 
        text-[#3d3d3d] dark:text-softIvory 
        font-body 
        transition-colors duration-700 ease-in-out 
        relative overflow-hidden
      "
    >
      {/* Main Content Wrapper */}
      <div className="relative z-10 space-y-16 max-w-7xl mx-auto">
        {/* Search Bar */}
        <SearchBar />

        {/* Hero */}
        <HeroSection />

        {/* Title Section */}
        <section className="max-w-3xl mx-auto text-center mt-10 px-4">
          <h1
            className="
              text-5xl sm:text-6xl font-title font-extrabold 
              text-pinkMaroon dark:text-vintageMaroon 
              mb-6 
              drop-shadow-soft-pink dark:drop-shadow-dark-soft
              tracking-wide
              transition-colors duration-500 ease-in-out
            "
          >
            The Screening Room
          </h1>
          <p
            className="
              text-lg sm:text-xl 
              text-[#6e4b50] dark:text-dustyTaupe 
              leading-relaxed italic 
              max-w-xl mx-auto 
              font-body
            "
          >
            Discover movies based on how you're feeling — from cozy classics to pulse-racing thrillers, your next favorite is just one mood away 💫
          </p>
        </section>

        {/* Mood Picker */}
        <section className="max-w-4xl mx-auto text-center px-4">
          <h2
            className="
              text-2xl sm:text-3xl font-title font-semibold 
              text-pinkMaroon dark:text-fadedGold 
              mb-6 
              tracking-tight
              transition-colors duration-500 ease-in-out
            "
          >
            Pick a mood to get started 💖
          </h2>
          <div className="px-4 sm:px-0">
            <MoodFilter />
          </div>
        </section>

        {/* Feature Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="
            text-3xl sm:text-4xl font-title font-semibold 
            text-center mt-24 mb-6 
            text-[#4e3b3b] dark:text-softIvory 
            drop-shadow-md 
            transition-colors duration-500 ease-in-out
          "
        >
          Discover Why You'll Love MRS
        </motion.h2>

        {/* Animated Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="
            flex justify-center text-2xl 
            text-sepiaAccent dark:text-sepiaAccent 
            mt-2 
            select-none
            transition-colors duration-500 ease-in-out
          "
        >
          ↓
        </motion.div>

        {/* Feature Highlights Section */}
        <FeatureHighlight />
      </div>
    </div>
  );
}
