"use client";

import { useState, useTransition } from "react";
import { updatePickLimit } from "@/app/admin/actions";

export function PickLimitForm({
  galleryId,
  current
}: {
  galleryId: string;
  current: number | null;
}) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    { kind: "ok"; msg: string } | { kind: "err"; msg: string } | null
  >(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setStatus(null);
          const res = await updatePickLimit(galleryId, fd);
          if (res?.error) {
            setStatus({ kind: "err", msg: res.error });
          } else {
            const v = (res as { ok: true; value: number | null }).value;
            setStatus({
              kind: "ok",
              msg: v == null ? "Limit removed ✓" : `Limit set to ${v} ✓`
            });
            setTimeout(() => setStatus(null), 3000);
          }
        })
      }
      className="card mt-0"
    >
      <h2 className="font-semibold">Pick limit</h2>
      <p className="mt-1 text-sm text-ink/60">
        Cap how many photos your client can pick. Leave blank for unlimited.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="label">Maximum picks</label>
          <input
            name="pick_limit"
            type="number"
            min={1}
            placeholder="e.g. 20"
            defaultValue={current ?? ""}
            className="input"
          />
        </div>
        <button className="btn btn-ghost text-sm" disabled={pending}>
          {pending ? "Saving…" : "Update limit"}
        </button>
      </div>

      {status && (
        <p
          className={`mt-3 text-sm ${
            status.kind === "ok" ? "text-green-700" : "text-red-600"
          }`}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}
