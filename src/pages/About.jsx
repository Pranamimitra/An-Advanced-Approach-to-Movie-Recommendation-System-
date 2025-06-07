import { Mail, Github, Linkedin } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen p-8 font-body bg-dreamyPink text-dustyTaupe dark:bg-smoky dark:text-softIvory transition-colors duration-700 ease-soft-ease">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Overview */}
        <section>
          <h1 className="text-4xl font-title mb-4 text-blushPink dark:text-vintageMaroon">🎬 About MRS</h1>
          <p className="text-lg leading-relaxed text-dustyRose dark:text-dustyTaupe">
            MRS (Movie Recommendation System) is your ultimate movie buddy — crafted to recommend films based on your mood and preferences. Whether you're feeling cheerful, nostalgic, or mysterious, MRS finds the perfect film for you.
          </p>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-warmGold dark:text-fadedGold">🧠 Key Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-dustyRose dark:text-dustyTaupe">
            <li>Hybrid Recommendation Engine (Content + Collaborative Filtering)</li>
            <li>Mood-Based Movie Suggestions</li>
            <li>User Watchlist & Ratings</li>
            <li>Dynamic UI with Search & Filtering</li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-warmGold dark:text-fadedGold">🛠 Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
              { name: "Flask", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
              { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
              { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
              { name: "TMDb", logo: "/tmdb-logo.svg" },
              { name: "MovieLens", logo: "/movielens-logo.svg" }
            ].map(({ name, logo }) => (
              <div
                key={name}
                className="rounded-2xl p-4 flex flex-col items-center shadow-md transition-shadow duration-300 ease-in-out bg-white bg-opacity-80 dark:bg-filmGray hover:shadow-pinkGlow dark:hover:shadow-sepiaAccent/50"
              >
                <img src={logo} alt={name} className="h-10 w-10 mb-2" />
                <span className="text-sm text-vintageMaroon dark:text-softIvory">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-warmGold dark:text-fadedGold">👥 Meet the Team</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {["Pranami Mitra", "Prashasti Nanda", "Shubhashree Pal", "Archishmita Ghorai"].map((member) => (
              <div key={member} className="rounded-2xl p-4 bg-white bg-opacity-80 dark:bg-filmGray">
                <h3 className="font-medium text-lg text-vintageMaroon dark:text-softIvory">{member}</h3>
                <p className="text-sm text-dustyRose dark:text-dustyTaupe">Full-stack Developer & Researcher</p>
              </div>
            ))}
          </div>
        </section>

        {/* Acknowledgements */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-warmGold dark:text-fadedGold">🙏 Acknowledgements</h2>
          <p className="text-lg text-dustyRose dark:text-dustyTaupe">
            We extend heartfelt thanks to our mentors, professors, and the open-source communities behind TMDb, MovieLens, and React. Your contributions made this possible.
          </p>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-warmGold dark:text-fadedGold">📬 Contact & Feedback</h2>
          <div className="flex space-x-4 text-vintageMaroon dark:text-softIvory">
            <a href="mailto:team@example.com" className="hover:text-sepiaAccent transition-colors duration-300">
              <Mail />
            </a>
            <a href="https://github.com/example" target="_blank" className="hover:text-sepiaAccent transition-colors duration-300">
              <Github />
            </a>
            <a href="https://linkedin.com/in/example" target="_blank" className="hover:text-sepiaAccent transition-colors duration-300">
              <Linkedin />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
