import React from 'react';

interface EmptyStateProps {
  variant: 'playlists' | 'songs' | 'search';
}

/**
 * Friendly empty state illustrations for playlists and songs views.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ variant }) => {
  if (variant === 'playlists') {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in border border-dashed border-surface-600 rounded-3xl bg-surface-800/50">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-[2rem] bg-surface-700/80 border border-surface-500 shadow-xl flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-14 h-14 text-brand-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          {/* Floating dots */}
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-500 animate-pulse shadow-glow-sm" aria-hidden="true" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-brand-700 animate-pulse shadow-glow-sm" style={{ animationDelay: '300ms' }} aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No playlists yet</h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
          Create your first playlist to start organizing your music collection.
          Hit <strong className="text-slate-700 dark:text-slate-200 font-semibold">New Playlist</strong> above to get started.
        </p>
      </div>
    );
  }

  if (variant === 'search') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in border border-dashed border-surface-600 rounded-3xl bg-surface-800/30">
        <div className="w-20 h-20 rounded-[1.5rem] bg-surface-700/80 border border-surface-500 flex items-center justify-center mb-5 shadow-lg backdrop-blur-sm">
          <svg
            className="w-10 h-10 text-slate-500 dark:text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No matching playlists or songs</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
          Try adjusting your search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in bg-surface-800/30 rounded-2xl border border-dashed border-surface-600 m-4">
      <div className="w-20 h-20 rounded-[1.5rem] bg-surface-700/80 border border-surface-500 flex items-center justify-center mb-5 shadow-lg backdrop-blur-sm">
        <svg
          className="w-10 h-10 text-slate-500 dark:text-slate-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No songs yet</h3>
      <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs leading-relaxed">
        Use the form above to add your first track to this playlist.
      </p>
    </div>
  );
};

export default EmptyState;
