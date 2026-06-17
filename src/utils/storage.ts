import { Playlist, Song } from '../types';

const STORAGE_KEY = 'harmonix_playlists_v1';

// ─── Schema validators ────────────────────────────────────────────────────────

/**
 * Returns true only if `value` is a non-empty string.
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates and sanitizes a single Song object.
 * Returns `null` if the record is irreparably corrupt.
 */
function parseSong(raw: unknown): Song | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  if (!isNonEmptyString(r.id)) return null;
  if (!isNonEmptyString(r.title)) return null;
  if (!isNonEmptyString(r.artist)) return null;

  return {
    id: r.id as string,
    title: (r.title as string).trim(),
    artist: (r.artist as string).trim(),
    createdAt:
      typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString(),
  };
}

/**
 * Validates and sanitizes a single Playlist object.
 * Drops any individual songs that fail validation rather than discarding
 * the whole playlist.
 * Returns `null` if the playlist itself is irreparably corrupt.
 */
function parsePlaylist(raw: unknown): Playlist | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  if (!isNonEmptyString(r.id)) return null;
  if (!isNonEmptyString(r.name)) return null;

  const rawSongs = Array.isArray(r.songs) ? r.songs : [];
  const songs: Song[] = rawSongs.reduce<Song[]>((acc, s) => {
    const song = parseSong(s);
    if (song) acc.push(song);
    return acc;
  }, []);

  return {
    id: r.id as string,
    name: (r.name as string).trim(),
    createdAt:
      typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString(),
    songs,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Loads and validates playlists from localStorage.
 * Gracefully handles missing data, JSON parse errors, and corrupt records.
 * Always returns a usable array — never throws.
 */
export function loadPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.reduce<Playlist[]>((acc, item) => {
      const playlist = parsePlaylist(item);
      if (playlist) acc.push(playlist);
      return acc;
    }, []);
  } catch {
    // JSON parse error or localStorage unavailable – start fresh
    return [];
  }
}

/**
 * Persists playlists to localStorage.
 * Silently handles storage quota exceeded or unavailable environments.
 */
export function savePlaylists(playlists: Playlist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  } catch {
    // Storage quota exceeded or unavailable – no-op
  }
}
