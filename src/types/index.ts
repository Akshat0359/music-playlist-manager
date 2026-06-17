/** Represents a single song within a playlist */
export interface Song {
  id: string;
  title: string;
  artist: string;
  createdAt: string; // ISO 8601 timestamp
}

/** Represents a playlist containing songs */
export interface Playlist {
  id: string;
  name: string;
  createdAt: string; // ISO 8601 timestamp
  songs: Song[];
}

/** Result returned by all write operations – enables typed success/error handling */
export interface OperationResult {
  success: boolean;
  error?: string;
}

/** Validation errors keyed by field name */
export type FormErrors = Record<string, string>;
