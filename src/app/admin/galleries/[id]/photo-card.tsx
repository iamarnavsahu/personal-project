"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePhoto } from "@/app/admin/actions";

export function PhotoCard({
  id, url, filename, picked
}: { id: string; url: string; filename: string; picked: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <li className="group relative overflow-hidden rounded-md border border-ink/10 bg-white">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={filename} className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square w-full bg-ink/10" />
      )}
      {picked && (
        <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
          ★ picked
        </span>
      )}
      <button
        onClick={() => {
          if (!confirm(`Delete ${filename}?`)) return;
          start(async () => {
            await deletePhoto(id);
            router.refresh();
          });
        }}
        disabled={pending}
        className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs opacity-0 transition group-hover:opacity-100"
      >
        {pending ? "…" : "Delete"}
      </button>
      <p className="truncate px-2 py-1 text-xs text-ink/60">{filename}</p>
    </li>
  );
}
