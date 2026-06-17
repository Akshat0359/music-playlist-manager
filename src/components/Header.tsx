import React, { useState, useEffect } from 'react';

interface HeaderProps {
  playlistCount: number;
  songCount: number;
}

/**
 * App-wide sticky header with branding, live library stats, and a theme toggle.
 */
const Header: React.FC<HeaderProps> = ({ playlistCount, songCount }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('harmonix_theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('harmonix_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-surface-900/80 border-b border-surface-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-sm flex-shrink-0"
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">Harmonix</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-none">Playlist Manager</p>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-5" aria-label="Library statistics">
            <StatBadge count={playlistCount} label="Playlists" />
            <div className="w-px h-4 bg-surface-600" aria-hidden="true" />
            <StatBadge count={songCount} label="Songs" />
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

interface StatBadgeProps {
  count: number;
  label: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ count, label }) => (
  <div className="text-right">
    <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">{count}</span>
    <span className="block text-xs text-slate-500 dark:text-slate-500">{label}</span>
  </div>
);

export default Header;
