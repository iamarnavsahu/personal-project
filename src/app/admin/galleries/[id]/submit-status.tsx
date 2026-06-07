"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unlockGallery } from "@/app/admin/actions";

export function SubmitStatus({
  galleryId,
  isLocked,
  pickedCount
}: {
  galleryId: string;
  isLocked: boolean;
  pickedCount: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onUnlock() {
    if (
      !confirm(
        "Unlock this gallery? Your client will be able to change their picks again."
      )
    )
      return;
    start(async () => {
      setErr(null);
      const res = await unlockGallery(galleryId);
      if (res?.error) setErr(res.error);
      else router.refresh();
    });
  }

  if (!isLocked) {
    return (
      <div className="card mt-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Gallery status</h2>
            <p className="mt-1 text-sm text-ink/60">
              Open. Your client can still pick or change their selection.
            </p>
          </div>
          <span className="rounded-full border border-ink/15 px-3 py-1 text-[10px] uppercase tracking-widest text-ink/70">
            Open
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-0 border-clay/30 bg-clay/[0.06]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Gallery submitted</h2>
          <p className="mt-1 text-sm text-ink/65">
            Your client clicked <strong>Submit picks</strong> with{" "}
            <strong className="tabular-nums">{pickedCount}</strong> photo
            {pickedCount === 1 ? "" : "s"} selected. The gallery is locked &mdash;
            no one (you or them) can pick or unpick from this point.
          </p>
          <p className="mt-2 text-xs text-ink/55">
            If they got here by mistake, unlock the gallery to let them keep
            picking.
          </p>
          {pickedCount > 0 && (
            <a
              href="#client-picks"
              className="mt-2 inline-block text-sm font-medium text-ink underline underline-offset-2 hover:text-ink/70"
            >
              View client picks folder ↓
            </a>
          )}
        </div>
        <span className="rounded-full bg-clay px-3 py-1 text-[10px] uppercase tracking-widest text-paper">
          ✓ Submitted
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onUnlock}
          disabled={pending}
          className="rounded-md border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-paper disabled:opacity-50"
        >
          {pending ? "Unlocking…" : "Unlock gallery"}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}
