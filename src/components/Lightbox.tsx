import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelinePhoto } from '../types';

interface LightboxProps {
  photos: TimelinePhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photos, index, onClose, onNavigate }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const photo = photos[index];

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!photo) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${photos.length}`}
      className="fixed inset-0 z-[1100] flex flex-col bg-black/92 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white/70">
        <span className="text-[12px] font-semibold uppercase tracking-wider">
          {index + 1} / {photos.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Fermer la visionneuse"
          className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-2 px-3 pb-2 min-h-0">
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Photo précédente"
            className="hidden sm:flex shrink-0 p-3 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <img
          src={photo.image_url}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />

        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Photo suivante"
            className="hidden sm:flex shrink-0 p-3 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {photo.caption && (
        <p
          onClick={(e) => e.stopPropagation()}
          className="px-6 pb-6 pt-2 text-center text-[14px] text-white/75 max-w-[720px] mx-auto"
        >
          {photo.caption}
        </p>
      )}

      {photos.length > 1 && (
        <div className="sm:hidden flex items-center justify-center gap-6 pb-6 text-white/70">
          <button type="button" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Photo précédente" className="p-3 rounded-full hover:bg-white/10">
            <ChevronLeft size={24} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Photo suivante" className="p-3 rounded-full hover:bg-white/10">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
