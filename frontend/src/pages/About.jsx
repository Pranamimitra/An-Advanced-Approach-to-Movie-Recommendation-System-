import { FiMail } from "react-icons/fi";
import { SiGithub, SiLinkedin } from "react-icons/si";

export default function About() {
  const techStack = [
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    { name: "Jupyter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
    { name: "NLP", logo: "/NLP.svg" },
    { name: "Scikit-learn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
    { name: "SciPy", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg" },
    { name: "NumPy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
    { name: "Flask", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Tailwind CSS", logo: "https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg" },
    { name: "TMDb", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tmdb.new.logo.svg" },
    { name: "MovieLens", logo: "/movielens.svg" }
  ];

  return (
    <div className="bg-white text-gray-900 dark:bg-[#121212] dark:text-[#F5F3E7] font-[Inter] min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* Overview */}
        <section>
          <h1 className="text-3xl font-['Playfair Display'] text-yellow-700 dark:text-[#E0B158] mb-4 tracking-wide">
            About <span className="text-red-800 dark:text-[#7B2D26]">The Screening Room</span>
          </h1>
          <p className="text-gray-700 dark:text-[#C2BDAF] text-base leading-relaxed max-w-3xl tracking-wide">
            Welcome to <span className="font-semibold text-yellow-700 dark:text-[#E0B158]">The Screening Room</span>, your personalized movie companion that understands your mood and guides you to your next cinematic escape. Whether you're craving a heartwarming tale, a thrilling mystery, or a nostalgic classic, we tailor film suggestions that speak to your vibe.
            <br /><br />
            Dive into a seamless movie discovery experience powered by cutting-edge technology and designed with love for film enthusiasts like you.
          </p>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-[#E0B158] mb-3 border-b border-red-800 dark:border-[#7B2D26] pb-1">
            Key Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-[#B0AA9F] text-sm max-w-3xl">
            <li>Hybrid Recommendation Engine combining Content & Collaborative Filtering.</li>
            <li>Mood-Based Suggestions tailored to your emotional vibe.</li>
            <li>Watchlist & Ratings to manage your film library.</li>
            <li>Interactive Chatbot for smooth movie discovery.</li>
            <li>Search & Filtering options for quick browsing.</li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-[#E0B158] mb-3 border-b border-red-800 dark:border-[#7B2D26] pb-1">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {techStack.map(({ name, logo }) => (
              <div
                key={name}
                className="bg-gray-100 dark:bg-[#222222] rounded-2xl p-4 flex flex-col items-center shadow hover:shadow-yellow-500/30 dark:hover:shadow-[#E0B158]/30 transition-shadow duration-300"
                title={name}
              >
                <img src={logo} alt={name} className="h-10 w-10 mb-2 object-contain" />
                <span className="text-xs text-center text-gray-800 dark:text-[#F5F3E7]">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-[#E0B158] mb-3 border-b border-red-800 dark:border-[#7B2D26] pb-1">
            Meet the Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: "Pranami Mitra", role: "Computer Science and Engineering" },
              { name: "Prashasti Nanda", role: "Computer Science and Engineering" },
              { name: "Shubhashree Pal", role: "Computer Science and Engineering" },
              { name: "Archishmita Ghorai", role: "Computer Science and Engineering" }
            ].map(({ name, role }) => (
              <div
                key={name}
                className="bg-gray-100 dark:bg-[#222222] rounded-xl p-4 flex flex-col items-center shadow hover:shadow-yellow-500/30 dark:hover:shadow-[#E0B158]/30 transition-shadow"
              >
                <h3 className="text-gray-900 dark:text-[#F5F3E7] font-medium text-base">{name}</h3>
                <p className="text-gray-600 dark:text-[#B0AA9F] mt-1 text-xs italic">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Acknowledgements */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-[#E0B158] mb-3 border-b border-red-800 dark:border-[#7B2D26] pb-1">
            Acknowledgements
          </h2>
          <p className="text-gray-600 dark:text-[#B0AA9F] text-sm max-w-3xl leading-relaxed">
            Huge thanks to our incredible mentors, professors, and the open-source communities behind <span className="font-semibold text-yellow-700 dark:text-[#E0B158]">TMDb</span>, <span className="font-semibold text-yellow-700 dark:text-[#E0B158]">MovieLens</span>, and <span className="font-semibold text-yellow-700 dark:text-[#E0B158]">React</span>. Your support made this possible.
          </p>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-[#E0B158] mb-3 border-b border-red-800 dark:border-[#7B2D26] pb-1">
            Contact & Feedback
          </h2>
          <p className="text-gray-600 dark:text-[#B0AA9F] mb-3 text-sm">
            Got feedback or just want to connect? We’d love to hear from you!
          </p>
          <div className="flex space-x-6 text-gray-900 dark:text-[#F5F3E7] text-xl">
            <a
              href="mailto:team@example.com"
              className="hover:text-yellow-600 dark:hover:text-[#E0B158] transition-colors duration-300"
              aria-label="Email"
            >
              <FiMail size={22} />
            </a>
            <a
              href="https://github.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-600 dark:hover:text-[#E0B158] transition-colors duration-300"
              aria-label="GitHub"
            >
              <SiGithub size={22} />
            </a>
            <a
              href="https://linkedin.com/in/example"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-600 dark:hover:text-[#E0B158] transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <SiLinkedin size={22} />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
