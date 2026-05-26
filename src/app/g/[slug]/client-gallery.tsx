"use client";

import { useOptimistic, useState, useTransition } from "react";
import { togglePick, submitPicks } from "./actions";

type Photo = { id: string; filename: string; url: string; picked: boolean };

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
  const [pending, start] = useTransition();
  const [optimistic, applyOptimistic] = useOptimistic(
    photos,
    (state, photoId: string) =>
      state.map((p) => (p.id === photoId ? { ...p, picked: !p.picked } : p))
  );
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [submitted, setSubmitted] = useState(isLocked);
  const pickedCount = optimistic.filter((p) => p.picked).length;

  function toggle(p: Photo) {
    if (submitted) return;
    start(async () => {
      applyOptimistic(p.id);
      await togglePick(galleryId, p.id, slug);
    });
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!optimistic.length && <p className="text-ink/60">No photos in this gallery yet.</p>}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {optimistic.map((p) => (
            <li key={p.id} className="group relative overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.filename}
                onClick={() => setLightbox(p)}
                className="aspect-square w-full cursor-zoom-in object-cover"
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

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.url} alt={lightbox.filename} className="max-h-full max-w-full object-contain" />
          <button
            onClick={(e) => { e.stopPropagation(); toggle(lightbox); }}
            disabled={submitted}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 font-medium shadow ${
              lightbox.picked ? "bg-ink text-paper" : "bg-paper text-ink"
            }`}
          >
            {lightbox.picked ? "★ Picked" : "☆ Pick this"}
          </button>
        </div>
      )}
    </div>
  );
}
