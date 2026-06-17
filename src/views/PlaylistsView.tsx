import React, { useState, useMemo } from 'react';
import { Playlist } from '../types';
import PlaylistCard from '../components/PlaylistCard';
import CreatePlaylistForm from '../components/CreatePlaylistForm';
import EmptyState from '../components/EmptyState';
import { pluralize } from '../utils/helpers';

interface PlaylistsViewProps {
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => { success: boolean; error?: string };
  onSelectPlaylist: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
}

/**
 * The main playlists listing page.
 * Shows the create form, a grid of playlist cards, or an empty state.
 * Features an instant client-side search across playlists and songs.
 */
const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  onCreatePlaylist,
  onSelectPlaylist,
  onDeletePlaylist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const totalSongs = playlists.reduce((sum, p) => sum + p.songs.length, 0);
  const uniqueArtists = new Set(
    playlists.flatMap((p) => p.songs.map((s) => s.artist.toLowerCase()))
  ).size;

  // Client-side search logic: filters playlists by name or by song title/artist
  const filteredPlaylists = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return playlists;

    return playlists.filter((playlist) => {
      // Match playlist name
      if (playlist.name.toLowerCase().includes(normalizedQuery)) return true;

      // Match any song title or artist within the playlist
      return playlist.songs.some(
        (song) =>
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [playlists, searchQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            Your Library
          </h2>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            {playlists.length > 0 ? (
              <>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {pluralize(playlists.length, 'playlist')}
                </span>
                <span className="w-1 h-1 rounded-full bg-surface-600" aria-hidden="true" />
                <span>{pluralize(totalSongs, 'song')}</span>
                {uniqueArtists > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-surface-600" aria-hidden="true" />
                    <span>{pluralize(uniqueArtists, 'artist')}</span>
                  </>
                )}
              </>
            ) : (
              'Start building your music library'
            )}
          </div>
        </div>
        <div className="w-full md:w-auto">
          <CreatePlaylistForm onSubmit={onCreatePlaylist} />
        </div>
      </div>

      {/* Search Bar */}
      {playlists.length > 0 && (
        <div className="mb-10 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-slate-500 dark:text-slate-500 group-focus-within:text-brand-400 transition-colors duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            id="library-search-input"
            type="text"
            className="input-field pl-11 py-3.5 rounded-2xl shadow-sm"
            placeholder="Search playlists, songs, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search your library"
          />
        </div>
      )}

      {/* Content */}
      {playlists.length === 0 ? (
        <EmptyState variant="playlists" />
      ) : filteredPlaylists.length === 0 ? (
        <EmptyState variant="search" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onSelect={onSelectPlaylist}
              onDelete={onDeletePlaylist}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default PlaylistsView;
