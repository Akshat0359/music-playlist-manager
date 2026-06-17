/**
 * Normalizes a string for duplicate-checking:
 * trims whitespace and lowercases.
 */
export function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Formats an ISO timestamp into a short human-readable date.
 * Returns 'Unknown date' if the timestamp is invalid.
 * e.g. "Jun 16, 2026"
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a grammatically correct count label.
 * e.g. pluralize(1, 'song') => '1 song'
 *      pluralize(3, 'song') => '3 songs'
 */
export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count !== 1 ? 's' : ''}`;
}

/**
 * Derives a stable HSL hue (0–359) from a playlist name.
 * The same name always produces the same hue — no random values on re-render.
 */
export function getPlaylistHue(name: string): number {
  return (
    Math.abs(name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) %
    360
  );
}
