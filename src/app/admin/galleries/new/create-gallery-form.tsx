"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGallery } from "@/app/admin/actions";

export function CreateGalleryForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        const res = await createGallery(fd);
        router.push(`/admin/galleries/${res.id}`);
        router.refresh();
      } catch (e: any) {
        setErr(e?.message || "Could not create gallery");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="label">Gallery name</label>
        <input name="name" required className="input" placeholder="Sarah's Grad Shoot" />
      </div>
      <div>
        <label className="label">Client name <span className="text-ink/40">(optional)</span></label>
        <input name="client_name" className="input" placeholder="Sarah" />
      </div>
      <div>
        <label className="label">Passcode</label>
        <input name="passcode" required minLength={4} className="input" placeholder="at least 4 characters" />
        <p className="mt-1 text-xs text-ink/60">Share this with your client along with the link.</p>
      </div>
      <div>
        <label className="label">Pick limit <span className="text-ink/40">(optional)</span></label>
        <input name="pick_limit" type="number" min={1} placeholder="e.g. 20" className="input" />
        <p className="mt-1 text-xs text-ink/60">Cap how many photos your client can pick. Leave blank for unlimited.</p>
      </div>
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Creating…" : "Create gallery"}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
