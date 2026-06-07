"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  preparePhotoUploads,
  finalizePhotoUploads,
  type PreparedUpload
} from "@/app/admin/actions";

const BATCH_SIZE = 15;
const UPLOAD_CONCURRENCY = 4;

async function uploadOne(file: File, item: PreparedUpload) {
  const res = await fetch(item.signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": item.contentType }
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `${file.name}: upload failed (${res.status})${detail ? ` — ${detail.slice(0, 120)}` : ""}`
    );
  }
}

async function uploadBatch(files: File[], items: PreparedUpload[], onProgress: () => void) {
  let cursor = 0;
  const total = items.length;
  const workers = Array.from({ length: Math.min(UPLOAD_CONCURRENCY, total) }, async () => {
    while (cursor < total) {
      const i = cursor++;
      await uploadOne(files[i], items[i]);
      onProgress();
    }
  });
  await Promise.all(workers);
}

export function Uploader({ galleryId }: { galleryId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick() {
    inputRef.current?.click();
  }

  function resetInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setErr(null);
    setPending(true);

    const arr = Array.from(files);
    let done = 0;

    try {
      for (let offset = 0; offset < arr.length; offset += BATCH_SIZE) {
        const batch = arr.slice(offset, offset + BATCH_SIZE);
        const batchNum = Math.floor(offset / BATCH_SIZE) + 1;
        const batchTotal = Math.ceil(arr.length / BATCH_SIZE);

        setProgress(`Preparing batch ${batchNum} of ${batchTotal}…`);
        const { items } = await preparePhotoUploads(
          galleryId,
          batch.map((f) => ({ name: f.name, type: f.type, size: f.size }))
        );

        await uploadBatch(batch, items, () => {
          done++;
          setProgress(`Uploaded ${done} of ${arr.length}…`);
        });

        setProgress(`Saving batch ${batchNum} of ${batchTotal}…`);
        await finalizePhotoUploads(
          galleryId,
          items.map((item) => ({
            path: item.path,
            filename: item.filename,
            sortOrder: item.sortOrder
          }))
        );
        router.refresh();
      }

      setProgress(`Done — ${arr.length} photo${arr.length === 1 ? "" : "s"} uploaded.`);
      resetInput();
      router.refresh();
      setTimeout(() => setProgress(""), 3000);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
      setProgress("");
      resetInput();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3">
      <div
        onClick={onPick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="cursor-pointer border-2 border-dashed border-ink/20 p-8 text-center transition hover:border-ink"
      >
        <p className="font-medium">Drop JPEGs here or click to choose</p>
        <p className="text-sm text-ink/60">
          Uploads go straight to Supabase (not through Vercel). Up to 25 MB per photo.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {pending && <p className="mt-2 text-sm text-ink/60">{progress || "Uploading…"}</p>}
      {!pending && progress && <p className="mt-2 text-sm text-green-700">{progress}</p>}
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </div>
  );
}
