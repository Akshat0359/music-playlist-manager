import React, { useState } from 'react';
import { Playlist, OperationResult } from '../types';
import AddSongForm from '../components/AddSongForm';
import SongRow from '../components/SongRow';
import EmptyState from '../components/EmptyState';
import { pluralize, formatDate, getPlaylistHue } from '../utils/helpers';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onAddSong: (title: string, artist: string) => OperationResult;
  onRemoveSong: (songId: string) => void;
  onBack: () => void;
  onDeletePlaylist: (id: string) => void;
}

/**
 * Detailed view for a single playlist.
 * Shows the playlist hero card, add-song form, and the song track list.
 * Includes a two-step delete confirmation on the playlist itself.
 */
const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  onAddSong,
  onRemoveSong,
  onBack,
  onDeletePlaylist,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const songCount = playlist.songs.length;
  const hue = getPlaylistHue(playlist.name);

  // Valid CSS color strings
  const gradientBg = `linear-gradient(90deg, hsl(${hue} 65% 50%), hsl(${(hue + 60) % 360} 65% 60%))`;
  const iconBg = `hsla(${hue}, 65%, 60%, 0.15)`;
  const iconFg = `hsl(${hue} 65% 70%)`;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Back navigation */}
      <button
        onClick={onBack}
        className="btn-ghost mb-6 -ml-2"
        aria-label="Go back to all playlists"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All Playlists
      </button>

      {/* Playlist hero card */}
      <div className="card overflow-hidden mb-6">
        {/* Gradient accent bar */}
        <div
          className="h-2 w-full"
          style={{ background: gradientBg }}
          aria-hidden="true"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* Icon + title + date */}
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBg, color: iconFg }}
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {playlist.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Created {formatDate(playlist.createdAt)}
                </p>
              </div>
            </div>

            {/* Stats + delete */}
            <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
              <span className="badge-purple text-sm px-3 py-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
                {pluralize(songCount, 'song')}
              </span>

              {!isConfirmingDelete ? (
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="btn-danger border border-red-500/20"
                  aria-label={`Delete playlist: ${playlist.name}`}
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
                  Delete Playlist
                </button>
              ) : (
                <div
                  className="flex items-center gap-2 animate-scale-in"
                  role="group"
                  aria-label="Confirm playlist deletion"
                >
                  <span className="text-xs text-slate-600 dark:text-slate-400">Delete this playlist?</span>
                  <button
                    onClick={() => onDeletePlaylist(playlist.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 active:bg-red-600 text-white text-xs font-semibold transition-colors"
                    aria-label="Confirm delete playlist"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-3 py-1.5 rounded-lg bg-surface-600 hover:bg-surface-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                    aria-label="Cancel delete"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add song form */}
      <div className="mb-6">
        <AddSongForm onSubmit={onAddSong} />
      </div>

      {/* Song track list */}
      <section aria-label={`Songs in ${playlist.name}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            Tracks
          </h2>
          {songCount > 0 && (
            <span className="badge-slate" aria-label={`${songCount} tracks`}>
              {songCount}
            </span>
          )}
        </div>

        {songCount === 0 ? (
          <div className="card">
            <EmptyState variant="songs" />
          </div>
        ) : (
          <div
            className="card divide-y divide-surface-700/60 overflow-hidden"
            role="list"
            aria-label="Track list"
          >
            {playlist.songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                onRemove={onRemoveSong}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PlaylistDetailView;
