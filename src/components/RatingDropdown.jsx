import React from 'react';

const RatingDropdown = ({ value, onChange, theme }) => {
  const isDark = theme === 'dark';

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full max-w-xs px-5 py-3 rounded-3xl
        font-body text-lg border shadow-md transition duration-300 ease-in-out cursor-pointer
        ${isDark
          ? 'bg-filmGray text-softIvory border-sepiaAccent shadow-[0_4px_10px_rgba(139,106,79,0.4)] focus:ring-fadedGold'
          : 'bg-pink-50 text-rose-700 border-pink-300 shadow-[0_4px_15px_rgba(236,72,153,0.3)] focus:ring-pink-400'
        }
        focus:outline-none focus:ring-4
      `}
      aria-label="Rate this movie"
    >
      <option className="font-title text-fadedGold" value="">
        ⭐ Rate this movie
      </option>
      <option className="font-title" value="5">⭐⭐⭐⭐⭐ 5 Loved it!</option>
      <option className="font-title" value="4">⭐⭐⭐⭐ 4 Liked it!</option>
      <option className="font-title" value="3">⭐⭐⭐ 3 It was okay.</option>
      <option className="font-title" value="2">⭐⭐ 2 Didn't like it.</option>
      <option className="font-title" value="1">⭐ 1 Hated it.</option>
    </select>
  );
};

export default RatingDropdown;
