import React, { useState, useRef, useEffect } from 'react';
import { OperationResult, FormErrors } from '../types';

interface CreatePlaylistFormProps {
  onSubmit: (name: string) => OperationResult;
}

/**
 * Expandable inline form for creating a new playlist.
 *
 * - Collapsed by default; expands into a card form on click.
 * - Auto-focuses the name input when expanded.
 * - Supports Escape key to cancel.
 * - Shows inline error with shake animation on failure.
 * - Collapses and resets on successful submission.
 */
const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isShaking, setIsShaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when form expands
  useEffect(() => {
    if (isExpanded) {
      // Small delay lets the CSS scale-in animation start first
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isExpanded]);

  const reset = () => {
    setName('');
    setErrors({});
    setIsExpanded(false);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(name);

    if (!result.success) {
      setErrors({ name: result.error ?? 'Something went wrong.' });
      triggerShake();
      return;
    }

    reset();
  };

  const handleCancel = () => reset();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Clear error as user types
    if (errors.name) setErrors({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') reset();
  };

  if (!isExpanded) {
    return (
      <button
        id="create-playlist-btn"
        onClick={() => setIsExpanded(true)}
        className="btn-primary w-full sm:w-auto"
        aria-label="Create a new playlist"
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
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Playlist
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={`card p-4 w-full sm:max-w-sm animate-scale-in ${isShaking ? 'animate-shake' : ''}`}
      aria-label="Create playlist form"
      noValidate
    >
      <label
        htmlFor="playlist-name-input"
        className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2"
      >
        Playlist Name
      </label>

      <div className="space-y-3">
        <div>
          <input
            ref={inputRef}
            id="playlist-name-input"
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="e.g. Late Night Vibes"
            className={`input-field ${errors.name ? 'error' : ''}`}
            maxLength={80}
            aria-describedby={errors.name ? 'playlist-name-error' : undefined}
            aria-invalid={!!errors.name}
            autoComplete="off"
          />

          {errors.name && (
            <p
              id="playlist-name-error"
              role="alert"
              className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Create
          </button>
          <button type="button" onClick={handleCancel} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePlaylistForm;
