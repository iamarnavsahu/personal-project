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
      <div id="client-picks" className="card border-2 border-dashed border-ink/15">
        <h2 className="font-semibold">📁 Edits folder (client picks)</h2>
        <p className="mt-2 text-sm text-ink/65">
          When your client clicks <strong>Submit picks</strong>, their selections are copied
          into a numbered <code className="rounded bg-ink/5 px-1 text-xs">…/picks/</code> folder
          sorted in gallery order — ready for your edit workflow.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink/60">
          <li>Client stars their favorites in the gallery</li>
          <li>They click <strong>Submit picks</strong></li>
          <li>Files land as <code className="text-xs">0001-name.jpg</code>, <code className="text-xs">0002-name.jpg</code>, etc.</li>
          <li>Download the picks ZIP here or browse in Supabase Storage</li>
        </ol>
        <p className="mt-3 text-xs text-ink/50">
          Storage path: <code className="rounded bg-ink/5 px-1">{galleryId}/picks/</code>
        </p>
      </div>
    );
  }

  return (
    <div id="client-picks" className="card border-clay/30 bg-clay/[0.04]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">📁 Edits folder (client picks)</h2>
          <p className="mt-1 text-sm text-ink/65">
            {picks.length} photo{picks.length === 1 ? "" : "s"} sorted in gallery order as{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-xs">0001-…</code> through{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-xs">
              {String(picks.length).padStart(4, "0")}-…
            </code>
            {isLocked ? " — client submitted." : " — current selection (re-sync after submit)."}
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
