"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGallerySlug } from "@/app/admin/actions";

export function SlugForm({
  galleryId,
  currentSlug
}: {
  galleryId: string;
  currentSlug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(currentSlug);
  const [origin, setOrigin] = useState<string>("");
  const [status, setStatus] = useState<
    { kind: "ok"; msg: string } | { kind: "err"; msg: string } | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  /* live, client-side normalisation as the user types */
  function onChange(raw: string) {
    const next = raw
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(next);
    setStatus(null);
  }

  const dirty = slug !== currentSlug;
  const tooShort = slug.length < 3;
  const previewHost = origin || "picka.studio";

  return (
    <form
      action={(fd) =>
        start(async () => {
          setStatus(null);
          if (!confirm(
            "Changing the URL will break any link you've already shared. Continue?"
          )) return;
          const res = await updateGallerySlug(galleryId, fd);
          if (res?.error) {
            setStatus({ kind: "err", msg: res.error });
          } else {
            const v = (res as { ok: true; value: string }).value;
            setStatus({ kind: "ok", msg: `URL saved as ${v} ✓` });
            // Stay on the same admin page (it's keyed by id, not slug)
            router.refresh();
            setTimeout(() => setStatus(null), 3000);
          }
        })
      }
      className="card mt-0"
    >
      <h2 className="font-semibold">Customise the URL</h2>
      <p className="mt-1 text-sm text-ink/60">
        Make the link easier to read. Letters, numbers, and dashes only.
        Changing it breaks any link you&rsquo;ve already shared.
      </p>

      <div className="mt-4">
        <label className="label">Your URL</label>
        <div className="flex items-stretch overflow-hidden rounded border border-ink/15">
          <span className="select-none whitespace-nowrap bg-ink/[0.04] px-3 py-2 font-mono text-sm text-ink/60">
            {previewHost}/g/
          </span>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => onChange(e.target.value)}
            placeholder="sarah-grad-2026"
            minLength={3}
            maxLength={60}
            required
            className="flex-1 bg-paper px-3 py-2 font-mono text-sm text-ink focus:outline-none"
          />
        </div>
        {tooShort && slug.length > 0 && (
          <p className="mt-1 text-xs text-ink/60">At least 3 characters.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          className={`text-sm ${
            status?.kind === "ok"
              ? "text-green-700"
              : status?.kind === "err"
              ? "text-red-600"
              : "text-transparent"
          }`}
        >
          {status?.msg ?? "placeholder"}
        </p>
        <button
          className="btn btn-ghost text-sm"
          disabled={pending || !dirty || tooShort}
        >
          {pending ? "Saving…" : "Update URL"}
        </button>
      </div>
    </form>
  );
}
