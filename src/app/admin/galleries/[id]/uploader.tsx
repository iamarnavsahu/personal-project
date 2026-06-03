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

    // Upload in chunks of 12 — each chunk uploads its files in parallel
    // on the server, so the wall-clock time scales with chunk count, not
    // file count. Two chunks fire concurrently as well.
    start(async () => {
      try {
        const chunkSize = 12;
        const chunks: File[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          chunks.push(arr.slice(i, i + chunkSize));
        }

        let done = 0;
        // Two-at-a-time concurrency on the client side too.
        const concurrency = 2;
        let cursor = 0;
        async function worker() {
          while (cursor < chunks.length) {
            const idx = cursor++;
            const chunk = chunks[idx];
            const fd = new FormData();
            fd.append("galleryId", galleryId);
            chunk.forEach((file) => fd.append("files", file));
            await uploadPhotos(fd);
            done += chunk.length;
            setProgress(`Uploaded ${done} of ${arr.length}…`);
          }
        }
        await Promise.all(Array.from({ length: concurrency }, worker));

        setProgress("");
        router.refresh();
      } catch (e: any) {
        setErr(e?.message || "Upload failed");
        setProgress("");
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
