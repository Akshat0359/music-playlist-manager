import React, { useState } from 'react';
import { Playlist } from '../types';
import { pluralize, formatDate, getPlaylistHue } from '../utils/helpers';

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Displays a single playlist as a card.
 * Includes a color-coded accent bar derived from the playlist name,
 * song count, creation date, and an inline two-step delete confirmation.
 */
const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const songCount = playlist.songs.length;
  const hue = getPlaylistHue(playlist.name);

  // CSS color strings – using valid hsla() syntax
  const accentColor = `hsl(${hue} 65% 60%)`;
  const iconBg = `hsla(${hue}, 65%, 60%, 0.15)`;
  const iconFg = `hsl(${hue} 65% 70%)`;

  const handleCardClick = () => {
    if (!isConfirmingDelete) onSelect(playlist.id);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConfirmingDelete) onSelect(playlist.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(playlist.id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  return (
    <article
      className="card card-hover cursor-pointer group animate-slide-up overflow-hidden relative z-0"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open playlist: ${playlist.name}`}
    >
      {/* Dynamic ambient background glow based on hue */}
      <div 
        className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, hsla(${hue}, 65%, 60%, 0.1), transparent 60%)`
        }}
        aria-hidden="true"
      />

      {/* Color accent bar */}
      <div
        className="h-1.5 w-full flex-shrink-0 transition-all duration-300 group-hover:brightness-110"
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      <div className="p-5">
        {/* Top row: icon + name + delete control */}
        <div className="flex items-start justify-between gap-3">

          {/* Icon + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: iconBg, color: iconFg }}
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5"
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
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight group-hover:text-brand-300 transition-colors duration-150">
                {playlist.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                Created {formatDate(playlist.createdAt)}
              </p>
            </div>
          </div>

          {/* Delete control */}
          {!isConfirmingDelete ? (
            <button
              onClick={handleDeleteClick}
              className="btn-danger opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0 p-2"
              aria-label={`Delete playlist: ${playlist.name}`}
              title="Delete playlist"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          ) : (
            <div
              className="flex items-center gap-2 flex-shrink-0 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
              role="group"
              aria-label="Confirm playlist deletion"
            >
              <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">Delete?</span>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 active:bg-red-600 text-white text-xs font-semibold transition-colors"
                aria-label={`Confirm delete playlist: ${playlist.name}`}
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1.5 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          )}
        </div>

        {/* Footer: song count + open hint */}
        <div className="mt-4 flex items-center justify-between">
          <span className="badge-purple">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
            {pluralize(songCount, 'song')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
            View all
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default PlaylistCard;
