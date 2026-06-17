import React, { useState, useRef, useEffect } from 'react';
import { OperationResult, FormErrors } from '../types';

interface AddSongFormProps {
  onSubmit: (title: string, artist: string) => OperationResult;
}

/**
 * Form for adding a new song to the current playlist.
 *
 * - Validates title and artist before submission.
 * - Shows a shake animation + error banner on failure.
 * - Shows a transient success banner after a successful add.
 * - Clears any pending timers on unmount to prevent memory leaks.
 * - Returns focus to the title field after a successful submission.
 */
const AddSongForm: React.FC<AddSongFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isShaking, setIsShaking] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up pending timers when the component unmounts
  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const clearFormError = () => {
    if (errors.form) setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(title, artist);

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' });
      setIsShaking(true);
      shakeTimerRef.current = setTimeout(() => setIsShaking(false), 400);
      return;
    }

    // Reset form and show transient success message
    setTitle('');
    setArtist('');
    setErrors({});
    setJustAdded(true);
    successTimerRef.current = setTimeout(() => setJustAdded(false), 2500);
    titleRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`card p-5 ${isShaking ? 'animate-shake' : ''}`}
      aria-label="Add song form"
      noValidate
    >
      {/* Form heading */}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span
          className="w-6 h-6 rounded-lg bg-brand-600/20 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            className="w-3.5 h-3.5 text-brand-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        Add a Song
      </h3>

      {/* Input row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Title */}
        <div>
          <label
            htmlFor="song-title-input"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
          >
            Song Title <span className="text-red-400" aria-label="required">*</span>
          </label>
          <input
            ref={titleRef}
            id="song-title-input"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearFormError(); }}
            placeholder="e.g. Blinding Lights"
            className="input-field"
            maxLength={120}
            autoComplete="off"
            aria-required="true"
          />
        </div>

        {/* Artist */}
        <div>
          <label
            htmlFor="song-artist-input"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
          >
            Artist <span className="text-red-400" aria-label="required">*</span>
          </label>
          <input
            id="song-artist-input"
            type="text"
            value={artist}
            onChange={(e) => { setArtist(e.target.value); clearFormError(); }}
            placeholder="e.g. The Weeknd"
            className="input-field"
            maxLength={120}
            autoComplete="off"
            aria-required="true"
          />
        </div>
      </div>

      {/* Error banner */}
      {errors.form && (
        <p
          role="alert"
          className="mb-3 text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {errors.form}
        </p>
      )}

      {/* Success banner */}
      {justAdded && (
        <p
          role="status"
          aria-live="polite"
          className="mb-3 text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 animate-fade-in"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Song added successfully!
        </p>
      )}

      <button type="submit" className="btn-primary">
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
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Song
      </button>
    </form>
  );
};

export default AddSongForm;
