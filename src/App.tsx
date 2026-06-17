import { useState, useCallback } from 'react';
import Header from './components/Header';
import PlaylistsView from './views/PlaylistsView';
import PlaylistDetailView from './views/PlaylistDetailView';
import { usePlaylists } from './hooks/usePlaylists';
import { OperationResult } from './types';

/**
 * Root application component.
 *
 * Owns the single piece of navigation state: which playlist (if any) is open.
 * All data operations are delegated to usePlaylists.
 *
 * View routing:
 *   - selectedPlaylistId === null  → PlaylistsView (grid of all playlists)
 *   - selectedPlaylistId !== null  → PlaylistDetailView (single playlist)
 *
 * Edge case: if the currently viewed playlist is deleted (from the detail view),
 * navigation automatically returns to the list view.
 */
function App() {
  const {
    playlists,
    totalSongs,
    createPlaylist,
    deletePlaylist,
    addSong,
    removeSong,
    getPlaylist,
  } = usePlaylists();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // Derive the current playlist object. May be undefined if the id was deleted.
  const selectedPlaylist = selectedPlaylistId
    ? getPlaylist(selectedPlaylistId)
    : undefined;

  const handleSelectPlaylist = useCallback((id: string) => {
    setSelectedPlaylistId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedPlaylistId(null);
  }, []);

  /**
   * Delete a playlist by id. If it is the currently open one, return to list.
   */
  const handleDeletePlaylist = useCallback(
    (id: string) => {
      deletePlaylist(id);
      if (selectedPlaylistId === id) {
        setSelectedPlaylistId(null);
      }
    },
    [deletePlaylist, selectedPlaylistId]
  );

  /**
   * Add a song to the selected playlist.
   * Returns an OperationResult so the form can show validation feedback.
   */
  const handleAddSong = useCallback(
    (title: string, artist: string): OperationResult => {
      if (!selectedPlaylistId) {
        return { success: false, error: 'No playlist selected.' };
      }
      return addSong(selectedPlaylistId, title, artist);
    },
    [addSong, selectedPlaylistId]
  );

  const handleRemoveSong = useCallback(
    (songId: string) => {
      if (!selectedPlaylistId) return;
      removeSong(selectedPlaylistId, songId);
    },
    [removeSong, selectedPlaylistId]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header playlistCount={playlists.length} songCount={totalSongs} />

      {/* View routing: show detail if a valid playlist is selected, else list */}
      {selectedPlaylist ? (
        <PlaylistDetailView
          playlist={selectedPlaylist}
          onAddSong={handleAddSong}
          onRemoveSong={handleRemoveSong}
          onBack={handleBack}
          onDeletePlaylist={handleDeletePlaylist}
        />
      ) : (
        <PlaylistsView
          playlists={playlists}
          onCreatePlaylist={createPlaylist}
          onSelectPlaylist={handleSelectPlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t border-surface-700/50">
        <p className="text-xs text-slate-400 dark:text-slate-600">
          Harmonix &mdash; Your music, organized beautifully.
        </p>
      </footer>
    </div>
  );
}

export default App;
