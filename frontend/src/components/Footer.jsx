import { useEffect, useState } from 'react';

function useThemeMode() {
  const [isLightMode, setIsLightMode] = useState(!document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const onThemeChange = () => {
      setIsLightMode(!document.documentElement.classList.contains('dark'));
    };

    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isLightMode;
}

export default function Footer() {
  const isLightMode = useThemeMode();

  return (
    <footer
      className="py-6 px-4 text-center font-body select-none"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)',
        boxShadow:
          'inset 0 1px 10px rgba(255 255 255 / 0.05), 0 -2px 10px rgba(139,106,79,0.25)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <p
        className="text-sm md:text-base tracking-wide"
        style={{
          maxWidth: 600,
          margin: '0 auto',
          letterSpacing: '0.05em',
        }}
      >
        © 2025{' '}
        <span
          className="font-title cursor-default"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--primary-accent)',
            textShadow:
              '0 0 8px rgba(123,45,38,0.7), 0 0 15px rgba(201,180,88,0.5)',
            userSelect: 'none',
          }}
        >
          MRS
        </span>{' '}
        — Made with{' '}
        <span
          aria-label="heart"
          role="img"
          className="inline-block animate-pulse"
          style={{
            color: 'var(--secondary-accent)',
            filter: 'drop-shadow(0 0 4px var(--secondary-accent))',
            fontSize: '1.2rem',
            margin: '0 0.2em',
          }}
        >
          ❤️
        </span>{' '}
        by Team
      </p>

      {/* Theme CSS variables */}
      <style jsx global>{`
        :root {
          /* Light theme (default) */
          --bg-color: #fdf0f4; /* Creamy soft pink */
          --primary-accent: #d66a86; /* Warm vintage pink maroon */
          --secondary-accent: #ffc1cc; /* Soft pinky gold */
          --card-surface: #f8e9eb; /* Very soft pink gray */
          --text-primary: #6b3a4f; /* Dusty raspberry brown */
          --text-secondary: #bfa6aa; /* Soft muted rose taupe */
          --sepia-accent: #c49dae; /* Muted pink sepia */
          --fadedGold: #ffc1cc;
        }

        html.dark {
          /* Dark theme overrides */
          --bg-color: #1a1a1a; /* Smoky Charcoal */
          --primary-accent: #7b2d26; /* Vintage Maroon */
          --secondary-accent: #c9b458; /* Faded Gold */
          --card-surface: #2d2d2d; /* Film Gray */
          --text-primary: #f5f3e7; /* Soft Ivory */
          --text-secondary: #a89f91; /* Dusty Taupe */
          --sepia-accent: #8b6a4f; /* Sepia Accent */
          --fadedGold: #c9b458;
        }
      `}</style>
    </footer>
  );
}
