"use client";

import { useState, useTransition } from "react";
import { renameGallery } from "@/app/admin/actions";

export function GalleryDetailsForm({
  galleryId,
  name,
  clientName
}: {
  galleryId: string;
  name: string;
  clientName: string | null;
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
          const res = await renameGallery(galleryId, fd);
          if (res?.error) {
            setStatus({ kind: "err", msg: res.error });
          } else {
            setStatus({ kind: "ok", msg: "Saved ✓" });
            setTimeout(() => setStatus(null), 3000);
          }
        })
      }
      className="card mt-0 space-y-4"
    >
      <h2 className="font-semibold">Gallery details</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Gallery name</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={name}
            placeholder="Sarah's Grad"
            className="input"
          />
        </div>
        <div>
          <label className="label">Client name (optional)</label>
          <input
            name="client_name"
            type="text"
            defaultValue={clientName ?? ""}
            placeholder="Sarah Chen"
            className="input"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-sm ${
            status?.kind === "ok"
              ? "text-green-700"
              : status?.kind === "err"
              ? "text-red-600"
              : "text-transparent"
          }`}
        >
          {status?.msg ?? "Placeholder"}
        </p>
        <button className="btn btn-ghost text-sm" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
