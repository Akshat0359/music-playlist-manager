import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Playlist, Song, OperationResult } from '../types';
import { loadPlaylists, savePlaylists } from '../utils/storage';
import { normalize } from '../utils/helpers';

export interface UsePlaylists {
  playlists: Playlist[];
  totalSongs: number;
  createPlaylist: (name: string) => OperationResult;
  deletePlaylist: (id: string) => void;
  addSong: (playlistId: string, title: string, artist: string) => OperationResult;
  removeSong: (playlistId: string, songId: string) => void;
  getPlaylist: (id: string) => Playlist | undefined;
}

/**
 * Core state management hook for all playlist operations.
 *
 * Design decisions:
 * - State is initialized lazily from localStorage (avoids a synchronous read on
 *   every render cycle).
 * - A useEffect syncs state to localStorage after every successful mutation.
 * - `addSong` validates BEFORE calling setPlaylists to avoid the anti-pattern
 *   of reading external state inside a state updater.
 * - All write operations return an OperationResult so callers get typed
 *   success/error feedback without exceptions.
 */
export function usePlaylists(): UsePlaylists {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => loadPlaylists());

  // Persist to localStorage on every state change
  useEffect(() => {
    savePlaylists(playlists);
  }, [playlists]);

  const totalSongs = playlists.reduce((sum, p) => sum + p.songs.length, 0);

  // ── Create ──────────────────────────────────────────────────────────────────

  const createPlaylist = useCallback(
    (name: string): OperationResult => {
      const trimmed = name.trim();
      if (!trimmed) {
        return { success: false, error: 'Playlist name is required.' };
      }
      if (trimmed.length > 80) {
        return { success: false, error: 'Playlist name must be 80 characters or fewer.' };
      }

      // Duplicate check is done against current playlists state captured by
      // this callback. The useCallback dep array includes `playlists` so this
      // is always fresh.
      const isDuplicate = playlists.some(
        (p) => normalize(p.name) === normalize(trimmed)
      );
      if (isDuplicate) {
        return { success: false, error: 'A playlist with this name already exists.' };
      }

      const newPlaylist: Playlist = {
        id: uuidv4(),
        name: trimmed,
        createdAt: new Date().toISOString(),
        songs: [],
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      return { success: true };
    },
    [playlists]
  );

  // ── Delete ──────────────────────────────────────────────────────────────────

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Add song ────────────────────────────────────────────────────────────────

  const addSong = useCallback(
    (playlistId: string, title: string, artist: string): OperationResult => {
      const trimmedTitle = title.trim();
      const trimmedArtist = artist.trim();

      // Validate inputs before touching state
      if (!trimmedTitle) {
        return { success: false, error: 'Song title is required.' };
      }
      if (trimmedTitle.length > 120) {
        return { success: false, error: 'Song title must be 120 characters or fewer.' };
      }
      if (!trimmedArtist) {
        return { success: false, error: 'Artist name is required.' };
      }
      if (trimmedArtist.length > 120) {
        return { success: false, error: 'Artist name must be 120 characters or fewer.' };
      }

      // Find the target playlist from current state for duplicate checking.
      // This must happen OUTSIDE the setPlaylists updater to avoid reading
      // stale closure values inside an async state batch.
      const target = playlists.find((p) => p.id === playlistId);
      if (!target) {
        return { success: false, error: 'Playlist not found.' };
      }

      const isDuplicate = target.songs.some(
        (s) =>
          normalize(s.title) === normalize(trimmedTitle) &&
          normalize(s.artist) === normalize(trimmedArtist)
      );
      if (isDuplicate) {
        return {
          success: false,
          error: 'This song by this artist already exists in the playlist.',
        };
      }

      const newSong: Song = {
        id: uuidv4(),
        title: trimmedTitle,
        artist: trimmedArtist,
        createdAt: new Date().toISOString(),
      };

      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, songs: [...p.songs, newSong] } : p
        )
      );

      return { success: true };
    },
    [playlists]
  );

  // ── Remove song ─────────────────────────────────────────────────────────────

  const removeSong = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p
      )
    );
  }, []);

  // ── Lookup ──────────────────────────────────────────────────────────────────

  const getPlaylist = useCallback(
    (id: string): Playlist | undefined => playlists.find((p) => p.id === id),
    [playlists]
  );

  return {
    playlists,
    totalSongs,
    createPlaylist,
    deletePlaylist,
    addSong,
    removeSong,
    getPlaylist,
  };
}
