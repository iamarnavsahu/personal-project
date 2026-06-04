"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadPhotos } from "@/app/admin/actions";

export function Uploader({ galleryId }: { galleryId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick() { inputRef.current?.click(); }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setErr(null);
    const arr = Array.from(files);

    // Upload in chunks. Each chunk goes to a single Vercel server-action
    // invocation, which has a wall-clock execution limit. We keep chunks
    // small (6 files) so even multi-megabyte JPEGs finish well under the
    // limit, and run them sequentially to avoid lost rows when two chunks
    // hit the same gallery's sort_order calculation simultaneously.
    start(async () => {
      try {
        const chunkSize = 6;
        const chunks: File[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          chunks.push(arr.slice(i, i + chunkSize));
        }

        let done = 0;
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const fd = new FormData();
          fd.append("galleryId", galleryId);
          chunk.forEach((file) => fd.append("files", file));
          try {
            await uploadPhotos(fd);
          } catch (chunkErr: any) {
            // Surface per-chunk failures with context — and stop, so the
            // photographer isn't left wondering why N photos are missing.
            const after = done;
            const within = chunk.length;
            throw new Error(
              `${chunkErr?.message || "Upload failed"} (after ${after} of ${arr.length}; stopped on the next batch of ${within})`
            );
          }
          done += chunk.length;
          setProgress(`Uploaded ${done} of ${arr.length}…`);
          /* Refresh the grid mid-batch so the photographer sees photos
             land as they upload, instead of waiting for the whole set. */
          router.refresh();
        }

        setProgress("");
        router.refresh();
      } catch (e: any) {
        setErr(e?.message || "Upload failed");
        setProgress("");
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-3">
      <div
        onClick={onPick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        className="cursor-pointer border-2 border-dashed border-ink/20 p-8 text-center transition hover:border-ink"
      >
        <p className="font-medium">Drop JPEGs here or click to choose</p>
        <p className="text-sm text-ink/60">PNGs work too. Up to 50MB per batch.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {pending && <p className="mt-2 text-sm text-ink/60">{progress || "Uploading…"}</p>}
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </div>
  );
}
