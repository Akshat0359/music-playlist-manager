import React, { useState } from 'react';
import { Song } from '../types';

interface SongRowProps {
  song: Song;
  index: number;
  onRemove: (id: string) => void;
}

/**
 * Displays a single song row with index, title, artist, and remove action.
 */
const SongRow: React.FC<SongRowProps> = ({ song, index, onRemove }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-700/60 transition-all duration-150 animate-slide-up"
      role="listitem"
    >
      {/* Track number */}
      <span
        className="w-7 text-right text-sm font-mono text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-500 flex-shrink-0 select-none"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Song icon */}
      <div className="w-8 h-8 rounded-lg bg-surface-600 group-hover:bg-brand-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
        <svg
          className="w-4 h-4 text-slate-500 dark:text-slate-500 group-hover:text-brand-400 transition-colors"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
        </svg>
      </div>

      {/* Title & Artist */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">{song.title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{song.artist}</p>
      </div>

      {/* Remove action */}
      {!isConfirming ? (
        <button
          onClick={() => setIsConfirming(true)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0 p-1.5 rounded-lg text-slate-500 dark:text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          aria-label={`Remove "${song.title}" by ${song.artist}`}
          title="Remove song"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center gap-1.5 flex-shrink-0 animate-scale-in" role="group" aria-label="Confirm removal">
          <button
            onClick={() => onRemove(song.id)}
            className="px-2.5 py-1 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors"
            aria-label="Confirm remove"
          >
            Remove
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="px-2.5 py-1 rounded-md bg-surface-600 hover:bg-surface-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            aria-label="Cancel"
          >
            Keep
          </button>
        </div>
      )}
    </div>
  );
};

export default SongRow;
