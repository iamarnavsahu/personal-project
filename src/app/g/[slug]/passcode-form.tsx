"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unlockGallery } from "./actions";

export function PasscodeForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      className="mt-6 space-y-3"
      action={(fd) =>
        start(async () => {
          setErr(null);
          try {
            const res = await unlockGallery(slug, fd);
            console.log("[unlock] response:", res);
            if (res?.error) setErr(res.error);
            else if (res?.ok) router.refresh();
            else setErr("Unexpected response from server");
          } catch (e: any) {
            console.error("[unlock] threw:", e);
            setErr(e?.message || "Something went wrong");
          }
        })
      }
    >
      <input
        name="passcode"
        type="password"
        required
        autoFocus
        placeholder="Passcode"
        className="input"
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
