import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const moods = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Excited', emoji: '🤩' },
  { label: 'Romantic', emoji: '💘' },
  { label: 'Angry', emoji: '😡' },
  { label: 'Chill', emoji: '🧘' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Inspired', emoji: '🌟' },
];

export default function MoodFilter() {
  const navigate = useNavigate();

  const handleClick = (mood) => {
    navigate(`/mood?mood=${mood}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-12 px-4 transition-all duration-700 ease-in-out">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.label}
          onClick={() => handleClick(mood.label)}
          className="rounded-3xl p-6 sm:p-7 font-body transition-all duration-500 ease-in-out
            shadow-lg hover:shadow-2xl
            dark:bg-filmGray bg-pink-100
            dark:text-softIvory text-rose-800
            hover:dark:ring-2 hover:dark:ring-sepiaAccent hover:ring-2 hover:ring-rose-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="text-4xl sm:text-5xl mb-3"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: index * 0.1 }}
          >
            {mood.emoji}
          </motion.div>

          <div
            className="text-lg sm:text-xl font-title tracking-wide transition-all duration-300
              dark:text-fadedGold text-pink-600"
          >
            {mood.label}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
