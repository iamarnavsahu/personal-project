"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resyncPicksFolder } from "@/app/admin/actions";

type PickedPhoto = {
  id: string;
  filename: string;
  url: string;
  picksPath: string;
};

export function PicksSection({
  galleryId,
  galleryName,
  isLocked,
  picks
}: {
  galleryId: string;
  galleryName: string;
  isLocked: boolean;
  picks: PickedPhoto[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [syncPending, startSync] = useTransition();
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onDownloadPicks() {
    if (!picks.length || downloadProgress !== null) return;
    setErr(null);
    setDownloadProgress(0);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      let done = 0;
      const total = picks.length;

      for (let i = 0; i < picks.length; i++) {
        const p = picks[i];
        const res = await fetch(p.url);
        if (!res.ok) throw new Error(`Could not fetch ${p.filename}`);
        const blob = await res.blob();
        zip.file(`${String(i + 1).padStart(4, "0")}-${p.filename}`, blob);
        done++;
        setDownloadProgress(Math.round((done / total) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${galleryName.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "")}-client-picks.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadProgress(null);
    } catch (e: any) {
      setErr(e?.message || "Download failed");
      setDownloadProgress(null);
    }
  }

  function onResync() {
    startSync(async () => {
      setErr(null);
      const res = await resyncPicksFolder(galleryId);
      if (res?.error) setErr(res.error);
      else router.refresh();
    });
  }

  if (!picks.length) {
    return (
      <div className="card">
        <h2 className="font-semibold">Client picks folder</h2>
        <p className="mt-1 text-sm text-ink/60">
          When your client submits their picks, copies land in a separate{" "}
          <code className="rounded bg-ink/5 px-1 py-0.5 text-xs">{galleryId.slice(0, 8)}…/picks/</code>{" "}
          folder in storage. Nothing here yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card border-clay/30 bg-clay/[0.04]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Client picks folder</h2>
          <p className="mt-1 text-sm text-ink/65">
            {picks.length} photo{picks.length === 1 ? "" : "s"} copied to{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-xs">…/picks/</code>{" "}
            {isLocked ? "after your client submitted." : "from their current selection."}
          </p>
          <p className="mt-1 text-xs text-ink/55">
            In Supabase Storage, browse bucket <strong>photos</strong> → folder{" "}
            <strong>{galleryId}/picks</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => start(onDownloadPicks)}
            disabled={pending || downloadProgress !== null}
            className="rounded-md border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-paper disabled:opacity-50"
          >
            {downloadProgress !== null ? `${downloadProgress}%` : pending ? "Preparing…" : "Download picks ZIP"}
          </button>
          <button
            onClick={onResync}
            disabled={syncPending}
            className="rounded-md border border-ink/15 px-4 py-2 text-xs uppercase tracking-wider hover:bg-ink/5 disabled:opacity-50"
          >
            {syncPending ? "Syncing…" : "Re-sync folder"}
          </button>
        </div>
      </div>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {picks.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-md border border-ink/10 bg-white">
            {p.url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.url}
                alt={p.filename}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="aspect-square w-full bg-ink/10" />
            )}
            <p className="truncate px-2 py-1 text-xs text-ink/60">{p.filename}</p>
            <p className="truncate px-2 pb-1 text-[10px] text-ink/45">{p.picksPath.split("/").pop()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
