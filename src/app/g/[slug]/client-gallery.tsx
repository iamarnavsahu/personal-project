"use client";

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePick, submitPicks, relockGallery } from "./actions";

type Photo = { id: string; filename: string; url: string; fullUrl: string; picked: boolean };

export function ClientGallery({
  galleryId, slug, title, clientName, isLocked, photos
}: {
  galleryId: string;
  slug: string;
  title: string;
  clientName: string | null;
  isLocked: boolean;
  photos: Photo[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimistic, applyOptimistic] = useOptimistic(
    photos,
    (state, photoId: string) =>
      state.map((p) => (p.id === photoId ? { ...p, picked: !p.picked } : p))
  );
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(isLocked);
  const pickedCount = optimistic.filter((p) => p.picked).length;
  const touchStartX = useRef<number>(0);

  const currentPhoto = lightboxIdx !== null ? optimistic[lightboxIdx] : null;

  function toggle(p: Photo) {
    if (submitted) return;
    start(async () => {
      applyOptimistic(p.id);
      await togglePick(galleryId, p.id, slug);
    });
  }

  function next() {
    setLightboxIdx((i) =>
      i === null || optimistic.length === 0 ? i : (i + 1) % optimistic.length
    );
  }
  function prev() {
    setLightboxIdx((i) =>
      i === null || optimistic.length === 0
        ? i
        : (i - 1 + optimistic.length) % optimistic.length
    );
  }

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setLightboxIdx(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, optimistic.length]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightboxIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIdx]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) prev();
    else next();
  }

  function onSubmit() {
    if (!pickedCount) {
      alert("Pick at least one photo first.");
      return;
    }
    if (!confirm(`Send ${pickedCount} favorite${pickedCount === 1 ? "" : "s"} to your photographer? You won't be able to change them after.`)) return;
    start(async () => {
      await submitPicks(galleryId, slug);
      setSubmitted(true);
    });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
            <div className="border-l border-ink/15 pl-3">
              <h1 className="text-lg font-bold leading-tight">{title}</h1>
              {clientName && <p className="text-xs text-ink/60">for {clientName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              <strong>{pickedCount}</strong> picked
            </span>
            {submitted ? (
              <span className="border border-ink/30 px-3 py-1 text-xs uppercase tracking-widest text-ink/70">✓ Submitted</span>
            ) : (
              <button onClick={onSubmit} disabled={pending} className="btn btn-primary text-xs">
                Submit picks
              </button>
            )}
            <button
              onClick={() => {
                if (!confirm("Sign out of this gallery? You'll need the passcode again to view it.")) return;
                start(async () => {
                  await relockGallery(galleryId, slug);
                  router.refresh();
                });
              }}
              disabled={pending}
              title="Sign out — re-enter passcode next visit"
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition hover:border-ink hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!optimistic.length && <p className="text-ink/60">No photos in this gallery yet.</p>}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {optimistic.map((p, idx) => (
            <li key={p.id} className="group relative overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.filename}
                loading="lazy"
                decoding="async"
                onClick={() => setLightboxIdx(idx)}
                className="aspect-square w-full cursor-zoom-in bg-ink/5 object-cover"
              />
              <button
                onClick={() => toggle(p)}
                disabled={submitted}
                aria-label={p.picked ? "Unpick" : "Pick"}
                className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-lg shadow transition ${
                  p.picked ? "bg-ink text-paper" : "bg-paper/90 text-ink hover:bg-paper"
                }`}
              >
                {p.picked ? "★" : "☆"}
              </button>
            </li>
          ))}
        </ul>
      </main>

      {currentPhoto && lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-30 flex select-none items-center justify-center bg-black/95 p-4"
        >
          {/* Close (top-right) */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            aria-label="Close"
            className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Counter (top-left) */}
          <div className="absolute left-4 top-4 z-40 rounded-full bg-white/10 px-3 py-1.5 text-xs tabular-nums text-paper backdrop-blur">
            {lightboxIdx + 1} / {optimistic.length}
          </div>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentPhoto.id}
            src={currentPhoto.fullUrl || currentPhoto.url}
            alt={currentPhoto.filename}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full select-none object-contain"
            draggable={false}
          />

          {/* Prev */}
          {optimistic.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next */}
          {optimistic.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}

          {/* Pick toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); toggle(currentPhoto); }}
            disabled={submitted}
            className={`absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full px-6 py-2.5 text-sm font-medium shadow-lg transition ${
              currentPhoto.picked ? "bg-clay text-paper" : "bg-paper text-ink hover:bg-white"
            }`}
          >
            {currentPhoto.picked ? "★ Picked" : "☆ Pick this"}
          </button>

          {/* Preload neighbours for snappier swipes / arrow taps */}
          {optimistic.length > 1 && (
            <div className="hidden" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optimistic[(lightboxIdx + 1) % optimistic.length]?.fullUrl} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  optimistic[(lightboxIdx - 1 + optimistic.length) % optimistic.length]?.fullUrl
                }
                alt=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
