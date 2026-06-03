"use client";

import { useEffect, useState } from "react";

export function ShareLinkBox({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const fullUrl = origin ? `${origin}/g/${slug}` : `/g/${slug}`;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Fallback: select the text */
      const el = document.getElementById(`share-link-${slug}`) as HTMLInputElement | null;
      el?.select();
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
      <input
        id={`share-link-${slug}`}
        type="text"
        readOnly
        value={fullUrl}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="block w-full truncate rounded bg-ink/5 px-3 py-2 font-mono text-sm text-ink"
      />
      <button
        onClick={onCopy}
        className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
          copied
            ? "bg-clay text-paper"
            : "bg-ink text-paper hover:bg-clay"
        }`}
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
