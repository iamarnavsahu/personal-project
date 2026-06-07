"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resyncPicksFolder } from "@/app/admin/actions";

type PickedPhoto = {
  id: string;
  filename: string;
  url: string;
  pickNumber: number;
  picksPath: string;
};

export function PicksSection({
  galleryId,
  isLocked,
  picks
}: {
  galleryId: string;
  isLocked: boolean;
  picks: PickedPhoto[];
}) {
  const router = useRouter();
  const [syncPending, startSync] = useTransition();
  const [err, setErr] = useState<string | null>(null);

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
        <h2 className="font-semibold">Client picks</h2>
        <p className="mt-2 text-sm text-ink/65">
          When your client submits their picks, only their selections show up here —
          use the filenames to find matching RAWs on your drive.
        </p>
        <p className="mt-3 text-xs text-ink/50">
          Copies also land in storage: <code className="rounded bg-ink/5 px-1">{galleryId}/picks/</code>
        </p>
      </div>
    );
  }

  return (
    <div id="client-picks" className="card border-clay/30 bg-clay/[0.04]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Client picks ({picks.length})</h2>
          <p className="mt-1 text-sm text-ink/65">
            {isLocked
              ? "Your client submitted. Match these preview filenames to your RAW files."
              : "Current selection — client hasn't submitted yet."}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            Storage folder: <code className="rounded bg-ink/5 px-1">photos/{galleryId}/picks/</code>
          </p>
        </div>
        <button
          onClick={onResync}
          disabled={syncPending}
          className="rounded-md border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-ink/5 disabled:opacity-50"
        >
          {syncPending ? "Syncing…" : "Re-sync folder"}
        </button>
      </div>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {picks.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-md border border-clay/40 bg-white">
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
            <p className="bg-ink/[0.03] px-2 py-1.5 text-xs font-medium tabular-nums text-ink">
              {String(p.pickNumber).padStart(4, "0")}
            </p>
            <p className="truncate px-2 pb-2 text-xs text-ink/70" title={p.filename}>
              {p.filename}
            </p>
          </li>
        ))}
      </ul>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-ink/50 hover:text-ink/70">
          Filename list (for RAW matching)
        </summary>
        <ol className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded border border-ink/10 bg-paper p-3 text-xs text-ink/70">
          {picks.map((p) => (
            <li key={p.id} className="font-mono">
              {String(p.pickNumber).padStart(4, "0")} — {p.filename}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
