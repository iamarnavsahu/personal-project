"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bulkDeletePhotos, deletePhoto } from "@/app/admin/actions";

type Photo = { id: string; filename: string; url: string };

export function PhotosGrid({
  galleryId,
  photos
}: {
  galleryId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(photos.map((p) => p.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function onBulkDelete() {
    const ids = Array.from(selected);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} photo${ids.length === 1 ? "" : "s"}? This can't be undone.`)) return;
    start(async () => {
      await bulkDeletePhotos(galleryId, ids);
      exitSelectMode();
      router.refresh();
    });
  }

  function onSingleDelete(id: string, filename: string) {
    if (!confirm(`Delete ${filename}?`)) return;
    start(async () => {
      await deletePhoto(id);
      router.refresh();
    });
  }

  const allSelected = photos.length > 0 && selected.size === photos.length;

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-0 z-20 -mx-2 mb-3 flex flex-wrap items-center justify-between gap-3 bg-paper/95 px-2 py-3 backdrop-blur">
        <div className="text-sm text-ink/60">
          {selectMode ? (
            <span>
              <strong className="text-ink tabular-nums">{selected.size}</strong>{" "}
              of {photos.length} selected
            </span>
          ) : (
            <span>Hover to delete, or use Select for many</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!selectMode ? (
            <button
              onClick={() => setSelectMode(true)}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-paper"
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={allSelected ? clearSelection : selectAll}
                className="rounded-md border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-paper"
              >
                {allSelected ? "Clear" : "Select all"}
              </button>
              <button
                onClick={onBulkDelete}
                disabled={pending || selected.size === 0}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pending ? "Deleting…" : `Delete ${selected.size || ""}`.trim()}
              </button>
              <button
                onClick={exitSelectMode}
                disabled={pending}
                className="rounded-md border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-ink/5"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Photo grid */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((p) => {
          const isSelected = selected.has(p.id);
          return (
            <li
              key={p.id}
              onClick={selectMode ? () => toggleOne(p.id) : undefined}
              className={`group relative overflow-hidden rounded-md border bg-white transition ${
                selectMode ? "cursor-pointer" : ""
              } ${isSelected ? "border-clay ring-2 ring-clay" : "border-ink/10"}`}
            >
              {p.url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.url}
                  alt={p.filename}
                  loading="lazy"
                  decoding="async"
                  className={`aspect-square w-full object-cover transition ${
                    isSelected ? "opacity-80" : ""
                  }`}
                />
              ) : (
                <div className="aspect-square w-full bg-ink/10" />
              )}

              {/* Selection checkbox */}
              {selectMode && (
                <span
                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ring-2 ${
                    isSelected
                      ? "bg-clay text-paper ring-paper"
                      : "bg-paper/90 text-ink/50 ring-ink/15"
                  }`}
                  aria-hidden
                >
                  {isSelected ? "✓" : ""}
                </span>
              )}

              {/* Single delete (only outside select mode) */}
              {!selectMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSingleDelete(p.id, p.filename);
                  }}
                  disabled={pending}
                  className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs opacity-0 transition group-hover:opacity-100"
                >
                  Delete
                </button>
              )}

              <p className="truncate px-2 py-1 text-xs text-ink/60">{p.filename}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
