import { useEffect, useState } from 'react';
import { Star, MessageSquare, Bookmark, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Star className="w-10 h-10" />,
    title: "Recommend",
    description: "Accurate suggestions based on your mood and taste. Let the algorithm work its magic!",
  },
  {
    icon: <MessageSquare className="w-10 h-10" />,
    title: "Rate & Review",
    description: "Build your taste profile by rating everything you watch — praise or throw shade, your call!",
  },
  {
    icon: <Bookmark className="w-10 h-10" />,
    title: "Track",
    description: "Track what you've watched with your personal Watchlist and Journal.",
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: "Collections",
    description: "Curate private or shared movie collections with friends by topic or genre.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.25,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};

export default function FeatureHighlight() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
  const checkTheme = () => {
    setIsLightMode(!document.documentElement.classList.contains('dark'));
  };
  checkTheme();

  const observer = new MutationObserver(checkTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
}, []);



  const textColor = isLightMode ? 'text-[#6e4b50]' : 'text-[#F5F3E7]';
  const titleColor = isLightMode ? 'text-[#9c496a]' : 'text-[#7B2D26]';
  const cardBg = isLightMode ? 'bg-[#fff0f6]' : 'bg-[#2D2D2D]';
  const cardShadow = isLightMode
    ? 'shadow-[0_6px_18px_rgba(249,143,177,0.25)] hover:shadow-[0_12px_24px_rgba(249,127,176,0.7)]'
    : 'shadow-[0_6px_18px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_24px_rgba(139,106,79,0.6)]';

  return (
    <section
      role="region"
      aria-label="Feature highlights of The Screening Room"
      className={`relative py-32 px-6 transition-all duration-500 ${
        isLightMode
          ? 'bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300'
          : 'bg-[#1A1A1A]'
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={`text-5xl md:text-6xl font-title font-extrabold mb-24 tracking-wide ${
            isLightMode
              ? 'text-[#9c496a]'
              : 'text-[#C9B458] drop-shadow-[0_3px_12px_rgba(123,45,38,0.7)]'
          }`}
        >
          Why "The Screening Room"?
        </motion.h2>

        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className={`rounded-3xl px-8 py-10 cursor-pointer border border-transparent transition-all duration-500 ${cardBg} ${cardShadow} hover:scale-105 hover:brightness-110`}
            >
              <div className={`mb-6 flex justify-center items-center ${titleColor}`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-title mb-3 tracking-wide ${titleColor}`}>
                {feature.title}
              </h3>
              <p className={`text-base leading-relaxed max-w-[280px] mx-auto ${textColor}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
