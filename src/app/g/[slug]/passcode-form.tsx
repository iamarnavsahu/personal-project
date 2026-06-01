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
        className={`input ${err ? "border-red-600 focus:border-red-600" : ""}`}
      />
      {err && (
        <div
          role="alert"
          className="border border-red-600 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {err}
        </div>
      )}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
